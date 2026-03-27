import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Layouts 1.3

Rectangle {
    id: root

    property var items: []
    property string currentKey: ""
    signal itemTriggered(string key)

    radius: 22
    color: "#0d1420"
    border.width: 1
    border.color: "#223144"

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 12
        spacing: 12

        Rectangle {
            Layout.alignment: Qt.AlignHCenter
            width: 40
            height: 40
            radius: 14
            color: "#1d4ed8"

            Label {
                anchors.centerIn: parent
                text: "DB"
                color: "#f8fafc"
                font.pixelSize: 14
                font.weight: Font.Black
            }
        }

        Repeater {
            model: root.items

            delegate: Button {
                Layout.fillWidth: true
                implicitHeight: 60
                padding: 0
                hoverEnabled: true

                background: Rectangle {
                    radius: 16
                    color: root.currentKey === modelData.key ? "#17355f" : (parent.hovered ? "#111b2a" : "transparent")
                    border.width: root.currentKey === modelData.key ? 1 : 0
                    border.color: "#2d70d6"
                }

                contentItem: Column {
                    anchors.centerIn: parent
                    spacing: 4

                    Label {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: modelData.shortLabel
                        color: "#e5eefb"
                        font.pixelSize: 16
                        font.weight: Font.Bold
                    }

                    Label {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: modelData.label
                        color: "#8ea0b6"
                        font.pixelSize: 10
                    }
                }

                onClicked: root.itemTriggered(model.modelData.key)

                ToolTip.visible: hovered
                ToolTip.text: model.modelData.label
            }
        }

        Item {
            Layout.fillHeight: true
        }

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 74
            radius: 16
            color: "#111b2a"
            border.width: 1
            border.color: "#223144"

            Column {
                anchors.centerIn: parent
                spacing: 4

                Label {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Bus"
                    color: "#d4deed"
                    font.pixelSize: 13
                    font.weight: Font.DemiBold
                }

                Label {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Live"
                    color: "#34d399"
                    font.pixelSize: 12
                }
            }
        }
    }
}
