import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createDropDownInputField(id, element, p, holderDIV, focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded, setRightSideDropDown, setDropdownName) {
    let isAnyRequiredElementEdited = false;
    
    let dropdownField = document.createElement("div");
    dropdownField.className = "dropdownInput";
    dropdownField.id = id;
    dropdownField.style.width = "100%";
    dropdownField.style.height = "100%";
    dropdownField.style.backgroundColor = "#0000";
    dropdownField.style.borderRadius = "0px";
    dropdownField.style.outline = "0px";
    dropdownField.style.overflow = "overlay";
    // dropdownField.innerHTML = `<select><option>${postData.dropdownField.value}</option></select>`;
    dropdownField.style.position = "absolute";

    const selectElement = document.createElement("select");
    selectElement.className = "select-element";
    selectElement.innerHTML = element.data2;
    
    dropdownField.onclick = (e) => {
        // focuseddClassMaintain(e);
        table_dropdown_focuseddClassMaintain(e);
        if (e.ctrlKey) {
            copyInput("dropdown2");
        }
        handleClicked("dropdown2");
        setRightSideDropDown(false);
        setSidebar(true);
    };

    // selectElement.innerHTML = element.data2;

    const para = document.createElement("p");
    para.innerHTML = " Dropdown Name";
    para.className = "dropdownName";
    para.innerText = element.data1;

    dropdownField.append(para);
    dropdownField.append(selectElement);
    setDropdownName(element.data1);

    // paragraphField.innerHTML = `${data.normal.data[0][0].paragraph}`;

    holderDIV.append(dropdownField);

    // holderDIV.append(paragraphField);

    document
        .getElementsByClassName("midSection_container")
    [p - 1] // ?.item(0)
        ?.append(holderDIV);
}
export default createDropDownInputField;