export function HistoryLoadingState() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border-border flex flex-col justify-between rounded-2xl border p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-5 w-24 animate-pulse rounded-md bg-(--surface-2)" />
            <div className="h-4 w-16 animate-pulse rounded-md bg-(--surface-2)" />
          </div>

          <div className="mb-4 space-y-2">
            <div className="h-5 w-full animate-pulse rounded-md bg-(--surface-2)" />
            <div className="h-5 w-2/3 animate-pulse rounded-md bg-(--surface-2)" />
          </div>

          <div className="mb-6 flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-md bg-(--surface-2)" />
            <div className="h-6 w-20 animate-pulse rounded-md bg-(--surface-2)" />
          </div>

          <div className="border-border mt-auto flex items-center justify-between border-t pt-4">
            <div className="h-4 w-32 animate-pulse rounded-md bg-(--surface-2)" />
            <div className="h-6 w-6 animate-pulse rounded-full bg-(--surface-2)" />
          </div>
        </div>
      ))}
    </div>
  );
}
