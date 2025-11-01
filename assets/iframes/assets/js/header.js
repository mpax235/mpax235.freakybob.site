const home = document.getElementById('home');
const blog = document.getElementById('blog');
const projects = document.getElementById('projects');
const stats = document.getElementById('stats');
const live = document.getElementById('live');
const versions = document.getElementById('versions');
const pathName = window.top.location.pathname;

if (pathName.startsWith('/home')) {
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