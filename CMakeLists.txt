cmake_minimum_required(VERSION 3.16)

project(dd-feet VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTORCC ON)

find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Quick QuickControls2)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Quick QuickControls2)

if(QT_VERSION_MAJOR EQUAL 6)
    qt_standard_project_setup(REQUIRES 6.5)
endif()

set(PROJECT_SOURCES
    src/main.cpp
)

set(QML_FILES
        qml/Main.qml
        qml/SampleData.js
        qml/components/BrowsePane.qml
        qml/components/BottomPanel.qml
        qml/components/ServiceTreePane.qml
        qml/components/Toast.qml
        qml/components/WorkbenchPane.qml
)

if(QT_VERSION_MAJOR EQUAL 6)
    qt_add_executable(dd-feet
        ${PROJECT_SOURCES}
    )

    qt_add_qml_module(dd-feet
        URI DbusWorkbench
        VERSION 1.0
        QML_FILES
            ${QML_FILES}
    )
else()
    add_executable(dd-feet
        ${PROJECT_SOURCES}
        resources.qrc
    )
endif()

target_link_libraries(dd-feet
    PRIVATE
        Qt${QT_VERSION_MAJOR}::Quick
        Qt${QT_VERSION_MAJOR}::QuickControls2
)

install(TARGETS dd-feet
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)
