interface KVRowProps {
  label: string
  value: string
  mono?: boolean
}

export function KVRow({ label, value, mono }: KVRowProps) {
  return (
    <div className="flex items-baseline border-b border-dashed border-border py-1.5 last:border-b-0">
      <span className="w-[100px] shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${mono ? 'font-mono text-teal-600 dark:text-teal-400' : ''}`}>{value}</span>
    </div>
  )
}
