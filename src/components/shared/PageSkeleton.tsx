import React from 'react';

export function PageSkeleton() {
  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-8 md:p-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>

      {/* Stats cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-tally-surface-dark border border-slate-100 dark:border-tally-border-dark space-y-3"
          >
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-7 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 rounded-3xl bg-white dark:bg-tally-surface-dark border border-slate-100 dark:border-tally-border-dark p-6 space-y-4">
            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-40 w-full bg-slate-100 dark:bg-slate-800/40 rounded-2xl" />
          </div>
          <div className="h-48 rounded-3xl bg-white dark:bg-tally-surface-dark border border-slate-100 dark:border-tally-border-dark p-6 space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="h-96 rounded-3xl bg-white dark:bg-tally-surface-dark border border-slate-100 dark:border-tally-border-dark p-6 space-y-4">
          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-60 w-full bg-slate-100 dark:bg-slate-800/40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default PageSkeleton;
