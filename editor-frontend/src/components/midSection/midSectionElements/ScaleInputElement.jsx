import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createScaleInputField(id, element, p, holderDIV, focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded) {
  let isAnyRequiredElementEdited = false;
  let scaleField = document.createElement("div");
  scaleField.className = "scaleInput";
  scaleField.id = id;
  scaleField.style.width = "100%";
  scaleField.style.height = "100%";
  scaleField.style.backgroundColor = "transparent";
  scaleField.style.borderRadius = "0px";
  scaleField.style.outline = "0px";
  scaleField.style.overflow = "overlay";
  // iframeField.innerHTML = "iframe";
  scaleField.style.position = "absolute";

  if (element.data == "scale here") {
    scaleField.innerHTML = element.data;
  }
  if (
    element.data != "scale here" &&
    decoded.details?.action === "template"
  ) {
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.position = "relative";
    iframe.style.zIndex = "-1";
    iframe.src = element.scale_url;

    scaleField.addEventListener("resize", () => {
      iframe.style.width = scaleField.clientWidth + "px";
      iframe.style.height = scaleField.clientHeight + "px";
    });

    scaleField.append(iframe);
  }

  if (
    element.details === "Template scale" &&
    decoded.details?.action === "document"
  ) {
    const iframe = document.createElement("iframe");
    iframe.style.width = "90%";
    iframe.style.height = "90%";

    Axios.post(
      "https://100035.pythonanywhere.com/api/nps_create_instance",
      {
        scale_id: element.scaleId,
      }
    )
      .then((res) => {
        setIsLoading(false);
        // console.log(res, "scaleData");
        const lastInstance = res.data.response.instances.slice(-1)[0];
        const lastValue = Object.values(lastInstance)[0];
        iframe.src = lastValue;
        // console.log(lastValue);
      })
      .catch((err) => {
        setIsLoading(false);
        // console.log(err);
      });
    scaleField.addEventListener("resize", () => {
      iframe.style.width = scaleField.clientWidth + "px";
      iframe.style.height = scaleField.clientHeight + "px";
    });

    scaleField.append(iframe);
  }
  if (
    element.details === "Document instance" &&
    decoded.details?.action === "document"
  ) {
    const iframe = document.createElement("iframe");
    iframe.style.width = "90%";
    iframe.style.height = "90%";
    iframe.src = element.scale_url;

    scaleField.addEventListener("resize", () => {
      iframe.style.width = scaleField.clientWidth + "px";
      iframe.style.height = scaleField.clientHeight + "px";
    });

    scaleField.append(iframe);
  }

  const scaleIdHolder = document.createElement("div");

  scaleIdHolder.className = "scaleId_holder";
  scaleIdHolder.innerHTML = element.scaleId;
  scaleIdHolder.style.display = "none";

  const labelHolder = document.createElement("div");
  labelHolder.className = "label_holder";
  labelHolder.style.display = "none";

  scaleField.onclick = (e) => {
    // focuseddClassMaintain(e);
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

  document
    .getElementsByClassName("midSection_container")
  [p - 1] // ?.item(0)
    ?.append(holderDIV);
}
export default createScaleInputField;