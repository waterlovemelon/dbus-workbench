# dd-feet

A modern Qt Quick D-Bus workbench prototype with a Postman/VS Code inspired layout.

## Current status

- Qt Quick application shell is in place.
- The main window includes:
  - top command bar
  - activity rail
  - service explorer with node context menus
  - workbench panel for method calls and command export
  - bottom monitor deck for signals and history
- The UI currently uses sample data.
- The next backend pass should wire real D-Bus introspection, invocation, monitoring, and terminal integration.

## Build

```bash
cmake -S . -B build
cmake --build build
```

## Run

```bash
./build/dd-feet
```

Or use the helper:

```bash
./run-dev.sh
```
