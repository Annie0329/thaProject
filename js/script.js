const doorSelect = document.getElementById("doorSelect");
const cateSelect = document.getElementById("cateSelect");
const secSelect = document.getElementById("secSelect");
const content = document.getElementById("content");
const downloadZone = document.getElementById("downloadZone");
downloadZone.style.display = "none"
var searchType = "table"

buildHtmlTable("");
//切換到總表
document.getElementById("tableBtn").addEventListener("click", function () {
    searchType = "table"
    doorSelect.value = "0";
    doorSelect.dispatchEvent(new Event("change"));
    buildHtmlTable("");
})
//切換到簡明目錄
document.getElementById("contentsBtn").addEventListener("click", function () {
    searchType = "content"
    //自動預設選到「全部」
    doorSelect.value = "0";
    doorSelect.dispatchEvent(new Event("change"));
    buildContents("");
})

//切換字型
fontSelect = document.getElementById("fontSelect")
fontSelect.addEventListener('change', () => {
    console.log(fontSelect.value)
    document.body.style.fontFamily = fontSelect.value + ',\'tanHsinFont_FD\''
});

//用id換不同的內容
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if (id) {
    content.style.display = "none"
    downloadZone.style.display = "inline-block"
    downloadZone.innerHTML = "<button onclick=\"back()\">回首頁</button>"
    for (item of fileName) {
        if (item.lastIndexOf(id, 0) == 0) {
            downloadZone.innerHTML += "<p class = \"downloadLink\"><a href=\"./pdf/" + item + ".pdf\" target=\"_blank\">" + item + "</a></p>";
        }
    }

} else {
    doorSelect.value = "0";
    doorSelect.dispatchEvent(new Event("change"));
    buildHtmlTable("");
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
}

//建立總目錄
function buildHtmlTable(findId) {
    var table = document.querySelector("#excelDataTable");
    table.innerHTML = "";
    let groupRendered = false;
    //門
    for (var i = 0; i < myList.length; i++) {
        let groupRendered = false;
        var group = myList[i];
        //篩選
        console.log("findId[0]" + findId[0] + "group.id" + group.id)
        if (group.id.startsWith(findId[0]) || findId == "") {
            var rowspan = group.items.filter(item =>
                item.id.startsWith(findId[0] + (findId[1] || "")) || findId.length < 2
            ).length;
            //類
            for (var j = 0; j < group.items.length; j++) {
                //篩選
                if (group.items[j].id.startsWith(findId[0] + findId[1]) || findId.length < 2) {
                    var row = document.createElement("tr");
                    //門標題
                    if (!groupRendered) {
                        var th = document.createElement("th");
                        var value = group.name
                        th.setAttribute("rowspan", rowspan);
                        buildCase(th, value);
                        row.appendChild(th);
                        groupRendered = true;
                    }
                    // sub title
                    var subTh = document.createElement("th");
                    var value = group.items[j].name;
                    buildCase(subTh, value);
                    row.appendChild(subTh);

                    // objects
                    // var objNum = 9
                    var objNum = findId.length > 1 ? group.items[j].objs.length : 9
                    console.log("objNum" + objNum)
                    var objs = group.items[j].objs || [];
                    //款
                    for (let i = 0; i < objNum; i++) {
                        var value = objs[i]?.name ?? "";
                        var objId = objs[i]?.id ?? ""
                        //篩選
                        if (objId.startsWith(findId) || findId.length < 3) {
                            var fileNum = value ? value.slice(value.indexOf("(") + 1, value.indexOf(")")) : "";
                            var td = document.createElement("td");

                            if (value) {
                                let link;
                                // 如果沒有案件可以下載就不要做連結
                                if (fileNum == "0") {
                                    link = document.createElement("p");
                                } else {
                                    link = document.createElement("a");
                                    link.setAttribute("href", "./index.html?id=" + objId);
                                }

                                buildCase(link, value);
                                link.setAttribute("class", "contentLink");
                                link.setAttribute("id", objId);

                                td.appendChild(link);
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
    var columns = addAllColumnHeaders(contents, "#excelDataTable");
    //根據選單顯示對應的案件
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