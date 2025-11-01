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

const theResult = document.getElementById('theResult');
const errorText = document.getElementById('errortext');

document.getElementById('convertToDecimal').addEventListener('click', () => {
    const firstOctet = Number(document.getElementById('firstOctet').value);
    const secondOctet = Number(document.getElementById('secondOctet').value);
    const thirdOctet = Number(document.getElementById('thirdOctet').value);
    const fourthOctet = Number(document.getElementById('fourthOctet').value);

    if (!Number.isFinite(firstOctet) || !Number.isFinite(secondOctet) || !Number.isFinite(thirdOctet) || !Number.isFinite(fourthOctet)) {
        theResult.style.display = 'none';
        errorText.style.display = 'block';
        errorText.textContent = 'The values cannot be something else other than a number.';
        return;
    }

    if (firstOctet > 255 || secondOctet > 255 || thirdOctet > 255 || fourthOctet > 255) {
        theResult.style.display = 'none';
        errorText.style.display = 'block';
        errorText.textContent = 'The numbers cannot be bigger than 255 characters.';
        return;
    } 

    errorText.style.display = 'none';
    const result = `${(firstOctet * (256 ** 3)) + (secondOctet * (256 ** 2)) + (thirdOctet * (256 ** 1)) + (fourthOctet * (256 ** 0))}`;
    theResult.style.display = 'block';
    theResult.textContent = `Result: ${result}`;
});