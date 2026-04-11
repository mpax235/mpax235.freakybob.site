const yearText = document.getElementById('year');
const date = new Date();

yearText.textContent = `2024-${date.getFullYear()} mpax235`;

function loadFooterTheme() {
    if (localStorage.getItem('classicThemeEnabled') === 'false') {
        document.getElementById('realFooterCSSClassic')?.remove();

        const link1 = document.createElement('link');
        link1.rel = 'stylesheet';
        link1.id = 'realFooterCSS';
        link1.href = '/assets/iframes/assets/css/footer.css';

        document.head.appendChild(link1);
    } else {
        document.getElementById('realFooterCSS')?.remove();

        const link1 = document.createElement('link');
        link1.rel = 'stylesheet';
        link1.id = 'realFooterCSSClassic';
        link1.href = '/assets/iframes/assets/css/classic/footer.css';

        document.head.appendChild(link1);
    }
}

loadFooterTheme();