import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";
import { spawn } from "child_process";

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, "public")
    : RENDERER_DIST;

// Only allow one instance of the app
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    console.log('Another instance is already running. Quitting.');
    app.quit();
    process.exit(0);
}

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        autoHideMenuBar: true,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        }
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }

    // Handle second instance
    app.on('second-instance', () => {
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });

    // Register IPC handler for emotiv server
    ipcMain.handle('start-emotiv-server', async () => {
        try {
            const rootPath = path.resolve(process.env.APP_ROOT as string, '..');
            const emotivProcess = spawn('npm', ['run', 'start:emotiv-server'], {
                cwd: rootPath,
                detached: true,
                stdio: 'ignore'
            });
            
            emotivProcess.unref();
            return true;
        } catch (error) {
            return false;
        }
    });
}

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(createWindow);
