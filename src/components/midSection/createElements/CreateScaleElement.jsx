import React, { useState } from 'react';
import copyInput from '../CopyInput';
import Axios from 'axios';

// Regular JavaScript function to create a text input field
function createScaleInputElement(holderDIV, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, setScaleData, title) {
  let scaleField = document.createElement("div");
  scaleField.className = "scaleInput";
  scaleField.style.width = "100%";
  scaleField.style.height = "100%";
  scaleField.style.backgroundColor = "transparent";
  scaleField.style.borderRadius = "0px";
  scaleField.style.outline = "0px";
  scaleField.style.overflow = "overlay";
  // scaleField.innerHTML = 'iframe';
  scaleField.style.position = "absolute";
  // scaleField.innerText = "scale here";

  const scales = document.getElementsByClassName("scaleInput");
  if (scales.length) {
    const s = scales.length;
    scaleField.id = `scl${s + 1}`;
  } else {
    scaleField.id = "scl1";
  }

  let scale = document.createElement("iframe");
  scale.style.width = "100%";
  scale.style.height = "100%";
  scale.style.position = "relative";
  scale.style.zIndex = "-1";

  const scaleIdHolder = document.createElement("div");
  scaleIdHolder.className = "scaleId_holder";
  scaleIdHolder.style.display = "none";

  const labelHolder = document.createElement("div");
  labelHolder.className = "label_holder";
  labelHolder.style.display = "none";

  scaleField.addEventListener("resize", () => {
    scale.style.width = scaleField.clientWidth + "px";
    scale.style.height = scaleField.clientHeight + "px";
  });

  scaleField.append(scale);
  Axios.post(
    "https://100035.pythonanywhere.com/api/nps_settings_create/",
    {
      username: "nake",
      orientation: "horizontal",
      scalecolor: "#8f1e1e",
      roundcolor: "#938585",
      fontcolor: "#000000",
      fomat: "numbers",
      time: "00",
      name: `${title}_scale`,
      left: "good",
      right: "best",
      center: "neutral",
    }
  )
    .then((res) => {
      setIsLoading(false);
      // console.log(res.data, "scaleData");
      setScaleData(res.data);
      const success = res.data.success;
      var successObj = JSON.parse(success);
      const id = successObj.inserted_id;
      // console.log(res.scale_urls, "stateScale");
      if (id.length) {
        // console.log(id, "id");
        // setScaleId(id);
        scaleIdHolder.innerHTML = id;
      }
      scale.src = res.data.scale_urls;
    })
    .catch((err) => {
      setIsLoading(false);
      // console.log(err);
    });

  scaleField.onclick = (e) => {
    e.stopPropagation();
    table_dropdown_focuseddClassMaintain(e);
    if (e.ctrlKey) {
      copyInput("scale2");
    }
    handleClicked("scale2");
    setSidebar(true);
  };

  holderDIV.append(scaleField);
  holderDIV.append(scaleIdHolder);
  holderDIV.append(labelHolder);

  return holderDIV;
}
export default createScaleInputElement;