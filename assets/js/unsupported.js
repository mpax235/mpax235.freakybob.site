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

const browser = document.getElementById('browser');
const browserversion = document.getElementById('browserversion');

function detectBrowser() {
    const userAgent = window.navigator.userAgent;

    const msie = userAgent.indexOf('MSIE ');
    const trident = userAgent.indexOf('Trident/');

    let safarimatch = userAgent.match(/Safari\/(\d+)\./);
    if (safarimatch) {
        const continueanyway = document.querySelector('.continue');
        continueanyway.style.display = 'flex';
        browser.textContent = 'Safari';
        browserversion.textContent = 'Safari/' + safarimatch[1] + '.0'; 
    }
    
    let chromiummatch = userAgent.match(/Chrome\/(\d+)\./);
    if (chromiummatch) {
        const continueanyway = document.querySelector('.continue');
        continueanyway.style.display = 'flex';
        browser.textContent = 'Chromium';
        browserversion.textContent = 'Chrome/' + chromiummatch[1] + '.0';
    }

    let ladybirdmatch = userAgent.match(/Ladybird\/(\d+)\./);
    if (ladybirdmatch) {
        const continueanyway = document.querySelector('.continue');
        continueanyway.style.display = 'flex';
        browser.textContent = 'Ladybird Browser';
        browserversion.textContent = 'Ladybird/' + ladybirdmatch[1] + '.0';
    }

    let edgematch = userAgent.match(/Edg\/(\d+)\./);
    if (edgematch) {
        const continueanyway = document.querySelector('.continue');
        continueanyway.style.display = 'flex';
        browser.textContent = 'Microsoft Edge';
        browserversion.textContent = 'Edg/' + edgematch[1] + '.0'; 
    }

    let tridentmatch = userAgent.match(/Trident\/(\d+)\./);
    if (msie > -1 || trident > -1) {
        browser.textContent = 'Internet Explorer';
        browserversion.textContent = 'Trident/' + tridentmatch[1] + '.0';
        return;
    }

    let firefoxmatch = userAgent.match(/Firefox\/(\d+)\./);
    if (firefoxmatch && parseInt(firefoxmatch[1]) <= 68) {
        const continueanyway = document.querySelector('.continue');
        continueanyway.style.display = 'flex';
        browser.textContent = 'Waterfox Classic / Firefox 68.0 and lower';
        browserversion.textContent = 'Firefox/' + firefoxmatch[1] + '.0';
        return;
    }

    let firefoxnewmatch = userAgent.match(/Firefox\/(\d+)\./);
    if (firefoxnewmatch) {
        const continueanyway = document.querySelector('.continue');
        continueanyway.style.display = 'flex';
        browser.textContent = 'Firefox';
        browserversion.textContent = 'Firefox/' + firefoxmatch[1] + '.0';
    }

    let nintendomatch3ds = userAgent.match(/NX\/(\d+)\./);
    if (nintendomatch3ds) {
        browser.textContent = 'New Nintendo 3DS Browser';
        browserversion.textContent = 'NX/' + nintendomatch3ds[1] + '.0';
    }
}

window.onload = detectBrowser;