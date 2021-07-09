// Multi Noter
(function multiNoter_1_2() {
    function toastMsg(str, sec, err) {
        WF.showMessage(str, err);
        setTimeout(WF.hideMessage, (sec || 2) * 1e3)
    }
    const itemNoteHasTag = (item, Tag) => WF.getItemNoteTags(item).some(t => t.tag.toLowerCase() === Tag.toLowerCase());
    const htmlEscTextForContent = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\u00A0/g, " ");
    const htmlEscText = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

    function pendOmatic(items, input, typeOfWrite) {
        let inputTagOrUrl;
        let inputTagTxt;
        const inputUrl = input.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
        if (inputUrl[0]){
           const match = inputUrl[0].match(/[a-f0-9]{12}/);
           const item = WF.getItemById(WF.shortIdToId(match[0]));
           const formattedElement = `<a href='${inputUrl[0]}'>${item.getNameInPlainText()}</a>`;
           inputTagOrUrl = formattedElement;
        }
        else {
           const tagInput = input.match(/[#@][a-zA-Z0-9][\w:-]*/);
           const inputTagTxt = tagInput ? tagInput[0].replace(/:{1,2}$/, "") : "";
           inputTagOrUrl = inputTagTxt;
        }
        const inputHasTagBorder = inputTagOrUrl ? typeOfWrite === "prePend" ? input.endsWith(inputTagTxt) : input.startsWith(inputTagTxt) : false;
        input = inputUrl ? inputTagOrUrl : htmlEscTextForContent(input);
        const pend = inputHasTagBorder ? typeOfWrite === "prePend" ? `${input} ` : ` ${input}` : input;
        WF.editGroup(() => {
            items.forEach(item => {
                if ((!inputTagOrUrl || !itemNoteHasTag(item, inputTagTxt)) && typeOfWrite !== "newLine") {
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
        const buttons = addButton(1, "Append &#8614;") + addButton(2, "&#8612; Prepend") + addButton(3, "&#8615; New Line");
        WF.showAlertDialog(`<style>${htmlEscText(inputStyle+buttonStyle)}</style><div>${bodyHtml}</div>${box}<div>${buttons}</div>`, "Enter tag or text:");
        setTimeout(() => {
            let userInput;
            const inputBx = document.getElementById("inputBx");
            const btn1 = document.getElementById("btn1");
            const btn2 = document.getElementById("btn2");
            const btn3 = document.getElementById("btn3")
            inputBx.select();
            inputBx.addEventListener("keyup", event => {
                if (event.key === "Enter") btn1.click()
            });
            btn1.onclick = () => {
                userInput = inputBx.value;
                WF.hideDialog();
                setTimeout(() => pendOmatic(selections, userInput), 50)
            };
            btn2.onclick = () => {
                userInput = inputBx.value;
                WF.hideDialog();
                setTimeout(() => pendOmatic(selections, userInput, "prePend"), 50)
            }
            btn3.onclick = () => {
                userInput = inputBx.value;
                WF.hideDialog();
                setTimeout(() => pendOmatic(selections, userInput, "newLine"), 50)
            }
        }, 100)
    }
    const selections = WF.getSelection().filter(item => !item.isReadOnly());
    if (selections.length === 0) {
        return void toastMsg(`Use WorkFlowy's multi-select to select bullets, and try again. <i>(Alt+Click or Cmd+Click)</i>`, 3, true)
    }
    multiTagAlert(`<i>${selections.length} items</i>`)
})();
