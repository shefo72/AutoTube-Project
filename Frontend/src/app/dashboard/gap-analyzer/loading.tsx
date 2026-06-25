export default function GapAnalyzerLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-6 p-5 md:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={`stat-card-${i}`}
              className="bg-card border-border flex items-center gap-4 rounded-2xl border p-5 shadow-xs"
            >
              <div className="bg-surface-2 h-12 w-12 shrink-0 animate-pulse rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="bg-surface-2 h-2.5 w-20 animate-pulse rounded-md" />
                <div className="bg-surface-2 h-6 w-14 animate-pulse rounded-md" />
              </div>
            </div>
          ))}
        </div>

        <div className="border-border/60 border-b pb-4">
          <div className="flex items-center gap-6 px-1 md:gap-10">
            {[...Array(4)].map((_, i) => (
              <div key={`tab-${i}`} className="flex items-center gap-2 pt-2">
                <div className="bg-surface-2 h-4 w-4 animate-pulse rounded-md" />
                <div className="bg-surface-2 h-4 w-16 animate-pulse rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="bg-surface-2 h-12 flex-1 animate-pulse rounded-xl" />
            <div className="bg-surface-2 h-12 w-full animate-pulse rounded-xl md:w-56" />
            <div className="bg-surface-2 h-12 w-full animate-pulse rounded-xl md:w-52" />
            <div className="bg-surface-2 h-12 w-full animate-pulse rounded-xl md:w-28" />
          </div>
        </div>

        <div className="bg-card border-border overflow-hidden rounded-2xl border">
          <div className="border-border hidden gap-4 border-b bg-(--surface-1) px-5 py-4 lg:grid lg:grid-cols-[2.5fr_100px_100px_100px_100px_180px]">
            {[...Array(6)].map((_, i) => (
              <div
                key={`th-${i}`}
                className="bg-surface-2 h-3 w-12 animate-pulse rounded-md"
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 p-4 lg:gap-0 lg:p-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={`row-${i}`}
                className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-4 last:border-b-0 lg:grid lg:grid-cols-[2.5fr_100px_100px_100px_100px_180px] lg:items-center lg:gap-4 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b lg:bg-transparent lg:p-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="bg-surface-2 h-16 w-28 shrink-0 animate-pulse rounded-lg lg:h-12 lg:w-20" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="bg-surface-2 h-3.5 w-3/4 animate-pulse rounded-md" />
                    <div className="bg-surface-2 h-2.5 w-1/3 animate-pulse rounded-md" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-xl bg-(--surface-1) p-4 lg:contents lg:bg-transparent lg:p-0">
                  <div className="bg-surface-2 h-6 w-10 animate-pulse rounded-md lg:h-5" />

                  {[...Array(3)].map((_, mi) => (
                    <div key={mi} className="space-y-1.5 pr-4">
                      <div className="bg-surface-2 h-3 w-8 animate-pulse rounded-md" />
                      <div className="bg-surface-2 h-2 w-full animate-pulse rounded-full lg:h-1.5" />
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-end gap-3 lg:mt-0 lg:pr-2">
                  <div className="bg-surface-2 h-10 w-10 animate-pulse rounded-xl lg:h-9 lg:w-9 lg:rounded-lg" />
                  <div className="bg-surface-2 h-10 flex-1 animate-pulse rounded-xl lg:h-9 lg:w-24 lg:flex-none lg:rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
