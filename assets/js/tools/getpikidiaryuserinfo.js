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

const usernameInput = document.getElementById('usernameInput');
const workerUrl = 'https://allowcors.nomaakip.workers.dev/?url=';

document.getElementById('getInfo').addEventListener('click', () => {
    const loadingThingy = document.getElementById('loadingThingy');
    const introduction = document.getElementById('introduction');
    const warning = document.querySelector('.warning');
    const url = `https://pikidiary-api.vercel.app/?username=${usernameInput.value}`;
    const preAPI = document.querySelector('.preapi');
    const apiResult = document.querySelector('.apiResult');
    const pikidiaryerror = document.querySelector('.usernotfoundpikidiary');
    const bioElement = document.querySelector('.bio');
    pikidiaryerror.style.display = 'none';

    warning.style.display = 'none';
    bioElement.innerHTML = '';
    apiResult.style.display = 'none';
    preAPI.style.display = 'block';
    loadingThingy.textContent = 'Loading...';
    introduction.style.display = 'none';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                console.error('PikiAPI Error:', response.status);
                pikidiaryerror.style.display = 'block';
                apiResult.style.display = 'none';
                preAPI.style.display = 'none';
                pikidiaryerror.innerHTML = `There was an error. Either Vercel or PikiAPI is down, you dont have a internet connection, or the user does not exist. Please try again later.<br><a id="errorred" style="font-size: 18px">${response.status}</a><br><br>`;

                throw new Error(`HTTP Error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            pikidiaryerror.style.display = 'none';
            preAPI.style.display = 'none';
            apiResult.style.display = 'block';

            if (data.loginStreak >= 35039 || data.username === "@squirrel on the diary" || data.pfp === "https://images2.minutemediacdn.com/image/upload/c_fill,w_1200,ar_1:1,f_auto,q_auto,g_auto/shape/cover/sport/clown-4-104309a9de96b5c3b380947359b31f69.jpg") {
                // refuse to load and give out a error instead
                pikidiaryerror.style.display = 'block';
                apiResult.style.display = 'none';
                preAPI.style.display = 'none';
                pikidiaryerror.innerHTML = 'PikiAPI is down currently. Please wait till it is fixed, and then try again.<br>Meanwhile, check out the PikiDiary BetaBan3 update.<br><br>';

                return;
            }
            
            apiResultFunction(data.username, data.followers, data.following, data.pfp, data.banner, data.isVerified, data.isAdmin, data.isDonator, data.isInactive, data.bio, data.loginStreak, data.achievements, data.posts);
        })
        .catch(error => {
            console.error('PikiAPI Error:', error);
            pikidiaryerror.style.display = 'block';
            apiResult.style.display = 'none';
            pikidiaryerror.innerHTML = `There was an error. Either Vercel or PikiAPI is down, you dont have a internet connection, or the user does not exist. Please try again later.<br><a id="errorred" style="font-size: 18px">${error}</a><br><br>`;
        });
});

function apiResultFunction(username, followers, following, pfp, banner, isVerified, isAdmin, isDonator, isInactive, bio, loginStreak, achievements, posts) {
    const rightTop = document.querySelector('.righttop');
    const badges = rightTop.querySelectorAll('.badge');
    const usernameElement = document.getElementById('username');
    const followersElement = document.getElementById('followers');
    const followingElement = document.getElementById('following');
    const pfpElement = document.getElementById('pfp');
    const bannerElement = document.getElementById('banner');
    const bioElement = document.querySelector('.bio');
    const loginStreakElement = document.getElementById('loginStreakTitle');
    const achievementsElement = document.querySelector('.achievements');
    const achievementsDiary = achievementsElement.querySelectorAll('.achievement');
    const postsElement = document.querySelector('.posts');
    const postsDiary = postsElement.querySelectorAll('.post');

    if (badges) {
        badges.forEach(badge => badge.remove());
    } else {
        console.log('No badges found');
    }

    if (achievementsDiary) {
        achievementsDiary.forEach(achievementDiary => achievementDiary.remove());
    } else {
        console.log('No achievements found');
    }

    if (postsDiary) {
        postsDiary.forEach(postDiary => postDiary.remove());
    } else {
        console.log('No posts found');
    }
    
    usernameElement.textContent = username;
    followersElement.textContent = followers;
    followingElement.textContent = following;
    pfpElement.src = workerUrl + pfp;

    if (isInactive === true) {
        pfpElement.style.filter = 'grayscale(100%)';
    } else {
        pfpElement.style.filter = 'none';
    }

    bioElement.innerHTML = bio;
    if (loginStreak === null) {
        loginStreakElement.textContent = '0';
    } else {
        loginStreakElement.textContent = loginStreak;
    }
    
    if (banner === null) {
        bannerElement.src = '../assets/images/tools/getpikiuserinfo/bannerplaceholder.png';
    } else {
        bannerElement.src = workerUrl + banner;
    }

    if (isAdmin === true) {
        const badge = document.createElement('img');
        badge.className = 'badge';
        badge.src = workerUrl + 'https://pikidiary.lol/img/icons/admin.png';
        rightTop.appendChild(badge);
    }

    if (isVerified === true) {
        const badge = document.createElement('img');
        badge.className = 'badge';
        badge.src = workerUrl + 'https://pikidiary.lol/img/icons/verified.png';
        rightTop.appendChild(badge);
    }

    /* get isDonator variable */
    if (isDonator === true) {
        const badge = document.createElement('img');
        badge.className = 'badge';
        badge.src = workerUrl + 'https://pikidiary.lol/img/icons/donator.png';
        rightTop.appendChild(badge);
    }

    /* get achievements from the api */
    if (achievements) {
        achievements.forEach((achievement, index) => {
            const achievementElement = document.createElement('div');
            const achievementleft = document.createElement('div');
            const achievementright = document.createElement('div');

            achievementElement.className = 'achievement';
            achievementleft.className = 'achievementleft';
            achievementright.className = 'achievementright';

            const iconUrl = document.createElement('img');
            iconUrl.id = 'iconUrl';
            iconUrl.src = workerUrl + `${achievement.iconUrl}`;
            achievementleft.appendChild(iconUrl);

            const name = document.createElement('a');
            const description = document.createElement('a');

            name.id = 'name';
            description.id = 'description';

            name.textContent = `${achievement.name}`;
            description.textContent = `${achievement.description}`;

            achievementright.appendChild(name);
            achievementright.appendChild(description);

            achievementElement.appendChild(achievementleft);
            achievementElement.appendChild(achievementright);

            achievementsElement.appendChild(achievementElement);
        });
    }

    if (posts) {
        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            const postTop2 = document.createElement('div');
            const postTop = document.createElement('div');
            const postContent = document.createElement('div');
            const attachmentContent = document.createElement('div');

            postElement.className = 'post';
            postTop2.className = 'posttop2';
            postTop.className = 'posttop';
            postContent.className = 'postcontent';
            attachmentContent.id = 'attachmentContent';

            const pfpElement = document.createElement('img');
            pfpElement.id = 'pfp';
            pfpElement.src = workerUrl + pfp;

            const authorElement = document.createElement('a');
            authorElement.id = 'author';
            authorElement.textContent = `${post.author}`;

            const contentElement = document.createElement('a');
            contentElement.id = 'content';
            contentElement.textContent = `${post.content}`;

            const timestampElement = document.createElement('a');
            timestampElement.id = 'timestamp';
            timestampElement.textContent = `${post.timestamp}`;

            const barrierOne = document.createElement('a');
            barrierOne.textContent = ' | ';

            const likesElement = document.createElement('a');
            likesElement.id = 'likes';
            likesElement.textContent = `${post.likes}`;

            const textOne = document.createElement('a');
            textOne.textContent = ' likes';

            const barrierTwo = document.createElement('a');
            barrierTwo.textContent = ' | ';

            const commentsElement = document.createElement('a');
            commentsElement.id = 'comments';
            commentsElement.textContent = `${post.comments}`;
            
            const textTwo = document.createElement('a');
            textTwo.textContent = ' comments';

            const breaklineOne = document.createElement('br');

            postElement.appendChild(postTop2);
            postTop2.appendChild(pfpElement);
            postTop2.appendChild(postTop);
            postTop.appendChild(authorElement);

            postTop.appendChild(postContent);
            postContent.appendChild(contentElement);
            postElement.appendChild(breaklineOne);
            postElement.appendChild(timestampElement);
            postElement.appendChild(barrierOne);
            postElement.appendChild(likesElement);
            postElement.appendChild(textOne);
            postElement.appendChild(barrierTwo);
            postElement.appendChild(commentsElement);
            postElement.appendChild(textTwo);

            if (post.comments === undefined) {
                commentsElement.textContent = '';
                textTwo.textContent = '';
                barrierTwo.textContent = '';
            }

            /* Cmon github pages please push this fixed code or im gonna move on */
            if (post.media && post.media.length > 0) {
                post.media.forEach((imageObj) => {
                    if (imageObj.url && imageObj.type === "image") {
                        const image = document.createElement('img');
                        image.src = imageObj.url;
                        attachmentContent.appendChild(image);
                        attachmentContent.style.margin = '10px 0 0 0';
                    }
                });
            }
            postContent.appendChild(attachmentContent);
            postsElement.appendChild(postElement);
        });
    }
}