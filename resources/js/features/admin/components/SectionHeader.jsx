import { adminTheme as theme } from '../styles/adminTheme'

export default function SectionHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold md:text-2xl uppercase tracking-wide" style={{ color: theme.textPrimary }}>✧ {title}</h2>
        {description && (
          <p className="mt-2 text-sm" style={{ color: theme.textMuted }}>{description}</p>
        )}
      </div>

      {action}
    </div>
  )
}