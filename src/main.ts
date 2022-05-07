import { BrowserWindow, Menu, ipcMain, nativeTheme } from 'electron';
import path from 'path';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow: any;
    static Menu: Electron.Menu;

    private static onWindowAllClosed() {
        // Quit when all windows are closed, except on macOS. There, it's common
        // for applications and their menu bar to stay active until the user quits
        // explicitly with Cmd + Q.
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        // Dereference the window object. 
        Main.mainWindow.close;
    }

    private static createWindow() {
        // Create the browser window.
        Main.mainWindow = new Main.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        });
        // and load the index.html of the app.
        Main.mainWindow.loadFile('index.html');

        ipcMain.handle('dark-mode:toggle', () => {
            if (nativeTheme.shouldUseDarkColors) {
                nativeTheme.themeSource = 'light'
            } else {
                nativeTheme.themeSource = 'dark'
            }
            return nativeTheme.shouldUseDarkColors
        })

        ipcMain.handle('dark-mode:system', () => {
            nativeTheme.themeSource = 'system'
        })
        
        // Open the DevTools.
        Main.mainWindow.webContents.openDevTools();

        //Main.mainWindow.on('closed', Main.onClose);
        
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        // we pass the Electron.App object and the  
        // Electron.BrowserWindow into this function 
        // so this class has no dependencies. This 
        // makes the code easier to write tests for 
        Main.BrowserWindow = browserWindow;
        Menu.setApplicationMenu(null);
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.createWindow);

        
    }
}