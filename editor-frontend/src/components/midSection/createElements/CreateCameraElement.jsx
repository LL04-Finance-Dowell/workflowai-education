import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createCameraInputElement(holderDIV, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain) {
    let cameraField = document.createElement("div");
    cameraField.className = "cameraInput";
    cameraField.style.width = "100%";
    cameraField.style.height = "100%";
    cameraField.style.borderRadius = "0px";
    cameraField.style.outline = "0px";
    // cameraField.style.overflow = "overlay";
    cameraField.style.overflow = "hidden";

    const camera = document.getElementsByClassName("cameraInput");
    if (camera.length) {
      const h = camera.length;
      cameraField.id = `cam1${h + 1}`;
    } else {
      cameraField.id = "cam1";
    }

    let videoField = document.createElement("video");
    videoField.className = "videoInput";
    videoField.style.width = "100%";
    videoField.style.height = "100%";
    videoField.autoplay = true;
    videoField.loop = true;
    cameraField.append(videoField);

    let cameraImageInput = document.createElement("canvas");
    cameraImageInput.className = "cameraImageInput";
    cameraImageInput.style.display = "none";
    cameraField.append(cameraImageInput);

    const imgHolder = document.createElement("img");
    imgHolder.className = "imageHolder";
    imgHolder.alt = "";
    imgHolder.style.display = "none";
    cameraField.append(imgHolder);

    const imageLinkHolder = document.createElement("h1");
    imageLinkHolder.className = "imageLinkHolder";
    imageLinkHolder.textContent = "image_link";
    imageLinkHolder.style.display = "none";
    cameraField.append(imageLinkHolder);

    const videoLinkHolder = document.createElement("h1");
    videoLinkHolder.className = "videoLinkHolder";
    videoLinkHolder.textContent = "video_link";
    videoLinkHolder.style.display = "none";
    cameraField.append(videoLinkHolder);

    cameraField.addEventListener("resize", () => {
      videoField.style.width = cameraField.clientWidth + "px";
      videoField.style.height = cameraField.clientHeight + "px";
    });

    function openCam() {
      let All_mediaDevices = navigator.mediaDevices;
      if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
        alert("Media not supported.");
        return;
      }
      All_mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
        .then(function (vidStream) {
          var video = videoField;
          if ("srcObject" in video) {
            video.srcObject = vidStream;
          } else {
            video.src = window.URL.createObjectURL(vidStream);
          }
          video.onloadedmetadata = function (e) {
            video.play();
          };
        })
        .catch(function (e) {
          alert(e.name + ": " + e.message);
        });
    }

    openCam();

    cameraField.onclick = (e) => {
      e.stopPropagation();
      table_dropdown_focuseddClassMaintain(e);
      if (e.ctrlKey) {
        copyInput("camera2");
      }
      handleClicked("camera2");
      setSidebar(true);
    };

    cameraImageInput.onclick = (e) => {
      e.stopPropagation();
      table_dropdown_focuseddClassMaintain(e);
      if (e.ctrlKey) {
        copyInput("camera2");
      }
      handleClicked("camera2");
      setSidebar(true);
    };

    holderDIV.append(cameraField);
}
export default createCameraInputElement;