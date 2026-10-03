import type { SidebarNavItem } from '../components/Sidebar'

export const findActiveNavItem = (
  items: SidebarNavItem[],
  pathname: string,
): SidebarNavItem | null =>
  items
    .filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0] ?? null
