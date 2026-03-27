import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Layouts 1.3

Rectangle {
    id: root

    property var signalEvents: []
    property var callHistory: []
    property bool expanded: false

    height: expanded ? 200 : 36
    color: "#ffffff"

    Behavior on height {
        NumberAnimation { duration: 200; easing.type: Easing.OutCubic }
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 36
            color: toggleMouse.containsMouse ? "#f8f7f4" : "#ffffff"

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 16
                anchors.rightMargin: 16
                spacing: 8

                Label {
                    text: "\u25CF"
                    font.pixelSize: 8
                    color: "#9c9690"
                }

                Label {
                    text: "信号 & 历史"
                    font.pixelSize: 12
                    font.weight: Font.Medium
                    color: "#6b6560"
                }

                Item { Layout.fillWidth: true }

                Row {
                    spacing: 12

                    Row {
                        spacing: 4
                        Rectangle {
                            width: 5
                            height: 5
                            radius: 2.5
                            color: "#d4882e"
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        Label {
                            text: root.signalEvents.length + " signals"
                            font.pixelSize: 11
                            color: "#9c9690"
                        }
                    }

                    Row {
                        spacing: 4
                        Rectangle {
                            width: 5
                            height: 5
                            radius: 2.5
                            color: "#3b82c4"
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        Label {
                            text: root.callHistory.length + " calls"
                            font.pixelSize: 11
                            color: "#9c9690"
                        }
                    }
                }

                Label {
                    text: root.expanded ? "\u25B2" : "\u25BC"
                    font.pixelSize: 9
                    color: "#9c9690"
                }
            }

            MouseArea {
                id: toggleMouse
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.expanded = !root.expanded
            }

            Rectangle {
                anchors.top: parent.top
                anchors.left: parent.left
                anchors.right: parent.right
                height: 1
                color: "#e8e6e1"
            }
        }

        Flickable {
            Layout.fillWidth: true
            Layout.fillHeight: true
            visible: root.expanded
            contentHeight: signalColumn.height
            clip: true

            ColumnLayout {
                id: signalColumn
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.leftMargin: 16
                anchors.rightMargin: 16
                anchors.topMargin: 8
                spacing: 4

                Repeater {
                    model: root.signalEvents

                    delegate: Rectangle {
                        Layout.fillWidth: true
                        height: 48
                        radius: 10
                        color: signalMouse.containsMouse ? "#f8f7f4" : "transparent"

                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 12
                            anchors.rightMargin: 12
                            spacing: 12

                            Label {
                                text: modelData.time
                                font.pixelSize: 11
                                font.family: "monospace"
                                color: "#3b82c4"
                            }

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 2

                                Label {
                                    text: modelData.topic
                                    font.pixelSize: 12
                                    font.weight: Font.Medium
                                    font.family: "monospace"
                                    color: "#1a1816"
                                    elide: Text.ElideRight
                                    Layout.fillWidth: true
                                }

                                Label {
                                    text: modelData.payload
                                    font.pixelSize: 11
                                    color: "#6b6560"
                                    elide: Text.ElideRight
                                    Layout.fillWidth: true
                                }
                            }
                        }

                        MouseArea {
                            id: signalMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            acceptedButtons: Qt.NoButton
                        }
                    }
                }
            }
        }
    }
}
