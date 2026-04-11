/*
MIT License

Copyright (c) 2025 mpax235

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function loadTheme(theme) {
    if (theme === 'new') {
        const link1 = document.createElement('link');
        const link2 = document.createElement('link');
        const link3 = document.createElement('link');
        const link4 = document.createElement('link');
        const link5 = document.createElement('link');

        link1.rel = 'stylesheet';
        link2.rel = 'stylesheet';
        link3.rel = 'stylesheet';
        link4.rel = 'stylesheet';
        link5.rel = 'stylesheet';

        link1.id = 'coreCSS';
        link2.id = 'headerCSS';
        link3.id = 'footerCSS';
        link4.id = 'mainCSS';
        link5.id = 'pagesCSS';

        link1.href = '/assets/css/core.css';
        link2.href = '/assets/css/header.css';
        link3.href = '/assets/css/footer.css';
        link4.href = '/assets/css/main.css';
        link5.href = '/assets/css/pages.css';

        document.head.appendChild(link1);
        document.head.appendChild(link2);
        document.head.appendChild(link3);
        document.head.appendChild(link4);
        document.head.appendChild(link5);

        setTimeout(() => {
            document.getElementById('coreCSSClassic')?.remove();
            document.getElementById('pagesCSSClassic')?.remove();
            document.getElementById('mainCSSClassic')?.remove();
            document.getElementById('headerCSSClassic')?.remove();
            document.getElementById('footerCSSClassic')?.remove();
        }, 100);
    } else {
        const link1 = document.createElement('link');
        const link2 = document.createElement('link');
        const link3 = document.createElement('link');
        const link4 = document.createElement('link');
        const link5 = document.createElement('link');

        link1.rel = 'stylesheet';
        link2.rel = 'stylesheet';
        link3.rel = 'stylesheet';
        link4.rel = 'stylesheet';
        link5.rel = 'stylesheet';

        link1.id = 'coreCSSClassic';
        link2.id = 'headerCSSClassic';
        link3.id = 'footerCSSClassic';
        link4.id = 'mainCSSClassic';
        link5.id = 'pagesCSSClassic';

        link1.href = '/assets/css/classic/core.css';
        link2.href = '/assets/css/classic/header.css';
        link3.href = '/assets/css/classic/footer.css';
        link4.href = '/assets/css/classic/main.css';
        link5.href = '/assets/css/classic/pages.css';

        document.head.appendChild(link1);
        document.head.appendChild(link2);
        document.head.appendChild(link3);
        document.head.appendChild(link4);
        document.head.appendChild(link5);

        setTimeout(() => {
            document.getElementById('coreCSS')?.remove();
            document.getElementById('pagesCSS')?.remove();
            document.getElementById('mainCSS')?.remove();
            document.getElementById('headerCSS')?.remove();
            document.getElementById('footerCSS')?.remove();
        }, 100);
    }
}

setTimeout(() => {
    if (localStorage.getItem('classicThemeEnabled') === 'true') {
        loadTheme('classic');
    } else {
        loadTheme('new');
    }
}, 100);