export default function VideoGeneratorLoading() {
  return (
    <div className="bg-background flex-1 overflow-y-auto">
      <div className="mx-auto grid min-h-[calc(50vh-3.5rem)] max-w-7xl grid-cols-1 items-stretch gap-6 p-5 md:p-8 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-4">
          <div className="bg-card border-border shadow-elevation-sm flex flex-1 flex-col justify-between rounded-2xl border p-6">
            <div className="space-y-6">
              <div className="border-border/50 flex items-center gap-2 border-b pb-4">
                <div className="bg-surface-2 h-4 w-4 animate-pulse rounded-full" />
                <div className="bg-surface-2 h-4 w-24 animate-pulse rounded-md" />
              </div>
              <div>
                <div className="bg-surface-2 mb-3 h-3 w-32 animate-pulse rounded-md" />
                <div className="bg-surface-2 h-11 w-full animate-pulse rounded-xl" />
              </div>
              <div>
                <div className="bg-surface-2 mb-3 h-3 w-40 animate-pulse rounded-md" />
                <div className="bg-surface-2 min-h-70 w-full animate-pulse rounded-xl" />
              </div>
            </div>
            <div className="bg-surface-2 mt-6 h-12 w-full shrink-0 animate-pulse rounded-xl" />
          </div>
        </div>
        <div className="flex flex-col lg:col-span-8">
          <div className="bg-card border-border flex flex-1 flex-col overflow-hidden rounded-2xl border">
            <div className="border-border flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-surface-2 h-5 w-48 animate-pulse rounded-md" />
                  <div className="bg-surface-2 h-4 w-12 animate-pulse rounded-full" />
                </div>
                <div className="bg-surface-2 h-3 w-32 animate-pulse rounded-md" />
              </div>
              <div className="bg-surface-2 h-8 w-28 animate-pulse rounded-lg" />
            </div>
            <div className="relative flex flex-1 flex-col items-center justify-center p-6">
              <div className="bg-surface-2/50 border-border aspect-video w-full max-w-3xl animate-pulse rounded-2xl border shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
