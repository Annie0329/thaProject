//建立選項
function buildOption(element) {
    const option = document.createElement("option");
    //真是駭人的寫法
    if (element == "all") {
        option.value = "0";
        option.textContent = "全部"
    } else {
        option.value = element.id[element.id.length - 1]
        option.textContent = option.value + " " + element.name.slice(0, element.name.indexOf("\n"));
    }
    return option
}
//建立所有選項
function buildOptions(elements, elementSelect) {
    elementSelect.disabled = false;
    elementSelect.innerHTML = "";

    elements.forEach(element => {
        elementSelect.appendChild(buildOption(element));
    });
    elementSelect.appendChild(buildOption("all"));
    //自動選第一個選項
    elementSelect.value = "0";
}

//停用選單
function disableOption(elementSelect) {
    elementSelect.value = "0"
    elementSelect.innerHTML = "<option value='0'>--</option>"
    elementSelect.disabled = true;
}

//製作門選單
buildOptions(thaTable, doorSelect)

//門
doorSelect.addEventListener("change", () => {
    if (doorSelect.value == "0") {
        disableOption(cateSelect)
    } else {
        //製作類選單
        const cates = thaTable[doorSelect.value - 1].items;
        buildOptions(cates, cateSelect)
    }
    cateSelect.dispatchEvent(new Event("change"));
});

//類
cateSelect.addEventListener("change", () => {
    if (cateSelect.value == "0") {
        disableOption(secSelect)
    } else {
        //製作款選單
        const secs = thaTable[doorSelect.value - 1].items[cateSelect.value - 1].objs;
        buildOptions(secs, secSelect)
    }
    secSelect.dispatchEvent(new Event("change"));
});

//款
secSelect.addEventListener("change", () => {
    var findId = doorSelect.value + cateSelect.value + secSelect.value
    //如果id有0(全部選項)的話，就把0的部分切掉，用頭去找
    if (findId.includes("0")) {
        findId = findId.slice(0, findId.indexOf("0"));
    }
    searchType == "table" ? buildTable(findId) : buildContents(findId)
})

doorSelect.value = "0";
doorSelect.dispatchEvent(new Event("change"));