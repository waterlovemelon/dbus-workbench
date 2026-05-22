/**
 * ServiceTree Component
 * Displays list of D-Bus services with search filter
 */

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { useTranslation } from '../../i18n'

interface ServiceTreeProps {
  services: string[]
  selectedServiceId: string | null
  onSelectService: (serviceName: string) => void
}

export function ServiceTree({
  services,
  selectedServiceId,
  onSelectService,
}: ServiceTreeProps) {
  const { t } = useTranslation()
  const [filterText, setFilterText] = useState('')

  const filteredServices = useMemo(() => {
    if (!filterText) return services
    const lowerFilter = filterText.toLowerCase()
    return services.filter((service) =>
      service.toLowerCase().includes(lowerFilter)
    )
  }, [services, filterText])

  return (
    <div className="flex h-full flex-col">
      {/* Search Bar */}
      <div className="border-b border-border p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('serviceTree.filterPlaceholder')}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="h-7 pl-7 text-xs"
          />
        </div>
      </div>

      {/* Service List */}
      <div className="flex-1 overflow-y-auto p-1">
        {filteredServices.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            {services.length === 0 ? t('serviceTree.noServices') : t('serviceTree.noMatching')}
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredServices.map((service) => (
              <button
                key={service}
                onClick={() => onSelectService(service)}
                className={`w-full rounded px-2 py-1 text-left text-xs transition-colors ${
                  selectedServiceId === service
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-2 py-1 text-xs text-muted-foreground">
        {t('serviceTree.servicesCount', { total: services.length })}
      </div>
    </div>
  )
}
