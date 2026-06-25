export default function ThumbnailsLoading() {
  return (
    <div className="bg-background flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-8 p-5 md:p-8">
        <div className="flex flex-col gap-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="bg-surface-2 h-5 w-5 animate-pulse rounded-md" />
            <div className="bg-surface-2 h-6 w-40 animate-pulse rounded-md" />
          </div>

          <div className="bg-card border-border shadow-elevation-sm rounded-3xl border p-2">
            <div className="rounded-2xl bg-(--surface-1) p-4">
              <div className="bg-surface-2 mb-4 min-h-25 w-full animate-pulse rounded-xl" />
              <div className="border-border/50 mt-4 flex flex-col items-start justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-surface-2 mr-1 h-4 w-10 animate-pulse rounded-md" />
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-surface-2 h-7 w-20 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
                <div className="bg-surface-2 h-10 w-full animate-pulse rounded-xl sm:w-48" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="border-border flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center opacity-60">
            <div className="bg-surface-2 mb-4 h-16 w-16 animate-pulse rounded-full" />
            <div className="bg-surface-2 mb-3 h-6 w-48 animate-pulse rounded-md" />
            <div className="bg-surface-2 h-4 w-64 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
