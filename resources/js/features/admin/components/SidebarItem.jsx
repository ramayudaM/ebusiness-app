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
      className={`group relative flex items-center rounded-[18px] px-4 py-3 text-sm font-bold transition-all duration-300 ${
        collapsed ? 'justify-center px-0' : 'gap-3'
      }`}
      style={{
        backgroundColor: active ? `${theme.primary}22` : 'transparent',
        color: active ? theme.primary : 'rgba(255,255,255,0.58)',
      }}
      onMouseEnter={(event) => {
        if (!active) {
          event.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'
          event.currentTarget.style.color = 'rgba(255,255,255,0.92)'
        }
      }}
      onMouseLeave={(event) => {
        if (!active) {
          event.currentTarget.style.backgroundColor = 'transparent'
          event.currentTarget.style.color = 'rgba(255,255,255,0.58)'
        }
      }}
    >
      {active && !collapsed && (
        <span
          className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full"
          style={{ backgroundColor: theme.primary }}
        />
      )}

      <span
        className={`flex shrink-0 items-center justify-center ${
          collapsed ? 'h-11 w-11 rounded-2xl' : ''
        }`}
        style={{
          backgroundColor: collapsed && active ? `${theme.primary}22` : 'transparent',
        }}
      >
        <AdminIcon name={icon} size={20} />
      </span>

      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>

          {badge ? (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-black"
              style={{
                backgroundColor: `${theme.primary}22`,
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