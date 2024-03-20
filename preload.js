// https://github.com/bddjr/ADScreenPlayer

/// <reference path="./global.d.ts" />

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  ipcRendererSendSync: ipcRenderer.sendSync,
  ipcRendererSend: ipcRenderer.send,
});
