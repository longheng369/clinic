import type { LucideIcon } from 'lucide-react'

export interface ISidebarOption {
   label: string
   icon?: LucideIcon
   path?: string
   badge?: number
   children?: ISidebarOption[]
}

export interface ISidebarSection {
   title: string
   items: ISidebarOption[]
}
