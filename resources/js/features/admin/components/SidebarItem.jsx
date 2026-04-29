import AdminIcon from './AdminIcon'

export default function SidebarItem({ icon, label, active, collapsed, href = '#' }) {
  return (
    <a
      href={href}
      title={collapsed ? label : ''}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
        active
          ? 'bg-white text-slate-950 shadow-sm'
          : 'text-white/60 hover:bg-white/10 hover:text-white'
      } ${collapsed ? 'justify-center px-0' : ''}`}
    >
      <AdminIcon name={icon} />
      {!collapsed && <span>{label}</span>}
    </a>
  )
}