import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createIframeInputField(id, element, p, holderDIV, table_dropdown_focuseddClassMaintain, handleClicked, setSidebar) {
    let isAnyRequiredElementEdited = false;
    
    let iframeField = document.createElement("div");
    iframeField.className = "iframeInput";
    iframeField.id = id;
    iframeField.style.width = "100%";
    iframeField.style.height = "100%";
    iframeField.style.backgroundColor = "#dedede";
    iframeField.style.borderRadius = "0px";
    iframeField.style.outline = "0px";
    iframeField.style.overflow = "overlay";

    iframeField.style.position = "absolute";

    if (element.data == "iFrame here") {
        iframeField.innerHTML = element.data;
    }
    if (element.data != "iFrame here") {
        const iframe = document.createElement("iframe");
        iframe.src = element.data;
        iframe.width = "100%";
        iframe.height = "100%";

        iframeField.append(iframe);
    }

    iframeField.onclick = (e) => {
        table_dropdown_focuseddClassMaintain(e);
        if (e.ctrlKey) {
            copyInput("iframe2");
        }
        handleClicked("iframe2");
        setSidebar(true);
    };

    holderDIV.append(iframeField);

    document
        .getElementsByClassName("midSection_container")
    [p - 1] // ?.item(0)
        ?.append(holderDIV);
}
export default createIframeInputField;