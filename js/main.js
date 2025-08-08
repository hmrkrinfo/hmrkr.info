// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  // 카드를 소환할 장소를 ID 대신 클래스 이름으로 찾도록 변경!
  const releaseSection = document.querySelector(".release-section");

  // 만약 소환 장소가 없다면 마법을 시전하지 않고 중단
  if (!releaseSection) {
    console.error("릴리즈 섹션을 찾을 수 없습니다.");
    return;
  }

  async function fetchAndDisplayAlbums() {
    try {
      // 1. data/albums.json에서 데이터(마법 재료)를 가져온다
      const response = await fetch("/data/albums.json");
      const albums = await response.json();

      // 2. 데이터가 없다면 마법 중단
      if (albums.length === 0) {
        releaseSection.innerHTML = "<p>표시할 앨범이 없습니다.</p>";
        return;
      }

      // 3. 앨범 데이터 개수만큼 카드를 소환하는 마법(forEach) 시전
      albums.forEach((album) => {
        const albumCard = document.createElement("article");
        albumCard.className = "release-card"; // article 태그에 release-card 클래스 부여

        // 카드 내용물을 HTML로 생성
        albumCard.innerHTML = `
    <img src="${album.coverImage}" alt="${album.title} - ${album.artist}">
    <div class="card-footer">
        <div class="card-info">
            <span class="artist-name">${album.artist}</span>
            <span class="album-name">${album.title}</span>
        </div>
        <div class="card-time">${album.totalDuration}</div>
    </div>
`;

        // 나중에 상세 페이지로 이동하기 위한 클릭 이벤트 추가
        // js/main.js 의 addEventListener 부분

        // 각 앨범 카드에 클릭 이벤트를 추가합니다.
        albumCard.addEventListener("click", () => {
          // 페이지 이동 대신, 전역 함수인 playAlbum을 호출해서 앨범 정보를 넘겨줌
          window.playAlbum(album);
        });

        // 4. 완성된 카드를 소환 장소에 실제로 배치!
        releaseSection.appendChild(albumCard);
      });
    } catch (error) {
      console.error("앨범 데이터를 불러오는 데 실패했습니다:", error);
      releaseSection.innerHTML = "<p>앨범 목록을 불러올 수 없습니다.</p>";
    }
  }

  fetchAndDisplayAlbums();
});
