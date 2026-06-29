/* main.js */

const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");

let siteData = {};

// 網頁啟動時，先 fetch 這個 json
fetch('data.json')
    .then(response => response.json())
    .then(data => 
    {
        siteData = data;
        console.log("資料已載入:", siteData); //F12打開開發者工具可以看到這個
    })
    .catch(err => console.error("JSON 載入失敗:", err));

document.addEventListener("DOMContentLoaded", () => 
{
    const mainTabs = document.querySelectorAll(".main-tab");

    mainTabs.forEach(tab => 
    {
        tab.addEventListener("click", () => 
        {
            const group = tab.closest(".tab-group");

            document.querySelectorAll(".tab-group.open").forEach(openGroup => 
            {
                if (openGroup !== group) 
                {
                    openGroup.classList.remove("open");
                }
            });

            group.classList.toggle("open");
        });
    });
    loadHomePage(); 

    // ===== 放大圖片用的 =====
    document.addEventListener("click", (e) => 
    {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("image-modal-img");

    console.log("Click detected on:", e.target.tagName, e.target.id, e.target.closest("#leftPage"), e.target.closest("#rightPage"));

    if (e.target.tagName === "IMG" && 
        (e.target.closest("#leftPage") || e.target.closest("#rightPage"))) 
    {
        modal.classList.add("show");
        modalImg.src = e.target.src;
        console.log("Modal opened for:", e.target.src);
    }

    else if (e.target.id === "image-modal") 
        {
        console.log("Modal background clicked, closing...");
        modal.classList.remove("show");
        modalImg.src = "";
    }
    });

    //Close modal with Escape key
    document.addEventListener("keydown", (e) => 
    {
    if (e.key === "Escape") 
    {
        console.log("Escape key pressed");
        const modal = document.getElementById("image-modal");
        modal.classList.remove("show");
        document.getElementById("image-modal-img").src = "";
    }
    });

    //expand & collapse
    rightPage.addEventListener("click", (e) => 
    {

        // === 展開 ===
        const expandBtn = e.target.closest(".expand-btn");
        if (expandBtn) {
            const item = expandBtn.closest(".expand-item");
            const content = item?.querySelector(".expand-content");
            if (content) content.classList.toggle("show");
            return;
        }

        // === 縮小 ===
        const collapseBtn = e.target.closest(".collapse-btn");
        if (collapseBtn) 
        {
            const content = collapseBtn.closest(".expand-content");
            const item = content?.closest(".expand-item");
            const titleBtn = item?.querySelector(".expand-btn");

            if (content) content.classList.remove("show");

            titleBtn?.scrollIntoView
            ({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// 在 main.js 中加入這個統一的處理函式
function loadPage(pageKey, leftSelector, rightSelector, callback) {
    const pageData = siteData[pageKey];
    
    if (pageData) {
        const leftEl = document.querySelector(leftSelector);
        const rightEl = document.querySelector(rightSelector);
        
        if (leftEl && rightEl) {
            leftEl.innerHTML = pageData.left;
            rightEl.innerHTML = pageData.right;
        } else {
            console.error("找不到頁面容器，請檢查 index.html 的 ID:", leftSelector, rightSelector);
        }
    } else {
        console.error("data.json 中找不到這個頁面索引:", pageKey);
        // 如果不是 JSON 資料，嘗試當作檔案路徑載入
        fetch(pageKey)
            .then(res => res.text())
            .then(html => {
                const temp = document.createElement("div");
                temp.innerHTML = html;
                document.querySelector(leftSelector).innerHTML = temp.querySelector(`#${pageKey.split('/')[1].replace('.html', '')}-left`)?.innerHTML || "";
                document.querySelector(rightSelector).innerHTML = temp.querySelector(`#${pageKey.split('/')[1].replace('.html', '')}-right`)?.innerHTML || "";
                if (callback) callback();
            });
    }
}

function loadHomePage() 
{
    fetch("BookmarkPages/Home.html")
        .then(res => res.text())
        .then(html => 
        {
            const temp = document.createElement("div");
            temp.innerHTML = html;

            leftPage.innerHTML = temp.querySelector("#home-left").innerHTML;
            rightPage.innerHTML = temp.querySelector("#home-right").innerHTML;

        });
}

// 產生廢文區塊的函數範例 (這段可以寫在 main.js)
function renderPost(title, content) 
{
    return `
        <div class="expand-item">
            <button class="expand-btn">${title}</button>
            <div class="expand-content">
                <h6>${content}</h6>
                <button class="collapse-btn">▲ 縮小</button>
            </div>
        </div>
    `;
}

function bindZeroJudgeSelect() 
{
    bindProblemSelect
    (
        "problemSelect",
        "BookmarkPages/APCS_Journey/ZerojudgeProblems/",
        "BookmarkPages/APCS_Journey/ZerojudgeProblems/ZerojudgeDefault.html"
    );
}

function bindLeetcodeSelect() 
{
    bindProblemSelect
    (
        "problemSelect",
        "BookmarkPages/APCS_Journey/LeetcodeProblems/",
        "BookmarkPages/APCS_Journey/LeetcodeProblems/LeetcodeDefault.html"
    );
}

function bindProblemSelect(selectId, basePath, defaultPath) 
{
    const select = document.getElementById(selectId);
    if (!select) return;

    loadDefaultPage(defaultPath);

    select.addEventListener("change", () => 
        {
            const file = select.value;
            if (!file) 
            {
                loadDefaultPage(defaultPath);
                return;
            }

            fetch(basePath + file)
            .then(res => res.text())
            .then(html => 
            {
                const temp = document.createElement("div");
                temp.innerHTML = html;

                const leftTarget = leftPage.querySelector("#zj-dynamic-content");
                if (leftTarget) 
                {
                    leftTarget.innerHTML = 
                    `
                        <div class="block block-small" id="problem-desc">
                            <h3>題目敘述</h3>
                            <div class="block-content"></div>
                        </div>
                        <div class="block block-large" id="problem-solution">
                            <h3>解題思路</h3>
                            <div class="block-content"></div>
                        </div>
                    `;
                }

                rightPage.innerHTML = 
                `
                    <h3>【程式碼】</h3>
                    <div class="block-content" id="problem-code"></div>
                `;

                const desc = document.querySelector("#problem-desc .block-content");
                const sol = document.querySelector("#problem-solution .block-content");
                const code = document.querySelector("#problem-code");

                if (desc) desc.innerHTML = temp.querySelector(".problem-desc")?.innerHTML || "";
                if (sol) sol.innerHTML = temp.querySelector(".problem-solution")?.innerHTML || "";
                if (code) code.innerHTML = temp.querySelector(".problem-code")?.innerHTML || "";
            });
    });
}

function loadDefaultPage(path) 
{
    fetch(path)
        .then(res => res.text())
        .then(html => {
            const temp = document.createElement("div");
            temp.innerHTML = html;

            const descContent = temp.querySelector(".problem-desc")?.innerHTML || "";
            const solContent = temp.querySelector(".problem-solution")?.innerHTML || "";
            const codeContent = temp.querySelector(".problem-code")?.innerHTML || "";
            const leftTarget = leftPage.querySelector("#zj-dynamic-content");
            if (leftTarget) 
            {
                leftTarget.innerHTML = 
                `
                    <div class="default-text-area">
                        ${descContent}
                        ${solContent}
                    </div>
                `;
            }
            rightPage.innerHTML = codeContent;
        });
}

function loadDefaultPage(path) 
{
    fetch(path)
        .then(res => res.text())
        .then(html => 
        {
            const temp = document.createElement("div");
            temp.innerHTML = html;

            const leftTarget = document.getElementById("zj-dynamic-content");
            if (leftTarget) 
            {
                leftTarget.innerHTML = 
                `
                    <div class="default-text-area">
                        ${temp.querySelector(".problem-desc")?.innerHTML || ""}
                        ${temp.querySelector(".problem-solution")?.innerHTML || ""}
                    </div>
                `;
            }
            rightPage.innerHTML = temp.querySelector(".problem-code")?.innerHTML || "";
        });
}

