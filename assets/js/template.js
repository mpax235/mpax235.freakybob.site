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

setTimeout(() => {
    const homepage = document.querySelector('.homepage');
    const br = document.createElement('br');
    const huh = document.createElement('p');
    const button = document.createElement('a');
    const template = document.createElement('div');

    template.style.textAlign = 'center';
    homepage.appendChild(template);

    huh.style.textAlign = 'center';
    huh.textContent = 'If you are reading this, this is susposed to be a template for pages on this website. If you want to go home, click the button below!';
    template.appendChild(huh);

    template.appendChild(br);

    button.href = 'home.html';
    button.innerHTML = `<button>Go home</button>`;
    template.appendChild(button);
}, 10000);