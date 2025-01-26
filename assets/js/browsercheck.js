function detectIE() {
    const userAgent = window.navigator.userAgent;

    const msie = userAgent.indexOf('MSIE ');
    const trident = userAgent.indexOf('Trident/');

    if (msie > -1 || trident > -1) {
        window.location.replace('https://mpax235.github.io/unsupported.html');
    }
}

function detectWaterfoxClassic() {
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes('Waterfox/56.6.2022.11')) { // i really want to make sure it does not conflict with the modern waterfox browser
        window.location.replace('https://mpax235.github.io/unsupported.html');
    }
}

window.onload = detectIE;
window.onload = detectWaterfoxClassic;