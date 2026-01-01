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

//setTimeout(function() {
//    window.location.href = "https://mpax235.freakybob.site/maintenance.html";
//}, 0);

const season = 'winter';

function updateCountdown() {
    const now = new Date();
    const targetDate = new Date('January 1 2026 00:00:00');
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
        document.getElementById('time').innerHTML = '<div id="happynewyear">HAPPY NEW YEAR!</div>';
        document.getElementById('time').style.textShadow = 'none';
        clearInterval(interval);
        return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000).toString().padStart(2, '0');

    document.getElementById('time').innerHTML = `
        <div>${days}d ${hours}h ${minutes}m ${seconds}s</div>
    `;

    if (timeDifference <= 59000 && !(timeDifference <= 0)) {
        document.getElementById('time').style.textShadow = '0 0 20px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.4)';
    }
}

const interval = setInterval(updateCountdown, 100);
updateCountdown();

let version = '6.2.0';
document.getElementById('versioncounter').innerHTML = version;

function loadSeasonsTheme() {
    if (season === 'winter') {
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = '/assets/css/seasons/winter.css';
        
        document.head.appendChild(style);
    }
}

// loadSeasonsTheme(); // sorry i didn't finish it in time :( - mpax235