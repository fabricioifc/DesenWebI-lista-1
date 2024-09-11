const form = document.querySelector('form');
const BASE_URL = 'https://picsum.photos';

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData(event.target);
    const width = formData.get('largura');
    const height = formData.get('altura');
    const quantidade = formData.get('quantidade');

    const url = `${BASE_URL}/${width}/${height}.webp`;

    try {
        const section = document.querySelector('section#resultado');
        section.innerHTML = '<p>Carregando...</p>';
        const imagens = [];

        for (let i = 0; i < quantidade; i++) {
            const response = await fetch(url);
            const data = await response.url;
            const imageId = data.split('/')[4];

            imagens.push({
                src: data,
                alt: `Imagem ${i + 1}`,
                id: imageId
            });
        }

        renderImages(imagens, section);
    } catch (error) {
        console.error('Erro ao carregar as imagens:', error);
        showMessage('Ocorreu um erro ao carregar as imagens. Por favor, tente novamente.', true);
    }
});

function renderImages(imagens, container) {
    container.innerHTML = '';
    imagens.forEach(({ src, alt, id }) => {
        const card = createImageCard(src, alt, id);
        container.appendChild(card);
    });
}

function createImageCard(src, alt, id) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const copyLink = createActionLink('\u{1F4CB}', 'Copiar link', () => {
        navigator.clipboard.writeText(src);
        copyLink.textContent = 'Copiado!';
        setTimeout(() => copyLink.textContent = '\u{1F4CB}', 2000);
    });

    const downloadLink = createActionLink('FULL HD', 'Download FULL HD', `${BASE_URL}/id/${id}/1920/1080.webp`);

    actions.appendChild(copyLink);
    actions.appendChild(downloadLink);

    card.appendChild(img);
    card.appendChild(actions);

    return card;
}

function createActionLink(text, title, hrefOrCallback) {
    const a = document.createElement('a');
    a.textContent = text;
    a.title = title;

    if (typeof hrefOrCallback === 'string') {
        a.href = hrefOrCallback;
        a.target = '_blank';
    } else {
        a.href = '#';
        a.addEventListener('click', (e) => {
            e.preventDefault();
            hrefOrCallback();
        });
    }

    return a;
}

function validateForm() {
    const inputs = ['largura', 'altura'];
    const errors = [];

    inputs.forEach(input => {
        const element = document.querySelector(`input[name=${input}]`);
        const value = element.value.trim();
        element.classList.remove('error');

        if (!value) {
            errors.push(`${input.charAt(0).toUpperCase() + input.slice(1)} é obrigatório`);
            element.classList.add('error');
        }
    });

    if (errors.length) {
        showMessage(errors.join('<br>'), true);
        return false;
    }

    return true;
}

function showMessage(message, isError = false) {
    const mensagem = document.querySelector('div#mensagem');
    mensagem.innerHTML = message;
    mensagem.className = isError ? 'erro' : '';
}