declare function translit(val: string)
declare function uniqueid(len?: number)
declare function checkLinks(message: string)
declare function now(stamp?: string)
declare function getFileType(name: string)
declare function dragAndDropLoader(
  DOMElementId: any,
  CSSClassHighlight: string,
  Callback: Function
)
declare function downloadFile(
  fileUrl: string,
  targetPath: string,
  loaderDOMElement: any
)
declare function uploadingFile(received: number, total: number)
declare function upperFirst(s: string): string
declare function lowerFirst(s: string): string

export {
  translit,
  uniqueid,
  checkLinks,
  now,
  getFileType,
  dragAndDropLoader,
  downloadFile,
  uploadingFile,
  upperFirst,
  lowerFirst
}
