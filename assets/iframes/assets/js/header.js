const home = document.getElementById('home');
const blog = document.getElementById('blog');
const projects = document.getElementById('projects');
const stats = document.getElementById('stats');
const live = document.getElementById('live');
const versions = document.getElementById('versions');
const pathName = window.top.location.pathname;

if (pathName.endsWith('/')) {
    home.classList.add('active');
} else if (pathName.startsWith('/blog')) {
    blog.classList.add('active');
} else if (pathName.startsWith('/projects')) {
    projects.classList.add('active');
} else if (pathName.startsWith('/stats')) {
    stats.classList.add('active');
} else if (pathName.startsWith('/live')) {
    live.classList.add('active');
} else if (pathName.startsWith('/versions')) {
    versions.classList.add('active');
}

/*
home.addEventListener('click', function(e) {
    e.preventDefault();
    window.top.history.pushState(null, '', '/home.html');
});
*/

function loadHeaderTheme(theme) {
    if (localStorage.getItem('classicThemeEnabled') === 'false') {
        document.getElementById('realHeaderCSSClassic')?.remove();

        const link1 = document.createElement('link');
        link1.rel = 'stylesheet';
        link1.id = 'realHeaderCSS';
        link1.href = '/assets/iframes/assets/css/header.css';

        document.head.appendChild(link1);
    } else {
        document.getElementById('realHeaderCSS')?.remove();

        const link1 = document.createElement('link');
        link1.rel = 'stylesheet';
        link1.id = 'realHeaderCSSClassic';
        link1.href = '/assets/iframes/assets/css/classic/header.css';

        document.head.appendChild(link1);
    }
}

loadHeaderTheme();