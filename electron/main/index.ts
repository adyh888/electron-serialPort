import { app, BrowserWindow, shell, ipcMain, globalShortcut } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
// import { strHexBuffer } from '../../src/utils'

const { SerialPort } = require('serialport')

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
//serialPort类
let serialPort: any
let serialErr: any
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1366,
    height: 768,
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // 以下两个属性必须设置,在渲染进程才能正常访问require语句！
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(() => {
  createWindow(),
    globalShortcut.register('CommandOrControl+Shift+i', function () {
      win.webContents.openDevTools()
    })
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// //node-serialPort
// ipcMain.on('openSerialPort', (event, args) => {
//   serialPort = new SerialPort({
//     path: '/dev/tty.Bluetooth-Incoming-Port', // 串口号
//     baudRate: 19200, // 波特率
//     dataBits: 8, // 数据位
//     parity: 'none', // 奇偶校验
//     stopBits: 1, // 停止位
//     autoOpen: false // 是否自动打开端口
//   })
//   // 打开串口
//   serialPort.open(err => {
//     if (err) {
//       return
//     }
//     // 主进程=>向渲染进程回复
//     win.webContents.send('openSerialPort', '端口打开成功')
//   })
//
//   // serialPort.removeAllListeners() //清除所有监听器
//   // 串口数据监听
//   serialPort.on('data', data => {
//     win.webContents.send('dataSerialPort', data)
//   })
//   // 串口关闭
//   serialPort.on('close', () => {
//     win.webContents.send('closeSerialPort', '端口关闭成功')
//   })
//   // 错误监听
//   serialPort.on('error', err => {
//     win.webContents.send('catchSerialPort', err)
//   })
// })
//
// //关闭串口
// ipcMain.on('closePort', (event, args) => {
//   // 打开串口
//   serialPort.close(err => {
//     if (err) {
//       return
//     }
//   })
// })
//
// //写入串口
// ipcMain.on('writeSerialPort', (event, args) => {
//   // const buffer = strHexBuffer(args)
//   // 打开串口
//   serialPort.write(args, err => {
//     if (err) {
//       return
//     }
//   })
// })
