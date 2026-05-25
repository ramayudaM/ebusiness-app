import AdminIcon from './AdminIcon'
import { adminTheme as theme } from '../styles/adminTheme'

export default function SidebarItem({
  icon,
  label,
  active,
  collapsed,
  href = '#',
  badge,
}) {
  return (
    <a
      href={href}
      title={collapsed ? label : ''}
      className={`group relative flex items-center rounded-[14px] px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-300 ${collapsed ? 'justify-center px-0' : 'gap-3'
        } overflow-hidden`}
      style={{
        backgroundColor: active ? theme.sidebarActive : 'transparent',
        color: active ? theme.primary : theme.textMuted,
        borderLeft: active && !collapsed ? `3px solid ${theme.primary}` : '1px solid rgba(255,255,255,0)',
      }}
      onMouseEnter={(event) => {
        if (!active) {
          event.currentTarget.style.backgroundColor = theme.sidebarHover
          event.currentTarget.style.color = theme.textSecondary
        }
      }}
      onMouseLeave={(event) => {
        if (!active) {
          event.currentTarget.style.backgroundColor = 'transparent'
          event.currentTarget.style.color = theme.textMuted
        }
      }}
    >
      {/* Animated Glow on Active */}
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/0 via-[var(--primary)]/10 to-[var(--primary)]/0 animate-pulse"></div>
      )}

      {/* Icon Container */}
      <span
        className={`flex shrink-0 items-center justify-center relative z-10 transition-all duration-300 ${collapsed ? 'h-10 w-10 rounded-xl' : ''
          }`}
        style={{
          backgroundColor: collapsed && active ? theme.sidebarActive : collapsed ? 'rgba(255,255,255,0.03)' : 'transparent',
          color: active ? theme.primary : theme.textMuted,
        }}
      >
        <AdminIcon name={icon} size={18} />
      </span>

      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate relative z-10 text-[11px]">{label}</span>

          {badge ? (
            <span
              className="rounded-full px-2 py-1 text-[9px] font-black relative z-10 whitespace-nowrap"
              style={{
                backgroundColor: theme.primary + '22',
                color: theme.primary,
              }}
            >
              {badge}
            </span>
          ) : null}
        </>
      )}
    </a>
  )
}