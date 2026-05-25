import { registerServiceExplorerHandlers } from './serviceExplorer'
import { registerBusWatcherHandlers, cleanupBusWatcher } from './busWatcher'
import { registerMethodInvokerHandlers } from './methodInvoker'
import { registerSignalMonitorHandlers, cleanupSignalMonitor } from './signalMonitor'
import { registerPropertyAccessorHandlers } from './propertyAccessor'
import { registerSSHHandlers, cleanupSSH } from './ssh'

/**
 * Register all IPC handlers
 */
export function registerAllIPCHandlers() {
  registerServiceExplorerHandlers()
  registerBusWatcherHandlers()
  registerMethodInvokerHandlers()
  registerSignalMonitorHandlers()
  registerPropertyAccessorHandlers()
  registerSSHHandlers()
}

/**
 * Cleanup all IPC handlers
 */
export async function cleanupAllIPCHandlers() {
  await cleanupBusWatcher()
  await cleanupSignalMonitor()
  await cleanupSSH()
}

export { cleanupSignalMonitor, cleanupSSH }
