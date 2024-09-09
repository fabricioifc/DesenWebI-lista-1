const BASE_URL = 'https://picsum.photos'

const form = document.querySelector('form')
form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!validateForm())
        return
    
    // get form data
    const formData = new FormData(event.target)
    const width = formData.get('largura')
    const height = formData.get('altura')
    const quantidade = formData.get('quantidade')



    const url = `${BASE_URL}/${width}/${height}.webp`

    try {
        const section = document.querySelector('section#resultado')
        section.innerHTML = '<i>Carregando...</i>'
        const imagens = []

        for (let i = 0; i < quantidade; i++) {
            const response = await fetch(url)
            const data = await response.url
            const img = document.createElement('img')
            img.src = data
            img.alt = `Imagem ${i + 1}`

            // add a link to copy the image to clipboard
            const a = document.createElement('a')
            a.href = data
            a.textContent = '📋'
            a.title = 'Copiar link'
            a.addEventListener('click', (event) => {
                event.preventDefault()
                navigator.clipboard.writeText(data)
                a.textContent = 'Copiado!'
            })

            const imageId = data.split('/')[4]
            const downloadLink = document.createElement('a')
            downloadLink.textContent = 'FULL HD'
            downloadLink.href = `${BASE_URL}/id/${imageId}/1920/1080.webp`
            downloadLink.target = '_blank'

            imagens.push({
                img,
                a,
                downloadLink
            })
        }
        section.innerHTML = ''
        imagens.forEach(({ img, a, downloadLink }) => {
            const card = document.createElement('div')
            card.className = 'card'
            const actions = document.createElement('div')
            actions.className = 'actions'
            actions.appendChild(a)
            actions.appendChild(downloadLink)
            card.appendChild(img)
            card.appendChild(actions)
            section.appendChild(card)
        })
    } catch (error) {
        console.error('Erro ao carregar a imagem:', error)
    }
})

const validateForm = () => {
    const larguraInput = document.querySelector('input[name=largura]')
    const alturaInput = document.querySelector('input[name=altura]')
    const quantidadeInput = document.querySelector('input[name=quantidade]')
    quantidadeInput.classList.remove('error')
    alturaInput.classList.remove('error')
    larguraInput.classList.remove('error')
    
    const form = document.querySelector('form')
    const formData = new FormData(form)
    const largura = formData.get('largura')
    const altura = formData.get('altura')
    const quantidade = formData.get('quantidade')

    const mensagem = document.querySelector('div#mensagem')
    mensagem.innerHTML = ''
    mensagem.classList.remove('erro')
    const erros = []

    if (!largura) {
        erros.push('Largura é obrigatória')
        larguraInput.classList.add('error')
    }

    if (!altura) {
        erros.push('Altura é obrigatória')
        alturaInput.classList.add('error')
    }

    if (!quantidade) {
        erros.push('Quantidade é obrigatória')
        quantidadeInput.classList.add('error')
    }

    if (erros.length) {
        mensagem.classList.add('erro')
        erros.forEach(erro => {
            const p = document.createElement('p')
            p.textContent = erro
            mensagem.appendChild(p)
        })
        return false
    }


    return true
}