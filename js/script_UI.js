const doorSelect = document.getElementById("doorSelect");
const cateSelect = document.getElementById("cateSelect");
const secSelect = document.getElementById("secSelect");
const content = document.getElementById("content");
const downloadZone = document.getElementById("downloadZone");
downloadZone.style.display = "none"
var searchType = "table";

//讀取儲存的字型選項
const savedFont = localStorage.getItem("selectedFont");
if (savedFont) {
    document.body.style.fontFamily = savedFont

    // 同步 select 顯示
    const fontSelect = document.getElementById("fontSelect");
    if (fontSelect) {
        fontSelect.value = savedFont;
    }
}

buildTable("");

//切換到總表或簡明目錄
//strategy i suppose
function buildSearchUI(search) {
    searchType = search
    doorSelect.value = "0";
    doorSelect.dispatchEvent(new Event("change"));
    searchType == "table" ? buildTable("") : buildContents("");
}
document.getElementById("tableBtn").addEventListener("click", () => { buildSearchUI("table") })
document.getElementById("contentsBtn").addEventListener("click", () => { buildSearchUI("content") })

//切換字型
fontSelect = document.getElementById("fontSelect")
fontSelect.addEventListener('change', () => {
    const selectedFont = fontSelect.value;
    document.body.style.fontFamily = selectedFont

    // 存到 localStorage
    localStorage.setItem("selectedFont", selectedFont);
    console.log(selectedFont)
});

//用id換不同的內容
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if (id) {
    content.style.display = "none"
    downloadZone.style.display = "inline-block"
    downloadZone.innerHTML = "<button onclick=\"back()\">回首頁</button>"
    for (item of pdfFileList) {
        if (item.lastIndexOf(id, 0) == 0) {
            downloadZone.innerHTML += "<p class = \"downloadLink\"><a href=\"./pdf/" + item + ".pdf\" target=\"_blank\">" + item + "</a></p>";
        }
    }

} else {
    buildSearchUI("table")
}

//回首頁
function back() {
    content.style.display = "inline-block"
    downloadZone.style.display = "none"
    window.history.replaceState({}, '', './index.html');
}