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

let header = document.getElementById('header-iframe');

header.addEventListener('load', function() {
    let iframeDoc = header.contentDocument || header.contentWindow.document;

    let menuButton = iframeDoc.getElementById('menubutton');

    if (menuButton) {
        menuButton.addEventListener('click', function() {
            let menu = document.getElementById('menu');

            if (menu) {
                menu.style.display = 'block';
                menu.style.opacity = '0';

                menu.offsetHeight;

                let menuContainer = document.getElementById('menucontainer');
                if (menuContainer) {
                    menuContainer.style.opacity = '0';

                    menuContainer.offsetHeight;

                    menuContainer.classList.remove('hide');
                    menuContainer.classList.add('show');
                }

                setTimeout(() => {
                    menu.style.opacity = '1';
                }, 10);
            }
        });
    }
});

function onclosebuttonpressed() {
    let menu = document.getElementById('menu');

    if (menu) {
        menu.style.display = 'block';
        menu.style.opacity = '1';

        menu.offsetHeight;

        let menuContainer = document.getElementById('menucontainer');
        if (menuContainer) {
            menuContainer.style.opacity = '1';

            menuContainer.offsetHeight;

            menuContainer.classList.remove('show');
            menuContainer.classList.add('hide');
        }

        setTimeout(() => {
            menu.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            menu.style.display = 'none';
        }, 510);
    }
}