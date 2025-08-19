import { Search } from "lucide-react"

export function EmptyState({ title, description, icon: Icon = Search }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>

      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title || "No data found"}</h3>

      <p className="text-slate-600">
        {description || "Try searching for a different player or adjusting your filters."}
      </p>
    </div>
  )
}
