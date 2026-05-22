/**
 * TopBar Component
 * Custom title bar with window controls and bus selector
 */

import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { useTranslation } from '../../i18n'

interface TopBarProps {
  onOpenRemoteDrawer?: () => void
}

export function TopBar({ onOpenRemoteDrawer }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useSettingsStore()
  const { t, locale, setLocale } = useTranslation()

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const menuItems = [
    { label: t('topbar.settings'), action: () => {} },
    { label: t('topbar.remoteConnection'), action: () => onOpenRemoteDrawer?.() },
    { label: theme === 'dark' ? t('topbar.switchToLight') : t('topbar.switchToDark'), action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
    { label: locale === 'zh' ? 'English' : '中文', action: () => setLocale(locale === 'zh' ? 'en' : 'zh') },
    { label: t('topbar.about'), action: () => {} },
  ]

  return (
    <div
      className="flex h-[36px] items-center justify-between bg-surface-1 border-b border-border px-2"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left: App title */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-2">D-Bus Workbench</span>
      </div>

      {/* Center: empty spacer for layout balance */}
      <div />

      {/* Right: Menu + Window controls */}
      <div
        className="flex items-center gap-0.5"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {/* Settings menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-7 w-7 flex items-center justify-center rounded text-text-2 hover:bg-surface-2 transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 rounded-md border border-border bg-surface-3 py-1 shadow-lg z-50">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action()
                    setMenuOpen(false)
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-text-0 hover:bg-surface-2 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Window controls */}
        <button
          onClick={() => window.electronAPI.minimizeWindow()}
          className="h-7 w-7 flex items-center justify-center rounded text-[11px] text-text-2 hover:bg-surface-2"
        >
          _
        </button>
        <button
          onClick={() => window.electronAPI.maximizeWindow()}
          className="h-7 w-7 flex items-center justify-center rounded text-[11px] text-text-2 hover:bg-surface-2"
        >
          □
        </button>
        <button
          onClick={() => window.electronAPI.closeWindow()}
          className="h-7 w-7 flex items-center justify-center rounded text-[11px] text-text-2 hover:bg-error hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  )
}
