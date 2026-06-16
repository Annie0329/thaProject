const doorSelect = document.getElementById("doorSelect");
const cateSelect = document.getElementById("cateSelect");
const secSelect = document.getElementById("secSelect");
const content = document.getElementById("content");
const downloadZone = document.getElementById("downloadZone");
doorSelect.style.display = "none"
cateSelect.style.display = "none"
secSelect.style.display = "none"
downloadZone.style.display = "none"
buildHtmlTable();
//切換到總表
document.getElementById("tableBtn").addEventListener("click", function () {
    doorSelect.style.display = "none"
    cateSelect.style.display = "none"
    secSelect.style.display = "none"
    buildHtmlTable();
})
//切換到簡明目錄
document.getElementById("contentsBtn").addEventListener("click", function () {
    doorSelect.style.display = "inline-block"
    cateSelect.style.display = "inline-block"
    secSelect.style.display = "inline-block"
    //自動選第一個選項
    doorSelect.value = "1";
    doorSelect.dispatchEvent(new Event("change"));
})

//切換字型
fontSelect = document.getElementById("fontSelect")
fontSelect.addEventListener('change', () => {
    console.log(fontSelect.value)
    document.body.style.fontFamily = fontSelect.value + ',\'tanHsinFont_FD\''
});

//用id換不同的內容
const links = document.querySelectorAll(".contentLink");
links.forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        content.style.display = "none"
        downloadZone.style.display = "inline-block"
        downloadZone.innerHTML = "<button onclick=\"back()\">回首頁</button>"
        for (item of fileName) {
            if (item.lastIndexOf(this.id, 0) == 0) {
                downloadZone.innerHTML += "<p class = \"downloadLink\"><a href=\"./pdf/" + item + ".pdf\" download= \"" + item + ".pdf\"" + ">" + item + "</a></p>";
            }
        }
    });
});

function back() {
    content.style.display = "inline-block"
    downloadZone.style.display = "none"
}
//增加標題和資訊
function buildCase(element, value) {
    var caseTitle = document.createElement("p");
    caseTitle.setAttribute("class", "caseTitle");
    caseTitle.textContent = value.slice(0, value.indexOf("\n"))
    element.appendChild(caseTitle)

    var caseInfo = document.createElement("p");
    caseInfo.setAttribute("class", "caseInfo");
    caseInfo.textContent = value.slice(value.indexOf("\n") + 1)
    element.appendChild(caseInfo)
}

//建立總目錄
function buildHtmlTable() {
    var table = document.querySelector("#excelDataTable");
    table.innerHTML = "";
    for (var i = 0; i < myList.length; i++) {
        var group = myList[i];
        var rowspan = group.items.length;

        for (var j = 0; j < group.items.length; j++) {
            var row = document.createElement("tr");

            if (j === 0) {
                var th = document.createElement("th");
                var value = group.title
                th.setAttribute("rowspan", rowspan);
                buildCase(th, value);
                row.appendChild(th);
            }

            // sub title
            var subTh = document.createElement("th");
            var value = group.items[j].name;
            buildCase(subTh, value);
            row.appendChild(subTh);

            // objects
            var objs = group.items[j].objs || [];

            for (let i = 0; i < 9; i++) {
                var value = objs[i] || "";
                var fileNum = value ? value.slice(value.indexOf("(") + 1, value.indexOf(")")) : "";
                var idNumber = value ? value.slice(-8, -5) : "";
                var td = document.createElement("td");

                if (value) {
                    let link;
                    // 如果沒有案件可以下載就不要做連結
                    if (fileNum == "0") {
                        link = document.createElement("p");
                    } else {
                        link = document.createElement("a");
                        link.setAttribute("href", "");
                    }

                    buildCase(link, value);
                    link.setAttribute("class", "contentLink");
                    link.setAttribute("id", idNumber);

                    td.appendChild(link);
                }
                row.appendChild(td);
            };
            table.appendChild(row);
        }
    }
}

//建立簡明目錄
function buildContents(findId) {
    var table = document.querySelector("#excelDataTable");
    table.innerHTML = "";
    var columns = addAllColumnHeaders(contents, "#excelDataTable");
    //根據選單顯示對應的案件
    if (findId.indexOf("0") != -1) {
        findId = findId.slice(0, findId.indexOf("0"));
        console.log(findId)
    }
    for (var i = 0; i < contents.length; i++) {
        if (contents[i].文件下載.indexOf(findId) == 0) {
            var row = document.createElement("tr");
            for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                var td = document.createElement("td");
                var cellValue = contents[i][columns[colIndex]];

                if (columns[colIndex] === "文件下載" && fileName.includes(cellValue)) {
                    var link = document.createElement("a");
                    link.href = "./pdf/" + cellValue + ".pdf"
                    link.textContent = cellValue;
                    link.download = cellValue + ".pdf";
                    td.appendChild(link);
                } else {
                    if (cellValue == null) cellValue = "";
                    td.textContent = cellValue;
                }
                row.appendChild(td);
            }
            table.appendChild(row);
        }
    }
}

function addAllColumnHeaders(contents, selector) {
    var table = document.querySelector(selector);
    var columnSet = [];
    var headerTr = document.createElement("tr");;

    for (var i = 0; i < contents.length; i++) {
        var rowHash = contents[i];
        for (var key in rowHash) {
            if (!columnSet.includes(key)) {
                var th = document.createElement("th");
                columnSet.push(key);
                th.textContent = key;
                headerTr.appendChild(th);
            }
        }
    }
    table.appendChild(headerTr);

    return columnSet;
}