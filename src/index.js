'use strict'

import { app, BrowserWindow, Tray, ipcMain, Menu, MenuItem,
  dialog, nativeImage, globalShortcut } from 'electron'
import path from 'path'
import pkg from '../package.json'

if(process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
} else {
  global.__static = path.join(__dirname, '../static').replace(/\\/g, '\\\\')
}

process.on('uncaughtException', (err) => {
  console.log(err)
})

app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
app.allowRendererProcessReuse = true

let mainWindow
let appTray
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const appIconOverlay = path.resolve(__static, 'iconOverlay.png')
let iconOverlay = nativeImage.createFromPath(appIconOverlay)
const appIconTray = path.resolve(__static, 'iconTray.ico')
let iconTray = nativeImage.createFromPath(appIconTray)

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 563,
    minWidth: 1100,
    minHeight: 563,
    useContentSize: true,
    frame: false,
    toolbar: false,
    show: false,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      nativeWindowOpen: true,
      enableRemoteModule: false,
      partition: 'persist:tmp'
    },
    icon: path.resolve(__static, 'icons/64x64.png'),
    headless: true,
    args: ['--no-sandbox']
  })

  mainWindow.loadURL(winURL)

  appTray = new Tray(iconTray)
  appTray.setToolTip('Notepad Jimhucksly Studio')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => mainWindow.show()
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true
        app.quit()
      }
    }
  ])

  appTray.setContextMenu(contextMenu)

  appTray.on('click', () => {
    if(mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  mainWindow.on('closed', () => {
    // mainWindow = null
  })

  mainWindow.on('minimize', (e) => {
    // e.preventDefault()
    // mainWindow.hide()
  })

  mainWindow.on('show', () => {
    // appTray.setHighlightMode('always')
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('did-frame-finish-load', () => {
    if(process.env.NODE_ENV === 'development') {
      mainWindow.focus()
    }
  })
}

const gotTheLock = app.requestSingleInstanceLock()

if(!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if(mainWindow) {
      if(mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  })

  app.on('ready', createWindow)
}

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('browser-window-created', (e, window) => {
  window.setMenu(null)
  window.setOverlayIcon(null, '')
  window.setTitle(pkg.build.productName)

  const submenu = new Menu()
  submenu.append(new MenuItem({
    label: 'Preferences...',
    click: () => {
      const appMenu = Menu.getApplicationMenu()
      const menuItemFile = appMenu.items.find(item => item.label === 'File')
      const menuItemReload = menuItemFile.submenu.items.find(item => item.label === 'Reload')
      menuItemReload.visible = false
      window.webContents.send('preferences-show')
    }
  }))
  submenu.append(new MenuItem({
    label: 'Reload',
    click: () => {
      window.webContents.send('reload')
    }
  }))
  submenu.append(new MenuItem({
    label: 'Sign Out',
    click: () => {
      window.webContents.send('sign-out')
    }
  }))
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'File',
    submenu
  }))
  menu.append(new MenuItem({
    label: 'About',
    click: () => {
      window.webContents.send('about')
    }
  }))
  Menu.setApplicationMenu(menu)
})

app.on('activate', () => {
  if(mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', (e) => {
  globalShortcut.unregisterAll()
})

app.on('before-quit', () => {
  mainWindow.removeAllListeners('close')
  globalShortcut.unregisterAll()
  appTray.destroy()
  mainWindow.close()
})

app.setPath('userData', path.resolve(app.getPath('userData'), '../JimhuckslyStudio/notepad-app'))

ipcMain.on('get-app-path', (event) => {
  event.sender.send('set-app-path', app.getPath('userData'))
})

ipcMain.on('get-window-title', (event) => {
  event.sender.send('set-window-title', mainWindow.getTitle())
})

ipcMain.on('minimize', (event) => {
  mainWindow.minimize()
})

ipcMain.on('min-max', (event) => {
  if(mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.on('hide', (event) => {
  mainWindow.hide()
})

ipcMain.on('menu-popup', (event) => {
  const appMenu = Menu.getApplicationMenu()
  appMenu.popup(mainWindow)
})

ipcMain.on('context-menu-popup', (event) => {
  const contextMenu = new Menu()
  contextMenu.append(new MenuItem({
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }))
  contextMenu.popup(mainWindow)
})

ipcMain.on('authorized', () => {
  const appMenu = Menu.getApplicationMenu()
  const menuItemFile = appMenu.items.find(item => item.label === 'File')
  menuItemFile.visible = true
})

ipcMain.on('unauthorized', () => {
  const appMenu = Menu.getApplicationMenu()
  const menuItemFile = appMenu.items.find(item => item.label === 'File')
  menuItemFile.visible = false
})

ipcMain.on('preferences-hide', () => {
  const appMenu = Menu.getApplicationMenu()
  const menuItemFile = appMenu.items.find(item => item.label === 'File')
  const menuItemReload = menuItemFile.submenu.items.find(item => item.label === 'Reload')
  menuItemReload.visible = true
})

ipcMain.on('open-folder-dialog', (event, arg) => {
  dialog.showOpenDialog({
    title: 'Choose folder',
    defaultPath: arg.defaultPath,
    filters: [
      { name: 'exe', extensions: ['exe'] }
    ],
    properties: ['openDirectory']
  }).then((filePaths) => {
    event.sender.send('open-dialog-paths-selected', filePaths)
  })
})

ipcMain.on('open-file-dialog', (event, arg) => {
  dialog.showOpenDialog({
    title: 'Choose file',
    properties: ['openFile'],
    filters: [
      { name: 'txt', extensions: ['txt'] },
      { name: 'json', extensions: ['json'] }
    ]
  }).then((file) => {
    event.sender.send('open-dialog-file-selected', file)
  })
})

ipcMain.on('save-file-dialog', (event, arg) => {
  dialog.showSaveDialog({
    title: 'Save file',
    buttonLabel: 'Save',
    filters: [
      {name: 'json', extensions: ['json']}
    ]
  }).then((file) => {
    event.sender.send('save-dialog-file-selected', file)
  })
})

ipcMain.on('json-viewer-src-set', (event, txt) => {
  event.sender.send('json-viewer-src-set', txt)
})
ipcMain.on('json-viewer-save', (event, fileName) => {
  event.sender.send('json-viewer-save', fileName)
})
ipcMain.on('json-viewer-clear', (event) => {
  event.sender.send('json-viewer-clear')
})

ipcMain.on('set-icon-notification', () => {
  mainWindow.setOverlayIcon(iconOverlay, 'You have an unread message')
  appTray.displayBalloon({
    icon: iconOverlay,
    title: 'my app',
    content: 'Access app settings from tray menu.'
  })
})

ipcMain.on('hide-icon-notification', () => {
  setTimeout(() => {
    mainWindow.setOverlayIcon(null, '')
  }, 2000)
})

ipcMain.on('open-error-dialog', (event, msg) => {
  dialog.showMessageBox(null, {
    type: 'error',
    buttons: ['Cancel'],
    defaultId: 2,
    title: 'Error',
    message: msg
  }).then(() => {
    event.sender.send('dialog-error-callback')
  })
})

ipcMain.on('open-dialog-remove-confirm', (event) => {
  dialog.showMessageBox(null, {
    type: 'question',
    buttons: ['Yes', 'No'],
    defaultId: 1,
    title: 'Confirm',
    message: 'Remove record?'
  }).then(data => {
    if(data.response === 0) {
      event.sender.send('remove-is-confimed')
    }
  })
})

ipcMain.on('open-dialog-unlock-confirm', (event) => {
  dialog.showMessageBox(null, {
    type: 'question',
    buttons: ['Yes', 'No'],
    defaultId: 1,
    title: 'Confirm',
    message: 'Remove the protection?'
  }).then(data => {
    if(data.response === 0) {
      event.sender.send('unlock-is-confimed')
    } else {
      event.sender.send('unlock-is-unconfimed')
    }
  })
})

ipcMain.on('codemirror-link-click', (event, text) => {
  event.sender.send('codemirror-link-click', text)
})

ipcMain.on('todo-add', (event, text) => {
  event.sender.send('todo-add')
})

ipcMain.on('data-transfer', (event, data) => {
  event.sender.send('data-transfer', data)
})
