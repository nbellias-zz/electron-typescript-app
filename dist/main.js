"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
class Main {
    static onWindowAllClosed() {
        // Quit when all windows are closed, except on macOS. There, it's common
        // for applications and their menu bar to stay active until the user quits
        // explicitly with Cmd + Q.
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }
    static onClose() {
        // Dereference the window object. 
        Main.mainWindow.close;
    }
    static createWindow() {
        // Create the browser window.
        Main.mainWindow = new Main.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path_1.default.join(__dirname, 'preload.js')
            }
        });
        // and load the index.html of the app.
        Main.mainWindow.loadFile('index.html');
        electron_1.ipcMain.handle('dark-mode:toggle', () => {
            if (electron_1.nativeTheme.shouldUseDarkColors) {
                electron_1.nativeTheme.themeSource = 'light';
            }
            else {
                electron_1.nativeTheme.themeSource = 'dark';
            }
            return electron_1.nativeTheme.shouldUseDarkColors;
        });
        electron_1.ipcMain.handle('dark-mode:system', () => {
            electron_1.nativeTheme.themeSource = 'system';
        });
        // Open the DevTools.
        Main.mainWindow.webContents.openDevTools();
        //Main.mainWindow.on('closed', Main.onClose);
    }
    static main(app, browserWindow) {
        // we pass the Electron.App object and the  
        // Electron.BrowserWindow into this function 
        // so this class has no dependencies. This 
        // makes the code easier to write tests for 
        Main.BrowserWindow = browserWindow;
        electron_1.Menu.setApplicationMenu(null);
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.createWindow);
    }
}
exports.default = Main;
