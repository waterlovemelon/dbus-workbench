import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Layouts 1.3

Rectangle {
    id: root

    property var services: []
    property var members: []
    property string selectedServiceId: ""
    property string selectedMemberId: ""

    signal serviceSelected(string id)
    signal memberSelected(string id)

    color: "#ffffff"

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 44

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 16
                anchors.rightMargin: 16

                Label {
                    text: "服务"
                    font.pixelSize: 12
                    font.weight: Font.DemiBold
                    color: "#9c9690"
                }

                Item { Layout.fillWidth: true }

                Label {
                    text: root.services.length + " services"
                    font.pixelSize: 11
                    color: "#9c9690"
                }
            }
        }

        Rectangle {
            Layout.fillWidth: true
            height: 1
            color: "#e8e6e1"
        }

        ListView {
            id: serviceList
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true
            model: root.services

            delegate: Column {
                width: serviceList.width

                property bool isExpanded: index === 0
                property var serviceMembers: getMembersForService(modelData)

                function getMembersForService(service) {
                    var result = [];
                    var serviceLabel = service.label;
                    for (var i = 0; i < root.members.length; i++) {
                        var m = root.members[i];
                        if (m.interfaceName === serviceLabel || m.interfaceName.indexOf(serviceLabel) !== -1) {
                            result.push(m);
                        }
                    }
                    if (result.length === 0 && index === 0) {
                        for (var j = 0; j < root.members.length; j++) {
                            result.push(root.members[j]);
                        }
                    }
                    return result;
                }

                Rectangle {
                    width: parent.width
                    height: 40
                    color: serviceMouse.containsMouse ? "#f1f0ec" : "transparent"

                    RowLayout {
                        anchors.fill: parent
                        anchors.leftMargin: 12
                        anchors.rightMargin: 12
                        spacing: 8

                        Label {
                            text: "\u25B6"
                            font.pixelSize: 8
                            color: "#9c9690"
                            rotation: isExpanded ? 90 : 0
                        }

                        Label {
                            Layout.fillWidth: true
                            text: modelData.label
                            font.pixelSize: 13
                            font.weight: Font.Medium
                            color: "#1a1816"
                            elide: Text.ElideRight
                        }

                        Rectangle {
                            height: 20
                            width: countLabel.implicitWidth + 12
                            radius: 10
                            color: "#f1f0ec"
                            border.width: 1
                            border.color: "#e8e6e1"

                            Label {
                                id: countLabel
                                anchors.centerIn: parent
                                text: serviceMembers.length
                                font.pixelSize: 10
                                color: "#9c9690"
                            }
                        }
                    }

                    MouseArea {
                        id: serviceMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            root.serviceSelected(modelData.id);
                            isExpanded = !isExpanded;
                        }
                    }
                }

                Repeater {
                    model: isExpanded ? serviceMembers : []

                    delegate: Rectangle {
                        width: parent.width
                        height: 36
                        color: root.selectedMemberId === modelData.id ? "#fef0ed" : (memberMouse.containsMouse ? "#f8f7f4" : "transparent")

                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 36
                            anchors.rightMargin: 12
                            spacing: 10

                            Rectangle {
                                width: 6
                                height: 6
                                radius: 3
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

                            Label {
                                Layout.fillWidth: true
                                text: modelData.label
                                font.pixelSize: 12
                                font.family: "monospace"
                                color: "#1a1816"
                                elide: Text.ElideRight
                            }

                            Label {
                                text: modelData.type
                                font.pixelSize: 10
                                color: "#9c9690"
                            }
                        }

                        MouseArea {
                            id: memberMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.memberSelected(modelData.id)
                        }
                    }
                }
            }
        }
    }
}
