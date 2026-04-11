/*
const blackScreen = document.querySelector('.blackscreen');

setTimeout(() => {
    blackScreen.style.display = 'none';
}, 2000);
*/

const enableClassicThemeButton = document.getElementById('enableClassicThemeButton');

if (!localStorage.getItem('classicThemeEnabled')) {
    localStorage.setItem('classicThemeEnabled', 'false');
}

if (localStorage.getItem('classicThemeEnabled') === 'false') {
    enableClassicThemeButton.textContent = 'Enable Classic Theme';
} else {
    enableClassicThemeButton.textContent = 'Disable Classic Theme';
}

enableClassicThemeButton.addEventListener('click', () => {
    if (localStorage.getItem('classicThemeEnabled') === 'false') {
        localStorage.setItem('classicThemeEnabled', 'true');
        document.location.reload();
    } else {
        localStorage.setItem('classicThemeEnabled', 'false');
        document.location.reload();
    }
});