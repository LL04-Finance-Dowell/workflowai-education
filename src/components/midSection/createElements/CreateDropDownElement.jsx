import React, { useState } from "react";
import copyInput from "../CopyInput";
import { BiText } from "react-icons/bi";

// Regular JavaScript function to create a text input field
function createDropDownInputElement(
  holderDIV,
  handleClicked,
  setSidebar,
  table_dropdown_focuseddClassMaintain,
  setRightSideDropDown,
  getOffset,
  copy_data = false
) {
  let dropdownField = document.createElement("div");
  dropdownField.className = "dropdownInput";
  dropdownField.style.width = "100%";
  dropdownField.style.height = "100%";
  dropdownField.style.backgroundColor = "#0000";
  dropdownField.style.borderRadius = "0px";
  dropdownField.style.outline = "0px";
  dropdownField.style.overflow = "overlay";

  dropdownField.style.position = "absolute";

  const dropD = document.getElementsByClassName("dropdownInput");
  if (dropD.length) {
    const d = dropD.length;
    dropdownField.id = `dd${d + 1}`;
  } else {
    dropdownField.id = "dd1";
  }

  // <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>

  // <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewbox="0 0 24 24" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path></svg>


  const selectElement = document.createElement("select");
  selectElement.className = "select-element";
  selectElement.style.width = "500";
  selectElement.style.height = "auto";
  // otion design updated code
  var opt = document.createElement("option");
  opt.setAttribute("selected", "selected")
  opt.setAttribute("disabled", true)

  // to do dropdown img need to added
  const svg = document.createElement("svg")
  svg.setAttribute("stroke", "currentColor")
  svg.setAttribute("fill", "currentColor")
  svg.setAttribute("stroke-width", "0")
  svg.setAttribute("viewBox", "0 0 24 24")
  svg.setAttribute("height", "1em")
  svg.setAttribute("width", "1em")
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  const path = document.createElement("path")
  path.setAttribute("d", "M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z")
  svg.append(path)
  let img = document.createElement('img');
  img.src =
    'https://media.geeksforgeeks.org/wp-content/uploads/20190529122828/bs21.png';

  // svg.setAttributeNS(stroke="currentColor", fill="currentColor", stroke-width="0", viewBox="0 0 24 24", height="1em", width="1em", xmlns="http://www.w3.org/2000/svg")
  // const biSolidDArrow = <BiText/>


  // console.log("BiSolidDownArrow", biSolidDArrow);
  // to do dropdown img need to added

  opt.value = "default";
  opt.innerHTML = "Select List Here";
  // opt.append(svg)
  selectElement.append(opt);
  // selectElement.append(<BiText/>);

  selectElement.onclick = () => {
    selectElement.parentElement.click();
  };

  // dropdownField.onchange = (event) => {
  //   event.preventDefault();
  //   setPostData({
  //     ...postData,
  //     dropdownField: {
  //       value: event.target.value,
  //       xcoordinate: getOffset(holderDIV).left,
  //       ycoordinate: getOffset(holderDIV).top,
  //     },
  //   });
  // };

  if (dropdownField) {
    const dropdownField = {
      dropdownField: {
        value: event.target.value,
        xcoordinate: getOffset(holderDIV).left,
        ycoordinate: getOffset(holderDIV).top,
      },
    };
  }

  dropdownField.onclick = (e) => {
    e.stopPropagation();
    // focuseddClassMaintain(e);
    table_dropdown_focuseddClassMaintain(e);
    // dropdownField.classList.add("focussed");
    if (e.ctrlKey) {
      copyInput("dropdown2");
    }
    handleClicked("dropdown2", "container2");
    setRightSideDropDown(false);
    setSidebar(true);
  };

  holderDIV.append(svg);

  if (copy_data) {
    dropdownField.innerHTML = copy_data;
  } else {
    const para = document.createElement("p");
    para.innerHTML = " Dropdown Name";
    para.className = "dropdownName";
    para.onclick = () => {
      para.parentElement.click();
    };
    dropdownField.append(para)
    dropdownField.append(selectElement);
  }

  holderDIV.append(dropdownField);
  return holderDIV;
}
export default createDropDownInputElement;
