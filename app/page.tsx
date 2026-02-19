import { promises as fs } from "fs";
import path from "path";
import Image from "next/image";

interface Post {
  id: string;
  date: string;
  caption: string;
  image: string;
}

async function getPosts(): Promise<Post[]> {
  const filePath = path.join(process.cwd(), "public", "posts.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const posts: Post[] = JSON.parse(raw);
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-2xl font-semibold tracking-tight">Les Ruches</h1>
      </header>

      <div className="flex flex-col gap-16">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col gap-3">
            {post.image && (
              <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-neutral-100">
                <Image
                  src={post.image}
                  alt={post.caption || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 576px"
                />
              </div>
            )}
            {post.caption && (
              <p className="text-base leading-relaxed">{post.caption}</p>
            )}
            <time
              dateTime={post.date}
              className="text-sm text-neutral-400"
            >
              {formatDate(post.date)}
            </time>
          </article>
        ))}
      </div>
    </main>
  );
}
