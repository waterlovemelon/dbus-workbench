.pragma library

function serviceGroups() {
    return [
        { id: "service-notify", label: "org.freedesktop.Notifications", count: 8 },
        { id: "service-network", label: "org.freedesktop.NetworkManager", count: 12 },
        { id: "service-login", label: "org.freedesktop.login1", count: 6 },
        { id: "service-upower", label: "org.freedesktop.UPower", count: 5 }
    ];
}

function treeItems() {
    return [
        {
            id: "method-notify",
            type: "method",
            label: "Notify",
            status: "callable",
            path: "/org/freedesktop/Notifications",
            interfaceName: "org.freedesktop.Notifications",
            summary: "Show or update a desktop notification"
        },
        {
            id: "method-close",
            type: "method",
            label: "CloseNotification",
            status: "callable",
            path: "/org/freedesktop/Notifications",
            interfaceName: "org.freedesktop.Notifications",
            summary: "Close a visible notification"
        },
        {
            id: "method-capabilities",
            type: "method",
            label: "GetCapabilities",
            status: "callable",
            path: "/org/freedesktop/Notifications",
            interfaceName: "org.freedesktop.Notifications",
            summary: "Return the list of server capabilities"
        },
        {
            id: "method-server-info",
            type: "method",
            label: "GetServerInformation",
            status: "callable",
            path: "/org/freedesktop/Notifications",
            interfaceName: "org.freedesktop.Notifications",
            summary: "Return server name, vendor, and version"
        },
        {
            id: "signal-action",
            type: "signal",
            label: "ActionInvoked",
            status: "stream",
            path: "/org/freedesktop/Notifications",
            interfaceName: "org.freedesktop.Notifications",
            summary: "Raised when an action button is clicked"
        },
        {
            id: "property-version",
            type: "property",
            label: "ServerInformation",
            status: "read",
            path: "/org/freedesktop/Notifications",
            interfaceName: "org.freedesktop.Notifications",
            summary: "Read-only server capability data"
        }
    ];
}

function methodArgs() {
    return [
        { name: "app_name", signature: "s", editor: "text", value: "System Monitor" },
        { name: "replaces_id", signature: "u", editor: "number", value: "0" },
        { name: "app_icon", signature: "s", editor: "text", value: "dialog-information" },
        { name: "summary", signature: "s", editor: "text", value: "CPU usage warning" },
        { name: "body", signature: "s", editor: "text", value: "CPU usage has stayed above 80 percent for 5 minutes." },
        { name: "expire_timeout", signature: "i", editor: "number", value: "5000" }
    ];
}

function exportActions() {
    return [
        { title: "Copy gdbus call", detail: "gdbus call --session --dest org.freedesktop.Notifications ..." },
        { title: "Copy busctl call", detail: "busctl --user call org.freedesktop.Notifications ..." },
        { title: "Copy Python snippet", detail: "Generate a dbus-next sample invocation" },
        { title: "Open in terminal", detail: "Insert command into the built-in shell" }
    ];
}

function signalEvents() {
    return [
        {
            time: "14:20:01",
            topic: "org.freedesktop.DBus.Properties.PropertiesChanged",
            sender: ":1.5",
            payload: "{ \"Brightness\": 75, \"AutoAdjust\": true }"
        },
        {
            time: "14:20:08",
            topic: "org.freedesktop.Notifications.ActionInvoked",
            sender: ":1.143",
            payload: "{ \"id\": 42, \"action\": \"dismiss\" }"
        },
        {
            time: "14:20:13",
            topic: "org.gnome.Shell.Extensions.Reloaded",
            sender: ":1.9",
            payload: "{ \"uuid\": \"dash-to-panel@jderose9.github.com\" }"
        }
    ];
}

function callHistory() {
    return [
        { title: "Notify", detail: "org.freedesktop.Notifications", stamp: "2 min ago" },
        { title: "GetServerInformation", detail: "org.freedesktop.Notifications", stamp: "18 min ago" },
        { title: "ListNames", detail: "org.freedesktop.DBus", stamp: "Yesterday" }
    ];
}
