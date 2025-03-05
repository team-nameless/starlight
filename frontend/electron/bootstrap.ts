import { BrowserWindow, app } from "electron";

app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: "Glorious Starlight"
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        win.loadFile("dist/index.html");
    }
});
