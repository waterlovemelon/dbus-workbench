import { ArrowLeft } from 'lucide-react'
import { MonitoringCommands } from '../common/MonitoringCommands'
import type { BusType } from '../../types/electron-api'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { KVRow } from '../common/KVRow'
import { useTranslation } from '../../i18n'

interface InterfacePaneProps {
  interfaceName: string
  path: string
  serviceName: string
  busType: BusType
  onBack?: () => void
}

export function InterfacePane({
  interfaceName,
  path,
  serviceName,
  busType,
  onBack,
}: InterfacePaneProps) {
  const { t } = useTranslation()

  const monitorCmd = `dbus-monitor --${busType} "destination='${serviceName}',path='${path}',interface='${interfaceName}'"`

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30 p-6">
      <div className="mx-auto w-full max-w-[780px] space-y-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">{interfaceName}</h1>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('interface.interfaceInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <KVRow label={t('interface.interfaceName')} value={interfaceName} mono />
              <KVRow label={t('interface.objectPath')} value={path} mono />
              <KVRow label={t('interface.owningService')} value={serviceName} mono />
              <KVRow label={t('interface.busType')} value={busType} />
            </div>
          </CardContent>
        </Card>

        <MonitoringCommands title={t('interface.monitorInterface')} command={monitorCmd} />
      </div>
    </div>
  )
}
