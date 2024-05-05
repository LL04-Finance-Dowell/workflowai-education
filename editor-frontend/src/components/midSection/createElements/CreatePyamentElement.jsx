import React from 'react';
import copyInput from '../CopyInput';


function CreatePyamentElement(holderDIV, focuseddClassMaintain, handleClicked, setSidebar) {
    let paymentField = document.createElement("button");
    paymentField.className = "paymentInput";
    paymentField.style.width = "100%";
    paymentField.style.height = "100%";
    paymentField.style.backgroundColor = "#0000";
    paymentField.style.borderRadius = "0px";
    // paymentField.style.outline = "0px";
    paymentField.style.overflow = "overlay";
    paymentField.style.position = "absolute";
    paymentField.style.outline = "none";
    // paymentField.style.boxShadow="none"; 
    paymentField.style.border = "none"
    paymentField.textContent = "Pay";

    const paymentInput = document.getElementsByClassName("paymentInput");
    if (paymentInput.length) {
        const p = paymentInput.length;
        paymentField.id = `pay${p + 1}`;
    } else {
        paymentField.id = "pay1";
    }

    paymentField.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
            copyInput("payment2");
        }
        handleClicked("payment2", "container2");
        setSidebar(true);
    };

    const linkHolder = document.createElement("div");
    linkHolder.className = "stripe_key";
    linkHolder.style.display = "none";

    const purposeHolder = document.createElement("div");
    purposeHolder.className = "paypal_id";
    purposeHolder.style.display = "none";

    holderDIV.append(paymentField);
    holderDIV.append(linkHolder);
    holderDIV.append(purposeHolder);

    // * This loop is to trigger rightside bar to update to the recently selected btn type
    let x = true;
    while (x) {
        paymentField.click();
        x = false;
    }
};

export default CreatePyamentElement;