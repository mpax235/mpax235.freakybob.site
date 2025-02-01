function detectBrowser() {
    const userAgent = window.navigator.userAgent;

    const msie = userAgent.indexOf('MSIE ');
    const trident = userAgent.indexOf('Trident/');

    if (msie > -1 || trident > -1) {
        window.location.replace('https://mpax235.github.io/unsupported.html');
        return;
    }

    if (userAgent.includes('Waterfox/56.6.2022.11')) {
        window.location.replace('https://mpax235.github.io/unsupported.html');
        return;
    }

    if (userAgent.includes('Nintendo 3DS')) {
        window.location.replace('https://mpax235.github.io/unsupported.html');
        return;
    }

    if (userAgent.includes("Nintendo WiiU")) {
        window.location.replace('https://mpax235.github.io/unsupported.html');
        return;
    }
}


window.onload = detectBrowser;