import {hexToHsv} from './colors.js'

const body = document.body
body.addEventListener('dragover', (e) => {
  e.preventDefault()
  body.classList.add('file-hover')
})
body.addEventListener('drop', async (e) => {
  e.preventDefault()
  const file = e.dataTransfer.items[0].getAsFile()
  generateGrid(await file.text())
  body.classList.remove('file-hover')
})

function copy (text) {
  navigator.clipboard.writeText(text)
}

function strToDom(str) {
  return document.createRange().createContextualFragment(str).firstChild;
}

function generateGrid(code) {
  const pre = document.querySelector('#code')
  const regexp = /([#"])([0-9A-F]{6})/gi

  // On vide la grille
  const grid = document.querySelector('.grid')
  grid.innerHTML = ''

  // On extrait les couleurs
  let colors = code.match(regexp)?.map(c => c.toUpperCase().replace('"', '#'))
  if (colors === undefined) {
    alert('Impossible de trouver une couleur :(')
    return;
  }

  document.body.classList.add('file-dropped')

  colors = [...new Set(colors)].sort((a, b) => {
    return hexToHsv(a).h - hexToHsv(b).h
  })

  // On génère la grille
  const itemsPerLine = Math.ceil(Math.sqrt(colors.length))
  grid.setAttribute('style', `--line:${itemsPerLine}`)
  colors.forEach((color) => {
    const colorItem = strToDom(`<li style="background-color: ${color}; --line: ${itemsPerLine}">
<span>${color}</span>
  </li>`)
    colorItem.addEventListener('click', function () {
      copy(color.replace('#', ''))
    })
    grid.appendChild(colorItem)
  })

  // On ajoute le code dans la page
  pre.innerText = code
  const html = pre.innerHTML
  pre.innerHTML = html.replace(regexp, "$1<span style=\"color: #$2\">$2</span>")
}
