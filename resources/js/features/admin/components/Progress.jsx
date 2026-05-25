import { adminTheme as theme } from '../styles/adminTheme'

export default function Progress({ label, value, color = theme.primary }) {
  return (
    <div>
      <div className="mb-3 flex justify-between text-sm">
        <span style={{ color: theme.textSecondary }}>{label}</span>
        <span className="font-bold" style={{ color: color }}>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}