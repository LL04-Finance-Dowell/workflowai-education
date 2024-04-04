import React, { useState, useEffect } from "react";
import copyInput from "../CopyInput";
import { renderPreview } from "../MidSection";
// import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createTextInputField(
  id,
  element,
  document_map_required,
  p,
  holderDIV,
  focuseddClassMaintain,
  handleClicked,
  setSidebar
) {
  let isAnyRequiredElementEdited = false;
  const inputField = document.createElement("div");
  inputField.setAttribute("contenteditable", true);
  inputField.className = "textInput";
  inputField.id = id;
  inputField.style.width = "100%";
  inputField.style.height = "100%";
  inputField.style.resize = "none";
  inputField.style.zIndex = 2;
  inputField.style.backgroundColor = "#0000";
  inputField.style.borderRadius = "0px";
  inputField.style.outline = "0px";
  inputField.style.overflow = "overlay";
  inputField.style.position = "relative";
  inputField.style.cursor = "text";
  holderDIV.style.border = 'none'
  inputField.addEventListener('input', function () {
    const previewCanvas = document.querySelector('.preview-canvas');
    if (previewCanvas) {
      const mainSection = document.querySelector('.editSec_midSec');
      if (mainSection) renderPreview(mainSection);
    };
  });
  if (window.innerWidth < 993) {
    inputField.classList.add("text_eabled_pointer_event");
  }

  inputField.oninput = (e) => {
    const required_map_document = document_map_required?.filter(
      (item) => element.id == item.content
    );

    if (
      inputField?.parentElement.classList.contains("holderDIV") &&
      required_map_document?.length > 0
    ) {
      inputField?.parentElement.classList.add("element_updated");
    }
    if (element.required) {
      isAnyRequiredElementEdited = true;
    }
  };

  inputField.onclick = (e) => {
    focuseddClassMaintain(e);
    holderDIV.style.border = '3px dotted gray'
    if (e.ctrlKey) {
      copyInput("align2");
    }
    handleClicked("align2");
    setSidebar(true);
  };
  inputField.onfocusout = () => {
    alert('focus out')
    holderDIV.style.border = 'none'
  }

  const text = `${element.raw_data}`;
  inputField.innerHTML = text;

  holderDIV.appendChild(inputField);

  const midSectionContainers = document.getElementsByClassName(
    "midSection_container"
  );
  if (midSectionContainers[p - 1]) {
    midSectionContainers[p - 1].appendChild(holderDIV);
  }
}
export default createTextInputField;
