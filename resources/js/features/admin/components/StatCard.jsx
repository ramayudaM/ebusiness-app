import AdminIcon from './AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'

export default function StatCard({ title, value, change, note, icon, color = theme.primary }) {
  return (
    <div 
      className="rounded-[20px] border backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden relative group"
      style={{
        backgroundColor: `${color}08`,
        borderColor: `${color}20`,
      }}
    >
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[color]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
            {title}
          </p>
          <h3 className="mt-3 text-3xl font-bold" style={{ color: theme.textPrimary }}>
            {value}
          </h3>
        </div>

        {icon && (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
            style={{
              color: color,
              backgroundColor: `${color}18`,
              borderWidth: '1px',
              borderColor: `${color}20`,
            }}
          >
            <AdminIcon name={icon} size={20} />
          </div>
        )}
      </div>

      {(change || note) && (
        <div className="relative z-10 mt-5 flex items-center gap-2">
          {change && (
            <span
              className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
              style={{
                color: color,
                backgroundColor: `${color}18`,
              }}
            >
              {change}
            </span>
          )}
          {note && <span className="text-xs" style={{ color: theme.textMuted }}>{note}</span>}
        </div>
      )}
    </div>
  )
}