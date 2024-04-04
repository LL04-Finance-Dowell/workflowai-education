import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createDateInputField(id, element, document_map_required, p, holderDIV, focuseddClassMaintain, handleClicked, setSidebar, setRightSideDateMenu, setMethod, setStartDate) {
    let isAnyRequiredElementEdited = false;
    let dateField = document.createElement("div");
    dateField.className = "dateInput";
    dateField.id = id;
    dateField.style.width = "100%";
    dateField.style.height = "100%";
    dateField.style.backgroundColor = "#dedede";
    dateField.style.borderRadius = "0px";
    dateField.style.outline = "0px";
    dateField.style.overflow = "overlay";
    dateField.style.position = "relative";

    function dateClick() {
        document.getElementById("date_picker")?.click();

    }

    dateField.onclick = (e) => {
        if (e.ctrlKey) {
            copyInput("calendar2");
        }
        focuseddClassMaintain(e);
        handleClicked("calendar2");
        setRightSideDateMenu(false);
        //console.log("innerText", e.target.innerText);
        const date = e.target.innerText
        if (date != "mm/dd/yyyy") {
            if (date.includes("/")) {
                const setDate = new Date(parseInt(date));
                //console.log("First from Midsection", setDate);
                setMethod("first");
                setStartDate(setDate);
            } else {
                if (date.includes("-")) {
                    setMethod("fourth");
                } else {
                    setMethod("second");
                }
                const setDate = new Date(e.target.innerText);
                //// console.log("Second from Midsection", setDate);

                setStartDate(setDate);
            }
        }
        setSidebar(true);
        setTimeout(dateClick, 0);
    };

    dateField.innerText = `${element.data}`;

    holderDIV.append(dateField);

    document
        .getElementsByClassName("midSection_container")
    [p - 1] // ?.item(0)
        ?.append(holderDIV);
}
export default createDateInputField;