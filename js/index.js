//setTimeout(function() {
//    window.location.href = "https://mpax235.github.io/maintenance.html";
//}, 0);

function updateCountdown() {
    const now = new Date();
    const targetDate = new Date('January 1, 2025 00:00:00');
    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
        document.getElementById('time').innerHTML = '<div id="happynewyear">HAPPY NEW YEAR!</div>';
        clearInterval(interval);
        return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000).toString().padStart(2, '0');

    document.getElementById('time').innerHTML = `
        <div>${days}:${hours}:${minutes}:${seconds}</div>
    `;
}

const interval = setInterval(updateCountdown, 1000);
updateCountdown();