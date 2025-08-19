export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Player Summary Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
          <div>
            <div className="h-6 bg-slate-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-4">
              <div className="h-4 bg-slate-200 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-8 bg-slate-200 rounded w-12 animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-4">
              <div className="h-4 bg-slate-200 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-6 bg-slate-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Games Table Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-6 bg-slate-200 rounded w-32 mb-6 animate-pulse"></div>

        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3">
              <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
