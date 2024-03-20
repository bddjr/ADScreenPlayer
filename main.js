// https://github.com/bddjr/ADScreenPlayer

/// <reference path="./global.d.ts" />

const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, ipcMain, screen } = require("electron/main");

/**
 * @param {string} inp
 */
function autoRootDirFile(inp) {
  const oup = path.resolve(inp);
  return fs.existsSync(oup) ? oup : path.join(__dirname, inp);
}

const config = require(autoRootDirFile("./conf/config.json"));
console.log(config);

function quit() {
  if (process.platform !== "darwin") {
    console.log("quit");
    app.quit();
  }
}

/** @type {BrowserWindow | null} */
var win = null;

function createWindowMain() {
  const { scaleFactor } = screen.getPrimaryDisplay();
  console.log(scaleFactor);
  const rect = {
    x: Math.ceil(config.x / scaleFactor),
    y: Math.ceil(config.y / scaleFactor),
    width: Math.ceil(config.width / scaleFactor),
    height: Math.ceil(config.height / scaleFactor),
  };
  console.log(rect);
  win = new BrowserWindow({
    x: rect.x,
    y: rect.y,

    alwaysOnTop: config.alwaysOnTop,
    fullscreen: config.fullscreen,
    fullscreenable: config.fullscreen,
    frame: config.debugmode,
    resizable: config.debugmode,
    thickFrame: config.debugmode,
    minimizable: config.minimizable,
    maximizable: config.maximizable,

    webPreferences: {
      devTools: config.debugmode,
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload.js"),
    },

    backgroundColor: "#000000",
    hasShadow: false,
    roundedCorners: false,
    backgroundMaterial: "none",
    title: "ADScreenPlayer",

    show: false,
  });
  win.setContentSize(rect.width, rect.height);
  // win.on("closed", quit);

  ipcMain.on("getConfig", (event) => {
    event.returnValue = config;
  });
  ipcMain.on("getVideoNames", (event) => {
    const p = autoRootDirFile("./conf/video/");
    event.returnValue = fs.readdirSync(p).map((i) => path.join(p, i));
  });
  ipcMain.on("openOrCloseDevTools", async () => {
    if (win.webContents.isDevToolsOpened()) {
      win.webContents.closeDevTools();
    } else {
      win.webContents.openDevTools();
    }
  });

  win.show();
  console.log(win.getPosition());
  console.log(win.getSize());

  win.loadFile("./html/index.html");
  win.focus();
}

/** @type {BrowserWindow | null} */
var button = null;

function createWindowButton() {
  let winPosition = win.getPosition();
  button = new BrowserWindow({
    parent: win,

    x: win.getSize()[0] + winPosition[0] + 1,
    y: winPosition[1],

    width: 40,
    height: 40,

    alwaysOnTop: config.alwaysOnTop,
    fullscreen: config.fullscreen,
    fullscreenable: config.fullscreen,
    frame: false,
    resizable: false,
    thickFrame: false,
    minimizable: false,
    maximizable: false,

    webPreferences: {
      devTools: config.debugmode,
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload.js"),
    },

    backgroundColor: "rgba(0,0,0,0)",
    hasShadow: false,
    roundedCorners: false,
    backgroundMaterial: "none",
    transparent: true,
  });

  ipcMain.on("closeWindow", async () => {
    win.close();
  });

  button.loadFile("./html/buttom.html");
}

app.whenReady().then(() => {
  createWindowMain();
  createWindowButton();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindowMain();
    }
  });
});

app.on("window-all-closed", quit);
