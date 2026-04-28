import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-2xl px-8 py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Conduit
        </h1>
        <p className="mt-4 max-w-md text-lg leading-7 text-zinc-600 dark:text-zinc-400">
          The polished connect, debug, ship loop for wiring authenticated SaaS and OpenAPI specs to Claude via MCP.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
