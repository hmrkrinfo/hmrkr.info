// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const albumListContainer = document.getElementById("album-list-container");

  async function fetchAndDisplayAlbums() {
    try {
      const response = await fetch("/data/albums.json");
      const albums = await response.json();

      albums.forEach((album) => {
        const albumCard = document.createElement("div");
        albumCard.classList.add("album-card");

        albumCard.innerHTML = `
                    <img src="${album.coverImage}" alt="${album.title} - ${album.artist}">
                    <div class="album-info">
                        <h3>${album.title}</h3>
                        <p>${album.artist}</p>
                    </div>
                `;

        // 앨범 ID를 카드에 저장합니다.
        albumCard.dataset.albumId = album.id;

        // ===== 여기부터 추가된 부분! =====
        // 각 앨범 카드에 클릭 이벤트를 추가합니다.
        albumCard.addEventListener("click", () => {
          // 클릭된 앨범의 ID를 가지고 album.html 페이지로 이동합니다.
          window.location.href = `/album.html?id=${album.id}`;
        });
        // ================================

        albumListContainer.appendChild(albumCard);
      });
    } catch (error) {
      console.error("앨범 데이터를 불러오는 데 실패했습니다:", error);
      albumListContainer.innerHTML = "<p>앨범 목록을 불러올 수 없습니다.</p>";
    }
  }

  fetchAndDisplayAlbums();
});
