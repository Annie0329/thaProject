//增加標題和資訊
function buildCase(element, item) {
    var caseTitle = document.createElement("p");
    caseTitle.setAttribute("class", "caseTitle");
    caseTitle.textContent = item.name
    element.appendChild(caseTitle)

    var caseInfo = document.createElement("p");
    caseInfo.setAttribute("class", "caseInfo");
    sharps = "#".repeat(5 - item.id.length) + ".##"

    caseInfo.textContent = "(" + item.fileNum + ")\n" + item.id + sharps
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
    for (const group of thaTable) {
        let groupRendered = false;
        if (idFit(group.id, findId)) {
            var rowspan = group.items.filter(item =>
                idFit(item.id, findId)
            ).length;
            //類
            for (const item of group.items) {
                if (idFit(item.id, findId)) {
                    var row = document.createElement("tr");
                    //門標題
                    if (!groupRendered) {
                        var th = document.createElement("th");
                        th.setAttribute("rowspan", rowspan);
                        row.appendChild(buildCase(th, group));
                        groupRendered = true;
                    }
                    // 類標題
                    var subTh = document.createElement("th");
                    row.appendChild(buildCase(subTh, item));

                    //款
                    var objNum = findId.length > 1 ? item.objs.length : 9
                    var objs = item.objs || [];
                    for (let i = 0; i < objNum; i++) {
                        var value = objs[i] || "";
                        var objId = objs[i]?.id ?? ""
                        //篩選
                        if (idFit(objId, findId)) {
                            var td = document.createElement("td");
                            //如果不是空的
                            if (value) {
                                let link;
                                // 如果沒有案件可以下載就不要做連結
                                if (objs[i].fileNum == "0") {
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
    for (const thaContent of thaContents) {
        if (thaContent.文件下載.startsWith(findId)) {
            var row = document.createElement("tr");
            for (const column of columns) {
                var td = document.createElement("td");
                var cellValue = thaContent[column];

                if (column === "文件下載" && pdfFileList.includes(cellValue)) {
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

    for (const content of contents) {
        for (var key in content) {
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