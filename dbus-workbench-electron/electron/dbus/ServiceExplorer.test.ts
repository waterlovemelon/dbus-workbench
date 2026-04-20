import test from 'node:test'
import assert from 'node:assert/strict'
import { ServiceExplorer } from './ServiceExplorer.ts'

async function captureConsoleError(run: () => Promise<void>) {
  const originalConsoleError = console.error
  const consoleErrors: unknown[][] = []
  console.error = (...args: unknown[]) => {
    consoleErrors.push(args)
  }

  try {
    await run()
    return consoleErrors
  } finally {
    console.error = originalConsoleError
  }
}

test('explorePaths skips child nodes that cannot be introspected', async () => {
  const explorer = new ServiceExplorer() as any

  explorer.getIntrospectionXML = async (_bus: unknown, _serviceName: string, path: string) => {
    if (path === '/') {
      return '<node><node name="ok"/><node name="ghost"/></node>'
    }

    if (path === '/ok') {
      return '<node></node>'
    }

    if (path === '/ghost') {
      const error = new Error('No such object path') as Error & { type?: string }
      error.type = 'org.freedesktop.DBus.Error.UnknownObject'
      throw error
    }

    throw new Error(`Unexpected path: ${path}`)
  }

  const consoleErrors = await captureConsoleError(async () => {
    const paths = await explorer.explorePaths({}, 'com.example.Service', '/')
    assert.deepEqual(paths, ['/', '/ok'])
  })

  assert.deepEqual(consoleErrors, [])
})

test('explorePaths logs and keeps failure visible when root path cannot be introspected', async () => {
  const explorer = new ServiceExplorer() as any

  explorer.getIntrospectionXML = async () => {
    const error = new Error('Root path is missing') as Error & { type?: string }
    error.type = 'org.freedesktop.DBus.Error.UnknownObject'
    throw error
  }

  const consoleErrors = await captureConsoleError(async () => {
    const paths = await explorer.explorePaths({}, 'com.example.Service', '/')
    assert.deepEqual(paths, ['/'])
  })

  assert.equal(consoleErrors.length, 1)
  assert.match(String(consoleErrors[0]?.[0]), /Failed to introspect path \//)
})

test('explorePaths keeps current path when introspection fails for reasons other than unknown object', async () => {
  const explorer = new ServiceExplorer() as any

  explorer.getIntrospectionXML = async () => {
    throw new Error('org.freedesktop.DBus.Error.TimedOut')
  }

  const consoleErrors = await captureConsoleError(async () => {
    const paths = await explorer.explorePaths({}, 'com.example.Service', '/slow')
    assert.deepEqual(paths, ['/slow'])
  })

  assert.equal(consoleErrors.length, 1)
  assert.match(String(consoleErrors[0]?.[0]), /Failed to introspect path \/slow/)
})
