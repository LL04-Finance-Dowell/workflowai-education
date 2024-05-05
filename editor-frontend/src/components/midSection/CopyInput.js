import { useStateContext } from "../../contexts/contextProvider";
import { dragElementOverPage } from "./DragElementOverPage";
import { getResizer } from "./GetResizerElement";

const copyInput = (clickHandler) => {

  const { setSidebar, handleClicked, focuseddClassMaintain } =
    useStateContext();

  const element = document.querySelector(".focussedd");

  let counter = 1;
  const copyEle = element.cloneNode(true);
  const rect = element.getBoundingClientRect();

  const copyEleTop =
    parseInt(copyEle.style.top.slice(0, -2)) +
    parseInt(rect.height) +
    20 +
    "px";

  copyEle.classList.remove("focussedd");
  copyEle.firstChild.classList.remove("focussed");

  copyEle.onfocus = () => {
    copyEle.style.border = "1px solid rgb(255 191 0)";
  };
  copyEle.onblur = () => {
    copyEle.style.border = "3px dotted gray";
  };
  if (copyEle) {
    copyEle.style.top = copyEleTop;
    copyEle.style.border = "3px dotted gray";
    copyEle.classList.remove("resizeBtn");

    copyEle.onmousedown = copyEle.addEventListener(
      "mousedown",
      (event) => {
        dragElementOverPage(event);
      },
      false
    );

    // trying to remove resize btn

    const resizeTags = copyEle.getElementsByClassName("resizeBtn");
    while (resizeTags.length > 0) {
      // console.log("resizeTags", resizeTags[0]);
      resizeTags[0].remove();
    }

    const resizerTL = getResizer("top", "left", decoded);
    const resizerTR = getResizer("top", "right", decoded);
    const resizerBL = getResizer("bottom", "left", decoded);
    const resizerBR = getResizer("bottom", "right", decoded);

    copyEle.addEventListener("focus", function (e) {
      copyEle.style.border = "2px solid orange";
      copyEle.append(resizerTL, resizerTR, resizerBL, resizerBR);
    });
    copyEle.addEventListener("focusout", function (e) {
      copyEle.classList.remove("zIndex-two");
      copyEle.style.border = "3px dotted gray";

      resizerTL.remove();
      resizerTR.remove();
      resizerBL.remove();
      resizerBR.remove();
    });
    copyEle.addEventListener("click", (e) => {
      e.stopPropagation();
      focuseddClassMaintain(e);
      // console.log("find classlist", e.target.classList[0]);
      if (
        e.target?.parentElement?.parentElement.classList.contains(
          "containerInput"
        )
      ) {
        let type = "";
        const containerClassName = e.target.classList[0];
        switch (containerClassName) {
          case "dateInput":
            type = "calendar2";
            break;
          case "textInput":
            type = "align2";
            break;
          case "imageInput":
            type = "image2";
            break;
          case "signInput":
            type = "signs2";
            break;
          case "iframeInput":
            type = "iframe2";
            break;
          case "scaleInput":
            type = "scale2";
            break;
          case "buttonInput":
            type = "button2";
            break;
          case "dropdownInput":
            type = "dropdown2";
            break;
          case "emailButton":
            type = "email2";
            break;
          default:
            type = "";
        }
        handleClicked(type, "container2");
        // console.log("inside if", type);
      } else {
        handleClicked(clickHandler);
      }
      setSidebar(true);
    });
  }

  let midSec = null;
  if (!midSec) {
    let targetParent = element;
    while (1) {
      if (
        targetParent.classList.contains("containerInput") ||
        targetParent.classList.contains("midSection_container")
      ) {
        targetParent = targetParent;
        break;
      } else {
        targetParent = targetParent.parentElement;
        midSec = targetParent;
      }
    }
  }

  copyEle.id += counter;
  if (
    parseInt(copyEle.style.top.slice(0, -2)) +
    parseInt(rect.height) +
    parseInt(rect.height) +
    20 <
    1122
  ) {
    midSec.appendChild(copyEle);
  }
  copyEle.onclick = (clickHandler2) => {
    if (clickHandler2.ctrlKey) {
      copyInput(clickHandler);
    }
  };
};

export default copyInput;
