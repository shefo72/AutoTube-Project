export default function ProfileSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-5 p-5 md:p-2">
        <div className="border-border bg-card rounded-card shadow-elevation-xs flex items-center gap-6 border p-6">
          <div className="bg-surface-2 h-16 w-16 shrink-0 animate-pulse rounded-2xl" />
          <div className="flex grow flex-col gap-2">
            <div className="bg-surface-2 h-6 w-1/3 animate-pulse rounded-md" />
            <div className="bg-surface-2 h-4 w-1/2 animate-pulse rounded-md" />
            <div className="bg-surface-2 h-4 w-1/4 animate-pulse rounded-full" />
            <div className="bg-surface-2 h-4 w-1/4 animate-pulse rounded-md" />
          </div>
          <div className="bg-surface-2 h-10 w-24 animate-pulse rounded-md" />
        </div>

        <div className="border-border bg-card rounded-card shadow-elevation-xs flex flex-col gap-6 border p-6">
          <div className="bg-surface-2 mb-2 h-6 w-1/4 animate-pulse rounded-md" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-x-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="bg-surface-2 h-4 w-1/4 animate-pulse rounded-md" />
                <div className="bg-surface-2 h-10 w-full animate-pulse rounded-md" />
              </div>
            ))}
          </div>
          <div className="bg-border my-4 h-px w-full" />
          <div className="bg-surface-2 mb-2 h-6 w-1/4 animate-pulse rounded-md" />
          <div className="bg-surface-2 mb-4 h-4 w-1/2 animate-pulse rounded-md" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-x-6">
            <div className="bg-surface-2 h-10 w-full animate-pulse rounded-md" />
            <div className="bg-surface-2 h-10 w-full animate-pulse rounded-md" />
          </div>
        </div>

        <div className="border-border bg-card rounded-card shadow-elevation-xs flex flex-col gap-6 border p-6">
          <div className="bg-surface-2 mb-2 h-6 w-1/4 animate-pulse rounded-md" />
          <div className="bg-surface-2 mb-4 h-4 w-1/3 animate-pulse rounded-md" />
          <div className="flex flex-wrap gap-2">
            {[16, 28, 20, 24, 36, 20, 20, 20, 20, 16, 24, 28, 32, 24, 16].map(
              (width, i) => (
                <div
                  key={i}
                  style={{ width: `${width}px` }}
                  className="bg-surface-2 h-8 animate-pulse rounded-full"
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
