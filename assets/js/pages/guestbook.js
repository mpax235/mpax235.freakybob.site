/*
MIT License

Copyright (c) 2026 mpax235

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

const scriptUrl = 'https://script.google.com/macros/s/AKfycbwm-7OpxR4r_iVp7XoWrHcCGUJZnB1SzPEqNhSoWBylEtd8PP87dd3mbaspLi4kWWO5/exec';
const thePosts = document.querySelector('.posts');

fetch(scriptUrl)
    .then(response => {
        if (!response.ok) {
            alert("Guestbook failed to load, please try again later.");
            throw new Error(`HTTP Error ${response.status}`);
        }

        return response.json();
    })
    .then(data => {
        Object.keys(data)
            .sort((a, b) => b - a)
            .forEach(key => {
                const post = data[key];
                loadGuestbookPosts(post.date, post.name, post.message, post.site, post.reply);
            });
    })
    .catch(error => {
        console.error('Guestbook error:', error);
        
        alert('Guestbook error, please try again later.');
    });

function formatDate(isoString) {
    const date = new Date(isoString);

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function loadGuestbookPosts(date, name, message, site, reply) {
    const postContainer = document.createElement('div');
    const guestBookUsername = document.createElement('span');
    const guestBookDate = document.createElement('span');
    const guestBookSite = document.createElement('span');
    const guestBookMessage = document.createElement('span');
    const replyContainer = document.createElement('div');
    const replyUsername = document.createElement('span');
    const replyMessage = document.createElement('span');

    postContainer.className = 'post';
    guestBookUsername.id = 'guestbookUsername';
    guestBookDate.id = 'lastUpdated';
    guestBookSite.id = 'lastUpdated';
    guestBookMessage.id = 'guestbookMessage';
    
    replyContainer.className = 'reply';
    replyUsername.id = 'guestbookUsername';
    replyMessage.id = 'guestbookMessage';

    guestBookUsername.textContent = name;
    guestBookDate.textContent = formatDate(date);
    guestBookMessage.textContent = message;
    guestBookSite.textContent = site;

    replyUsername.textContent = 'mpax235';
    replyMessage.textContent = reply;

    postContainer.appendChild(guestBookUsername);
    postContainer.appendChild(document.createElement('br'));

    postContainer.appendChild(guestBookDate);
    postContainer.appendChild(document.createElement('br'));

    postContainer.appendChild(guestBookSite);
    postContainer.appendChild(document.createElement('hr'));

    postContainer.appendChild(guestBookMessage);
    postContainer.appendChild(document.createElement('br'));

    if (!reply || reply.trim() === '') {
        // do nothing
    } else {
        postContainer.appendChild(document.createElement('br'));
        postContainer.appendChild(replyContainer);

        replyContainer.appendChild(replyUsername);
        replyContainer.appendChild(document.createElement('hr'));

        replyContainer.appendChild(replyMessage);
    }

    thePosts.appendChild(postContainer);
}

document.getElementById('guestbookForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        name: document.getElementById('name').value,
        message: document.getElementById('message').value,
        site: document.getElementById('site').value
    };

    await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    alert('Guestbook signed.');
    e.target.reset();
    document.location.reload();
});