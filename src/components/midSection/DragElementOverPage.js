import { renderPreview } from "./MidSection";

export const dragElementOverPage = (event, resizing, mode) => {
  let holder;

  if (!resizing) {
    let initX = event.screenX;
    let initY = event.screenY;
    var counterCheck = true;
    var tempTarget = event.target;
    var hitTarget = "";
    while (counterCheck) {
      if (tempTarget.classList.contains("holderDIV")) {
        hitTarget = tempTarget;
        counterCheck = false;
      } else if (tempTarget.classList.contains("textInput")) {
        hitTarget = null;
        counterCheck = false;
      }
      tempTarget = tempTarget?.parentNode;
    }

    holder = hitTarget;
    const holderPos = (function () {
      const holderPos = {
        top: parseInt(holder?.style?.top?.slice(0, -2)),
        left: parseInt(holder?.style?.left?.slice(0, -2)),
      };
      return Object.seal(holderPos);
    })();

    if (holder && holderPos) {
      let holderParentHolder = "";
      let holderParentHolderRect = "";
      let hodlerRect = "";
      if (holder?.parentElement.classList.contains("containerInput")) {
        holderParentHolder = holder?.parentElement?.parentElement;
      }
      if (holderParentHolder) {
        holderParentHolderRect = holderParentHolder.getBoundingClientRect();
      }
      hodlerRect = holder?.getBoundingClientRect();

      window.addEventListener("mousemove", moveObject);
      function moveObject(ev) {
        ev.preventDefault();
        const el = document.getElementById("midSection_container");
        const midsectionRect = el.getBoundingClientRect();
        console.log("event screenx", ev.screenX);
        console.log("event screeny", ev.screenY);
        console.log("midsect left", midsectionRect.left);
        console.log("midsect right", midsectionRect.right);
        if (!hodlerRect) return;
        const elemtnMeasureX =
          ev.screenX + holderPos.left + hodlerRect.width - initX;
        const elmentMeasureY =
          ev.screenY + holderPos.top + hodlerRect.height - initY;

        if (holder?.parentElement.classList.contains("containerInput")) {
          if (
            holderParentHolderRect.width > elemtnMeasureX + 5 &&
            ev.screenX + holderPos.left - initX > 0 &&
            holderParentHolderRect.height > elmentMeasureY + 5 &&
            ev.screenY + holderPos.top - initY > 0
          ) {
            const diffX = ev.screenX - initX;
            const diffY = ev.screenY - initY;
            holder.style.top = holderPos.top + diffY + "px";
            holder.style.left = holderPos.left + diffX + "px";
          } else {
            holder.style.top = holderPos.top + "px";
            holder.style.left = holderPos.left + "px";
          }
        } else {
          if (
            midsectionRect.width > elemtnMeasureX + 5 &&
            ev.screenX + holderPos.left - initX > 0 &&
            midsectionRect.height > elmentMeasureY + 5 &&
            ev.screenY + holderPos.top - initY > 0
          ) {
            const diffX = ev.screenX - initX;
            const diffY = ev.screenY - initY;
            holder.style.top = holderPos.top + diffY + "px";
            holder.style.left = holderPos.left + diffX + "px";
          } else {
            holder.style.top = holderPos.top + "px";
            holder.style.left = holderPos.left + "px";
          }
        }
        const previewCanvas =document.querySelector('.preview-canvas');
        if (previewCanvas) {
          const mainSection = document.querySelector('.editSec_midSec');
          if (mainSection) renderPreview(mainSection);
        };
      }

      window.addEventListener("mouseup", stopMove);
      function stopMove(ev) {
        window.removeEventListener("mousemove", moveObject);
        window.removeEventListener("mouseup", stopMove);
      }
    }
  }
};
