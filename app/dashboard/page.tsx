import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  const { data: connections } = await supabase
    .from('connections')
    .select('id, provider, display_name, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto w-full max-w-3xl px-8 py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Signed in as {data.user.email}.
        </p>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-zinc-950 dark:text-zinc-50">
              Connections
            </h2>
            <Link
              href="/connect"
              className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Connect a provider
            </Link>
          </div>

          {!connections || connections.length === 0 ? (
            <p className="mt-4 rounded-md border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              No connections yet. Connect Notion to get started.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {connections.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                      {c.provider}
                    </p>
                    {c.display_name && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{c.display_name}</p>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
