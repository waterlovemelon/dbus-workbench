import { BrowserWindow, ipcMain } from 'electron'
import { BusNameWatcher } from '../dbus/BusNameWatcher'
import type { BusType } from '../dbus/types'

const watcher = new BusNameWatcher()
let initialized = false

export function registerBusWatcherHandlers() {
  ipcMain.handle('dbus:startBusWatcher', async (_event, busType: BusType) => {
    await watcher.start(busType)
  })

  if (!initialized) {
    initialized = true
    watcher.on('nameOwnerChanged', (event) => {
      for (const window of BrowserWindow.getAllWindows()) {
        window.webContents.send('dbus:busNameOwnerChanged', event)
      }
    })
  }
}

export async function cleanupBusWatcher() {
  await watcher.stopAll()
}
