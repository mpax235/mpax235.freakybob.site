setTimeout(() => {
    const homepage = document.querySelector('.homepage');
    const br = document.createElement('br');
    const huh = document.createElement('p');
    const button = document.createElement('a');
    const template = document.createElement('div');

    template.style.textAlign = 'center';
    homepage.appendChild(template);

    huh.style.textAlign = 'center';
    huh.textContent = 'If you are reading this, this is susposed to be a template for pages on this website. If you want to go home, click the button below!';
    template.appendChild(huh);

    template.appendChild(br);

    button.href = 'index.html';
    button.innerHTML = `<button>Go home</button>`;
    template.appendChild(button);
}, 10000);