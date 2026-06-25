export default function AdminDashboardSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="border-border flex h-18 items-center border-b px-5 md:px-8">
        <div className="bg-surface-2 h-6 w-48 animate-pulse rounded-md" />
      </div>

      <div className="space-y-5 p-5 md:p-8">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card border-border flex h-32.5 flex-col justify-between overflow-hidden rounded-2xl border p-4 sm:p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className="bg-surface-2 h-3 w-20 animate-pulse rounded-md sm:h-4" />
                <div className="bg-surface-2 h-9 w-9 shrink-0 animate-pulse rounded-xl" />
              </div>

              <div className="mt-auto flex items-end justify-between">
                <div className="bg-surface-2 h-8 w-24 animate-pulse rounded-md" />
                <div className="bg-surface-2 h-5 w-12 animate-pulse rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border-border rounded-2xl border">
          <div className="border-border flex flex-col items-start justify-between gap-4 border-b px-5 py-4 sm:flex-row sm:items-center">
            <div className="bg-surface-2 h-5 w-36 animate-pulse rounded-md" />
            <div className="bg-surface-2 h-9 w-full animate-pulse rounded-xl sm:w-64" />
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-200">
              <thead>
                <tr className="border-border border-b bg-(--surface-1)">
                  {[...Array(7)].map((_, i) => (
                    <th key={i} className="px-5 py-4 text-left">
                      <div className="bg-surface-2 h-3 w-16 animate-pulse rounded-sm" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, r) => (
                  <tr key={r} className="border-border border-b">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-surface-2 h-8 w-8 shrink-0 animate-pulse rounded-lg" />
                        <div className="space-y-1.5">
                          <div className="bg-surface-2 h-3 w-28 animate-pulse rounded-sm" />
                          <div className="bg-surface-2 h-2.5 w-40 animate-pulse rounded-sm" />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="bg-surface-2 h-4 w-14 animate-pulse rounded-full" />
                    </td>

                    <td className="px-5 py-3">
                      <div className="bg-surface-2 h-4 w-16 animate-pulse rounded-full" />
                    </td>

                    <td className="px-5 py-3">
                      <div className="bg-surface-2 h-3 w-8 animate-pulse rounded-sm" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="bg-surface-2 h-3 w-8 animate-pulse rounded-sm" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="bg-surface-2 h-3 w-12 animate-pulse rounded-sm" />
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <div className="bg-surface-2 h-7 w-7 animate-pulse rounded-lg" />
                        <div className="bg-surface-2 h-7 w-7 animate-pulse rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
