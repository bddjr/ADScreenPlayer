declare interface Window {
    electronAPI: {
        ipcRendererSendSync: Electron.IpcRenderer.sendSync,
        ipcRendererSend: Electron.IpcRenderer.send,
    }
}
