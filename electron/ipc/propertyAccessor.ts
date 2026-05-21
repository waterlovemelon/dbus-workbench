import { ipcMain } from 'electron'
import { PropertyAccessor } from '../dbus/PropertyAccessor'
import { RemotePropertyAccessor } from '../dbus/RemotePropertyAccessor'
import { getTunnelManager } from './ssh'
import type { GetPropertyParams, SetPropertyParams, GetAllPropertiesParams } from './types'

const propertyAccessor = new PropertyAccessor()
let remotePropertyAccessor: RemotePropertyAccessor | null = null

function getRemotePropertyAccessor(): RemotePropertyAccessor {
  if (!remotePropertyAccessor) {
    remotePropertyAccessor = new RemotePropertyAccessor(getTunnelManager())
  }
  return remotePropertyAccessor
}

/**
 * Register IPC handlers for PropertyAccessor
 */
export function registerPropertyAccessorHandlers() {
  // Get a single property (supports remote via connectionId)
  ipcMain.handle('dbus:getProperty', async (_event, params: GetPropertyParams) => {
    try {
      if (params.connectionId) {
        return await getRemotePropertyAccessor().getProperty(
          params.connectionId,
          params.serviceName,
          params.path,
          params.interfaceName,
          params.propertyName,
          params.busType
        )
      }
      return await propertyAccessor.getProperty(
        params.serviceName,
        params.path,
        params.interfaceName,
        params.propertyName,
        params.busType
      )
    } catch (error: any) {
      console.error('Failed to get property:', error)
      return { success: false, error: error.message || 'Unknown error' }
    }
  })

  // Set a single property (supports remote via connectionId)
  ipcMain.handle('dbus:setProperty', async (_event, params: SetPropertyParams) => {
    try {
      if (params.connectionId) {
        return await getRemotePropertyAccessor().setProperty(
          params.connectionId,
          params.serviceName,
          params.path,
          params.interfaceName,
          params.propertyName,
          params.value,
          params.busType
        )
      }
      return await propertyAccessor.setProperty(
        params.serviceName,
        params.path,
        params.interfaceName,
        params.propertyName,
        params.value,
        params.busType
      )
    } catch (error: any) {
      console.error('Failed to set property:', error)
      return { success: false, error: error.message || 'Unknown error' }
    }
  })

  // Get all properties (supports remote via connectionId)
  ipcMain.handle('dbus:getAllProperties', async (_event, params: GetAllPropertiesParams) => {
    try {
      if (params.connectionId) {
        return await getRemotePropertyAccessor().getAllProperties(
          params.connectionId,
          params.serviceName,
          params.path,
          params.interfaceName,
          params.busType
        )
      }
      return await propertyAccessor.getAllProperties(
        params.serviceName,
        params.path,
        params.interfaceName,
        params.busType
      )
    } catch (error: any) {
      console.error('Failed to get all properties:', error)
      return { success: false, error: error.message || 'Unknown error' }
    }
  })
}
