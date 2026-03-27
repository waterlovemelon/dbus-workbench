import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Layouts 1.3

Rectangle {
    id: root

    property var node: ({})
    property var methodArguments: []

    signal backRequested()
    signal copyRequested(string type)
    signal executed()

    color: "#f8f7f4"

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 52
            color: "#ffffff"

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 16
                anchors.rightMargin: 16
                spacing: 12

                Rectangle {
                    height: 30
                    width: 68
                    radius: 8
                    color: backMouse.containsMouse ? "#f1f0ec" : "transparent"

                    Row {
                        anchors.centerIn: parent
                        spacing: 4

                        Label {
                            text: "\u25C0"
                            font.pixelSize: 9
                            color: "#6b6560"
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Label {
                            text: "返回"
                            font.pixelSize: 13
                            color: "#6b6560"
                        }
                    }

                    MouseArea {
                        id: backMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.backRequested()
                    }
                }

                Rectangle {
                    width: 1
                    height: 20
                    color: "#d4d1ca"
                }

                Label {
                    text: root.node.interfaceName || "org.freedesktop.Notifications"
                    font.pixelSize: 13
                    font.family: "monospace"
                    color: "#1a1816"
                }

                Label {
                    text: "\u00B7"
                    font.pixelSize: 14
                    color: "#9c9690"
                }

                Label {
                    text: root.node.label || "Notify"
                    font.pixelSize: 13
                    font.family: "monospace"
                    font.weight: Font.Medium
                    color: "#1a1816"
                }

                Item { Layout.fillWidth: true }
            }

            Rectangle {
                anchors.bottom: parent.bottom
                anchors.left: parent.left
                anchors.right: parent.right
                height: 1
                color: "#e8e6e1"
            }
        }

        Flickable {
            Layout.fillWidth: true
            Layout.fillHeight: true
            contentHeight: contentCol.height
            clip: true

            Column {
                id: contentCol
                width: parent.width
                leftPadding: 28
                rightPadding: 28
                topPadding: 24
                spacing: 20

                Rectangle {
                    width: parent.width - parent.leftPadding - parent.rightPadding
                    radius: 14
                    color: "#ffffff"
                    border.width: 1
                    border.color: "#e8e6e1"
                    height: argsContent.height

                    Column {
                        id: argsContent
                        width: parent.width
                        spacing: 0

                        Row {
                            width: parent.width
                            height: 48
                            leftPadding: 20
                            rightPadding: 20

                            Label {
                                text: "参数"
                                font.pixelSize: 14
                                font.weight: Font.DemiBold
                                color: "#1a1816"
                                anchors.verticalCenter: parent.verticalCenter
                            }

                            Item { width: parent.width - 120; height: 1 }

                            Label {
                                text: root.methodArguments.length + " arguments"
                                font.pixelSize: 11
                                color: "#9c9690"
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 1
                            color: "#e8e6e1"
                        }

                        Repeater {
                            model: root.methodArguments

                            delegate: Rectangle {
                                property var entry: model.modelData
                                width: parent.width
                                height: 52
                                color: argHover.containsMouse ? "#f8f7f4" : "transparent"

                                RowLayout {
                                    anchors.fill: parent
                                    anchors.leftMargin: 20
                                    anchors.rightMargin: 20
                                    spacing: 16

                                    Column {
                                        Layout.preferredWidth: 160
                                        spacing: 2
                                        anchors.verticalCenter: parent.verticalCenter

                                        Label {
                                            text: entry.name
                                            font.pixelSize: 13
                                            font.weight: Font.Medium
                                            color: "#1a1816"
                                        }

                                        Label {
                                            text: entry.signature
                                            font.pixelSize: 11
                                            font.family: "monospace"
                                            color: "#c45d3e"
                                        }
                                    }

                                    Rectangle {
                                        Layout.fillWidth: true
                                        height: 36
                                        radius: 10
                                        color: "#f1f0ec"
                                        border.width: 1
                                        border.color: argInput.activeFocus ? "#c45d3e" : "#d4d1ca"
                                        anchors.verticalCenter: parent.verticalCenter

                                        TextField {
                                            id: argInput
                                            anchors.fill: parent
                                            anchors.margins: 1
                                            text: entry.value
                                            font.pixelSize: 13
                                            font.family: "monospace"
                                            color: "#1a1816"
                                            selectByMouse: true
                                            background: Item {}
                                        }
                                    }
                                }

                                MouseArea {
                                    id: argHover
                                    anchors.fill: parent
                                    acceptedButtons: Qt.NoButton
                                    hoverEnabled: true
                                }
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 1
                            color: "#e8e6e1"
                        }

                        Row {
                            width: parent.width
                            height: 62
                            leftPadding: 20
                            rightPadding: 20
                            spacing: 8

                            Rectangle {
                                height: 34
                                width: execLbl.implicitWidth + 32
                                radius: 8
                                color: execHover.containsMouse ? "#a84e34" : "#c45d3e"
                                anchors.verticalCenter: parent.verticalCenter

                                Row {
                                    anchors.centerIn: parent
                                    spacing: 6

                                    Label {
                                        text: "\u25B6"
                                        font.pixelSize: 11
                                        color: "#ffffff"
                                    }

                                    Label {
                                        id: execLbl
                                        text: "执行"
                                        font.pixelSize: 13
                                        font.weight: Font.Medium
                                        color: "#ffffff"
                                    }
                                }

                                MouseArea {
                                    id: execHover
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.executed()
                                }
                            }

                            Repeater {
                                model: ["复制 gdbus 命令", "复制 busctl 命令", "复制 Python 代码"]

                                delegate: Rectangle {
                                    height: 34
                                    width: cpLbl.implicitWidth + 24
                                    radius: 8
                                    color: cpHover.containsMouse ? "#f1f0ec" : "transparent"
                                    border.width: 1
                                    border.color: "#d4d1ca"
                                    anchors.verticalCenter: parent.verticalCenter

                                    Label {
                                        id: cpLbl
                                        anchors.centerIn: parent
                                        text: modelData
                                        font.pixelSize: 12
                                        color: "#1a1816"
                                    }

                                    MouseArea {
                                        id: cpHover
                                        anchors.fill: parent
                                        hoverEnabled: true
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            var t = modelData.replace("复制 ", "").replace(" 命令", "").replace(" 代码", "");
                                            root.copyRequested(t);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                Rectangle {
                    width: parent.width - parent.leftPadding - parent.rightPadding
                    radius: 14
                    color: "#ffffff"
                    border.width: 1
                    border.color: "#e8e6e1"
                    height: resultContent.height

                    Column {
                        id: resultContent
                        width: parent.width
                        spacing: 0

                        Row {
                            width: parent.width
                            height: 48
                            leftPadding: 20
                            rightPadding: 20

                            Label {
                                text: "返回结果"
                                font.pixelSize: 14
                                font.weight: Font.DemiBold
                                color: "#1a1816"
                                anchors.verticalCenter: parent.verticalCenter
                            }

                            Item { width: parent.width - 140; height: 1 }

                            Row {
                                spacing: 4
                                anchors.verticalCenter: parent.verticalCenter

                                Rectangle {
                                    width: 6
                                    height: 6
                                    radius: 3
                                    color: "#3a9a5c"
                                    anchors.verticalCenter: parent.verticalCenter
                                }

                                Label {
                                    text: "success"
                                    font.pixelSize: 11
                                    color: "#3a9a5c"
                                }
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 1
                            color: "#e8e6e1"
                        }

                        Rectangle {
                            anchors.horizontalCenter: parent.horizontalCenter
                            width: parent.width - 40
                            height: resultTxt.implicitHeight + 24
                            radius: 10
                            color: "#f1f0ec"
                            anchors.topMargin: 16
                            anchors.bottomMargin: 16

                            Text {
                                id: resultTxt
                                anchors.fill: parent
                                anchors.margins: 12
                                text: '{\n  "id": 42,\n  "capabilities": ["actions", "body-markup"]\n}'
                                font.family: "monospace"
                                font.pixelSize: 13
                                color: "#1a1816"
                                wrapMode: Text.Wrap
                            }
                        }

                        Item { width: 1; height: 16 }
                    }
                }

                Item { width: 1; height: 20 }
            }
        }
    }
}
