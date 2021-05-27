// Multi Noter
(function search_nodes() {
    function toastMsg(str, sec, err) {
        WF.showMessage(str, err);
        setTimeout(WF.hideMessage, (sec || 2) * 1e3)
    }
    const itemNoteHasTag = (item, Tag) => WF.getItemNoteTags(item).some(t => t.tag.toLowerCase() === Tag.toLowerCase());
    const htmlEscTextForContent = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\u00A0/g, " ");
    const htmlEscText = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

    function copyThat(str) {
        const t = document.createElement("textarea");
        t.value = str;
        document.body.appendChild(t);
        t.select();
        const success = document.execCommand("copy");
        document.body.removeChild(t);
        return success
    }
function multiSelectMatches() {
    function applyToEachItem(functionToApply, parent) {
        functionToApply(parent);
        for (let child of parent.getChildren()) {
            applyToEachItem(functionToApply, child)
        }
    }

    function findMatchingItems(itemPredicate, parent) {
        const matches = [];

        function addIfMatch(item) {
            if (itemPredicate(item)) {
                matches.push(item)
            }
        }
        applyToEachItem(addIfMatch, parent);
        return matches
    }

    function isItemWithVisibleMatch(item) {
        const isVisible = WF.completedVisible() || !item.isWithinCompleted();
        return item.data.search_result && item.data.search_result.matches && isVisible
    }
    const matches = findMatchingItems(isItemWithVisibleMatch, WF.currentItem());
    blurFocusedContent();
    WF.setSelection(matches)
}

    const mirrorMatches = (userInput) => {
        setTimeout(() => {
            multiSelectMatches();
            }, 100)
    //const matches = findMatchingItems(isItemWithVisibleMatch, WF.currentItem());
    //blurFocusedContent();
    //WF.setSelection(matches)
    }
    function pendOmatic(items, input, typeOfWrite) {
        const inputTag = input.match(/[#@][a-zA-Z0-9][\w:-]*/);
        const inputTagTxt = inputTag ? inputTag[0].replace(/:{1,2}$/, "") : "";
        const inputHasTagBorder = inputTag ? typeOfWrite === "prePend" ? input.endsWith(inputTagTxt) : input.startsWith(inputTagTxt) : false;
        input = htmlEscTextForContent(input);
        const pend = inputHasTagBorder ? typeOfWrite === "prePend" ? `${input} ` : ` ${input}` : input;
        WF.editGroup(() => {
            items.forEach(item => {
                if ((!inputTag || !itemNoteHasTag(item, inputTagTxt)) && typeOfWrite !== "newLine") {
                    const linesOfNote = item.getNote().split('\n');
                    const nuName = typeOfWrite === "prePend" ? pend + linesOfNote[0].trimLeft()  : linesOfNote[0].trimRight() + pend;
                    WF.setItemNote(item, `${nuName}\n${linesOfNote.slice(1).join('\n')}`);
                }
                else{
                    WF.setItemNote(item, `${pend.trim()}\n${item.getNote()}`);
                }
            })
        })
    }

    function createAllTagsDataList() {
        const options = getRootDescendantTagCounts().getTagList().map(Tag => `<option value="${Tag.tag} ">`);
        return `<datalist id="tagPicker"<option value="">${options.join('')}</datalist>`
    }

    function getColors() {
        const p = document.querySelector(".page.active");
        return p ? `color:${getComputedStyle(p).color};background:${getComputedStyle(p).backgroundColor};` : ""
    }

    function multiTagAlert(bodyHtml) {
        const addButton = (num, name) => `<button type="button" class="btnX" id="btn${num.toString()}">${name}</button>`;
        const inputStyle = `#inputBx{${getColors()}width:95%;height:20px;display:block;margin-top:5px;border:1px solid #ccc;border-radius:4px;padding:5px}`;
        const buttonStyle = '.btnX{font-size:18px;background-color:steelblue;border:2px solid;border-radius:20px;color:#fff;padding:5px 15px;margin-top:16px;margin-right:16px}.btnX:focus{border-color:#c4c4c4}';
        const box = `<div><input id="inputBx" type="text" spellcheck="false" list="tagPicker">${createAllTagsDataList()}</div>`;
        const button = addButton(1, "Submit &#9094;")
        WF.showAlertDialog(`<style>${htmlEscText(inputStyle+buttonStyle)}</style><div>${bodyHtml}</div>${box}<div>${button}</div>`, "Enter tag or text:");
        setTimeout(() => {
            let userInput;
            const inputBx = document.getElementById("inputBx");
            const btn1 = document.getElementById("btn1");
            inputBx.select();
            inputBx.addEventListener("keyup", event => {
                if (event.key === "Enter") btn1.click()
            });
            btn1.onclick = () => {
                userInput = inputBx.value;
                WF.hideDialog();
                setTimeout(() => {
                  (() => WF.search(userInput))();
                    mirrorMatches(userInput);
                }, 50)
            };
        }, 100)
    }
    multiTagAlert(`<i>Dashboard</i>`)
})();
