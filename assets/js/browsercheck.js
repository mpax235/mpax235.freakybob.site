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

if (!localStorage.getItem('continueAnyway')) {
    localStorage.setItem('continueAnyway', 'false');
}

function detectBrowser() {
    if (localStorage.getItem('continueAnyway') === 'true') {
        return;
    }

    const userAgent = window.navigator.userAgent;

    const msie = userAgent.indexOf('MSIE ');
    const trident = userAgent.indexOf('Trident/');

    if (msie > -1 || trident > -1) {
        window.location.replace('https://mpax235.freakybob.site/unsupported.html');
        return;
    }

    let firefoxmatch = userAgent.match(/Firefox\/(\d+)\./);
    if (firefoxmatch && parseInt(firefoxmatch[1]) <= 68) {
        window.location.replace('https://mpax235.freakybob.site/unsupported.html');
        return;
    }

    if (userAgent.includes('Nintendo 3DS') || userAgent.includes('New Nintendo 3DS') || userAgent.includes("Nintendo WiiU")) {
        window.location.replace('https://mpax235.freakybob.site/unsupported.html');
        return;
    }
}


window.onload = detectBrowser;