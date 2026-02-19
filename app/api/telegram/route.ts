import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const ALLOWED_CHAT_ID = process.env.ALLOWED_CHAT_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function getFileSha(path: string): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path });
    return (data as { sha: string }).sha;
  } catch {
    return null;
  }
}

async function getCurrentPosts(): Promise<{ posts: Post[]; sha: string | null }> {
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path: "public/posts.json" });
    const content = Buffer.from((data as { content: string }).content, "base64").toString("utf-8");
    return { posts: JSON.parse(content), sha: (data as { sha: string }).sha };
  } catch {
    return { posts: [], sha: null };
  }
}

interface Post {
  id: string;
  date: string;
  caption: string;
  image: string;
}

async function uploadImage(filename: string, buffer: Buffer): Promise<string> {
  const path = `public/photos/${filename}`;
  const sha = await getFileSha(path);
  const content = buffer.toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message: `photo: ${filename}`,
    content,
    ...(sha ? { sha } : {}),
  });

  return `/photos/${filename}`;
}

async function savePosts(posts: Post[], sha: string | null) {
  const content = Buffer.from(JSON.stringify(posts, null, 2)).toString("base64");
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: "public/posts.json",
    message: "post: nouveau post",
    content,
    ...(sha ? { sha } : {}),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const msg = body.message;

  if (!msg || !msg.photo) {
    return NextResponse.json({ ok: true });
  }

  if (ALLOWED_CHAT_ID && String(msg.chat.id) !== String(ALLOWED_CHAT_ID)) {
    await sendMessage(msg.chat.id, "Non autorisé.");
    return NextResponse.json({ ok: true });
  }

  try {
    await sendMessage(msg.chat.id, "Publication en cours…");

    const photo = msg.photo[msg.photo.length - 1];
    const caption: string = msg.caption || "";

    const fileRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${photo.file_id}`
    );
    const fileData = await fileRes.json() as { result: { file_path: string } };
    const filePath = fileData.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    const imgRes = await fetch(fileUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    const ext = filePath.split(".").pop() || "jpg";
    const filename = `${Date.now()}.${ext}`;

    const imagePath = await uploadImage(filename, buffer);

    const { posts, sha } = await getCurrentPosts();
    const newPost: Post = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      caption,
      image: imagePath,
    };
    posts.unshift(newPost);
    await savePosts(posts, sha);

    await sendMessage(msg.chat.id, "Publié ✓");
  } catch (err) {
    const error = err as Error;
    console.error(error);
    await sendMessage(msg.chat.id, `Erreur : ${error.message}`);
  }

  return NextResponse.json({ ok: true });
}
