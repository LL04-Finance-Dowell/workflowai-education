import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createCameraInputField(id, p, holderDIV, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, videoLinkHolder, imageLinkHolder, decoded) {
  let isAnyRequiredElementEdited = false;
  let cameraField = document.createElement("div");
  cameraField.className = "cameraInput";
  cameraField.id = id;
  cameraField.style.width = "100%";
  cameraField.style.height = "100%";
  cameraField.style.borderRadius = "0px";
  cameraField.style.outline = "0px";
  // cameraField.style.overflow = "overlay";
  cameraField.style.overflow = "hidden";


  if (decoded.details.action === "template") {
    let videoField = document.createElement("video");
    const imageLinkHolder1 = document.createElement("h1");
    const videoLinkHolder1 = document.createElement("h1");
    if (videoLinkHolder === "video_link") {
      videoField.className = "videoInput";
      videoField.style.width = "100%";
      videoField.style.height = "100%";
      videoField.autoplay = true;
      videoField.loop = true;
      videoField.style.display = "none";
      cameraField.append(videoField);

      videoLinkHolder1.className = "videoLinkHolder";
      videoLinkHolder1.textContent = videoLinkHolder;
      videoLinkHolder1.style.display = "none";
      cameraField.append(videoLinkHolder1);
    } else {
      videoField.className = "videoInput";
      videoField.src = videoLinkHolder;
      videoField.style.width = "100%";
      videoField.style.height = "100%";
      videoField.autoplay = true;
      videoField.muted = true;
      videoField.loop = true;
      cameraField.append(videoField);

      videoLinkHolder1.className = "videoLinkHolder";
      videoLinkHolder1.textContent = videoLinkHolder;
      videoLinkHolder1.style.display = "none";
      cameraField.append(videoLinkHolder1);
    }

    let imgHolder = document.createElement("img");
    if (imageLinkHolder === "image_link") {
      imgHolder.className = "imageHolder";
      imgHolder.style.height = "100%";
      imgHolder.style.width = "100%";
      imgHolder.alt = "";
      imgHolder.style.display = "none";
      cameraField.append(imgHolder);

      imageLinkHolder1.className = "imageLinkHolder";
      imageLinkHolder1.textContent = imageLinkHolder;
      imageLinkHolder1.style.display = "none";
      cameraField.append(imageLinkHolder1);
    } else {
      imgHolder.className = "imageHolder";
      imgHolder.style.height = "100%";
      imgHolder.style.width = "100%";
      imgHolder.alt = "";
      imgHolder.src = imageLinkHolder;
      cameraField.append(imgHolder);

      imageLinkHolder1.className = "imageLinkHolder";
      imageLinkHolder1.textContent = imageLinkHolder;
      imageLinkHolder1.style.display = "none";
      cameraField.append(imageLinkHolder1);
    }

    cameraField.addEventListener("resize", () => {
      videoField.style.width = cameraField.clientWidth + "px";
      videoField.style.height = cameraField.clientHeight + "px";
    });

    imgHolder.onclick = (e) => {
      e.stopPropagation();
      table_dropdown_focuseddClassMaintain(e);
      if (e.ctrlKey) {
        copyInput("camera2");
      }
      handleClicked("camera2");
      setSidebar(true);
      // console.log("The camera", cameraField);
    };
  } else {
    let videoField = document.createElement("video");
    const videoLinkHolder1 = document.createElement("h1");
    if (videoLinkHolder === "video_link" || videoLinkHolder === "") {
      videoField.className = "videoInput";
      videoField.src = videoLinkHolder;
      videoField.style.width = "100%";
      videoField.style.height = "100%";
      videoField.muted = true;
      videoField.autoplay = true;
      videoField.loop = true;
      videoField.style.display = "none";
      cameraField.append(videoField);

      let cameraImageInput = document.createElement("canvas");
      cameraImageInput.className = "cameraImageInput";
      cameraImageInput.style.display = "none";
      cameraField.append(cameraImageInput);

      videoLinkHolder1.className = "videoLinkHolder";
      videoLinkHolder1.textContent = "";
      videoLinkHolder1.style.display = "none";
      cameraField.append(videoLinkHolder1);
    } else {
      videoField.className = "videoInput";
      videoField.src = videoLinkHolder;
      videoField.style.width = "100%";
      videoField.style.height = "100%";
      videoField.autoplay = true;
      videoField.loop = true;
      videoField.controls = true
      cameraField.append(videoField);

      let cameraImageInput = document.createElement("canvas");
      cameraImageInput.className = "cameraImageInput";
      cameraImageInput.style.display = "none";
      cameraField.append(cameraImageInput);

      videoLinkHolder1.className = "videoLinkHolder";
      videoLinkHolder1.textContent = "";
      videoLinkHolder1.style.display = "none";
      cameraField.append(videoLinkHolder1);
    }

    let imgHolder = document.createElement("img");
    const imageLinkHolder1 = document.createElement("h1");

    if (imageLinkHolder === "image_link" || imageLinkHolder === "") {
      imgHolder.className = "imageHolder";
      imgHolder.style.height = "100%";
      imgHolder.style.width = "100%";
      imgHolder.alt = "";
      imgHolder.style.display = "none";
      cameraField.append(imgHolder);

      imageLinkHolder1.className = "imageLinkHolder";
      imageLinkHolder1.textContent = imageLinkHolder;
      imageLinkHolder1.style.display = "none";
      cameraField.append(imageLinkHolder1);
    } else {
      imgHolder.className = "imageHolder";
      imgHolder.style.height = "100%";
      imgHolder.style.width = "100%";
      imgHolder.src = imageLinkHolder;
      imgHolder.alt = "";
      cameraField.append(imgHolder);

      imageLinkHolder1.className = "imageLinkHolder";
      imageLinkHolder1.textContent = imageLinkHolder;
      imageLinkHolder1.style.display = "none";
      cameraField.append(imageLinkHolder1);
    }

    imgHolder.onclick = (e) => {
      e.stopPropagation();
      table_dropdown_focuseddClassMaintain(e);
      if (e.ctrlKey) {
        copyInput("camera2");
      }
      handleClicked("camera2");
      setSidebar(true);
      // console.log("The camera", cameraField);
    };
  }

  cameraField.onclick = (e) => {
    e.stopPropagation();
    table_dropdown_focuseddClassMaintain(e);
    if (e.ctrlKey) {
      copyInput("camera2");
    }
    handleClicked("camera2");
    setSidebar(true);
  };

  holderDIV.append(cameraField);

  document
    .getElementsByClassName("midSection_container")
  [p - 1] // ?.item(0)
    ?.append(holderDIV);
}
export default createCameraInputField;