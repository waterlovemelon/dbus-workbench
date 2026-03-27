import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Layouts 1.3
import "SampleData.js" as SampleData
import "components"

ApplicationWindow {
    id: window

    width: 1280
    height: 800
    minimumWidth: 960
    minimumHeight: 640
    visible: true
    title: "D-Bus Workbench"
    color: "transparent"
    flags: Qt.FramelessWindowHint | Qt.Window | Qt.WindowMinimizeButtonHint | Qt.WindowMaximizeButtonHint

    property var serviceModel: SampleData.serviceGroups()
    property var memberModel: SampleData.treeItems()
    property var methodModel: SampleData.methodArgs()
    property var signalModel: SampleData.signalEvents()
    property string activeBus: "session"
    property string activeMode: "browse"
    property string selectedServiceId: "service-notify"
    property string selectedMemberId: "method-notify"
    property var selectedNode: findNode(selectedMemberId)
    property color highlightColor: "#3a9a5c"
    property point startMousePos
    property point startWindowPos

    function findNode(id) {
        for (var i = 0; i < memberModel.length; i++) {
            if (memberModel[i].id === id) return memberModel[i];
        }
        return memberModel.length > 0 ? memberModel[0] : ({});
    }

    function showToast(msg) {
        toast.show(msg);
    }

    Rectangle {
        anchors.fill: parent
        radius: 12
        color: "#f8f7f4"

        ColumnLayout {
            anchors.fill: parent
            spacing: 0

            Rectangle {
                id: header
                Layout.fillWidth: true
                Layout.preferredHeight: 52
                color: "#ffffff"

                MouseArea {
                    id: dragArea
                    anchors.fill: parent
                    onPressed: {
                        window.startMousePos = Qt.point(mouseX, mouseY);
                        window.startWindowPos = Qt.point(window.x, window.y);
                    }
                    onPositionChanged: {
                        if (pressed) {
                            var dx = mouseX - window.startMousePos.x;
                            var dy = mouseY - window.startMousePos.y;
                            window.x = window.startWindowPos.x + dx;
                            window.y = window.startWindowPos.y + dy;
                        }
                    }
                    onDoubleClicked: {
                        if (window.visibility === Window.Maximized) {
                            window.showNormal();
                        } else {
                            window.showMaximized();
                        }
                    }
                }

                Rectangle {
                    anchors.bottom: parent.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    height: 1
                    color: "#e8e6e1"
                }

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 16
                    anchors.rightMargin: 16
                    spacing: 12
                    z: 1

                    Rectangle {
                        Layout.preferredWidth: 120
                        Layout.preferredHeight: 30
                        radius: 8
                        color: "#c45d3e"

                        Row {
                            anchors.centerIn: parent
                            spacing: 6

                            Label {
                                text: "DBus"
                                color: "#ffffff"
                                font.pixelSize: 13
                                font.weight: Font.Bold
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Label {
                                text: "Workbench"
                                color: "#ffffff"
                                font.pixelSize: 12
                                font.weight: Font.Medium
                                opacity: 0.85
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                    }

                    Rectangle {
                        width: 1
                        height: 20
                        color: "#d4d1ca"
                    }

                    Rectangle {
                        width: 124
                        height: 28
                        radius: 8
                        color: "#f1f0ec"
                        border.width: 1
                        border.color: "#e8e6e1"

                        Row {
                            anchors.centerIn: parent
                            spacing: 2

                            Rectangle {
                                width: 58
                                height: 24
                                radius: 6
                                color: window.activeBus === "session" ? "#ffffff" : "transparent"

                                Label {
                                    text: "Session"
                                    anchors.centerIn: parent
                                    font.pixelSize: 12
                                    font.weight: Font.Medium
                                    color: window.activeBus === "session" ? window.highlightColor : "#6b6560"
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: window.activeBus = "session"
                                }
                            }

                            Rectangle {
                                width: 56
                                height: 24
                                radius: 6
                                color: window.activeBus === "system" ? "#ffffff" : "transparent"

                                Label {
                                    text: "System"
                                    anchors.centerIn: parent
                                    font.pixelSize: 12
                                    font.weight: Font.Medium
                                    color: window.activeBus === "system" ? window.highlightColor : "#6b6560"
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: window.activeBus = "system"
                                }
                            }
                        }
                    }

                    Item { Layout.fillWidth: true }

                    Rectangle {
                        Layout.preferredWidth: 320
                        Layout.preferredHeight: 32
                        radius: 10
                        color: "#f1f0ec"
                        border.width: 1
                        border.color: searchField.activeFocus ? "#c45d3e" : "#d4d1ca"

                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 10
                            anchors.rightMargin: 8
                            spacing: 6

                            Label {
                                text: "\u2318"
                                color: "#9c9690"
                                font.pixelSize: 12
                            }

                            TextField {
                                id: searchField
                                Layout.fillWidth: true
                                Layout.fillHeight: true
                                placeholderText: "搜索服务、接口、方法…"
                                font.pixelSize: 13
                                color: "#1a1816"
                                background: Item {}
                            }

                            Label {
                                text: "\u2318K"
                                color: "#9c9690"
                                font.pixelSize: 10
                                font.family: "monospace"
                            }
                        }
                    }

                    Item { Layout.fillWidth: true }

                    Row {
                        spacing: 0

                        Rectangle {
                            width: 46
                            height: 36
                            color: minBtn.containsMouse ? "#f1f0ec" : "transparent"

                            Rectangle {
                                width: 12
                                height: 2
                                color: "#6b6560"
                                anchors.centerIn: parent
                            }

                            MouseArea {
                                id: minBtn
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: window.showMinimized()
                            }
                        }

                        Rectangle {
                            width: 46
                            height: 36
                            color: maxBtn.containsMouse ? "#f1f0ec" : "transparent"

                            Rectangle {
                                visible: window.visibility !== Window.Maximized
                                width: 10
                                height: 10
                                color: "transparent"
                                border.color: "#6b6560"
                                border.width: 1
                                anchors.centerIn: parent
                            }

                            Row {
                                visible: window.visibility === Window.Maximized
                                anchors.centerIn: parent
                                spacing: 1

                                Rectangle {
                                    width: 5
                                    height: 7
                                    color: "transparent"
                                    border.color: "#6b6560"
                                    border.width: 1
                                }
                                Rectangle {
                                    width: 5
                                    height: 7
                                    color: "transparent"
                                    border.color: "#6b6560"
                                    border.width: 1
                                }
                            }

                            MouseArea {
                                id: maxBtn
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    if (window.visibility === Window.Maximized) {
                                        window.showNormal();
                                    } else {
                                        window.showMaximized();
                                    }
                                }
                            }
                        }

                        Rectangle {
                            width: 46
                            height: 36
                            color: closeBtn.containsMouse ? "#e84040" : "transparent"

                            Label {
                                anchors.centerIn: parent
                                text: "×"
                                font.pixelSize: 18
                                color: closeBtn.containsMouse ? "#ffffff" : "#6b6560"
                            }

                            MouseArea {
                                id: closeBtn
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: window.close()
                            }
                        }
                    }
                }
            }

            RowLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                spacing: 0

                ServiceTreePane {
                    id: sidebar
                    Layout.fillHeight: true
                    Layout.preferredWidth: 300
                    services: window.serviceModel
                    members: window.memberModel
                    selectedServiceId: window.selectedServiceId
                    selectedMemberId: window.selectedMemberId

                    onServiceSelected: function(id) {
                        window.selectedServiceId = id;
                    }

                    onMemberSelected: function(id) {
                        window.selectedMemberId = id;
                        window.activeMode = "browse";
                    }
                }

                Rectangle {
                    width: 1
                    Layout.fillHeight: true
                    color: "#e8e6e1"
                }

                ColumnLayout {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    spacing: 0

                    Loader {
                        id: contentLoader
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        sourceComponent: window.activeMode === "browse" ? browseComponent : workbenchComponent
                    }

                    BottomPanel {
                        id: drawer
                        Layout.fillWidth: true
                        signalEvents: window.signalModel
                        callHistory: SampleData.callHistory()
                    }
                }
            }

            Toast {
                id: toast
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.bottom: parent.bottom
                anchors.bottomMargin: 60
                z: 100
            }
        }
    }

    Component {
        id: browseComponent

        BrowsePane {
            node: window.selectedNode
            members: window.memberModel

            onMemberClicked: function(id) {
                window.selectedMemberId = id;
                window.activeMode = "workbench";
            }

            onCopyRequested: function(type, method) {
                window.showToast("已复制 " + type + " 命令");
            }
        }
    }

    Component {
        id: workbenchComponent

        WorkbenchPane {
            node: window.selectedNode
            methodArguments: window.methodModel

            onBackRequested: {
                window.activeMode = "browse";
            }

            onCopyRequested: function(type) {
                window.showToast("已复制 " + type + " 命令");
            }

            onExecuted: {
                window.showToast("执行完成");
            }
        }
    }
}
