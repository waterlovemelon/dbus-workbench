import { useEffect, useState } from 'react'
import type { DbusArgumentInfo, DbusMemberInfo } from '../../types/electron-api'
import { formatDbusTypeLabel } from '../../lib/memberLabel'
import { ArgumentForm } from './ArgumentForm'
import { ResultView } from './ResultView'
import { useMethodInvoker } from '../../hooks/useMethodInvoker'
import { ChevronLeft, Play, RotateCcw, Copy, Check } from 'lucide-react'

interface MethodPaneProps {
  member: DbusMemberInfo
  busType: 'session' | 'system'
  connectionId?: string | null
  onBack: () => void
}

function renderArgumentSummary(args: DbusArgumentInfo[]): string {
  if (args.length === 0) {
    return 'None'
  }
  return args
    .map((arg) => {
      const typeLabel = formatDbusTypeLabel(arg.type)
      return arg.name ? `${arg.name}: ${typeLabel}` : typeLabel
    })
    .join(', ')
}

export function MethodPane({ member, busType, connectionId, onBack }: MethodPaneProps) {
  const [args, setArgs] = useState<any[]>([])
  const { invoke, result, isInvoking, clearResult } = useMethodInvoker()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setArgs(new Array(member.inputArgs.length).fill(null))
  }, [member.inputArgs])

  const handleInvoke = async () => {
    await invoke({
      busType,
      serviceName: member.serviceName,
      path: member.path,
      interfaceName: member.interfaceName,
      methodName: member.name,
      args: args,
      connectionId: connectionId || undefined,
    })
  }

  const handleReset = () => {
    setArgs(new Array(args.length).fill(null))
    clearResult()
  }

  const buildDbusSendCmd = () => {
    const parts = [
      'dbus-send',
      `--${busType}`,
      `--dest=${member.serviceName}`,
      `--type=method_call`,
      `--print-reply`,
      member.path,
      `${member.interfaceName}.${member.name}`,
    ]
    return parts.join(' ')
  }

  const handleCopyCommand = async () => {
    const cmd = buildDbusSendCmd()
    await navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col bg-background text-text-0">
      {/* Header */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-surface-0 rounded-lg transition-colors group"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-text-2 group-hover:text-text-0 transition-colors" />
          </button>
          <div className="flex-1">
            <div className="text-sm text-text-2 font-mono">
              {member.interfaceName}
            </div>
            <h2 className="text-lg font-medium text-text-0 font-mono tracking-tight">
              {member.name}
            </h2>
          </div>
        </div>

        {/* Parameter summaries */}
        <div className="mt-4 flex gap-6">
          <div className="flex-1 bg-surface-0 rounded-lg px-4 py-3 border border-border">
            <div className="text-sm text-text-2 uppercase tracking-wider mb-1">
              Input Parameters
            </div>
            <div className="font-mono text-sm text-text-0">
              {renderArgumentSummary(member.inputArgs)}
            </div>
          </div>
          <div className="flex-1 bg-surface-0 rounded-lg px-4 py-3 border border-border">
            <div className="text-sm text-text-2 uppercase tracking-wider mb-1">
              Output Parameters
            </div>
            <div className="font-mono text-sm text-text-0">
              {renderArgumentSummary(member.outputArgs)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Arguments Section */}
        {member.inputArgs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-1 uppercase tracking-wider mb-4">
              Arguments
            </h3>
            <ArgumentForm
              args={member.inputArgs}
              values={args}
              onChange={setArgs}
              disabled={isInvoking}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleInvoke}
            disabled={isInvoking}
            className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground font-medium rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <Play className="w-4 h-4" />
            {isInvoking ? 'Invoking...' : 'Invoke'}
          </button>
          <button
            onClick={handleReset}
            disabled={isInvoking}
            className="flex items-center gap-2 px-4 py-2 bg-surface-2 text-text-1 rounded hover:bg-surface-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-border text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleCopyCommand}
            className="flex items-center gap-2 px-4 py-2 bg-surface-2 text-text-2 rounded hover:bg-surface-3 hover:text-text-0 transition-colors border border-border text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copy Command
          </button>
        </div>

        {/* Command Box */}
        <div className="bg-code-bg border border-border rounded p-3 mb-6">
          <code className="font-mono text-sm text-code-text break-all leading-relaxed">
            {buildDbusSendCmd()}
          </code>
        </div>

        {/* Results */}
        <ResultView result={result} isInvoking={isInvoking} />
      </div>
    </div>
  )
}
