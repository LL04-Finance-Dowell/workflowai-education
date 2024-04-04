import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create text input field
function createButtonInputField(id, element, p, holderDIV, focuseddClassMaintain, handleClicked, setSidebar, finalizeButton, rejectButton, decoded, document_map_required) {
    let isAnyRequiredElementEdited = false;
    let buttonField = document.createElement("button");
    buttonField.className = "buttonInput";
    buttonField.id = id;
    buttonField.style.width = "100%";
    buttonField.style.height = "100%";
    buttonField.style.backgroundColor = "#0000";
    buttonField.style.borderRadius = "0px";
    buttonField.style.outline = "0px";
    buttonField.style.overflow = "overlay";
    buttonField.style.position = "absolute";
    buttonField.textContent = element.data;

    if (decoded.details.action === "template") {
        buttonField.onclick = (e) => {
            focuseddClassMaintain(e);
            if (e.ctrlKey) {
                copyInput("button2");
            }
            handleClicked("button2");
            setSidebar(true);
        };
    }

    buttonField.onmouseover = (e) => {
        const required_map_document =
            document_map_required?.filter(
                (item) => element.id == item.content
            ) || [];
        if (
            buttonField.parentElement.classList.contains("holderDIV") &&
            required_map_document?.length > 0
        ) {
            buttonField.parentElement.classList.add("element_updated");
        }
        if (element.required) {
            isAnyRequiredElementEdited = true;
        }
    };

    if (
        decoded.details.action === "document" &&
        element.purpose == "custom" &&
        element.raw_data !== ""
    ) {
        buttonField.onclick = (e) => {
            window.open(element.raw_data, "_blank");
        };
    }

    if (finalizeButton) {
        if (isAnyRequiredElementEdited) {
            finalizeButton?.click();
        } else {
            // ? This was commented because it always runs when there is no required component
            // finalizeButton.disabled = true;
        }
    }

    if (
        decoded.details.action === "document" &&
        element.purpose == "reject"
    ) {
        buttonField.onclick = (e) => {
            rejectButton?.click();
        };
    }

    const linkHolder = document.createElement("div");
    linkHolder.className = "link_holder";
    linkHolder.innerHTML = element.raw_data;
    linkHolder.style.display = "none";

    const purposeHolder = document.createElement("div");
    purposeHolder.className = "purpose_holder";
    purposeHolder.innerHTML = element.purpose;
    purposeHolder.style.display = "none";

    holderDIV.append(buttonField);
    holderDIV.append(linkHolder);
    holderDIV.append(purposeHolder);
    // console.log(element);
    document
        .getElementsByClassName("midSection_container")
    [p - 1] // ?.item(0)
        ?.append(holderDIV);
}
export default createButtonInputField;