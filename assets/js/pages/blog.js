/*
const pageTitle = document.getElementById('pageTitle');
const column1Project = document.querySelectorAll('.column1project');
const column2Project = document.querySelectorAll('.column2project');
const homepage = document.querySelector('.homepage');
const headerIFrame = document.getElementById('header-iframe');

let checking = true;

const interval = setInterval(() => {
    if (window.location.pathname.startsWith('/home')) {
        clearInterval(interval);

        pageTitle.style.animation = 'scrollToRight 2s ease';

        column1Project.forEach(column => {
            column.style.animation = 'scrollToLeft 2s ease';
        });

        column2Project.forEach(column => {
            column.style.animation = 'scrollToRight 2s ease';
        });

        setTimeout(() => {
            fetch('/home.html')
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const homepageDiv = doc.querySelector('.homepage');

                    if (homepageDiv) {
                        console.log('Extracted content:', homepageDiv.innerHTML);
                    }

                    headerIFrame.contentWindow.location.reload();
                    homepage.innerHTML = homepageDiv.innerHTML;
                })
                .catch(error => {
                    console.error(error);
                });
        }, 2000);
    }
}, 100);
*/