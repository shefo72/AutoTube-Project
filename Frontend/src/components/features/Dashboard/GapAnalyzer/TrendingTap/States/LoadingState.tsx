export function LoadingState() {
  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      <div
        className="border-border grid border-b bg-(--surface-1) px-5 py-3"
        style={{ gridTemplateColumns: "2fr 100px 100px 100px 100px 140px" }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-3 w-16 animate-pulse rounded bg-(--surface-2)"
          />
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="border-border grid items-center border-b px-5 py-4 last:border-0"
          style={{ gridTemplateColumns: "2fr 100px 100px 100px 100px 140px" }}
        >
          <div>
            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-(--surface-2)" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-(--surface-2)" />
          </div>
          <div>
            <div className="h-6 w-10 animate-pulse rounded bg-(--surface-2)" />
          </div>
          <div>
            <div className="h-2 w-full animate-pulse rounded-full bg-(--surface-2)" />
          </div>
          <div>
            <div className="h-2 w-full animate-pulse rounded-full bg-(--surface-2)" />
          </div>
          <div>
            <div className="h-2 w-full animate-pulse rounded-full bg-(--surface-2)" />
          </div>
          <div className="flex justify-end">
            <div className="h-8 w-24 animate-pulse rounded-lg bg-(--surface-2)" />
          </div>
        </div>
      ))}
    </div>
  );
}
