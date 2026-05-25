import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useTranslation } from '../../i18n'

interface MonitoringCommandsProps {
  title: string
  command: string
}

export function MonitoringCommands({ title, command }: MonitoringCommandsProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!command) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="group flex items-center gap-2 rounded bg-muted/50 px-3 py-2 font-mono text-xs hover:bg-muted">
          <span className="flex-1 break-all text-foreground">{command}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100"
            title={t('monitor.copy')}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
