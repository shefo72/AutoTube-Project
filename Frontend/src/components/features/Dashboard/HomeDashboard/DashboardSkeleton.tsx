export default function DashboardSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-5 p-5 md:p-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border-border bg-card rounded-card shadow-elevation-xs flex h-32.5 flex-col justify-between border p-5"
            >
              <div className="flex items-center justify-between">
                <div className="bg-surface-2 mb-2 h-8 w-8 animate-pulse rounded-full" />
                <div className="bg-surface-2 h-5 w-14 animate-pulse rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="bg-surface-2 h-8 w-24 animate-pulse rounded-md" />
                <div className="bg-surface-2 h-4 w-32 animate-pulse rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_340px]">
          <div className="border-border bg-card rounded-card shadow-elevation-xs flex h-100 flex-col gap-4 border p-6">
            <div className="space-y-2">
              <div className="bg-surface-2 h-6 w-48 animate-pulse rounded-md" />
              <div className="bg-surface-2 h-4 w-32 animate-pulse rounded-md" />
            </div>
            <div className="bg-surface-2/50 mt-4 flex-1 animate-pulse rounded-xl" />
          </div>

          {/* Tools */}
          <div className="border-border bg-card rounded-card shadow-elevation-xs flex flex-col gap-4 border p-6">
            <div className="bg-surface-2 h-6 w-24 animate-pulse rounded-md" />
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-surface-2 h-30 animate-pulse rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>

        {/* opportunities   */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="border-border bg-card rounded-card shadow-elevation-xs flex h-95 flex-col gap-6 border p-6"
            >
              <div className="flex items-center justify-between">
                <div className="bg-surface-2 h-6 w-40 animate-pulse rounded-md" />
                <div className="bg-surface-2 h-4 w-16 animate-pulse rounded-md" />
              </div>

              <div className="flex flex-col gap-5">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-4">
                    <div className="bg-surface-2 h-10 w-10 shrink-0 animate-pulse rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="bg-surface-2 h-4 w-full animate-pulse rounded-md" />
                      <div className="bg-surface-2 h-3 w-2/3 animate-pulse rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
