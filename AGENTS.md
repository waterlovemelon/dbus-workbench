# AGENTS.md — dd-feet

Agent instructions for working in this repository.

## Project Overview

**dd-feet** is a Qt Quick/QML D-Bus workbench prototype with a Postman/VS Code inspired layout.
The UI shell is functional; backend D-Bus integration (introspection, invocation, monitoring) is the next pass.

- **Languages**: C++17 (entry point), QML (UI), JavaScript (sample data)
- **Framework**: Qt Quick with QuickControls2
- **Build system**: CMake (supports Qt5 and Qt6, prefers Qt6 ≥ 6.5)

## Build & Run

```bash
# Configure (once, or after CMakeLists.txt changes)
cmake -S . -B build

# Build
cmake --build build

# Run
./build/dd-feet

# Or use the helper (configures + builds + runs)
./run-dev.sh
```

**No tests or linters are configured yet.** If you add them, update this section.

## Project Structure

```
src/              C++ sources (main.cpp only — QML does the heavy lifting)
qml/              QML entry point (Main.qml) and JS data helpers
qml/components/   Reusable QML components (PanelFrame is the base for panes)
build/            CMake build output (do not edit manually)
CMakeLists.txt    Build configuration
resources.qrc     Qt resource file for Qt5 compatibility
```

## Code Style

### C++ (src/)

- Follow C++17 conventions.
- Keep `main.cpp` minimal — it only bootstraps the QML engine.
- Standard Qt includes at the top; no custom headers yet.
- Use `QObject::connect` with lambdas for signal wiring.

### QML (qml/)

**Imports** — always in this order:
```qml
import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Layouts 1.3
import "SampleData.js" as SampleData     // JS helpers (if needed)
import "components"                       // local components (if needed)
```

**Naming**:
- Component files: `PascalCase.qml` (e.g., `ServiceTreePane.qml`)
- Root element `id`: `root` (except `Main.qml` which uses `window`)
- Properties: `camelCase` (e.g., `currentKey`, `selectedId`)
- Signals: `camelCase`, typed when possible (e.g., `signal itemTriggered(string key)`)

**Properties**:
- `property var` for arrays and objects
- `property string`, `property color`, `property int` for primitives
- Use `default property alias` for content injection (see `PanelFrame.qml`)

**Layout patterns**:
- `RowLayout` / `ColumnLayout` for structured layouts
- `anchors.fill: parent` with `anchors.margins` for padding
- `Layout.fillWidth: true` / `Layout.fillHeight: true` for flexible sizing
- `spacing` between 8–20 depending on context

**Styling — dark theme palette**:
- Backgrounds: `#08111b`, `#091523`, `#0d1420`, `#101826`, `#111927`
- Borders: `#1c2838`, `#223144`, `#243041`
- Text primary: `#e2e8f0`, `#edf2ff`, `#eef2ff`, `#f1f5f9`, `#f8fafc`
- Text secondary: `#7c90aa`, `#8ea0b6`
- Accent blue: `#2d70d6`, `#2563eb`, `#1d4ed8`, `#17355f`
- Status colors: green `#34d399`, blue `#60a5fa`, amber `#f59e0b`, purple `#a78bfa`

**Border radius** — common values: `10`, `12`, `14`, `16`, `18`, `22`
**Font sizes**: `10–12` (labels), `13–14` (body), `16–18` (headings), `24` (titles)

**Component composition**:
- Extend `PanelFrame` for pane-style components (title + subtitle + content).
- Use `Repeater` with `model` for list rendering.
- Define signals on the root item for parent communication.

### JavaScript (qml/SampleData.js)

- Begin with `.pragma library` for stateless shared functions.
- Export functions that return arrays of objects.
- Keep data structures flat and predictable.

## Adding New Features

1. **New QML component** → create in `qml/components/`, add to `QML_FILES` in `CMakeLists.txt` and `resources.qrc`.
2. **New JS data source** → create in `qml/`, add to both build files.
3. **New C++ class** → add to `src/`, update `PROJECT_SOURCES` in `CMakeLists.txt`.
4. After changing `CMakeLists.txt`, re-run `cmake -S . -B build`.

## Conventions to Follow

- **No inline styles on root items** — use properties that can be overridden.
- **Signals over direct property mutation** — child components emit signals, parents handle state.
- **Clip list views** — always set `clip: true` on `ListView` and similar.
- **Accessible hover/press states** — every interactive element should have visual feedback.
- **Monospace for code/paths** — `font.family: "monospace"` for D-Bus paths, commands, JSON.
