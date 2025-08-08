// js/player.js

document.addEventListener('DOMContentLoaded', () => {

    const footerPlayer = document.querySelector(".site-footer-player");
    if (!footerPlayer) return;

    const playPauseBtn = footerPlayer.querySelector("#play-pause-btn");
    const artistNameEl = footerPlayer.querySelector(".player-track-info .artist-name");
    const trackTitleEl = footerPlayer.querySelector(".player-track-info .track-title");
    const progress = footerPlayer.querySelector(".player-progress");
    const progressBar = footerPlayer.querySelector(".player-progress-bar");
    const currentTimeEl = footerPlayer.querySelector("#current-time");
    const durationEl = footerPlayer.querySelector("#duration");
    const timeSeparator = footerPlayer.querySelector("#time-separator");
    
    const audio = new Audio();
    let currentAlbumData = null;

    // ▼▼▼ 'of' 글자가 있을 때만 숨기도록 안전장치 추가! ▼▼▼
    if (timeSeparator) {
        timeSeparator.style.display = 'none';
    }

    window.playAlbum = function(albumData) {
        currentAlbumData = albumData;
        loadAndPlayTrack(0);
    }

    function loadAndPlayTrack(trackIndex) {
        if (!currentAlbumData || !currentAlbumData.tracks[trackIndex]) return;

        // ▼▼▼ 'of' 글자가 있을 때만 보여주도록 안전장치 추가! ▼▼▼
        if (timeSeparator) {
            timeSeparator.style.display = 'inline';
        }
        
        const track = currentAlbumData.tracks[trackIndex];
        audio.src = track.src;
        artistNameEl.textContent = currentAlbumData.artist;
        trackTitleEl.textContent = track.title;
        durationEl.textContent = currentAlbumData.totalDuration || "0:00:00";
        audio.play();
        playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`;
    }

    // (이하 모든 코드는 기존과 동일)
    playPauseBtn.addEventListener("click", () => { /* ... */ });
    async function playRandomTrack() { /* ... */ }

    audio.addEventListener('timeupdate', () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });
    
    progressBar.addEventListener('click', (e) => { /* ... */ });
    function formatTime(seconds) { /* ... */ }

});