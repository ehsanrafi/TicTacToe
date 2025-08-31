const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        // width,
        // height,
        // fullscreen: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.maximize();
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow()
});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') // macOS
        app.quit();
});