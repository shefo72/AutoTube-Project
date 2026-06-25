export default function ScriptWriterLoading() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 p-5 md:p-8">
        <div className="border-border bg-card rounded-2xl border p-5">
          <div className="flex flex-col gap-5">
            <div>
              <div className="mb-2 flex items-end justify-between">
                <div className="bg-surface-2 h-3 w-24 animate-pulse rounded-md" />
                <div className="bg-surface-2 h-3 w-12 animate-pulse rounded-md" />
              </div>
              <div className="bg-surface-2 min-h-30 w-full animate-pulse rounded-xl" />
            </div>

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap">
                <div className="w-full sm:w-48">
                  <div className="bg-surface-2 mb-1.5 h-3 w-12 animate-pulse rounded-md" />
                  <div className="bg-surface-2 h-10 w-full animate-pulse rounded-xl" />
                </div>
                <div className="w-full sm:w-48">
                  <div className="bg-surface-2 mb-1.5 h-3 w-16 animate-pulse rounded-md" />
                  <div className="bg-surface-2 h-10 w-full animate-pulse rounded-xl" />
                </div>
              </div>

              <div className="bg-surface-2 h-10 w-full animate-pulse rounded-xl sm:w-32" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={`stat-${i}`}
              className="bg-card border-border flex items-center justify-between rounded-2xl border px-5 py-4"
            >
              <div className="bg-surface-2 h-3 w-16 animate-pulse rounded-md" />
              <div className="bg-surface-2 h-5 w-12 animate-pulse rounded-md" />
            </div>
          ))}
        </div>

        <div className="bg-card border-border overflow-hidden rounded-2xl border">
          {[...Array(4)].map((_, i) => (
            <div
              key={`section-${i}`}
              className={`flex w-full items-center gap-3 px-5 py-4 ${
                i !== 3 ? "border-border border-b" : ""
              }`}
            >
              <div className="bg-surface-2 h-9 w-9 shrink-0 animate-pulse rounded-xl" />

              <div className="flex-1">
                <div className="flex flex-col-reverse items-start gap-1 md:flex-row md:items-center md:gap-2">
                  <div className="bg-surface-2 h-4 w-32 animate-pulse rounded-md" />
                  <div className="bg-surface-2 h-4 w-12 animate-pulse rounded-full" />
                </div>
              </div>
              <div className="bg-surface-2 h-4 w-4 animate-pulse rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
