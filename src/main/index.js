import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

function createWindow() {
  // Cria a janela do navegador.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true, // Considerar ativar isso para segurança
      enableRemoteModule: false // Desativar o módulo remoto
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR para o renderer baseado no Electron-Vite CLI.
  // Carrega a URL remota para desenvolvimento ou o arquivo HTML local para produção.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // Evitar redirecionamentos não tratados para uma página não encontrada
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const currentUrl = mainWindow.webContents.getURL();
    // Verifique se a navegação está dentro do aplicativo
    if (url.startsWith(currentUrl)) {
      // Permite navegação dentro da mesma janela
      event.preventDefault();
      mainWindow.loadURL(url); // Use a URL diretamente
    }
  });
}

// Este método será chamado quando o Electron tiver terminado
// a inicialização e estiver pronto para criar janelas do navegador.
app.whenReady().then(() => {
  // Definir o ID do modelo de usuário do aplicativo para Windows
  electronApp.setAppUserModelId('com.electron');

  // Abrir ou fechar DevTools por padrão ao pressionar F12 em desenvolvimento
  // e ignorar CommandOrControl + R na produção.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Teste IPC
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', () => {
    // No macOS é comum recriar uma janela no aplicativo quando o
    // ícone do dock é clicado e não há outras janelas abertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Sair quando todas as janelas estiverem fechadas, exceto no macOS.
// Lá, é comum que os aplicativos e sua barra de menu permaneçam ativos
// até que o usuário saia explicitamente com Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
