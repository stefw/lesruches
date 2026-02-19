import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { Octokit } from "@octokit/rest";
import fetch from "node-fetch";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const ALLOWED_CHAT_ID = process.env.ALLOWED_CHAT_ID;

async function getFileSha(filePath) {
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path: filePath });
    return data.sha;
  } catch {
    return null;
  }
}

async function getCurrentPosts() {
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path: "public/posts.json" });
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return { posts: JSON.parse(content), sha: data.sha };
  } catch {
    return { posts: [], sha: null };
  }
}

async function uploadImage(filename, buffer) {
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

async function savePosts(posts, sha) {
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

bot.on("photo", async (msg) => {
  if (ALLOWED_CHAT_ID && String(msg.chat.id) !== String(ALLOWED_CHAT_ID)) {
    return bot.sendMessage(msg.chat.id, "Non autorisé.");
  }

  try {
    await bot.sendMessage(msg.chat.id, "Publication en cours…");

    const photo = msg.photo[msg.photo.length - 1];
    const caption = msg.caption || "";
    const fileInfo = await bot.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;

    const response = await fetch(fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const ext = fileInfo.file_path.split(".").pop() || "jpg";
    const filename = `${Date.now()}.${ext}`;

    const imagePath = await uploadImage(filename, buffer);

    const { posts, sha } = await getCurrentPosts();
    const newPost = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      caption,
      image: imagePath,
    };
    posts.unshift(newPost);
    await savePosts(posts, sha);

    await bot.sendMessage(msg.chat.id, "Publié ✓");
  } catch (err) {
    console.error(err);
    await bot.sendMessage(msg.chat.id, `Erreur : ${err.message}`);
  }
});

bot.on("polling_error", (err) => console.error("Polling error:", err));

console.log("Bot démarré.");
