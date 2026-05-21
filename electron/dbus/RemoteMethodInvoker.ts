import type { TunnelManager } from '../ssh/TunnelManager'
import type { BusType, DbusMethodResult } from './types'

export class RemoteMethodInvoker {
  constructor(private tunnelManager: TunnelManager) {}

  async invokeMethod(
    connectionId: string,
    serviceName: string,
    path: string,
    interfaceName: string,
    methodName: string,
    args: any[],
    busType: BusType
  ): Promise<DbusMethodResult> {
    const busFlag = busType === 'system' ? '--system' : '--session'

    // 构建 gdbus call 命令
    // gdbus call --system --dest <service> --object-path <path> --method <interface>.<method> [args...]
    const cmdParts = [
      'gdbus call',
      busFlag,
      `--dest ${serviceName}`,
      `--object-path ${path}`,
      `--method ${interfaceName}.${methodName}`,
    ]

    // 添加参数
    for (const arg of args) {
      cmdParts.push(this.formatArgument(arg))
    }

    const cmd = cmdParts.join(' ')
    console.log(`[RemoteMethodInvoker] executing: ${cmd}`)

    try {
      const output = await this.tunnelManager.runCommand(connectionId, cmd)
      console.log(`[RemoteMethodInvoker] output: ${output}`)

      // 解析 gdbus 输出
      // gdbus 输出格式: ('value1', 'value2', ...) 或 ()
      return this.parseOutput(output)
    } catch (err: any) {
      console.error(`[RemoteMethodInvoker] failed:`, err)
      return {
        success: false,
        error: err.message || '执行失败',
      }
    }
  }

  private formatArgument(arg: any): string {
    if (arg === null || arg === undefined) {
      return '""'
    }
    if (typeof arg === 'string') {
      // 转义单引号
      const escaped = arg.replace(/'/g, "\\'")
      return `'${escaped}'`
    }
    if (typeof arg === 'number') {
      return String(arg)
    }
    if (typeof arg === 'boolean') {
      return arg ? 'true' : 'false'
    }
    if (Array.isArray(arg)) {
      const items = arg.map(item => this.formatArgument(item)).join(', ')
      return `[${items}]`
    }
    if (typeof arg === 'object') {
      // 对象转 JSON 字符串
      const escaped = JSON.stringify(arg).replace(/'/g, "\\'")
      return `'${escaped}'`
    }
    return String(arg)
  }

  private parseOutput(output: string): DbusMethodResult {
    // 处理空结果 ()
    if (output === '()') {
      return { success: true, value: undefined }
    }

    // 提取括号内的内容
    const match = output.match(/^\((.+)\)$/s)
    if (!match) {
      // 可能是错误信息
      if (output.includes('Error')) {
        return { success: false, error: output }
      }
      return { success: true, value: output }
    }

    const content = match[1].trim()
    if (!content) {
      return { success: true, value: undefined }
    }

    // 解析值
    try {
      const value = this.parseValue(content)
      return { success: true, value }
    } catch (err: any) {
      return { success: true, value: content }
    }
  }

  private parseValue(content: string): any {
    content = content.trim()

    // 空值
    if (!content) return undefined

    // 字符串 'value'
    if (content.startsWith("'") && content.endsWith("'")) {
      return content.slice(1, -1).replace(/\\'/g, "'")
    }

    // 数字
    if (/^-?\d+$/.test(content)) {
      return parseInt(content, 10)
    }
    if (/^-?\d+\.\d+$/.test(content)) {
      return parseFloat(content)
    }

    // 布尔值
    if (content === 'true') return true
    if (content === 'false') return false

    // 数组 [...]
    if (content.startsWith('[') && content.endsWith(']')) {
      const inner = content.slice(1, -1).trim()
      if (!inner) return []
      const items = this.splitTopLevel(inner)
      return items.map(item => this.parseValue(item))
    }

    // 字典 {...}
    if (content.startsWith('{') && content.endsWith('}')) {
      const inner = content.slice(1, -1).trim()
      if (!inner) return {}
      const result: any = {}
      const items = this.splitTopLevel(inner)
      for (const item of items) {
        const colonIndex = item.indexOf(':')
        if (colonIndex > 0) {
          const key = this.parseValue(item.slice(0, colonIndex).trim())
          const value = this.parseValue(item.slice(colonIndex + 1).trim())
          result[key] = value
        }
      }
      return result
    }

    // 元组 (...)
    if (content.startsWith('(') && content.endsWith(')')) {
      const inner = content.slice(1, -1).trim()
      if (!inner) return []
      const items = this.splitTopLevel(inner)
      return items.map(item => this.parseValue(item))
    }

    // 原始值
    return content
  }

  private splitTopLevel(content: string): string[] {
    const items: string[] = []
    let current = ''
    let depth = 0
    let inString = false
    let escapeNext = false

    for (let i = 0; i < content.length; i++) {
      const char = content[i]

      if (escapeNext) {
        current += char
        escapeNext = false
        continue
      }

      if (char === '\\') {
        escapeNext = true
        current += char
        continue
      }

      if (char === "'" && !escapeNext) {
        inString = !inString
        current += char
        continue
      }

      if (inString) {
        current += char
        continue
      }

      if (char === '(' || char === '[' || char === '{') {
        depth++
        current += char
      } else if (char === ')' || char === ']' || char === '}') {
        depth--
        current += char
      } else if (char === ',' && depth === 0) {
        items.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    if (current.trim()) {
      items.push(current.trim())
    }

    return items
  }
}
