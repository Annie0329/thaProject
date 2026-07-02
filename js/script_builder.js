const doorSelect = document.getElementById("doorSelect");
const cateSelect = document.getElementById("cateSelect");
const secSelect = document.getElementById("secSelect");
const content = document.getElementById("content");
const downloadZone = document.getElementById("downloadZone");
downloadZone.style.display = "none"
var searchType = "table";
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
    document.body.style.fontFamily = fontSelect.value + ',\'tanHsinFont_FD\''
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
    return element
}

//篩選
function idFit(id, findId) {
    return id.startsWith(findId.slice(0, id.length))
}

//建立總目錄
function buildTable(findId) {
    var table = document.querySelector("#excelDataTable");
    table.innerHTML = "";
    let groupRendered = false;
    //門
    for (var i = 0; i < thaTable.length; i++) {
        let groupRendered = false;
        var group = thaTable[i];
        if (idFit(group.id, findId)) {
            var rowspan = group.items.filter(item =>
                idFit(item.id, findId)
            ).length;
            //類
            for (var j = 0; j < group.items.length; j++) {
                if (idFit(group.items[j].id, findId)) {
                    var row = document.createElement("tr");
                    //門標題
                    if (!groupRendered) {
                        var th = document.createElement("th");
                        th.setAttribute("rowspan", rowspan);
                        row.appendChild(buildCase(th, group.name));
                        groupRendered = true;
                    }
                    // 類標題
                    var subTh = document.createElement("th");
                    row.appendChild(buildCase(subTh, group.items[j].name));

                    //款
                    var objNum = findId.length > 1 ? group.items[j].objs.length : 9
                    var objs = group.items[j].objs || [];
                    for (let i = 0; i < objNum; i++) {
                        var value = objs[i]?.name ?? "";
                        var objId = objs[i]?.id ?? ""
                        //篩選
                        if (idFit(objId, findId)) {
                            var fileNum = value ? value.slice(value.indexOf("(") + 1, value.indexOf(")")) : "";
                            var td = document.createElement("td");
                            //如果不是空的
                            if (value) {
                                let link;
                                // 如果沒有案件可以下載就不要做連結
                                if (fileNum == "0") {
                                    link = document.createElement("p");
                                } else {
                                    link = document.createElement("a");
                                    link.setAttribute("href", "./index.html?id=" + objId);
                                }

                                link.setAttribute("class", "contentLink");
                                link.setAttribute("id", objId);

                                td.appendChild(buildCase(link, value));
                            }
                            row.appendChild(td);
                        }
                    };
                    table.appendChild(row);
                }
            }
        }
    }
}
//建立簡明目錄
function buildContents(findId) {
    var table = document.querySelector("#excelDataTable");
    table.innerHTML = "";
    var columns = addAllColumnHeaders(thaContents, "#excelDataTable");
    //根據選單顯示對應的案件
    for (var i = 0; i < thaContents.length; i++) {
        if (thaContents[i].文件下載.startsWith(findId)) {
            var row = document.createElement("tr");
            for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                var td = document.createElement("td");
                var cellValue = thaContents[i][columns[colIndex]];

                if (columns[colIndex] === "文件下載" && pdfFileList.includes(cellValue)) {
                    var link = document.createElement("a");
                    link.href = "./pdf/" + cellValue + ".pdf"
                    link.textContent = cellValue;
                    link.target = "_blank"
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