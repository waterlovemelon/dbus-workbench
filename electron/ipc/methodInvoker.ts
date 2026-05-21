import { ipcMain } from 'electron'
import { MethodInvoker } from '../dbus/MethodInvoker'
import { RemoteMethodInvoker } from '../dbus/RemoteMethodInvoker'
import { getTunnelManager } from './ssh'
import type { InvokeMethodParams } from './types'

const methodInvoker = new MethodInvoker()
let remoteMethodInvoker: RemoteMethodInvoker | null = null

function getRemoteMethodInvoker(): RemoteMethodInvoker {
  if (!remoteMethodInvoker) {
    remoteMethodInvoker = new RemoteMethodInvoker(getTunnelManager())
  }
  return remoteMethodInvoker
}

/**
 * Register IPC handlers for MethodInvoker
 */
export function registerMethodInvokerHandlers() {
  // Invoke method (supports remote via connectionId)
  ipcMain.handle('dbus:invokeMethod', async (_event, params: InvokeMethodParams) => {
    try {
      if (params.connectionId) {
        return await getRemoteMethodInvoker().invokeMethod(
          params.connectionId,
          params.serviceName,
          params.path,
          params.interfaceName,
          params.methodName,
          params.args,
          params.busType
        )
      }
      return await methodInvoker.invokeMethod(
        params.serviceName,
        params.path,
        params.interfaceName,
        params.methodName,
        params.args,
        params.busType
      )
    } catch (error: any) {
      console.error('Failed to invoke method:', error)
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  })
}
