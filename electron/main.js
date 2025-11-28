const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow = null;
let viteServer = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false
  });

  // Показываем окно только когда оно готово
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // В режиме разработки или если dist существует - загружаем из него
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev || !require('fs').existsSync(path.join(__dirname, '../dist/index.html'))) {
    // Запускаем Vite dev server
    startViteServer();
    // Загружаем из dev server
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173');
    }, 2000);
  } else {
    // Загружаем из собранного dist
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (viteServer) {
      viteServer.kill();
      viteServer = null;
    }
  });

  // Открываем DevTools в режиме разработки
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

function startViteServer() {
  const vitePath = path.join(__dirname, '../node_modules/.bin/vite');
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'vite.cmd' : 'vite';
  
  viteServer = spawn(command, [], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'ignore'
  });

  viteServer.on('error', (err) => {
    console.error('Ошибка запуска Vite:', err);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (viteServer) {
    viteServer.kill();
    viteServer = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (viteServer) {
    viteServer.kill();
    viteServer = null;
  }
});

