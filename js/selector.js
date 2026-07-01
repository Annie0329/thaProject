//製作門選單
myList.forEach(door => {
    console.log(door.name)
    const option = document.createElement("option");
    option.value = doorSelect.length + 1
    option.textContent = option.value + " " + door.name.slice(0, door.name.indexOf("\n"));
    doorSelect.appendChild(option);
});
//加上全部選項
function buildAllOpt() {
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = "全部"
    return option
}

doorSelect.appendChild(buildAllOpt());

//門
doorSelect.addEventListener("change", () => {
    // console.log("門：" + doorSelect.value)
    if (doorSelect.value == "0") {
        cateSelect.value = "0"
        cateSelect.innerHTML = "<option value='0'>--</option>"
        cateSelect.disabled = true;
    } else {
        //製作類選單
        cateSelect.disabled = false;
        cateSelect.innerHTML = "";
        const cates = myList[doorSelect.value - 1].items;

        cates.forEach(cate => {
            const option = document.createElement("option");
            option.value = cateSelect.length + 1;
            option.textContent = option.value + " " + cate.name.slice(0, cate.name.indexOf("\n"));
            cateSelect.appendChild(option);
        });
        //加上全部選項
        cateSelect.appendChild(buildAllOpt());
        //自動選第一個選項
        cateSelect.value = "0";
    }
    cateSelect.dispatchEvent(new Event("change"));
});

//類
cateSelect.addEventListener("change", () => {
    // console.log(cateSelect.value)
    if (cateSelect.value == "0") {
        secSelect.value = "0"
        secSelect.innerHTML = "<option value='0'>--</option>"
        secSelect.disabled = true;
    } else {
        //製作款選單
        secSelect.disabled = false;
        secSelect.innerHTML = "";
        const secs = myList[doorSelect.value - 1].items[cateSelect.value - 1].objs;

        secs.forEach(sec => {
            const option = document.createElement("option");
            option.value = secSelect.length + 1;
            option.textContent = option.value + " " + sec.name.slice(0, sec.name.indexOf("\n"));
            secSelect.appendChild(option);
        });
        //加上全部選項
        secSelect.appendChild(buildAllOpt());
        //自動選第一個選項
        secSelect.value = "0";
    }
    secSelect.dispatchEvent(new Event("change"));
});

//款
secSelect.addEventListener("change", () => {
    var findId = doorSelect.value + cateSelect.value + secSelect.value
    //如果id有0(全部選項)的話，就把0的部分切掉，用頭去找
    if (findId.indexOf("0") != -1) {
        findId = findId.slice(0, findId.indexOf("0"));
    }
    searchType == "table" ? buildHtmlTable(findId) : buildContents(findId)
})

doorSelect.value = "0";
doorSelect.dispatchEvent(new Event("change"));