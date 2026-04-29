export default function AdminIcon({ name, size = 20 }) {
  const icons = {
    dashboard: <path d="M4 13h7V4H4v9ZM13 20h7V11h-7v9ZM4 20h7v-5H4v5ZM13 4v5h7V4h-7Z" />,
    product: <path d="M21 8.5 12 3 3 8.5 12 14l9-5.5ZM3 8.5v7L12 21l9-5.5v-7M12 14v7" />,
    order: <path d="M7 8h14l-2 8H8.5L7 4H4M9 20h.01M18 20h.01" />,
    customer: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20c.9-3.1 3.8-5 7.5-5s6.6 1.9 7.5 5" />,
    chart: <path d="M4 18v-7M10.5 18V6M17 18v-4M3 20h18" />,
    search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-3.5-3.5" />,
    bell: <path d="M6 9a6 6 0 1 1 12 0v3.5l1.5 3h-15l1.5-3V9ZM10 18c.4 1.2 1.1 2 2 2s1.6-.8 2-2" />,
    revenue: <path d="M12 3v18M17 7.5c-.7-1-2-1.7-4-1.7-2.4 0-4 1.1-4 2.8 0 4.2 8 1.9 8 6.1 0 1.7-1.6 2.9-4.2 2.9-2.1 0-3.6-.7-4.6-1.9" />,
    chevronLeft: <path d="M15 18 9 12l6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    target: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 12l6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    edit: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />,
    trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />,
    eye: <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
    box: <path d="M21 8.5 12 3 3 8.5M21 8.5 12 14M21 8.5v7L12 21M3 8.5 12 14M3 8.5v7L12 21M12 14v7" />,
    alert: <path d="M12 9v4M12 17h.01M10.3 4.3 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  )
}