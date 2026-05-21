import type { TunnelManager } from '../ssh/TunnelManager'
import type { BusType, DbusMethodResult } from './types'

export class RemotePropertyAccessor {
  constructor(private tunnelManager: TunnelManager) {}

  async getProperty(
    connectionId: string,
    serviceName: string,
    path: string,
    interfaceName: string,
    propertyName: string,
    busType: BusType
  ): Promise<DbusMethodResult> {
    const busFlag = busType === 'system' ? '--system' : '--session'

    // gdbus call --system --dest <service> --object-path <path> --method org.freedesktop.DBus.Properties.Get <interface> <property>
    const cmd = `gdbus call ${busFlag} --dest ${serviceName} --object-path ${path} --method org.freedesktop.DBus.Properties.Get '${interfaceName}' '${propertyName}'`

    console.log(`[RemotePropertyAccessor] getProperty: ${cmd}`)

    try {
      const output = await this.tunnelManager.runCommand(connectionId, cmd)
      console.log(`[RemotePropertyAccessor] output: ${output}`)

      return this.parseOutput(output)
    } catch (err: any) {
      console.error(`[RemotePropertyAccessor] getProperty failed:`, err)
      return {
        success: false,
        error: err.message || '获取属性失败',
      }
    }
  }

  async setProperty(
    connectionId: string,
    serviceName: string,
    path: string,
    interfaceName: string,
    propertyName: string,
    value: any,
    busType: BusType
  ): Promise<DbusMethodResult> {
    const busFlag = busType === 'system' ? '--system' : '--session'
    const formattedValue = this.formatValue(value, 's') // 默认使用 string 类型

    // gdbus call --system --dest <service> --object-path <path> --method org.freedesktop.DBus.Properties.Set <interface> <property> <value>
    const cmd = `gdbus call ${busFlag} --dest ${serviceName} --object-path ${path} --method org.freedesktop.DBus.Properties.Set '${interfaceName}' '${propertyName}' ${formattedValue}`

    console.log(`[RemotePropertyAccessor] setProperty: ${cmd}`)

    try {
      const output = await this.tunnelManager.runCommand(connectionId, cmd)
      console.log(`[RemotePropertyAccessor] output: ${output}`)

      return { success: true, value: undefined }
    } catch (err: any) {
      console.error(`[RemotePropertyAccessor] setProperty failed:`, err)
      return {
        success: false,
        error: err.message || '设置属性失败',
      }
    }
  }

  async getAllProperties(
    connectionId: string,
    serviceName: string,
    path: string,
    interfaceName: string,
    busType: BusType
  ): Promise<DbusMethodResult> {
    const busFlag = busType === 'system' ? '--system' : '--session'

    // gdbus call --system --dest <service> --object-path <path> --method org.freedesktop.DBus.Properties.GetAll <interface>
    const cmd = `gdbus call ${busFlag} --dest ${serviceName} --object-path ${path} --method org.freedesktop.DBus.Properties.GetAll '${interfaceName}'`

    console.log(`[RemotePropertyAccessor] getAllProperties: ${cmd}`)

    try {
      const output = await this.tunnelManager.runCommand(connectionId, cmd)
      console.log(`[RemotePropertyAccessor] output: ${output}`)

      return this.parseOutput(output)
    } catch (err: any) {
      console.error(`[RemotePropertyAccessor] getAllProperties failed:`, err)
      return {
        success: false,
        error: err.message || '获取所有属性失败',
      }
    }
  }

  private formatValue(value: any, typeHint?: string): string {
    if (value === null || value === undefined) {
      return "''"
    }

    if (typeof value === 'string') {
      const escaped = value.replace(/'/g, "\\'")
      if (typeHint) {
        // 使用类型提示包装值
        return `${typeHint}:'${escaped}'`
      }
      return `'${escaped}'`
    }

    if (typeof value === 'number') {
      return String(value)
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false'
    }

    if (Array.isArray(value)) {
      const items = value.map(item => this.formatValue(item)).join(', ')
      return `[${items}]`
    }

    if (typeof value === 'object') {
      const escaped = JSON.stringify(value).replace(/'/g, "\\'")
      return `'${escaped}'`
    }

    return String(value)
  }

  private parseOutput(output: string): DbusMethodResult {
    // 处理空结果
    if (output === '()' || output === '') {
      return { success: true, value: undefined }
    }

    // 提取括号内的内容
    const match = output.match(/^\((.+)\)$/s)
    if (!match) {
      if (output.includes('Error')) {
        return { success: false, error: output }
      }
      return { success: true, value: output }
    }

    const content = match[1].trim()
    if (!content) {
      return { success: true, value: undefined }
    }

    try {
      const value = this.parseValue(content)
      return { success: true, value }
    } catch (err: any) {
      return { success: true, value: content }
    }
  }

  private parseValue(content: string): any {
    content = content.trim()

    if (!content) return undefined

    // 字符串 'value'
    if (content.startsWith("'") && content.endsWith("'")) {
      return content.slice(1, -1).replace(/\\'/g, "'")
    }

    // 带类型的值 type:'value'
    const typedMatch = content.match(/^(\w+):'(.+)'$/s)
    if (typedMatch) {
      return typedMatch[2].replace(/\\'/g, "'")
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

    // 数组
    if (content.startsWith('[') && content.endsWith(']')) {
      const inner = content.slice(1, -1).trim()
      if (!inner) return []
      const items = this.splitTopLevel(inner)
      return items.map(item => this.parseValue(item))
    }

    // 字典
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

    // 元组
    if (content.startsWith('(') && content.endsWith(')')) {
      const inner = content.slice(1, -1).trim()
      if (!inner) return []
      const items = this.splitTopLevel(inner)
      return items.map(item => this.parseValue(item))
    }

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
