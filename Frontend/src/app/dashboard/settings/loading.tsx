export default function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-card border-border relative flex items-center gap-5 rounded-2xl border p-6">
        <div className="bg-surface-2 h-16 w-16 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-2.5">
          <div className="bg-surface-2 h-5 w-48 rounded-md" />
          <div className="bg-surface-2 h-3 w-32 rounded-md" />
          <div className="bg-surface-2 mt-2 h-5 w-24 rounded-full" />
        </div>
        <div className="bg-surface-2 hidden h-9 w-28 rounded-xl sm:block" />
      </div>

      <div className="bg-card border-border flex flex-col rounded-2xl border p-6 md:p-8">
        <div className="mb-8">
          <div className="bg-surface-2 mb-6 h-5 w-40 rounded-md" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="bg-surface-2 h-12 w-full rounded-xl" />
            <div className="bg-surface-2 h-12 w-full rounded-xl" />
            <div className="bg-surface-2 h-12 w-full rounded-xl" />
            <div className="bg-surface-2 h-12 w-full rounded-xl" />
          </div>
          <div className="mt-4 flex justify-end">
            <div className="bg-surface-2 h-9 w-32 rounded-xl" />
          </div>
        </div>

        <div className="bg-border mb-8 h-px w-full" />

        <div>
          <div className="mb-5 flex flex-col gap-2">
            <div className="bg-surface-2 h-5 w-24 rounded-md" />
            <div className="bg-surface-2 h-3 w-64 rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="bg-surface-2 h-12 w-full rounded-xl" />
            <div className="bg-surface-2 h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>

      <div className="bg-card border-border rounded-2xl border p-6">
        <div className="bg-surface-2 mb-2 h-5 w-32 rounded-md" />
        <div className="bg-surface-2 mb-5 h-3 w-48 rounded-md" />

        <div className="flex flex-wrap gap-2">
          {[20, 24, 28, 20, 32, 24, 28, 20, 24, 20].map((width, i) => (
            <div
              key={i}
              className="bg-surface-2 h-8 rounded-xl"
              style={{ width: `${width / 4}rem` }}
            />
          ))}
        </div>
      </div>

      <div className="bg-card border-border rounded-2xl border p-6">
        <div className="border-border flex flex-col items-start gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center">
          <div className="bg-surface-2 h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="bg-surface-2 h-4 w-32 rounded-md" />
            <div className="bg-surface-2 h-3 w-56 rounded-md" />
          </div>
          <div className="bg-surface-2 h-8 w-20 shrink-0 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
