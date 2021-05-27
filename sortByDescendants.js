(function sortByDescendants(maxChildren = 400) {
    function toastMsg(str, sec, err) {
        WF.showMessage(str, err);
        setTimeout(WF.hideMessage, (sec || 3) * 1e3)
    }

    function sortAndMove(items, descending) {
        WF.hideDialog();
        setTimeout(() => {
            items.sort((a, b) => descending ? b.getChildren().length - a.getChildren().length : a.getChildren().length - b.getChildren().length);
            WF.editGroup(() => {
                items.forEach((item, i) => {
                    if (item.getPriority() !== i) WF.moveItems([item], parent, i)
                })
            });
            WF.editItemName(parent);
            toastMsg(`Sorted ${descending?"Descending.":"Ascending."}`, 1)
        }, 50)
    }
    const htmlEscText = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

    function showSortDialog(bodyHtml, title) {
        const addButton = (num, name) => `<button type="button" class="btnX" id="btn${num.toString()}">${name}</button>`;
        const style = '.btnX{font-size:18px;background-color:steelblue;border:2px solid;border-radius:20px;color:#fff;padding:5px 15px;margin-top:16px;margin-right:16px}.btnX:focus{border-color:#c4c4c4}';
        const buttons = addButton(1, "Ascending") + addButton(2, "Descending");
        WF.showAlertDialog(`<style>${htmlEscText(style)}</style><div>${bodyHtml}</div><div>${buttons}</div>`, title);
        setTimeout(() => {
            const btn1 = document.getElementById("btn1");
            const btn2 = document.getElementById("btn2");
            btn1.focus();
            btn1.onclick = function() {
                sortAndMove(children)
            };
            btn2.onclick = function() {
                sortAndMove(children, true)
            }
        }, 100)
    }
    if (WF.currentSearchQuery()) return void toastMsg("Sorting is disabled when search is active.", 3, true);
    const parent = WF.currentItem();
    if (parent.isEmbedded()) return void toastMsg("Sorting disabled for added shares.", 3, true);
    const children = parent.getChildren();
    if (children.length < 2) return void toastMsg("Nothing to sort.", 3, true);
    if (children.length > maxChildren) return void toastMsg(`Sorting more than ${maxChildren} children upsets the WorkFlowy gods, and has been disabled.`, 5, true);
    const sortInfo = `Sort <b>${children.length}</b> children?`;
    showSortDialog(sortInfo, parent.getNameInPlainText())
})();
