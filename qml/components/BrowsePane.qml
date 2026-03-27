import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Layouts 1.3

Rectangle {
    id: root

    property var node: ({})
    property var members: []

    signal memberClicked(string id)
    signal copyRequested(string type, string method)

    color: "#f8f7f4"

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 100
            color: "#ffffff"

            ColumnLayout {
                anchors.fill: parent
                anchors.leftMargin: 28
                anchors.rightMargin: 28
                anchors.topMargin: 20
                anchors.bottomMargin: 16
                spacing: 6

                Row {
                    spacing: 6
                    Label {
                        text: root.node.interfaceName || "org.freedesktop.Notifications"
                        font.pixelSize: 12
                        color: "#9c9690"
                        font.family: "monospace"
                    }
                }

                Label {
                    text: root.node.label || "Notifications"
                    font.pixelSize: 20
                    font.weight: Font.DemiBold
                    color: "#1a1816"
                }

                Label {
                    text: root.node.summary || "桌面通知服务 · 4 methods · 1 signal · 1 property"
                    font.pixelSize: 13
                    color: "#6b6560"
                }
            }

            Rectangle {
                anchors.bottom: parent.bottom
                anchors.left: parent.left
                anchors.right: parent.right
                height: 1
                color: "#e8e6e1"
            }
        }

        ListView {
            id: memberList
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true
            topMargin: 8
            bottomMargin: 28
            leftMargin: 20
            rightMargin: 20
            spacing: 2
            model: root.members

            delegate: Rectangle {
                id: memberRow

                width: memberList.width - memberList.leftMargin - memberList.rightMargin
                height: 56
                radius: 14
                color: rowMouse.containsMouse ? "#ffffff" : (root.node.id === modelData.id ? "#fef0ed" : "transparent")

                property bool showActions: rowMouse.containsMouse || copyMenuOpen

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 16
                    anchors.rightMargin: 12
                    spacing: 14

                    Rectangle {
                        width: 8
                        height: 8
                        radius: 4
                        color: {
                            switch (modelData.status) {
                            case "active":
                            case "live":
                                return "#3a9a5c";
                            case "callable":
                                return "#3b82c4";
                            case "stream":
                                return "#d4882e";
                            case "read":
                            case "readonly":
                                return "#8b6cc1";
                            default:
                                return "#9c9690";
                            }
                        }
                    }

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 2

                        Label {
                            text: modelData.label
                            font.pixelSize: 14
                            font.weight: Font.Medium
                            font.family: "monospace"
                            color: "#1a1816"
                        }

                        Label {
                            text: modelData.summary || ""
                            font.pixelSize: 12
                            color: "#6b6560"
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }
                    }

                    Row {
                        spacing: 4
                        visible: memberRow.showActions

                        Rectangle {
                            width: 28
                            height: 28
                            radius: 6
                            color: modelData.type === "method" ? (execMouse.containsMouse ? "#fef0ed" : "transparent") : "transparent"
                            visible: modelData.type === "method"

                            Label {
                                anchors.centerIn: parent
                                text: "\u25B6"
                                font.pixelSize: 11
                                color: "#c45d3e"
                            }

                            MouseArea {
                                id: execMouse
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    root.memberClicked(modelData.id);
                                }
                            }
                        }

                        Rectangle {
                            id: copyBtn
                            width: 28
                            height: 28
                            radius: 6
                            color: copyMouse.containsMouse ? "#f1f0ec" : "transparent"
                            visible: memberRow.showActions

                            Label {
                                anchors.centerIn: parent
                                text: "\u2398"
                                font.pixelSize: 13
                                color: "#9c9690"
                            }

                            MouseArea {
                                id: copyMouse
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    copyMenu.modelData = modelData;
                                    copyMenu.x = copyBtn.mapToItem(root, 0, 0).x - 140;
                                    copyMenu.y = copyBtn.mapToItem(root, 0, 0).y - copyMenu.height - 4;
                                    copyMenu.visible = true;
                                    copyMenuOpen = true;
                                }
                            }
                        }
                    }

                    Label {
                        text: "\u25B6"
                        font.pixelSize: 9
                        color: "#9c9690"
                        visible: !memberRow.showActions
                        opacity: 0
                    }
                }

                property bool copyMenuOpen: false

                MouseArea {
                    id: rowMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.memberClicked(modelData.id)
                }
            }
        }

        Rectangle {
            id: copyMenu
            Layout.alignment: Qt.AlignRight
            Layout.rightMargin: 20
            width: 190
            height: copyMenuCol.implicitHeight + 8
            radius: 10
            color: "#ffffff"
            border.width: 1
            border.color: "#e8e6e1"
            visible: false
            z: 100

            property var modelData: ({})

            ColumnLayout {
                id: copyMenuCol
                anchors.fill: parent
                anchors.margins: 4
                spacing: 0

                Repeater {
                    model: ["qdbus", "dbus-send", "gdbus", "Python"]

                    delegate: Rectangle {
                        Layout.fillWidth: true
                        height: 34
                        radius: 8
                        color: copyOptionMouse.containsMouse ? "#f8f7f4" : "transparent"

                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 10
                            anchors.rightMargin: 10
                            spacing: 8

                            Label {
                                text: modelData
                                font.pixelSize: 12
                                font.weight: Font.Medium
                                color: "#1a1816"
                            }

                            Item { Layout.fillWidth: true }

                            Label {
                                text: {
                                    switch (modelData) {
                                    case "qdbus": return "Qt CLI";
                                    case "dbus-send": return "GLib CLI";
                                    case "gdbus": return "GNOME CLI";
                                    case "Python": return "dbus-next";
                                    default: return "";
                                    }
                                }
                                font.pixelSize: 10
                                color: "#9c9690"
                            }
                        }

                        MouseArea {
                            id: copyOptionMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                root.copyRequested(modelData, copyMenu.modelData.label || "");
                                copyMenu.visible = false;
                                memberList.contentItem.children[0].copyMenuOpen = false;
                            }
                        }
                    }
                }
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        visible: copyMenu.visible
        z: 99
        onClicked: {
            copyMenu.visible = false;
        }
    }
}
