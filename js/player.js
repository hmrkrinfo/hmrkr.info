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

    if (timeSeparator) {
        timeSeparator.style.display = 'none';
    }

    window.playAlbum = function(albumData) {
        currentAlbumData = albumData;
        loadAndPlayTrack(0);
    }

    function loadAndPlayTrack(trackIndex) {
        if (!currentAlbumData || !currentAlbumData.tracks[trackIndex]) return;

        if (timeSeparator) {
            timeSeparator.style.display = 'inline';
        }
        
        const track = currentAlbumData.tracks[trackIndex];
        audio.src = track.src;
        artistNameEl.textContent = currentAlbumData.artist;
        trackTitleEl.textContent = track.title;
        audio.play();
        playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`;
    }

    playPauseBtn.addEventListener("click", () => {
        if (!currentAlbumData) {
            playRandomTrack();
            return;
        }
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`;
        } else {
            audio.pause();
            playPauseBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"></path></svg>`;
        }
    });

    async function playRandomTrack() {
        try {
            const response = await fetch('/data/albums.json');
            const albums = await response.json();
            if (albums.length === 0) return;
            const randomAlbumIndex = Math.floor(Math.random() * albums.length);
            window.playAlbum(albums[randomAlbumIndex]);
        } catch (error) {
            console.error("랜덤 재생 로딩 실패:", error);
        }
    }
    
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });
    
    progressBar.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
});