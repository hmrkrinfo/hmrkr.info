// js/album.js

document.addEventListener('DOMContentLoaded', () => {
    // URL에서 앨범 ID 가져오기
    const params = new URLSearchParams(window.location.search);
    const albumId = parseInt(params.get('id')); // 'id' 파라미터 값을 숫자로 변환

    let currentTrackIndex = 0;
    let albumData;

    // HTML 요소 가져오기
    const cover = document.getElementById('detail-cover');
    const title = document.getElementById('detail-title');
    const artist = document.getElementById('detail-artist');
    const releaseDate = document.getElementById('detail-release-date');
    const trackListContainer = document.getElementById('track-list');
    
    // 플레이어 요소
    const audio = new Audio(); // 오디오 객체 생성
    const playPauseBtn = document.getElementById('play-pause-btn');
    const currentTrackTitle = document.getElementById('current-track-title');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    // 데이터 로드 및 페이지 설정 함수
    async function loadAlbumDetails() {
        if (!albumId) {
            document.body.innerHTML = '<h1>잘못된 접근입니다.</h1>';
            return;
        }

        const response = await fetch('/data/albums.json');
        const albums = await response.json();
        albumData = albums.find(album => album.id === albumId);

        if (!albumData) {
            document.body.innerHTML = '<h1>앨범 정보를 찾을 수 없습니다.</h1>';
            return;
        }
        
        // 1. 앨범 기본 정보 표시
        document.title = albumData.title; // 브라우저 탭 제목 변경
        cover.src = albumData.coverImage;
        title.textContent = albumData.title;
        artist.textContent = albumData.artist;
        releaseDate.textContent = `Released: ${albumData.releaseDate}`;
        
        // 2. 트랙 리스트 표시
        albumData.tracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.classList.add('track-item');
            trackElement.innerHTML = `<span>${index + 1}. ${track.title}</span>`;
            trackElement.addEventListener('click', () => {
                playTrack(index);
            });
            trackListContainer.appendChild(trackElement);
        });

        // 3. 첫 번째 트랙으로 플레이어 설정
        loadTrack(currentTrackIndex);
    }

    // 특정 트랙을 로드하는 함수
    function loadTrack(index) {
        currentTrackIndex = index;
        audio.src = albumData.tracks[index].src;
        currentTrackTitle.textContent = albumData.tracks[index].title;
    }
    
    // 특정 트랙을 재생하는 함수
    function playTrack(index) {
        loadTrack(index);
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    // 재생/일시정지 버튼 클릭 이벤트
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // 오디오 재생 시간 업데이트 이벤트
    audio.addEventListener('timeupdate', () => {
        const { duration, currentTime } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // 시간 표시 포맷 변경
        currentTimeEl.textContent = formatTime(currentTime);
        if(duration) {
            durationEl.textContent = formatTime(duration);
        }
    });

    // 프로그레스 바 클릭 이벤트 (탐색)
    progressBar.addEventListener('click', (e) => {
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    // 시간 포맷을 0:00 형태로 변경하는 함수
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    loadAlbumDetails();
});