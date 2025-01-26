function detectIE() {
    const userAgent = window.navigator.userAgent;

    const msie = userAgent.indexOf('MSIE ');
    const trident = userAgent.indexOf('Trident/');

    if (msie > -1 || trident > -1) {
        window.location.replace('https://mpax235.github.io/unsupported.html');
    }
}

window.onload = detectIE;