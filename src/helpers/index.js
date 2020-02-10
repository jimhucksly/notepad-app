import request from 'request'
import fs from 'fs'
import path from 'path'

const REGEXP_URL = /\b(^(ftp|https?):\/\/[-\w]+(\.\w[-\w]*)+|(?:[a-z0-9](?:[-a-z0-9]*[a-z0-9])?\.)+(?: com\b|edu\b|biz\b|gov\b|in(?:t|fo)\b|mil\b|net\b|org\b|[a-z][a-z]\b))(\:\d+)?(\/[^.!,?;"'<>()\[\]{}\s\x7F-\xFF]*(?:[.!,?]+[^.!,?;"'<>()\[\]{}\s\x7F-\xFF]+)*)?/

const REGEXP_EMAIL = /.+@.+\..+/i

export const checkLinks = (message) => {
  let m = message.replace(/\n/g, '<br>').split('<br>')
  m.forEach((str, i) => {
    let p = str.split(' ')
    p.forEach((item, k) => {
      const isEmail = new RegExp(REGEXP_EMAIL).test(item)
      if(isEmail) {
        p[k] = item
        return
      }
      const isURL = new RegExp(REGEXP_URL).test(item)
      if(isURL) {
        item = '<a href="' + (item.indexOf('http') < 0 ? 'http://' : '') + item + '" target="_blank">' + item + '</a>'
        p[k] = item
      }
    })
    m[i] = p.join(' ')
  })
  return m.join('<br>')
}

export const now = (stamp) => {
  let d
  if(stamp !== undefined) {
    d = new Date(stamp.toString().replace(/(\d\d\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)/g, '$1-$2-$3 $4:$5:$6'))
  } else d = new Date()
  let y = d.getFullYear()
  let mon = d.getMonth()
  let day = d.getDate()
  let h = d.getHours()
  let mm = d.getMinutes()
  let s = d.getSeconds()

  mon = (mon + 1) < 10 ? '0' + (mon + 1) : (mon + 1)
  day = day < 10 ? '0' + day : day
  h = h < 10 ? '0' + h : h
  mm = mm < 10 ? '0' + mm : mm
  s = s < 10 ? '0' + s : s

  return {
    date: `${day}.${mon}.${y}, ${h}:${mm}`,
    stamp: `${y}${mon}${day}${h}${mm}${s}`
  }
}

export const isJSON = (str) => {
  try {
    var obj = JSON.parse(str)
    if(obj && typeof obj === 'object' && obj !== null) {
      return true
    }
  } catch (err) {}
  return false
}

export const getFileType = (name) => {
  if(/\.jpe?g$/.test(name)) return 'jpg'
  if(/\.png$/.test(name)) return 'png'
  if(/\.gif$/.test(name)) return 'image'
  if(/\.html?$/.test(name)) return 'html'
  if(/\.js$/.test(name)) return 'js'
  if(/\.json$/.test(name)) return 'json'
  if(/\.vue$/.test(name)) return 'vue'
  if(/\.css$/.test(name)) return 'css'
  if(/\.(sass|scss)$/.test(name)) return 'sass'
  if(/\.svg$/.test(name)) return 'svg'
  if(/\.docx?$/.test(name)) return 'doc'
  if(/\.pdf$/.test(name)) return 'pdf'
  if(/\.txt$/.test(name)) return 'txt'
  if(/\.zip$/.test(name)) return 'zip'
  if(/\.rar$/.test(name)) return 'rar'
  if(/\.md$/.test(name)) return 'md'

  return 'default'
}

export function dragAndDropLoader(DOMElementId, CSSClassHighlight, Callback) {
  const id = DOMElementId
  const cls = CSSClassHighlight
  const cb = Callback

  const dropArea = document.getElementById(id)

  if(dropArea) {
    if(!dropArea.style.position) {
      dropArea.style.position = 'relative'
    }
    const overlay = document.createElement('div')
    overlay.classList.add('drop-overlay')
    dropArea.appendChild(overlay)

    dropArea.ondragenter = function(e) {
      e.preventDefault()
      e.stopPropagation()
      if(!dropArea.classList.contains(cls)) {
        dropArea.classList.add(cls)
        overlay.style.display = 'block'
        overlay.style.position = 'absolute'
        overlay.style.left = 0
        overlay.style.right = 0
        overlay.style.width = '100%'
        overlay.style.height = '100%'
        overlay.style.background = 'rgba(0,0,0,0.2)'
        overlay.style.border = '2px dashed #fff'
      }
    }

    dropArea.ondragover = function(e) {
      e.preventDefault()
      e.stopPropagation()
      if(!dropArea.classList.contains(cls)) {
        dropArea.classList.add(cls)
        overlay.style.display = 'block'
      }
      dropArea.ondragleave = function(e) {
        e.preventDefault()
        e.stopPropagation()
        if(dropArea.classList.contains(cls)) {
          dropArea.classList.remove(cls)
          overlay.style.display = 'none'
          dropArea.ondragleave = null
        }
      }
    }

    dropArea.ondrop = function(e) {
      e.preventDefault()
      e.stopPropagation()
      cb(e)
      if(dropArea.classList.contains(cls)) {
        dropArea.classList.remove(cls)
        overlay.style.display = 'none'
      }
    }
  }
}

export const downloadFile = (fileUrl, targetPath, loaderDOMElement) => {
  let receivedBytes = 0
  let totalBytes = 0

  const req = request({
    method: 'GET',
    uri: fileUrl
  })

  const baseFileName = path.parse(targetPath).base
  const baseFileDir = path.parse(targetPath).dir

  const canSave = (targetPath) => {
    return new Promise((resolve, reject) => {
      fs.access(targetPath, (err) => {
        if(err) return resolve()
        else return reject(new Error('file exists'))
      })
    })
  }

  const checkTargetPath = (target) => {
    canSave(target)
      .then(() => {
        req.on('response', (data) => {
          if(data.statusCode === 200 || data.statusCode === 201) {
            totalBytes = parseInt(data.headers['content-length'])
            let out = fs.createWriteStream(target)
            req.pipe(out)
          } else {
            showError(loaderDOMElement)
            return null
          }
        })
        req.on('data', (chunk) => {
          if(totalBytes > 0) {
            receivedBytes += chunk.length
            showProgress(receivedBytes, totalBytes, loaderDOMElement)
          }
        })
        req.on('end', () => {

        })
      })
      .catch(() => {
        const filename = baseFileName.replace(/\./g, `(${++index}).`)
        const final = path.resolve(baseFileDir, filename)
        checkTargetPath(final)
      })
  }

  let index = 0

  checkTargetPath(targetPath)
}

const showError = (loaderDOMElement) => {
  loaderDOMElement.style.display = 'block'
  loaderDOMElement.firstElementChild.classList.add('error')
  loaderDOMElement.firstElementChild.textContent = 'Error: file not found'
  setTimeout(() => {
    loaderDOMElement.style.display = 'none'
    loaderDOMElement.firstElementChild.classList.remove('error')
    loaderDOMElement.firstElementChild.textContent = ''
  }, 5000)
}

const showProgress = (received, total, loaderDOMElement) => {
  let percentage = Math.ceil((received * 100) / total)
  loaderDOMElement.style.display = 'block'
  loaderDOMElement.style.width = `${percentage}px`
  loaderDOMElement.firstElementChild.textContent = `${percentage}%`
  if(percentage === 100) {
    setTimeout(() => {
      loaderDOMElement.style.display = 'none'
      loaderDOMElement.style.width = 0
      loaderDOMElement.firstElementChild.textContent = ''
    }, 3000)
  }
}

export const uploadingFile = (received, total) => {
  let percentage = Math.ceil((received * 100) / total)
  const cont = document.querySelector('.popup-uploading')
  if(cont) {
    const progress = cont.querySelector('.uploading-progress')
    if(progress) {
      const text = progress.firstElementChild
      progress.style.width = `${percentage}px`
      text && (text.textContent = `${percentage}%`)
    }
  }
}

export const translit = (val) => {
  const space = '_'
  /* eslint-disable object-property-newline */
  const transl = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh',
    'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'ju',
    'я': 'ja', ' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
    '#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
    '(': space, ')': space, '-': space, '\=': space, '+': space, '[': space,
    ']': space, '\\': space, '|': space, '/': space, '.': space, ',': space,
    '{': space, '}': space, '\'': space, '"': space, '': space, ':': space,
    '?': space, '<': space, '>': space, '№': space
  }
  /* eslint-enable object-property-newline */
  let result = ''
  let curentSim = ''
  const text = val.toLowerCase()

  text.split('').forEach((s, i) => {
    if(transl[text[i]] !== undefined) {
      if(curentSim !== transl[text[i]] || curentSim !== space) {
        result += transl[text[i]]
        curentSim = transl[text[i]]
      }
    } else {
      result += text[i]
      curentSim = text[i]
    }
  })

  return result.trim()
}

export const uniqueid = (len) => {
  if(len === undefined) len = 16
  let idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65))
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    const ascicode = Math.floor((Math.random() * 42) + 80)
    if(ascicode < 58 || (ascicode > 64 && ascicode < 91) || ascicode > 96) {
      // exclude all chars between : (58) and @ (64)
      idstr += String.fromCharCode(ascicode)
    }
  } while(idstr.length < len)
  return (idstr)
}
