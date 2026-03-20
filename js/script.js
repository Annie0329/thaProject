//切換目錄類型
document.getElementById("contentsBtn").addEventListener("click", function () {
    document.getElementById("excelDataTable").innerHTML = "";
    buildContents("#excelDataTable");
})
document.getElementById("tableBtn").addEventListener("click", function () {
    document.getElementById("excelDataTable").innerHTML = "";
    buildHtmlTable("#excelDataTable");
})

//用id換不同的內容
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if (id) {
    const container = document.getElementById("content");
    container.innerHTML = "";
    for (item of fileName) {
        if (item.lastIndexOf(id, 0) == 0) {
            container.innerHTML += "<p class = \"downloadLink\"><a href=\"../pdf/" + item + ".pdf\" download= \"" + item + ".pdf\"" + ">" + item + "</a></p>";
        }
    }

} else {
    buildHtmlTable("#excelDataTable");  // show table
    // buildContents("#excelDataTable")
}

function buildCaseTitle(value) {
    var caseTitle = document.createElement("p");
    caseTitle.setAttribute("class", "caseTitle");
    caseTitle.textContent = value.slice(0, value.indexOf("\n"))
    return caseTitle
}

function buildCaseInfo(value) {
    var caseInfo = document.createElement("p");
    caseInfo.setAttribute("class", "caseInfo");
    caseInfo.textContent = value.slice(value.indexOf("\n") + 1)
    return caseInfo
}
//建立總目錄
function buildHtmlTable(selector) {
    var table = document.querySelector(selector);

    for (var i = 0; i < myList.length; i++) {
        var group = myList[i];
        var rowspan = group.items.length;

        for (var j = 0; j < group.items.length; j++) {
            var row = document.createElement("tr");

            if (j === 0) {
                var th = document.createElement("th");
                var value = group.title
                th.setAttribute("rowspan", rowspan);
                th.appendChild(buildCaseTitle(value));
                th.appendChild(buildCaseInfo(value));

                row.appendChild(th);
            }

            // sub title
            var subTh = document.createElement("th");
            var value = group.items[j].name;
            subTh.appendChild(buildCaseTitle(value));
            subTh.appendChild(buildCaseInfo(value));

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
                        link.setAttribute("href", "../index.html?id=" + idNumber);
                    }

                    link.appendChild(buildCaseTitle(value));
                    link.appendChild(buildCaseInfo(value));
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
function buildContents(selector) {
    var table = document.querySelector(selector);
    var columns = addAllColumnHeaders(contents, selector);

    for (var i = 0; i < contents.length; i++) {
        var row = document.createElement("tr");;
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var td = document.createElement("td");
            var cellValue = contents[i][columns[colIndex]];

            if (cellValue == null) cellValue = "";
            td.textContent = cellValue;
            row.appendChild(td);
        }
        table.appendChild(row);
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

const titleSelect = document.getElementById("doorSelect");
const nameSelect = document.getElementById("cateSelect");
const objSelect = document.getElementById("secSelect");

// Populate title dropdown
myList.forEach((d, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = d.title.slice(0, d.title.indexOf("\n"));
    titleSelect.appendChild(option);
});

titleSelect.addEventListener("change", () => {
    const selectedIndex = titleSelect.value;
    nameSelect.innerHTML = "";
    const items = myList[selectedIndex].items;

    items.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = item.name.slice(0, item.name.indexOf("\n"));
        nameSelect.appendChild(option);
    });

    //Auto-select first item
    nameSelect.value = "0";
    nameSelect.dispatchEvent(new Event("change"));
});

// When name changes → populate objects
nameSelect.addEventListener("change", () => {
    const titleIndex = titleSelect.value;
    const nameIndex = nameSelect.value;

    objSelect.innerHTML = "";

    const selectedItem = myList[titleIndex].items[nameIndex];

    selectedItem.objs.forEach(obj => {
        const option = document.createElement("option");
        option.value = obj;
        option.textContent = obj.slice(0, obj.indexOf("\n"));;
        objSelect.appendChild(option);
    });

    //Auto-select first item
    objSelect.value = selectedItem.objs[0];
});

//Auto select first title
if (myList.length > 0) {
    titleSelect.value = "0";
    titleSelect.dispatchEvent(new Event("change"));
}