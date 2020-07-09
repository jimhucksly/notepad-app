import fs from "fs"
import path from 'path'

const debug = false

class Storage {
  public isPathExists(_path: string): Promise<object> {
    debug && console.log('isPathExists: call!')
    return new Promise(async (resolve, reject) => {
      debug && console.log('isPathExists: body of promise')
      fs.stat(_path, (err, stat) => {
        if(err) {
          debug && console.log('isPathExists: rejected!')
          return reject(err)
        } else {
          debug && console.log('isPathExists: resolved!')
          return resolve()
        }
      })
    })
  }

  public isFileExists(_path: string, _file?: string): Promise<object> {
    debug && console.log('call isFileExists')
    return new Promise(async (resolve, reject) => {
      let filePath = _path
      if(_file !== undefined) {
        filePath = path.resolve(_path, _file)
      }
      debug && console.log('call fs.stat')
      fs.stat(filePath, (err, stat) => {
        debug && console.log('fs.stat callback exec!!!!!')
        if(err) {
          debug && console.log('isFileExists: rejected!')
          return reject(null)
        } else {
          debug && console.log('isFileExists: resolved!')
          return resolve({})
        }
      })
    })
  }

  public append(_path: string, fileName: string, json: object): Promise<object> {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(_path, fileName)
      this.isFileExists(fullPath)
        .then(() => {
          let targetJson: any = fs.readFileSync(fullPath, 'utf8')
          try {
            targetJson = JSON.parse(targetJson)
          } catch (err) {
            targetJson = {}
          }
          const data = { ...targetJson, ...json }
          this.set(_path, fileName, data)
        })
        .catch(() => {
          this.set(_path, fileName, json)
        })
    })
  }

  public set(_path: string, fileName: string, json: object): Promise<object> {
    return new Promise(async (resolve, reject) => {
      let data
      try {
        data = json ? JSON.stringify(json) : '{}'
      } catch (err) {
        data = '{}'
      }
      const fullPath = path.resolve(_path, fileName)
      const sResponse = await this.isFileExists(fullPath)
      if(!sResponse) {
        reject(null)
      }
      try {
        fs.writeFileSync(fullPath, data)
        resolve()
      } catch(err) {
        reject(err)
      }
    })
  }

  public get(_path: string, _file: string, key?: string): Promise<object> {
    debug && console.log('call storage.get')
    return new Promise(async (resolve, reject) => {
      let fullPath = _path
      if(_file !== undefined) fullPath = path.resolve(_path, _file)
      try {
        debug && console.log('call storage.isFileExists')
        const sResponse = await this.isFileExists(fullPath)
        if(!sResponse) {
          return reject(null)
        }
        const data = fs.readFileSync(fullPath, 'utf8')
        let json
        try {
          json = JSON.parse(data)
        } catch (err) {
          json = {}
        }
        if(key && json[key] !== undefined) {
          resolve(json[key])
        } else resolve(json)
      } catch(err) {
        return reject(null)
      }
    })
  }
}

const instance = new Storage()
export default instance
