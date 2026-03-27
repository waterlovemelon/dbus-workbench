import QtQuick 2.11
import QtQuick.Controls 2.4
import QtQuick.Layouts 1.3

Rectangle {
    id: root

    property string message: ""

    width: toastText.implicitWidth + 32
    height: 36
    radius: 10
    color: "#1a1816"
    opacity: 0
    visible: opacity > 0

    function show(msg) {
        message = msg;
        hideTimer.restart();
        opacity = 1;
    }

    function hide() {
        opacity = 0;
    }

    Label {
        id: toastText
        anchors.centerIn: parent
        text: root.message
        font.pixelSize: 12
        font.weight: Font.Medium
        color: "#f8f7f4"
    }

    Behavior on opacity {
        NumberAnimation { duration: 200; easing.type: Easing.OutCubic }
    }

    Timer {
        id: hideTimer
        interval: 1800
        onTriggered: root.hide()
    }
}
