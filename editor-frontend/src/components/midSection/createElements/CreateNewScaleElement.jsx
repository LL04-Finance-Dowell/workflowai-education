import React, { useState } from "react";
import copyInput from "../CopyInput";
import Axios from "axios";
import { dragElementOverPage } from "../DragElementOverPage";
import { getResizer } from "../GetResizerElement";

// Regular JavaScript function to create a text input field
function createNewScaleInputElement(
  holderDIV,
  focuseddClassMaintain,
  handleClicked,
  setSidebar,
  table_dropdown_focuseddClassMaintain,
  decoded,
  setIsLoading,
) {
  let scaleField = document.createElement("div");
  scaleField.className = "newScaleInput";
  scaleField.style.width = "100%";
  scaleField.style.height = "100%";
  scaleField.style.backgroundColor = "#fff";
  scaleField.style.borderRadius = "0px";
  scaleField.style.outline = "0px";
  scaleField.style.overflow = "overlay";
  scaleField.style.position = "absolute";
  // scaleField.innerText = "scale here";

  const scaleTypeHolder = document.createElement("h6");
  scaleTypeHolder.className = "scaleTypeHolder";
  scaleTypeHolder.textContent = "";
  scaleTypeHolder.style.display = "none";
  scaleField.appendChild(scaleTypeHolder);

  const tempText = document.createElement("div");
  tempText.className = "tempText";
  tempText.textContent = "create your scale";
  tempText.style.fontWeight = "700";
  tempText.style.width = "100%";
  tempText.style.textAlign = "center";
  scaleField.appendChild(tempText);

  const scaleHold = document.createElement("div");
  scaleHold.className = "scool_input";
  scaleHold.style.color = "white";
  scaleHold.style.width = "100%";
  scaleHold.style.height = "90%";
  scaleHold.style.padding = "10px";
  scaleHold.style.display = "none";

  scaleField.append(scaleHold);

  const scaleText = document.createElement("div");
  scaleText.className = "scale_text";
  scaleText.textContent = "Untitled-file_scale";
  scaleText.style.marginBottom = "10px";
  scaleText.style.width = "100%";
  scaleText.style.display = "flex";
  scaleText.style.alignItems = "center";
  scaleText.style.justifyContent = "center";
  scaleText.style.height = "10%";
  scaleText.style.backgroundColor = "transparent";
  scaleText.style.borderRadius = "0px";
  scaleHold.append(scaleText);

  const otherComponent = document.createElement("h6");
  otherComponent.className = "otherComponent";
  otherComponent.style.display = "none";
  otherComponent.textContent = ""
  scaleHold.appendChild(otherComponent);

  const labelHold = document.createElement("div");
  labelHold.className = "label_hold";
  labelHold.style.width = "100%";
  labelHold.style.height = "85%";
  labelHold.style.border = "1px solid black";
  labelHold.style.backgroundColor = "white";
  // labelHold.style.display = "none";
  scaleHold.appendChild(labelHold);
  labelHold.style.display = "flex";
  // labelHold.style.flexWrap = "wrap";
  labelHold.style.justifyContent = "space-between";
  labelHold.style.alignItems = "center";
  // labelHold.style.margin = "0px";

  for (let i = 0; i < 11; i++) {
    const circle = document.createElement("div");
    circle.className = "circle_label";
    circle.style.width = "35%";
    circle.style.height = "35%";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "white";
    circle.style.top = "30%";
    circle.style.left = "30%";
    circle.style.display = "flex";
    circle.style.justifyContent = "center";
    circle.style.alignItems = "center";
    circle.style.marginLeft = "2px";

    circle.textContent = i;

    labelHold.append(circle);
  }

  const childDiv = document.createElement("div");
  childDiv.id = "child";
  childDiv.style.display = "flex";
  childDiv.style.justifyContent = "space-between";
  // childDiv.style.margin = "0px";

  const element1 = document.createElement("h6");
  element1.className = "left_child";
  element1.style.marginLeft = "0px";
  element1.textContent = "";
  childDiv.appendChild(element1);

  const element2 = document.createElement("h6");
  element2.className = "neutral_child";
  element2.textContent = "";
  childDiv.appendChild(element2);

  const element3 = document.createElement("h6");
  element3.className = "right_child";
  element3.textContent = "";
  childDiv.appendChild(element3);

  const idHolder = document.createElement("h6");
  idHolder.className = "scaleId";
  idHolder.textContent = "scale Id";
  idHolder.style.display = "none";
  childDiv.appendChild(idHolder);
  // childDiv.appendChild( idHolder);

  // childDiv.appendChild(element3);
  scaleHold.append(childDiv);
  const scales = document.getElementsByClassName("newScaleInput");
  if (scales.length) {
    const s = scales.length;
    scaleField.id = `scl${s + 1}`;
  } else {
    scaleField.id = "scl1";
  }

  let scale = document.createElement("div");
  scale.style.width = "90%";
  scale.style.height = "0%";

  // console.log(Element);
  scaleField.addEventListener("resize", () => {
    scale.style.width = scaleField.clientWidth + "px";
    scale.style.height = scaleField.clientHeight + "px";
  });

  setIsLoading(false);

  const copyScales = () => {
    // if (typeOfOperation === "IMAGE_INPUT") {
    const element = document.querySelector(".focussedd");
    // // console.log(element);
    let counter = 1;
    const copyEle = element.cloneNode(true);
    const copyEleTop = parseInt(copyEle.style.top.slice(0, -2)) + 100 + "px";

    // parseInt(holder.style.top.slice(0, -2))
    copyEle.classList.remove("focussedd");
    copyEle.firstChild.classList.remove("focussed");
    // copyEle.classList.add("imageInput")
    // console.log(copyEleTop);
    copyEle.onfocus = () => {
      copyEle.style.border = "1px solid rgb(255 191 0)";
    };
    copyEle.onblur = () => {
      copyEle.style.border = "1px dotted black";
    };
    if (copyEle) {
      copyEle.style.top = copyEleTop;
      copyEle.style.border = "1px dotted black";

      copyEle.onmousedown = copyEle.addEventListener(
        "mousedown",
        (event) => {
          dragElementOverPage(event, resizing);
        },
        false
      );

      const resizerTL = getResizer("top", "left", decoded);
      const resizerTR = getResizer("top", "right", decoded);
      const resizerBL = getResizer("bottom", "left", decoded);
      const resizerBR = getResizer("bottom", "right", decoded);
      // parseInt(holder.style.top.slice(0, -2))

      copyEle.addEventListener("focus", function (e) {
        // holderDIV.classList.add("focussedd");
        copyEle.classList.add("zIndex-two");
        copyEle.style.border = "2px solid orange";
        // holderDIV.append(holderMenu);

        copyEle.append(resizerTL, resizerTR, resizerBL, resizerBR);
      });
      copyEle.addEventListener("click", (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        // imageField.classList.add("focussed");
        handleClicked("image2", "container2");
        // copyImage()
        // resizing = true;
        setSidebar(true);
      });
    }
    // // console.log(copyEle)
    copyEle.id += counter;
    midSec.appendChild(copyEle);
    // console.log("coping", copyEle);
    // }
  };

  scaleField.addEventListener("click", (event) => {
    if (event.ctrlKey) {
      // console.log("clicked it");
      copyScales();
      // setSidebar(true)
    } else {
      // console.log("Faild to copy");
    }
  });

  scaleField.onclick = (e) => {
    e.stopPropagation();
    table_dropdown_focuseddClassMaintain(e);
    handleClicked("newScale2");
    setSidebar(true);
    // console.log(scaleField.id);
  };

  holderDIV.append(scaleField);
  return holderDIV;
}
export default createNewScaleInputElement;
