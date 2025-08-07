document.addEventListener('DOMContentLoaded', () => {
    let currentAudio = null; // 현재 재생 중인 오디오 객체를 저장할 변수

    // 모든 재생 버튼을 가져옵니다.
    const playButtons = document.querySelectorAll('.play-button');

    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const audioSrc = button.getAttribute('data-src');

            if (currentAudio) {
                currentAudio.pause(); // 기존 오디오 재생 중지
            }

            const newAudio = new Audio(audioSrc);
            newAudio.play();

            currentAudio = newAudio; // 현재 재생 중인 오디오 객체 업데이트

            // 버튼 텍스트 변경
            // 모든 버튼을 '재생'으로 초기화
            playButtons.forEach(btn => btn.textContent = '재생');
            button.textContent = '정지';
        });
    });
});