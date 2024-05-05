import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createPaymentInputField(id, element, p, holderDIV, focuseddClassMaintain, handleClicked, setSidebar, finalizeButton, rejectButton, decoded, document_map_required) {
    let paymentField = document.createElement("button");
    paymentField.className = "paymentInput";
    paymentField.id = id;
    paymentField.style.width = "100%";
    paymentField.style.height = "100%";
    paymentField.style.backgroundColor = "#0000";
    paymentField.style.borderRadius = "0px";
    paymentField.style.outline = "0px";
    paymentField.style.overflow = "overlay";
    paymentField.style.position = "absolute";
    paymentField.style.border = "none";
    paymentField.textContent = element.data;

    if (decoded.details.action === "template") {
        paymentField.onclick = (e) => {
            focuseddClassMaintain(e);
            if (e.ctrlKey) {
                copyInput("payment2");
            }
            handleClicked("payment2");
            setSidebar(true);
        };
    }

    if (decoded.details.action === "document") {
        paymentField.onclick = (e) => {
            focuseddClassMaintain(e);
            if (e.ctrlKey) {
                copyInput("payment2");
            }
            handleClicked("payment2", "table2");
            setSidebar(true);
        };
    }

    paymentField.onmouseover = (e) => {
        // if (buttonField?.parentElement?.classList.contains("holderDIV")) {
        //   buttonField?.parentElement?.classList.add("element_updated");
        // }

        const required_map_document = document_map_required?.filter(
            (item) => element.id == item.content
        );
        if (
            paymentField.parentElement.classList.contains("holderDIV") &&
            required_map_document?.length > 0
        ) {
            paymentField.parentElement.classList.add("element_updated");
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
        paymentField.onclick = (e) => {
            window.open(element.raw_data, "_blank");
        };
    }

    if (finalizeButton) {
        if (isAnyRequiredElementEdited) {
            finalizeButton?.click();
        } else {
            finalizeButton.disabled = true;
        }
    }

    // if (
    //   decoded.details.action === "document" &&
    //   element.purpose == "finalize"
    // ) {
    //   buttonField.onclick = (e) => {
    //     finalizeButton?.click();
    //   };
    // }
    if (
        decoded.details.action === "document" &&
        element.purpose == "reject"
    ) {
        paymentField.onclick = (e) => {
            rejectButton?.click();
        };
    }

    const linkHolder = document.createElement("div");
    // linkHolder.className = "link_holder";
    linkHolder.className = "stripe_key";
    linkHolder.innerHTML = element.raw_data;
    linkHolder.style.display = "none";

    const purposeHolder = document.createElement("div");
    // purposeHolder.className = "purpose_holder";
    purposeHolder.className = "paypal_id";
    purposeHolder.innerHTML = element.purpose;
    purposeHolder.style.display = "none";

    holderDIV.append(paymentField);
    holderDIV.append(linkHolder);
    holderDIV.append(purposeHolder);
    // console.log(element);
    document
        .getElementsByClassName("midSection_container")
    [p - 1] // ?.item(0)
        ?.append(holderDIV);
}
export default createPaymentInputField;