(function moveToGrandChild_1_0(wID= '"_wID_"', top = '_top_', sort = '_sort_', name = '"_name_"', secs = '_secs_') {
    if (typeof top !== "boolean") top = true;
    if (typeof sort !== "boolean") sort = false;
    if (typeof secs !== "number") secs = 3;

    function toastMsg(str, sec, err) {
        WF.showMessage(str, err);
        setTimeout(WF.hideMessage, (sec || 2) * 1e3)
    }

    function getViableMoves(items, target) {
        const isNotAncestorOfTarget = item => target.getAncestors().findIndex(ancestor => ancestor.equals(item)) === -1;
        const isNotEmbeddedChild = item => !item.isEmbedded() || item.isAddedSubtreePlaceholder();
        return items.filter(item => !item.equals(target) && isNotEmbeddedChild(item) && isNotAncestorOfTarget(item))
    }

    function getFocusInfo(viableItems) {
        let nuFocus, zoomOut = null;
        const current = WF.currentItem(),
            parent = current.getParent() || WF.rootItem(),
            lastMove = viableItems[viableItems.length - 1],
            firstMove = viableItems[0];
        if (lastMove.equals(current)) {
            nuFocus = parent.isMainDocumentRoot() ? parent.getVisibleChildren()[0] : parent;
            zoomOut = parent
        } else {
            nuFocus = lastMove.getNextVisibleSibling() || firstMove.getPreviousVisibleSibling() || current
        }
        return {
            item: nuFocus,
            zoom: zoomOut
        }
    }
    const htmlEscText = str => str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

    function createMoveMessage(target, num) {
        const url = target.getUrl();
        const link = `<b><a href="${url==="/"?"/#":url}" onclick="WF.hideMessage();return true">${htmlEscText(target.getNameInPlainText())}</a></b>`;
        toastMsg(`Moved <b>${num}</b>${arrow+link}`, secs)
    }

    function resetFocus(foc, sel) {
        blurFocusedContent();
        foc ? WF.editItemName(foc) : WF.setSelection(sel)
    }

    function moveTo(items, targetPid, Go) {
        WF.hideDialog();
        const target = WF.getItemById(targetPid);
        const viableMoves = getViableMoves(items, target);
        if (viableMoves.length === 0) return void toastMsg("<b>No viable moves found in selection.</b>", 5, true);
        const pty = top ? 0 : target.getChildren().length;
        const focusInfo = getFocusInfo(viableMoves);
        WF.moveItems(viableMoves, target, pty);
        if (Go) {
            WF.zoomTo(target);
            setTimeout(() => resetFocus(focus, viableMoves), 200)
        } else {
            createMoveMessage(target, viableMoves.length);
            if (focusInfo.zoom) WF.zoomTo(focusInfo.zoom);
            setTimeout(() => WF.editItemName(focusInfo.item), 200)
        }
    }
    function focusAndReturnElement(element){
        let searchedElement = document.getElementById(element);
        searchedElement.focus();
        searchedElement.selectedIndex = '0';
        return searchedElement;
    }
    function createSelectBox(items) {
        function getFontSize(num) {
            if (num < 44) return 14;
            else if (num < 48) return 13;
            else if (num < 51) return 12;
            else if (num < 56) return 11;
            else if (num < 61) return 10;
            else return 9
        }

        function getColors() {
            const p = document.querySelector(".page.active");
            return p ? `color:${getComputedStyle(p).color};background:${getComputedStyle(p).backgroundColor};` : ""
        }
        const options = items.map(item => `<option class="selectOpt" value="${item.getId()}">${htmlEscText(item.getNameInPlainText())}</option>`);
        const l = options.length;
        const style = `<style>#selectBox{font-size:${getFontSize(l)}px;border:hidden;margin-top:6px;width:460px;${getColors()}}#selectBox::-webkit-scrollbar{display:none!important}.selectOpt::before{content:"●  "!important;color:#c6c6c6!important}h1{font-size:120%!important}</style>`;
        return `${style}<select id="selectBox" size="${l}">${options.join('')}</select>`
    }

    function convertWidToItem(str, homeNotOption) {
        const match = str.match(/[a-f0-9]{12}/);
        if (match) return WF.getItemById(WF.shortIdToId(match[0]));
        return !homeNotOption && str === "" ? WF.rootItem() : null
    }
    const Parent = convertWidToItem(wID);
    if (!Parent) return void toastMsg("ERROR: Bad Parent ID", 7, true);
    const matches = Parent.getChildren().filter(item => !item.isCompleted() && !item.isEmbedded());
    if (matches.length === 0) return void toastMsg(`<b>No writable children found.</b>`, 7, true);
    if (sort) matches.sort((a, b) => a.getNameInPlainText().localeCompare(b.getNameInPlainText()));
    const arrow = top ? " ▲ " : " ▼ ";
    const focus = WF.focusedItem();
    const selections = WF.getSelection();
    if (selections.length > 0) WF.setSelection([]);
    const itemsToMove = focus ? [focus] : selections;
    if (itemsToMove.length === 0) return void toastMsg("<b>No bullets selected or focused</b>", 2, true);
    const moveInfo = itemsToMove.length === 1 ? itemsToMove[0].getNameInPlainText() : `${itemsToMove.length} items`;
    WF.showAlertDialog(createSelectBox(matches), name + arrow + moveInfo);
    setTimeout((function() {
        const selectBoxMatches = focusAndReturnElement("selectBox");
        selectBoxMatches.onclick = function(e) {
            if (!e.altKey && !e.ctrlKey && !e.metaKey) {
                const childText = e.currentTarget.selectedOptions[0].text;
                WF.showAlertDialog(createSelectBox(matches.find( item => item.data.nm === childText).getChildren(), name + arrow + moveInfo));
                const selectBoxSelected = focusAndReturnElement("selectBox");
                selectBoxSelected.onclick = function(e){
                    if (!e.altKey && !e.ctrlKey && !e.metaKey) {
                        if (!e.shiftKey) moveTo(itemsToMove, this.value);
                        if (e.shiftKey) moveTo(itemsToMove, this.value, true);
                    }
                }
            }
        };
        selectBoxMatches.onkeyup = function(e) {
            if (!e.altKey && !e.ctrlKey && !e.metaKey && e.key === "Enter") {
                const childText = e.currentTarget.selectedOptions[0].text;
                WF.showAlertDialog(createSelectBox(matches.find( item => item.data.nm === childText).getChildren(), name + arrow + moveInfo));
                const selectBoxSelected = focusAndReturnElement("selectBox");
                selectBoxSelected.onkeyup = function(e){
                    if (!e.altKey && !e.ctrlKey && !e.metaKey && e.key === "Enter") {
                        if (!e.shiftKey) moveTo(itemsToMove, this.value);
                        if (e.shiftKey) moveTo(itemsToMove, this.value, true)
                    }
                }
            }
            if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key === "Escape") {
                resetFocus(focus, selections)
            }
        }
    }), 100)
})();
