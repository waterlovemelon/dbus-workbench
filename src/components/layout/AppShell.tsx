/**
 * AppShell Component
 * Main application layout with resizable panels
 */

import { Component, useEffect, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { MethodPane } from '../workbench/MethodPane'
import { PropertyPane } from '../property/PropertyPane'
import { SignalPane } from '../signal/SignalPane'
import { ServiceOverviewPane } from '../service/ServiceOverviewPane'
import { PathPane } from '../service/PathPane'
import { InterfacePane } from '../service/InterfacePane'
import { RemoteDrawer } from '../remote/RemoteDrawer'
import { useAppStore } from '../../stores/appStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useTranslation } from '../../i18n'

class PanelErrorBoundary extends Component<
  { children: ReactNode; name: string },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.name}]`, error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <h2 className="text-lg font-semibold text-red-500">{this.props.name} crashed</h2>
          <pre className="mt-3 max-h-[60vh] overflow-auto rounded bg-muted p-4 text-left text-xs text-muted-foreground">
            {this.state.error.message}
          </pre>
          <button
            className="mt-4 rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function AppShell() {
  const { t } = useTranslation()
  const {
    selectedNode,
    selectedServiceName,
    activeBus,
    activeConnectionId,
    clearSelectedMember,
  } = useAppStore()
  const theme = useSettingsStore((s) => s.theme)
  const [remoteDrawerOpen, setRemoteDrawerOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const handleBack = () => {
    clearSelectedMember()
  }

  // Determine which pane to render
  const renderContent = () => {
    // A member is selected
    if (selectedNode?.type === 'member' && selectedNode.member) {
      const member = selectedNode.member

      switch (member.type) {
        case 'method':
          return (
            <MethodPane
              member={member}
              busType={activeBus}
              connectionId={activeConnectionId}
              onBack={handleBack}
            />
          )
        case 'signal':
          return (
            <SignalPane
              member={member}
              busType={activeBus}
              connectionId={activeConnectionId}
              onBack={handleBack}
            />
          )
        case 'property':
          return (
            <PropertyPane
              member={member}
              busType={activeBus}
              connectionId={activeConnectionId}
              onBack={handleBack}
            />
          )
      }
    }

    // A path node is selected
    if (selectedNode?.type === 'path') {
      return (
        <PathPane
          path={selectedNode.label}
          serviceName={selectedServiceName ?? ''}
          busType={activeBus}
          onBack={handleBack}
        />
      )
    }

    // An interface node is selected
    if (selectedNode?.type === 'interface') {
      return (
        <InterfacePane
          interfaceName={selectedNode.label}
          path={selectedNode.path ?? '/'}
          serviceName={selectedServiceName ?? ''}
          busType={activeBus}
          onBack={handleBack}
        />
      )
    }

    // A service is selected (but no specific member)
    if (selectedServiceName) {
      return (
        <ServiceOverviewPane
          serviceName={selectedServiceName}
          busType={activeBus}
          connectionId={activeConnectionId}
        />
      )
    }

    // Nothing selected
    return (
      <div className="flex h-full items-center justify-center bg-muted/30">
        <div className="text-center">
          <h2 className="text-xl font-bold">D-Bus Workbench</h2>
          <p className="mt-2 text-muted-foreground">{t('appshell.selectService')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden rounded-xl bg-background text-foreground">
      {/* Top Bar */}
      <TopBar onOpenRemoteDrawer={() => setRemoteDrawerOpen(true)} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Sidebar */}
          <Panel defaultSize={50} minSize={20} maxSize={55}>
            <PanelErrorBoundary name="Sidebar">
              <Sidebar />
            </PanelErrorBoundary>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

          {/* Main Content Area */}
          <Panel defaultSize={50} minSize={30}>
            <PanelErrorBoundary name="Detail">
              {renderContent()}
            </PanelErrorBoundary>
          </Panel>
        </PanelGroup>
      </div>

      {/* Remote Connection Drawer */}
      <RemoteDrawer open={remoteDrawerOpen} onClose={() => setRemoteDrawerOpen(false)} />
    </div>
  )
}
