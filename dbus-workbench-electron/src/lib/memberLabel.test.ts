import test from 'node:test'
import assert from 'node:assert/strict'
import { formatMemberLabel } from './memberLabel.ts'
import type { DbusMemberInfo } from '../types/electron-api'

function createMember(overrides: Partial<DbusMemberInfo>): DbusMemberInfo {
  return {
    id: 'member-1',
    name: 'SetDefaultEntry',
    type: 'method',
    serviceName: 'com.example.Service',
    interfaceName: 'com.example.Interface',
    path: '/com/example/Object',
    signature: '',
    returnType: '',
    annotation: '',
    ...overrides,
  }
}

test('formatMemberLabel shows method signatures in the member list', () => {
  const label = formatMemberLabel(
    createMember({
      signature: 'su',
    })
  )

  assert.equal(label, 'SetDefaultEntry(su)')
})

test('formatMemberLabel shows empty parentheses for methods without parameters', () => {
  const label = formatMemberLabel(createMember({ signature: '' }))

  assert.equal(label, 'SetDefaultEntry()')
})

test('formatMemberLabel keeps non-method members unchanged', () => {
  const label = formatMemberLabel(
    createMember({
      name: 'PropertiesChanged',
      type: 'signal',
      signature: 'sa{sv}as',
    })
  )

  assert.equal(label, 'PropertiesChanged')
})
