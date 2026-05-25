import { EventEmitter } from 'events'
import { Message, MessageType, sessionBus, systemBus } from 'dbus-next'
import type { BusType } from './types'

export interface BusNameChangedEvent {
  busType: BusType
  name: string
  oldOwner: string
  newOwner: string
}

export class BusNameWatcher extends EventEmitter {
  private buses = new Map<BusType, any>()

  async start(busType: BusType): Promise<void> {
    if (this.buses.has(busType)) {
      return
    }

    const bus = busType === 'system' ? systemBus() : sessionBus()

    await bus.call(new Message({
      type: MessageType.METHOD_CALL,
      destination: 'org.freedesktop.DBus',
      path: '/org/freedesktop/DBus',
      interface: 'org.freedesktop.DBus',
      member: 'AddMatch',
      signature: 's',
      body: ["type='signal',sender='org.freedesktop.DBus',interface='org.freedesktop.DBus',member='NameOwnerChanged'"],
    }))

    bus.on('message', (message: any) => {
      if (
        message.type !== MessageType.SIGNAL ||
        message.interface !== 'org.freedesktop.DBus' ||
        message.member !== 'NameOwnerChanged'
      ) {
        return
      }

      const [name, oldOwner, newOwner] = (message.body ?? []) as [string, string, string]
      if (!name || name.startsWith(':')) {
        return
      }

      this.emit('nameOwnerChanged', {
        busType,
        name,
        oldOwner,
        newOwner,
      } satisfies BusNameChangedEvent)
    })

    this.buses.set(busType, bus)
  }

  async stopAll(): Promise<void> {
    for (const [, bus] of this.buses) {
      bus.disconnect()
    }
    this.buses.clear()
  }
}
