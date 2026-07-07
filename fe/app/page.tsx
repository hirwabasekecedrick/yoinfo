import { fetchPosts } from '@/lib/api';
import Link from 'next/link';
import { Suspense } from 'react';
import EventRegistration from '@/components/event-registration';

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
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((pt: any) => (
                      <span key={pt.tag.id} className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        {pt.tag.label}
                      </span>
                    ))}
                  </div>
                )}
                {post.links?.length > 0 && (
                  <div className="space-y-1.5 mt-3">
                    {post.links.map((link: any) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {link.title || link.url}
                      </a>
                    ))}
                  </div>
                )}
                {post.event && (
                  <div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900">
                    <div className="flex items-center gap-2 mb-1.5">
                      <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">{post.event.title}</span>
                    </div>
                    {post.event.description && (
                      <p className="text-sm text-amber-700 dark:text-amber-400/80 mb-2">{post.event.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 mb-3">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {new Date(post.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {post.event.location && ` · ${post.event.location}`}
                      </span>
                    </div>
                    <EventRegistration eventId={post.event.id} />
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
