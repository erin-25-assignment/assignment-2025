const github = new GitHub();

// HTML 요소를 JS 변수로 저장
const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profileDiv = document.getElementById("profile");
const userListDiv = document.getElementById("userList");
const contribDiv = document.getElementById("contributions");
const spinner = document.getElementById("spinner");
const themeToggle = document.getElementById("themeToggle");

let hoverTimer = null;       // 마우스 1초 딜레이 타이머
let lastHoveredUser = null;  // 마지막으로 hover한 사용자 이름

// 검색 버튼 클릭 이벤트
searchBtn.addEventListener("click", async () => {
  const input = usernameInput.value.trim();

  if (!input) {
    alert("사용자 이름을 입력해주세요!");
    return;
  }

  // 로딩 시작
  spinner.classList.remove("hidden");
  spinner.classList.add("show");

  // 기존 결과 지우기
  profileDiv.innerHTML = "";
  userListDiv.innerHTML = "";
  contribDiv.innerHTML = "";

  try {
    // 유사 사용자 검색 (GitHub Search API 사용)
    const response = await fetch(`https://api.github.com/search/users?q=${input}`);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      profileDiv.innerHTML = "❌ 유사한 사용자를 찾을 수 없어요.";
      return;
    }

    // 최대 10명까지 출력
    const topUsers = data.items.slice(0, 10);

    // 리스트 렌더링 (간단한 이름+사진)
    userListDiv.innerHTML = topUsers.map(user => `
      <div class="user-item" data-username="${user.login}">
        <img src="${user.avatar_url}" alt="${user.login}" width="40" height="40" />
        <span>${user.login}</span>
      </div>
    `).join("");

    // 기본 상태는 상세 프로필 없이 깔끔한 리스트만
    profileDiv.innerHTML = "<p>사용자 리스트에서 프로필을 확인하려면 마우스를 올려보세요.</p>";
    contribDiv.innerHTML = "";

    // 이벤트 세팅 (마우스 이동 감지 포함)
    setupHoverEvents(topUsers);
  } catch (e) {
    profileDiv.innerHTML = "❌ 오류가 발생했습니다.";
    contribDiv.innerHTML = "";
  } finally {
    spinner.classList.remove("show");
    setTimeout(() => spinner.classList.add("hidden"), 300);
  }
});

usernameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

function setupHoverEvents(users) {
  // 모든 user-item 요소 선택
  const items = userListDiv.querySelectorAll(".user-item");

  // 마우스가 리스트 영역과 상세영역 밖으로 나갔을 때 처리
  function resetToDefault() {
    lastHoveredUser = null;
    profileDiv.innerHTML = "<p>사용자 리스트에서 프로필을 확인하려면 마우스를 올려보세요.</p>";
    contribDiv.innerHTML = "";
  }

  // 리스트, 상세 프로필 영역 hover 여부 체크
  let insideHoverArea = false;

  // 마우스가 리스트 또는 상세 영역 안에 있으면 true
  function setHoverAreaStatus(state) {
    insideHoverArea = state;
    if (!state) {
      // 300ms 후에 다시 기본 리스트 상태로 복귀
      setTimeout(() => {
        if (!insideHoverArea) resetToDefault();
      }, 300);
    }
  }

  // 리스트 영역에 마우스 enter/leave 감지
  userListDiv.addEventListener("mouseenter", () => setHoverAreaStatus(true));
  userListDiv.addEventListener("mouseleave", () => setHoverAreaStatus(false));

  // 상세 프로필 영역에도 마우스 enter/leave 감지
  profileDiv.addEventListener("mouseenter", () => setHoverAreaStatus(true));
  profileDiv.addEventListener("mouseleave", () => setHoverAreaStatus(false));

  contribDiv.addEventListener("mouseenter", () => setHoverAreaStatus(true));
  contribDiv.addEventListener("mouseleave", () => setHoverAreaStatus(false));

  items.forEach(item => {
    item.addEventListener("mouseenter", () => {
      setHoverAreaStatus(true);

      // 1초 딜레이로 상세 프로필 보여주기
      hoverTimer = setTimeout(async () => {
        const username = item.getAttribute("data-username");
        if (username === lastHoveredUser) return; // 중복 호출 방지

        lastHoveredUser = username;

 try {
    // 프로필 데이터
    const resProfile = await fetch(`https://api.github.com/users/${username}`);
    const profile = await resProfile.json();

    // 최신 5개 레포 데이터
    const resRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    const repos = await resRepos.json();

    profileDiv.innerHTML = `
      <div class="fade-in-up detailed-profile">
        <img src="${profile.avatar_url}" width="100" alt="${profile.login}" />
        <h2>${profile.name || profile.login}</h2>
        <div class="stats-boxes">
          <div class="stat-card followers">팔로워<br><span>${profile.followers}</span></div>
          <div class="stat-card following">팔로잉<br><span>${profile.following}</span></div>
          <div class="stat-card repos">레포<br><span>${profile.public_repos}</span></div>
          <div class="stat-card gists">Gists<br><span>${profile.public_gists}</span></div>
        </div>
        <p>${profile.bio || ""}</p>
        <a href="${profile.html_url}" target="_blank">깃허브 보기</a>
      </div>
    `;


          contribDiv.innerHTML = `
            <div class="fade-in-up">
              <h3>${username}의 최근 활동 (잔디밭)</h3>
              <img src="https://ghchart.rshah.org/${username}" alt="GitHub Contributions" style="width:100%; max-height: 200px;" />
                 <h4>최신 레포지토리</h4>
              <ul class="repo-list">
                ${repos.map(repo => `
                  <li>
                    <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                    <div class="repo-stats">
                      <span>★ ${repo.stargazers_count}</span>
                      <span>👁 ${repo.watchers_count}</span>
                      <span>🍴 ${repo.forks_count}</span>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          `;
        } catch {
          profileDiv.innerHTML = "❌ 상세 프로필을 불러오지 못했습니다.";
          contribDiv.innerHTML = "";
        }
      }, 300); // 0.3초 지연
    });

    item.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimer);
    });
  });
}

// 다크모드 토글 및 저장

function applyThemeFromStorageOrSystem() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "라이트모드";
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark");
    themeToggle.textContent = "다크모드";
  } else {
    // 브라우저 기본 설정 감지
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.body.classList.add("dark");
      themeToggle.textContent = "라이트모드";
    }
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "라이트모드" : "다크모드";
});

// 초기 테마 설정 실행
applyThemeFromStorageOrSystem();