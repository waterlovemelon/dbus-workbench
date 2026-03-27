import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Layouts 1.3

Rectangle {
    id: root

    property string title: ""
    property string subtitle: ""
    property color frameColor: "#141c29"
    property color borderColor: "#243041"
    property color titleColor: "#f1f5f9"
    property color subtitleColor: "#8ea0b6"
    default property alias contentData: container.data

    radius: 18
    color: frameColor
    border.width: 1
    border.color: borderColor

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 18
        spacing: 16

        Item {
            Layout.fillWidth: true
            Layout.preferredHeight: headerColumn.implicitHeight
            visible: root.title.length > 0 || root.subtitle.length > 0

            Column {
                id: headerColumn
                anchors.left: parent.left
                anchors.right: parent.right
                spacing: 4

                Label {
                    visible: root.title.length > 0
                    text: root.title
                    font.pixelSize: 18
                    font.weight: Font.DemiBold
                    color: root.titleColor
                }

                Label {
                    visible: root.subtitle.length > 0
                    text: root.subtitle
                    color: root.subtitleColor
                    font.pixelSize: 12
                    wrapMode: Text.WordWrap
                }
            }
        }

        ColumnLayout {
            id: container
            Layout.fillWidth: true
            Layout.fillHeight: true
            spacing: 12
        }
    }
}
