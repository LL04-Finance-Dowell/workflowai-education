import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createGenBtnEl(holderDIV, focuseddClassMaintain, handleClicked, setSidebar) {
 let buttonField = document.createElement("button");
 buttonField.className = "gen_btn";
 buttonField.style.width = "100%";
 buttonField.style.height = "100%";
 buttonField.style.backgroundColor = "#0000";
 buttonField.style.borderRadius = "0px";
 buttonField.style.outline = "0px";
 buttonField.style.overflow = "overlay";
 buttonField.style.position = "absolute";
 buttonField.textContent = "Choose button type";

 // * This adds a unique id for every gen btn added to the mid section
 const addedGenBtns = document.getElementsByClassName("gen_btn");
 if (addedGenBtns.length) {
  const d = addedGenBtns.length;
  buttonField.id = `gbt${d + 1}`;
 } else {
  buttonField.id = "gbt1";
 }

 buttonField.onclick = (e) => {
  e.stopPropagation();
  focuseddClassMaintain(e);
  if (e.ctrlKey) {
   copyInput("button2");
  }
  handleClicked("genBtn2", "container2");
  setSidebar(true);
 };

 // const linkHolder = document.createElement("div");
 // linkHolder.className = "link_holder";
 // linkHolder.style.display = "none";

 // const purposeHolder = document.createElement("div");
 // purposeHolder.className = "purpose_holder";
 // purposeHolder.style.display = "none";

 holderDIV.append(buttonField);
 // holderDIV.append(linkHolder);
 // holderDIV.append(purposeHolder);
 return holderDIV
}
export default createGenBtnEl;