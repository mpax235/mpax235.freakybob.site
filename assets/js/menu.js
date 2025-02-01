document.addEventListener('DOMContentLoaded', function() {
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