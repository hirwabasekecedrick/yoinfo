import { fetchPosts } from '@/lib/api';
import Link from 'next/link';
import { Suspense } from 'react';

async function PostsFeed() {
  let posts: any[] = [];
  try {
    posts = await fetchPosts();
  } catch (error) {
    console.error(error);
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">No posts yet</h3>
        <p className="text-sm text-neutral-500">Check back soon for new updates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post: any, index: number) => (
        <article
          key={post.id}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden transition-shadow hover:shadow-md"
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {post.author?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                      {post.author?.name || 'Anonymous'}
                    </span>
                  </div>
                  <time className="text-xs text-neutral-400 whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
                {post.imageUrl && (
                  <div className="mt-4 -mx-1">
                    <img
                      src={post.imageUrl}
                      alt="Post image"
                      className="rounded-lg w-full max-h-96 object-cover border border-neutral-200 dark:border-neutral-800"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function PostsFeedSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center">
              <svg className="w-4 h-4 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-base text-neutral-900 dark:text-neutral-100">InfoPulse</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/auth"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 px-3 py-1.5 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth"
              className="text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-1.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Updates
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Latest news and announcements
            </p>
          </div>
          <Suspense fallback={<PostsFeedSkeleton />}>
            <PostsFeed />
          </Suspense>
        </div>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-neutral-900 dark:bg-white flex items-center justify-center">
              <svg className="w-3 h-3 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">InfoPulse</span>
          </div>
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} InfoPulse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
