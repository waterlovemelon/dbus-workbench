import type { DbusMemberInfo } from '../types/electron-api'

export function formatMemberLabel(member: DbusMemberInfo): string {
  if (member.type !== 'method') {
    return member.name
  }

  return `${member.name}(${member.signature})`
}
