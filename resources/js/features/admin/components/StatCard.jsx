import AdminIcon from './AdminIcon'

export default function StatCard({ title, value, change, note, icon, color }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">{value}</h3>
        </div>

        {icon && (
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              color,
              backgroundColor: `${color}14`,
            }}
          >
            <AdminIcon name={icon} />
          </div>
        )}
      </div>

      {(change || note) && (
        <div className="mt-5 flex items-center gap-2">
          {change && (
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                color,
                backgroundColor: `${color}14`,
              }}
            >
              {change}
            </span>
          )}
          {note && <span className="text-xs text-slate-500">{note}</span>}
        </div>
      )}
    </div>
  )
}