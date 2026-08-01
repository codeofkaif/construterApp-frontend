export function downloadFileUrl(fileUrl: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = fileUrl
  anchor.download = fileName
  anchor.target = '_blank'
  anchor.rel = 'noopener noreferrer'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
