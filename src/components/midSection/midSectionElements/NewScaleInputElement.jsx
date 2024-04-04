import React, { useState } from "react";
import copyInput from "../CopyInput";
import Axios from "axios";

// Regular JavaScript function to create a text input field
function createNewScaleInputField(
  id,
  element,
  p,
  holderDIV,
  focuseddClassMaintain,
  handleClicked,
  setSidebar,
  table_dropdown_focuseddClassMaintain,
  decoded,
  token,
  document_map_required
) {
  let isAnyRequiredElementEdited = false;

  let scaleField = document.createElement("div");
  scaleField.className = "newScaleInput";
  scaleField.id = id;
  scaleField.style.width = "100%";
  scaleField.style.height = "100%";
  scaleField.style.backgroundColor = "#ffffff";
  scaleField.style.borderRadius = "0px";
  scaleField.style.outline = "0px";
  scaleField.style.overflow = "overlay";
  scaleField.style.position = "absolute";
  const scaleHold = document.createElement("div");
  scaleHold.className = "scool_input";
  scaleHold.style.fontFamily = element?.raw_data?.fontFamily;
  scaleHold.style.color = element?.raw_data?.fontColor;
  scaleHold.style.width = "100%";
  scaleHold.style.height = "96%";
  scaleHold.style.padding = "1px";
  const scaleText = document.createElement("div");
  scaleText.className = "scale_text";
  scaleText.textContent = element?.raw_data?.scaleText;
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
  otherComponent.textContent = element?.raw_data?.otherComponent;
  scaleHold.appendChild(otherComponent);

  const scaleTypeHolder = document.createElement("h6");
  scaleTypeHolder.className = "scaleTypeHolder";
  scaleTypeHolder.textContent = element?.raw_data?.scaleType;
  scaleTypeHolder.style.display = "none";
  scaleHold.appendChild(scaleTypeHolder);

  const stapelScaleArray = document.createElement("div");
  stapelScaleArray.className = "stapelScaleArray";
  stapelScaleArray.textContent = element?.raw_data?.stapelScaleArray;
  stapelScaleArray.style.display = "none";
  scaleHold.append(stapelScaleArray);

  const percentScaleArray = document.createElement("div");
  percentScaleArray.className = "percentScaleArray";
  percentScaleArray.textContent = element?.raw_data?.percentLabel;
  percentScaleArray.style.display = "none";
  scaleHold.append(percentScaleArray);

  const npsLiteTextArray = document.createElement("div");
  npsLiteTextArray.className = "nps_lite_text";
  npsLiteTextArray.textContent = element?.raw_data?.npsLiteTextArray;
  npsLiteTextArray.style.display = "none";
  scaleHold.append(npsLiteTextArray);

  const stapelOptionHolder = document.createElement("div");
  stapelOptionHolder.className = "stapelOptionHolder";
  stapelOptionHolder.textContent = element?.raw_data?.stapelOptionHolder;
  stapelOptionHolder.style.display = "none";
  scaleHold.append(stapelOptionHolder);

  const npsLiteOptionHolder = document.createElement("div");
  npsLiteOptionHolder.className = "nps_option_holder";
  npsLiteOptionHolder.textContent = element?.raw_data?.npsLiteOptionHolder;
  npsLiteOptionHolder.style.display = "none";
  scaleHold.append(npsLiteOptionHolder);

  const optionHolderLikert = document.createElement("div");
  optionHolderLikert.className = "likert_Option_Holder";
  optionHolderLikert.textContent = element?.raw_data?.likertOptionHolder || "";
  optionHolderLikert.style.display = "none";
  scaleHold.append(optionHolderLikert);
  scaleText.style.marginBottom = "10px";
  scaleText.style.height = "10%";

  const labelHold = document.createElement("div");
  labelHold.className = "label_hold";
  labelHold.style.width = "100%";
  labelHold.style.height = "95%";
  labelHold.style.border = "1px solid black";
  labelHold.style.backgroundColor = element?.raw_data?.scaleBgColor;
  scaleHold.appendChild(labelHold);
  labelHold.style.display = "flex";
  labelHold.style.justifyContent = "space-between";
  labelHold.style.alignItems = "center";

  const childDiv = document.createElement("div");
  const element1 = document.createElement("h6");
  const element2 = document.createElement("h6");
  const element3 = document.createElement("h6");
  if (scaleTypeHolder.textContent === "nps") {
    for (let i = 0; i < 11; i++) {
      const circle = document.createElement("div");
      circle.className = "circle_label";
      circle.style.width = "40px";
      circle.style.height = "24px";
      circle.style.borderRadius = "50%";
      circle.style.backgroundColor = element?.raw_data?.buttonColor;
      circle.style.top = "30%";
      circle.style.left = "30%";
      circle.style.display = "flex";
      circle.style.justifyContent = "center";
      circle.style.alignItems = "center";
      circle.style.marginLeft = "2px";

      labelHold.style.gap = "5px";
      labelHold.style.height = "100%";
      labelHold.style.justifyContent = "space-evenly";
      labelHold.style.position = "relative";
      scaleHold.style.height = "100%";
      scaleHold.style.padding = "";
      scaleText.style.display = "none";

      const orientation = element?.raw_data?.orentation;

      if (circle.textContent === "0" || i === 0) {
        circle.title = element?.raw_data?.left
      }
      else if (circle.textContent === "5" || i === 5) {
        circle.title = element?.raw_data?.center
      } else if (circle.textContent === "10" || i === 10) {
        circle.title = element?.raw_data?.right
      }

      circle.addEventListener("mouseleave", () => {
        if (circle.textContent === "0" || i === 0) {
          element1.style.display = "none";
        } else if (circle.textContent === "5" || i === 5) {
          element2.style.display = "none";
        } else if (circle.textContent === "10" || i === 10) {
          element3.style.display = "none";
        }
      });

      if (orientation === "nps_vertical") {
        const nps_vertical = document.createElement("h2");
        nps_vertical.className = "nps_vertical";
        nps_vertical.style.display = "none";
        nps_vertical.textContent = "nps_vertical";
        labelHold.appendChild(nps_vertical);

        element1.style.top = "35px";
        element1.style.bottom = "";
        element1.style.height = "fit-content";

        element2.style.top = "50%";
        element2.style.bottom = "";

        element2.style.height = "fit-content";

        element3.style.bottom = "5%";
        element3.style.left = "8%";
        element3.style.right = "";

        labelHold.style.height = "100%";
        labelHold.style.top = "50%";
        labelHold.style.left = "50%";
        labelHold.style.transform = "translate(-50%, -50%)";
        scaleHold.style.border = "none";
        scaleHold.style.textAlign = "center";
        labelHold.style.width = "100%";
        labelHold.style.position = "absolute";
        labelHold.style.flexDirection = "column";
        labelHold.style.alignItems = "center";
        labelHold.style.marginTop = "0";

        // buttonCircleM.style.marginTop = "2px";
      }
      const buttonImage = element?.raw_data?.buttonImages;
      if (buttonImage && Array.isArray(buttonImage) && buttonImage[i]) {
        let newImg = document.createElement("img");
        newImg.className = "images_label";
        newImg.src = buttonImage[i];
        // console.log(buttonImage[i]);
        circle.appendChild(newImg);
      }

      if (element?.raw_data?.buttonText) {
        const buttonText = element.raw_data.buttonText;
        if (Array.isArray(buttonText) && buttonText.length > 0) {
          circle.textContent = buttonText[i % buttonText.length];
          // console.log("EMOJIIIIIIIIIII");
        } else {
          // console.log("Empty buttonText array");
        }
      } else {
        // console.log("NUMBERRRRRRRRRRRRRR");
        circle.textContent = i;
      }
      labelHold.append(circle);
      // Get the token from the request header.
      // const token = request.headers.get("Authorization");

      // If the token is not present, return an error.
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (decoded.details.action === "document") {
        let isClicked = false;

        function setClickedCircleBackgroundColor(circle, bgColor, scaleID) {
          localStorage.setItem(
            `circleBgColor_${scaleID}_${circle.textContent}`,
            bgColor
          );
          localStorage.setItem(
            `lastClickedCircleID_${scaleID}`,
            circle.textContent,
            bgColor
          );
        }

        function getClickedCircleBackgroundColor(circle, scaleID) {
          const circleKey = `circleBgColor_${scaleID}_${circle.textContent}`;
          return localStorage.getItem(circleKey);
        }

        setTimeout(() => {
          let scales = document.querySelectorAll(".newScaleInput");
          // console.log(scales);
          scales.forEach((scale) => {
            const scaleID = scale?.querySelector(".scaleId").textContent;
            const circlesInScale = scale.querySelectorAll(".circle_label");
            const lastClickedCircleID = localStorage.getItem(
              `lastClickedCircleID_${scaleID}`
            );

            circlesInScale.forEach((circle) => {
              const storedBgColor = getClickedCircleBackgroundColor(
                circle,
                scaleID
              );

              if (storedBgColor) {
                if (circle.textContent === lastClickedCircleID) {
                  circle.style.backgroundColor = storedBgColor;
                } else {
                  circle.style.backgroundColor;
                }
              }
            });
          });
        }, 500);
        circle.addEventListener("click", function () {
          if (!isClicked) {
            let scale =
              circle.parentElement.parentElement.parentElement.parentElement;
            let holding = scale?.querySelector(".newScaleInput");
            const buttonCircle = scale
              ? scale.querySelectorAll(".circle_label")
              : [];

            function componentToHex(c) {
              var hex = c.toString(16);
              return hex.length == 1 ? "0" + hex : hex;
            }

            function rgbToHex(r, g, b) {
              return (
                "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
              );
            }

            function invert(rgb) {
              rgb = [].slice
                .call(arguments)
                .join(",")
                .replace(/rgb\(|\)|rgba\(|\)|\s/gi, "")
                .split(",");
              for (var i = 0; i < rgb.length; i++)
                rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
              return rgbToHex(rgb[0], rgb[1], rgb[2]);
            }

            const circleBgColor = circle.style.backgroundColor;

            circle.style.backgroundColor = invert(circleBgColor);

            for (let i = 0; i < buttonCircle.length; i++) {
              if (buttonCircle[i].textContent !== circle.textContent) {
                buttonCircle[i].style.backgroundColor = circleBgColor;
              }
            }

            let holdElem = scale?.querySelector(".holdElem");

            if (holdElem) {
              // If holdElem exists, update its text content
              holdElem.textContent = i;
            } else {
              // If holdElem doesn't exist, create a new one
              holdElem = document.createElement("div");
              holdElem.className = "holdElem";
              holdElem.style.display = "none";
              holdElem.textContent = i;
              holding?.appendChild(holdElem);
              console.log("This is holdEle", holdElem.textContent);
              // if (scaleField?.parentElement?.classList.contains("holderDIV")) {
              //   scaleField?.parentElement?.classList.add("element_updated");
              // }
              const required_map_document = document_map_required?.filter(
                (item) => element?.id == item?.content
              );
              if (
                scaleField?.parentElement?.classList.contains("holderDIV") &&
                required_map_document?.length > 0
              ) {
                scaleField?.parentElement?.classList.add("element_updated");
              }
            }

            const scaleID = scale?.querySelector(".scaleId")?.textContent;
            setClickedCircleBackgroundColor(
              circle,
              circle.style.backgroundColor,
              scaleID
            );

            localStorage.setItem(
              `lastClickedCircleID_${scaleID}`,
              circle.textContent
            );
          }
        });
      }
    }
  } else if (scaleTypeHolder.textContent === "snipte") {
    const stapelScale = stapelScaleArray.textContent.split(",");
    const selectedOption = stapelOptionHolder.textContent;
    const stapelOrientation = element?.raw_data?.stapelOrientation;
    // console.log("This is the stapel", stapelScale);
    // console.log("This is option", selectedOption);
    //clear scaleField values
    labelHold.style.display = "none";
    scaleHold.style.display = "none";
    scaleField.style.display = "flex";
    scaleField.style.backgroundColor = element?.raw_data?.scaleBgColor;
    scaleField.style.color = element?.raw_data?.fontColor;
    scaleField.style.fontFamily = element?.raw_data?.fontFamily;
    scaleField.style.flexDirection = "row";
    scaleField.style.alignItems = "center";
    scaleField.style.justifyContent = "center";

    const upperScaleLimit = document.createElement("h6");
    upperScaleLimit.className = "upper_scale_limit";
    upperScaleLimit.textContent = element?.raw_data?.stapelUpperLimit;
    upperScaleLimit.style.display = "none";
    scaleField.append(upperScaleLimit);

    const spaceUnit = document.createElement("h6");
    spaceUnit.className = "space_unit";
    spaceUnit.textContent = element?.raw_data?.spaceUnit;
    spaceUnit.style.display = "none";
    scaleField.append(spaceUnit);
    for (let i = 0; i < stapelScale.length; i++) {
      const circle = document.createElement("div");
      circle.className = "circle_label";
      circle.textContent = stapelScale[i];
      scaleField.appendChild(circle);
      circle.style.width = "35px";
      circle.style.height = "35px";
      circle.style.borderRadius = "50%";
      circle.style.display = "flex";
      circle.style.flexDirection = "column";
      circle.style.justifyContent = "center";
      circle.style.alignItems = "center";
      circle.style.margin = "0 2px 2px 0";
      circle.style.backgroundColor = element?.raw_data?.buttonColor;

      if (selectedOption === "emoji") {
        const buttonText = element.raw_data.buttonText;
        let emojiArr = buttonText[i % buttonText.length]
          .split(" ")[0]
          .split("");
        if (i === 0 || i === stapelScale.length - 1) {
          circle.textContent = `${emojiArr[0] + emojiArr[1]}`;
        } else {
          circle.textContent = buttonText[i % buttonText.length];
        }
        circle.style.fontSize = "1.4vw";
      }

      if (i === 0) {
        var left = document.createElement("span");
        left.className = "leftToolTip";
        left.innerHTML = element?.raw_data?.left;
        left.style.visibility = "hidden";
        left.style.position = "absolute";
        left.style.zIndex = "1";
        left.style.bottom =
          stapelOrientation === "stapel_vertical" ? " " : "3px";
        left.style.top = stapelOrientation === "stapel_vertical" ? "5%" : "";
        left.style.left = stapelOrientation === "stapel_vertical" ? "" : "5%";
        left.style.right = stapelOrientation === "stapel_vertical" ? "5%" : "";
        left.style.fontSize = "medium";
        left.style.writingMode =
          stapelOrientation === "stapel_vertical" ? "tb-rl" : "";
        left.style.backgroundColor = "#272828";
        left.style.color = "#EEEFEF";
        left.style.borderRadius = "3px";
        circle.append(left);
        circle.title = element?.raw_data?.left
      } else if (i === stapelScale.length - 1) {
        var right = document.createElement("span");
        right.className = "rightTooltip";
        right.innerHTML = element?.raw_data?.right;
        right.style.display = "none";
        right.style.position = "absolute";
        right.style.zIndex = "1";
        right.style.bottom = "3px";
        right.style.right = "5%";
        right.style.backgroundColor = "#272828";
        right.style.color = "#EEEFEF";
        right.style.fontSize = "medium";
        right.style.writingMode =
          stapelOrientation === "stapel_vertical" ? "tb-rl" : "";
        right.style.borderRadius = "3px";
        circle.append(right);
        circle.title = element?.raw_data?.right
      }

      if (stapelOrientation === "stapel_vertical") {
        const stapel_vertical = document.createElement("h2");
        stapel_vertical.className = "stapel_vertical";
        stapel_vertical.style.display = "none";
        stapel_vertical.textContent = "stapel_vertical";
        scaleField.appendChild(stapel_vertical);
        scaleField.style.display = "flex";
        scaleField.style.flexDirection = "column";
        scaleField.style.alignItems = "center";
        scaleField.style.justifyContent = "center";
      }

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (decoded.details.action === "document") {
        const shouldHideFinalizeButton =
          localStorage.getItem("hideFinalizeButton");

        function setClickedCircleBackgroundColor(circle, bgColor, scaleID) {
          localStorage.setItem(
            `circleBgColor_${scaleID}_${circle.textContent}`,
            bgColor
          );
          localStorage.setItem(
            `lastClickedCircleID_${scaleID}`,
            circle.textContent,
            bgColor
          );
        }

        function getClickedCircleBackgroundColor(circle, scaleID) {
          const circleKey = `circleBgColor_${scaleID}_${circle.textContent}`;
          return localStorage.getItem(circleKey);
        }
        let circles = document.querySelectorAll(".circle_label");
        let isClicked = false;

        let circleBgColor = circle.style.backgroundColor;
        setTimeout(() => {
          let scales = document.querySelectorAll(".newScaleInput");
          // console.log(scales);
          scales.forEach((scale) => {
            const scaleID = scale?.querySelector(".scaleId").textContent;
            const circlesInScale = scale.querySelectorAll(".circle_label");
            const lastClickedCircleID = localStorage.getItem(
              `lastClickedCircleID_${scaleID}`
            );

            circlesInScale.forEach((circle) => {
              const storedBgColor = getClickedCircleBackgroundColor(
                circle,
                scaleID
              );

              if (storedBgColor) {
                if (circle.textContent === lastClickedCircleID) {
                  circle.style.backgroundColor = storedBgColor;
                } else {
                  circle.style.backgroundColor;
                }
              }
            });
          });
        }, 1000);

        circle.addEventListener("click", function () {
          if (!isClicked) {
            let holdingParentEl =
              circle.parentElement.parentElement.parentElement.parentElement;
            let scale =
              circle.parentElement.parentElement;
            let holding = scale?.querySelector(".newScaleInput");
            const buttonCircle = scale
              ? scale.querySelectorAll(".circle_label")
              : [];

             console.log("This is the background color", holdingParentEl);
            function componentToHex(c) {
              var hex = c.toString(16);
              return hex.length == 1 ? "0" + hex : hex;
            }

            function rgbToHex(r, g, b) {
              return (
                "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
              );
            }
            function invert(rgb) {
              rgb = [].slice
                .call(arguments)
                .join(",")
                .replace(/rgb\(|\)|rgba\(|\)|\s/gi, "")
                .split(",");
              for (var i = 0; i < rgb.length; i++)
                rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
              return rgbToHex(rgb[0], rgb[1], rgb[2]);
            }

            circle.style.backgroundColor = invert(circle.style.backgroundColor);

            for (let i = 0; i < buttonCircle.length; i++) {
              if (buttonCircle[i].textContent !== circle.textContent) {
                buttonCircle[i].style.backgroundColor = circleBgColor;
              }
            }

            let holdElem = scale?.querySelector(".holdElem");

            if (holdElem) {
              // If holdElem exists, update its text content
              holdElem.textContent = stapelScale[i];
            } else {
              // If holdElem doesn't exist, create a new one
              holdElem = document.createElement("div");
              holdElem.className = "holdElem";
              holdElem.style.display = "none";
              holdElem.textContent = stapelScale[i];
              holding?.appendChild(holdElem);
              console.log("This is holdEle", holdElem.textContent);
              const required_map_document = document_map_required?.filter(
                (item) => element?.id == item?.content
              );
              if (
                scaleField?.parentElement?.classList.contains("holderDIV") &&
                required_map_document?.length > 0
              ) {
                scaleField?.parentElement?.classList.add("element_updated");
              }
              if (element.required) {
                isAnyRequiredElementEdited = true;
              }
              // if (scaleField?.parentElement?.classList.contains("holderDIV")) {
              //   scaleField?.parentElement?.classList.add("element_updated");
              // }
            }
            const scaleID = scale?.querySelector(".scaleId")?.textContent;
            setClickedCircleBackgroundColor(
              circle,
              circle.style.backgroundColor,
              scaleID
            );

            localStorage.setItem(
              `lastClickedCircleID_${scaleID}`,
              circle.textContent
            );
          }
        });
      }
    }
  } else if (scaleTypeHolder.textContent === "nps_lite") {
    const npsLiteText = npsLiteTextArray.textContent.split(",");
    for (let i = 0; i < npsLiteText.length; i++) {
      const circle = document.createElement("div");
      circle.className = `circle_label circle_${i}`;
      circle.textContent = npsLiteText[i];
      circle.style.borderRadius = "25px";
      circle.style.padding = "12px 27px";
      circle.style.margin = "0 auto";
      circle.style.display = "flex";
      circle.style.justifyContent = "center";
      circle.style.alignItems = "center";
      circle.style.width = "27%";
      circle.style.height = "35%";
      circle.style.fontSize = "18px";
      circle.style.backgroundColor = element?.raw_data?.buttonColor;

      if (element?.raw_data?.buttonText) {
        const buttonText = element.raw_data.buttonText;
        if (Array.isArray(buttonText) && buttonText.length > 0) {
          circle.textContent = buttonText[i % buttonText.length];
        } else {
          // console.log("Empty buttonText array");
        }
      } else {
        circle.textContent = i;
      }

      scaleHold.style.height = "100%";
      labelHold.style.border = "";
      labelHold.style.height = "100%";

      labelHold.appendChild(circle);
      scaleText.style.display = "none";

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      let orientation = element?.raw_data?.orientation;
      if (orientation === "Vertical") {
        const orientation = document.createElement("h2");
        orientation.className = "nps_lite_orientation";
        orientation.textContent = "Vertical";
        orientation.style.display = "none";
        labelHold.appendChild(orientation);

        circle.style.margin = "10px 0";
        circle.style.padding = "10px 30px";

        scaleHold.style.border = "none";
        scaleHold.style.display = "flex";
        scaleHold.style.alignItems = "center";
        scaleHold.style.justifyContent = "center";
        scaleHold.style.textAlign = "center";
        labelHold.style.height = "100%";
        labelHold.style.width = "50%";
        labelHold.style.position = "absolute";
        labelHold.style.display = "flex";
        labelHold.style.flexDirection = "column";
        labelHold.style.alignItems = "center";
        labelHold.style.marginTop = "0";
      }

      if (decoded.details.action === "document") {
        let isClicked = false;
        function setClickedCircleBackgroundColor(circle, bgColor, scaleID) {
          localStorage.setItem(
            `circleBgColor_${scaleID}_${circle.textContent}`,
            bgColor
          );
          localStorage.setItem(
            `lastClickedCircleID_${scaleID}`,
            circle.textContent,
            bgColor
          );
        }

        function getClickedCircleBackgroundColor(circle, scaleID) {
          const circleKey = `circleBgColor_${scaleID}_${circle.textContent}`;
          return localStorage.getItem(circleKey);
        }

        setTimeout(() => {
          let scales = document.querySelectorAll(".newScaleInput");
          // console.log(scales);
          scales.forEach((scale) => {
            const scaleID = scale?.querySelector(".scaleId").textContent;
            const circlesInScale = scale.querySelectorAll(".circle_label");
            const lastClickedCircleID = localStorage.getItem(
              `lastClickedCircleID_${scaleID}`
            );

            circlesInScale.forEach((circle) => {
              const storedBgColor = getClickedCircleBackgroundColor(
                circle,
                scaleID
              );

              if (storedBgColor) {
                if (circle.textContent === lastClickedCircleID) {
                  circle.style.backgroundColor = storedBgColor;
                } else {
                  circle.style.backgroundColor;
                }
              }
            });
          });
        }, 1000);

        circle.addEventListener("click", function () {
          if (!isClicked) {
            let scale =
              circle.parentElement.parentElement.parentElement.parentElement;
            let holding = scale?.querySelector(".newScaleInput");
            const buttonCircle = scale
              ? scale.querySelectorAll(".circle_label")
              : [];

            console.log(
              "This is the background color",
              circle.style.backgroundColor
            );

            function componentToHex(c) {
              var hex = c.toString(16);
              return hex.length == 1 ? "0" + hex : hex;
            }

            function rgbToHex(r, g, b) {
              return (
                "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
              );
            }

            function invert(rgb) {
              rgb = [].slice
                .call(arguments)
                .join(",")
                .replace(/rgb\(|\)|rgba\(|\)|\s/gi, "")
                .split(",");
              for (var i = 0; i < rgb.length; i++)
                rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
              return rgbToHex(rgb[0], rgb[1], rgb[2]);
            }

            const circleBgColor = circle.style.backgroundColor;

            circle.style.backgroundColor = invert(circleBgColor);

            for (let i = 0; i < buttonCircle.length; i++) {
              if (buttonCircle[i].textContent !== circle.textContent) {
                buttonCircle[i].style.backgroundColor = circleBgColor;
              }
            }

            let holdElem = scale?.querySelector(".holdElem");

            if (holdElem) {
              // If holdElem exists, update its text content
              holdElem.textContent = npsLiteText[i];
            } else {
              // If holdElem doesn't exist, create a new one
              holdElem = document.createElement("div");
              holdElem.className = "holdElem";
              holdElem.style.display = "none";
              holdElem.textContent = npsLiteText[i] === "" ? i : npsLiteText[i];
              holding?.appendChild(holdElem);
              console.log("This is holdEle", holdElem.textContent);
              const required_map_document = document_map_required?.filter(
                (item) => element?.id == item?.content
              );
              if (
                scaleField?.parentElement?.classList.contains("holderDIV") &&
                required_map_document?.length > 0
              ) {
                scaleField?.parentElement?.classList.add("element_updated");
              }
              if (element.required) {
                isAnyRequiredElementEdited = true;
              }
              // if (scaleField?.parentElement?.classList.contains("holderDIV")) {
              //   scaleField?.parentElement?.classList.add("element_updated");
              // }
            }

            const scaleID = scale?.querySelector(".scaleId")?.textContent;
            setClickedCircleBackgroundColor(
              circle,
              circle.style.backgroundColor,
              scaleID
            );

            localStorage.setItem(
              `lastClickedCircleID_${scaleID}`,
              circle.textContent
            );
          }
        });
      }
    }
  } else if (scaleTypeHolder.textContent === "likert") {
    const likertScaleArray = document.createElement("div");
    likertScaleArray.className = "likert_Scale_Array";
    likertScaleArray.textContent = element?.raw_data?.likertScaleArray || "";
    likertScaleArray.style.display = "none";

    scaleHold.append(likertScaleArray);
    const likertScale = likertScaleArray.textContent.split(",");
    const numRows = Math.ceil(likertScale / 3);
    const numColumns = Math.min(likertScale, 3);
    // console.log("This is the likertjddddddd++++!!!!!!!!!", likertScale);

    for (let i = 0; i < likertScale.length; i++) {
      const circle = document.createElement("div");
      circle.className = "circle_label";
      circle.textContent = likertScale[i];
      circle.style.width = "80%";
      circle.style.height = "55%";
      circle.style.borderRadius = "25px";
      circle.style.padding = "6px 12px";
      circle.style.marginLeft = "12px";
      circle.style.backgroundColor = element?.raw_data?.buttonColor;
      circle.style.display = "flex";
      circle.style.justifyContent = "center";
      circle.style.alignItems = "center";
      labelHold.style.border = "";
      labelHold.style.display = "grid";
      labelHold.style.gridTemplateColumns = `repeat(3, 1fr)`;
      labelHold.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
      labelHold.appendChild(circle);
      scaleText.style.display = "none";

      let orientation = element?.raw_data?.orientation;
      if (orientation === "vertical") {
        const orientation = document.createElement("div");
        orientation.className = "orientation";
        orientation.textContent = "vertical";
        orientation.style.display = "none";
        labelHold.appendChild(orientation);
        labelHold.style.position = "absolute";
        circle.style.padding = "6px 12px";
        circle.style.margin = "10px 0";
        scaleHold.style.border = "none";
        scaleHold.style.display = "flex";
        scaleHold.style.alignItems = "center";
        scaleHold.style.justifyContent = "center";
        scaleHold.style.textAlign = "center";
        labelHold.style.height = "100%";
        labelHold.style.width = "50%";
        labelHold.style.display = "flex";
        labelHold.style.flexDirection = "column";
        labelHold.style.alignItems = "center";
        labelHold.style.marginTop = "8px";
      }

      if (decoded.details.action === "document") {
        let isClicked = false;
        const shouldHideFinalizeButton =
          localStorage.getItem("hideFinalizeButton");

        function setClickedCircleBackgroundColor(circle, bgColor, scaleID) {
          localStorage.setItem(
            `circleBgColor_${scaleID}_${circle.textContent}`,
            bgColor
          );
          localStorage.setItem(
            `lastClickedCircleID_${scaleID}`,
            circle.textContent,
            bgColor
          );
        }

        function getClickedCircleBackgroundColor(circle, scaleID) {
          const circleKey = `circleBgColor_${scaleID}_${circle.textContent}`;
          return localStorage.getItem(circleKey);
        }

        setTimeout(() => {
          let scales = document.querySelectorAll(".newScaleInput");
          // console.log(scales);
          scales.forEach((scale) => {
            const scaleID = scale?.querySelector(".scaleId").textContent;
            const circlesInScale = scale.querySelectorAll(".circle_label");
            const lastClickedCircleID = localStorage.getItem(
              `lastClickedCircleID_${scaleID}`
            );

            circlesInScale.forEach((circle) => {
              const storedBgColor = getClickedCircleBackgroundColor(
                circle,
                scaleID
              );

              if (storedBgColor) {
                if (circle.textContent === lastClickedCircleID) {
                  circle.style.backgroundColor = storedBgColor;
                } else {
                  circle.style.backgroundColor;
                }
              }
            });
          });
        }, 1000);

        circle.addEventListener("click", function () {
          if (!isClicked) {
            let scale =
              circle.parentElement.parentElement.parentElement.parentElement;
            let holding = scale?.querySelector(".newScaleInput");
            const buttonCircle = scale
              ? scale.querySelectorAll(".circle_label")
              : [];

            console.log(
              "This is the background color",
              circle.style.backgroundColor
            );

            function componentToHex(c) {
              var hex = c.toString(16);
              return hex.length == 1 ? "0" + hex : hex;
            }

            function rgbToHex(r, g, b) {
              return (
                "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
              );
            }

            function invert(rgb) {
              rgb = [].slice
                .call(arguments)
                .join(",")
                .replace(/rgb\(|\)|rgba\(|\)|\s/gi, "")
                .split(",");
              for (var i = 0; i < rgb.length; i++)
                rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
              return rgbToHex(rgb[0], rgb[1], rgb[2]);
            }

            const circleBgColor = circle.style.backgroundColor;

            circle.style.backgroundColor = invert(circleBgColor);

            for (let i = 0; i < buttonCircle.length; i++) {
              if (buttonCircle[i].textContent !== circle.textContent) {
                buttonCircle[i].style.backgroundColor = circleBgColor;
              }
            }

            let holdElem = scale?.querySelector(".holdElem");

            if (holdElem) {
              // If holdElem exists, update its text content
              holdElem.textContent = likertScale[i];
            } else {
              // If holdElem doesn't exist, create a new one
              holdElem = document.createElement("div");
              holdElem.className = "holdElem";
              holdElem.style.display = "none";
              holdElem.textContent = likertScale[i];
              holding?.appendChild(holdElem);
              console.log("This is holdEle", holdElem.textContent);
              const required_map_document = document_map_required?.filter(
                (item) => element?.id == item?.content
              );
              if (
                scaleField?.parentElement?.classList.contains("holderDIV") &&
                required_map_document?.length > 0
              ) {
                scaleField?.parentElement?.classList.add("element_updated");
              }
              if (element.required) {
                isAnyRequiredElementEdited = true;
              }
            }

            const scaleID = scale?.querySelector(".scaleId")?.textContent;
            setClickedCircleBackgroundColor(
              circle,
              circle.style.backgroundColor,
              scaleID
            );

            localStorage.setItem(
              `lastClickedCircleID_${scaleID}`,
              circle.textContent
            );
          }
        });
      }
    }
  } else if (scaleTypeHolder.textContent === "percent_scale") {
    let prodLength = element?.raw_data?.percentLabel;
    scaleText.style.display = "none";
    scaleHold.style.overflow = "hidden";
    scaleHold.style.height = "100%";

    for (let i = 0; i < prodLength; i++) {
      labelHold.style.display = "flex";
      labelHold.style.justifyContent = "center";
      labelHold.style.height = "100%";
      labelHold.style.flexDirection = "column";
      labelHold.style.border = "none";

      let containerDIV = document.createElement("div");
      containerDIV.className = "containerDIV";
      containerDIV.style.width = "95%";
      containerDIV.style.padding = "10px 15px";
      containerDIV.style.borderTop = "1px solid gray";
      containerDIV.style.borderBottom = "1px solid gray";
      labelHold.append(containerDIV);

      let nameDiv = document.createElement("div");
      nameDiv.className = "product_name";
      nameDiv.style.textAlign = "center";
      nameDiv.style.fontWeight = "700";
      nameDiv.textContent = element?.raw_data?.percentProdName[i];
      containerDIV.appendChild(nameDiv);

      const inputPercent = document.createElement("input");
      inputPercent.type = "range";
      inputPercent.min = "0";
      inputPercent.max = "100";
      inputPercent.disabled = "true";
      inputPercent.className = "percent-slider";
      inputPercent.style.width = "100%";
      inputPercent.style.cursor = "pointer";
      inputPercent.style.background = element?.raw_data?.percentBackground;
      inputPercent.style.webkitAppearance = "none";
      inputPercent.style.borderRadius = "10px";
      inputPercent.setAttribute("data-index", i);
      containerDIV.appendChild(inputPercent);

      let percentChilds = document.createElement("div");
      percentChilds.style.display = "flex";
      percentChilds.style.width = "100%";
      percentChilds.style.justifyContent = "space-between";

      let leftPercent = document.createElement("div");
      leftPercent.textContent = "0";
      leftPercent.className = "left-percent";
      percentChilds.appendChild(leftPercent);

      let centerPercent = document.createElement("div");
      centerPercent.className = "center-percent";
      percentChilds.appendChild(centerPercent);

      let rightPercent = document.createElement("div");
      rightPercent.textContent = "100";
      rightPercent.className = "right-percent";
      percentChilds.appendChild(rightPercent);

      containerDIV.appendChild(percentChilds);
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      let orientation = element?.raw_data?.orientation;
      if (orientation === "Vertical") {
        const orientation = document.createElement("div");
        orientation.className = "orientation";
        orientation.textContent = "Vertical";
        orientation.style.display = "none";
        scaleHold.appendChild(orientation);

        scaleHold.style.display = "flex";
        scaleHold.style.flexDirection = "column";
        scaleHold.style.alignItems = "center";
        scaleHold.style.justifyContent = "center";

        containerDIV.style.padding =
          nameDiv.textContent.length < 9
            ? "24px 39px 10px 14px"
            : "24px 39px 37px 14px";
        containerDIV.style.width = "90%";
        containerDIV.style.position = "relative";
        containerDIV.style.borderRight = "none";

        labelHold.style.width = "100%";
        labelHold.style.height = "96%";
        labelHold.style.alignItems = "center";
        labelHold.style.transform = "rotate(270deg)";
        nameDiv.style.position = "absolute";
        nameDiv.style.lineHeight = "0.95";
        if (nameDiv.textContent.length < 10) {
          nameDiv.style.top = "20px";
          nameDiv.style.left = "93%";
          nameDiv.style.right = "2px";
        } else {
          nameDiv.style.left = "98%";
          nameDiv.style.top = "-1px";
          nameDiv.style.right = "-7px";
        }

        if (prodLength === 1) {
          containerDIV.style.width = "25vw";
          containerDIV.style.marginRight = "37px";
        }
        nameDiv.style.transform = "rotate(90deg)";
        nameDiv.style.paddingBottom = prodLength > 6 ? "30px" : "0px";
        inputPercent.style.width = "100%";
        scaleText.style.marginBottom = "65px";
        scaleText.style.marginBottom = "10px";
      }

      if (decoded.details.action === "document") {
        inputPercent.disabled = "";
        const scale = document.querySelector(".focussedd");

        // ...

        // Add an event listener to update centerPercent
        const scaleId = element?.raw_data?.scaleID; // Replace with your scale identifier

        // Generate a unique key for localStorage using scaleId and index
        const localStorageKey = `inputPercent_${scaleId}_${i}`;

        // Add an event listener to update centerPercent
        inputPercent.addEventListener("input", function () {
          centerPercent.textContent = `${inputPercent.value}%`;
          const required_map_document = document_map_required?.filter(
            (item) => element?.id == item?.content
          );
          if (
            scaleField?.parentElement?.classList.contains("holderDIV") &&
            required_map_document?.length > 0
          ) {
            scaleField?.parentElement?.classList.add("element_updated");
          }
          if (element.required) {
            isAnyRequiredElementEdited = true;
          }
          // if (scaleField?.parentElement?.classList.contains("holderDIV")) {
          //   scaleField?.parentElement?.classList.add("element_updated");
          // }

          // Store the current inputPercent value in localStorage using the unique key
          localStorage.setItem(localStorageKey, inputPercent.value);
        });

        // Retrieve and set the value from localStorage if available using the unique key
        const storedInputValue = localStorage.getItem(localStorageKey);
        if (storedInputValue !== null) {
          inputPercent.value = storedInputValue;
          centerPercent.textContent = `${inputPercent.value}%`;
        }
      }
    }
  } else if (scaleTypeHolder.textContent === "percent_sum_scale") {
    let prodLength = element?.raw_data?.percentLabel;

    let inputPercentArray = []; // Create an array to store all inputPercent elements
    let rightPercentArray = [];
    let centerPercentArray = [];
    let currentProductIndex = 0;

    for (let i = 0; i < prodLength; i++) {
      labelHold.style.display = "flex";
      labelHold.style.justifyContent = "center";
      labelHold.style.height = "100%";
      labelHold.style.flexDirection = "column";
      labelHold.style.border = "none";

      let containerDiv = document.createElement("div");
      containerDiv.className = "containerDIV";
      containerDiv.style.width = "95%";
      containerDiv.style.padding = "10px 15px";
      containerDiv.style.borderTop = "1px solid gray";
      containerDiv.style.borderBottom = "1px solid gray";
      labelHold.append(containerDiv);

      let nameDiv = document.createElement("div");
      nameDiv.className = "product_name";
      nameDiv.style.textAlign = "center";
      nameDiv.style.fontWeight = "700";
      nameDiv.textContent = element?.raw_data?.percentProdName[i];
      containerDiv.appendChild(nameDiv);

      const inputPercent = document.createElement("input");
      inputPercent.type = "range";
      inputPercent.min = "0";
      inputPercent.max = "100";
      inputPercent.disabled = "true";
      inputPercent.className = "percent-slider";
      inputPercent.style.width = "100%";
      inputPercent.style.cursor = "pointer";
      inputPercent.style.background = element?.raw_data?.percentBackground;
      inputPercent.style.webkitAppearance = "none";
      inputPercent.style.borderRadius = "10px";
      containerDiv.appendChild(inputPercent);

      let percentChilds = document.createElement("div");
      percentChilds.style.display = "flex";
      percentChilds.style.width = "100%";
      percentChilds.style.alignItems = "center";
      percentChilds.style.justifyContent = "space-between";

      let leftPercent = document.createElement("div");
      leftPercent.textContent = "0";
      leftPercent.className = "left-percent";
      percentChilds.appendChild(leftPercent);

      let centerPercent = document.createElement("div");
      centerPercent.className = "center-percent";
      percentChilds.appendChild(centerPercent);

      let rightPercent = document.createElement("div");
      rightPercent.textContent = "100";
      rightPercent.className = "right-percent";
      percentChilds.appendChild(rightPercent);
      containerDiv.appendChild(percentChilds);

      inputPercentArray.push(inputPercent);
      rightPercentArray.push(rightPercent);
      centerPercentArray.push(centerPercent);

      scaleHold.style.height = "100%";
      scaleText.style.display = "none"

      // let rateValue = document.createElement("button");
      // rateValue.className = "rate_name";
      // rateValue.textContent = "Rate";
      // rateValue.style.marginLeft = "45%";
      // rateValue.style.border = "1px solid green"; // Add a border
      // rateValue.style.borderRadius = "5px"; // Add border radius
      // containerDiv.appendChild(rateValue);

      // Add event listener to the "Rate" button
      inputPercentArray.forEach((inputPercent, i) => {
        console.log(
          `i = ${i}, inputPercent.disabled = ${inputPercent.disabled}`
        );
        // Disable the input initially for all but the first product
        if (i > 0) {
          inputPercent.disabled = true;
        }

        // if (i !== prodLength - 1) {
        //   inputPercent.disabled = false;
        // } else {
        //   // Disable the input for the last product
        //   inputPercent.disabled = true;
        // }

        inputPercent.addEventListener("input", function () {
          if (i < prodLength - 1) {
            const totalCenterPercent = inputPercentArray
              .slice(0, i + 1)
              .reduce((total, input) => total + parseInt(input.value), 0);
            const remainingPercentage = 100 - totalCenterPercent;
            // Enable the input for the next product if the previous product has a value selected
            if (centerPercentArray[i].textContent !== "Please select a value") {
              centerPercentArray[i + 1].textContent = "";
              rightPercentArray[i + 1].textContent = `${remainingPercentage}%`;
              inputPercentArray[i + 1].max = `${remainingPercentage}`;
              inputPercentArray[i + 1].disabled = false;
            } else {
              // Disable the input for the next product if the previous product has no value selected
              inputPercentArray[i + 1].disabled = true;
            }
          }
        });
      });

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      let orientation = element?.raw_data?.orientation;
      if (orientation === "Vertical") {
        const orientation = document.createElement("div");
        orientation.className = "orientation";
        orientation.textContent = "Vertical";
        orientation.style.display = "none";
        scaleHold.appendChild(orientation);

        scaleHold.style.display = "flex";
        scaleHold.style.flexDirection = "column";
        scaleHold.style.alignItems = "center";
        scaleHold.style.justifyContent = "center";
        containerDiv.style.padding =
          nameDiv.textContent.length < 9
            ? "24px 39px 10px 14px"
            : "24px 39px 37px 14px";
        containerDiv.style.width = "90%";
        containerDiv.style.position = "relative";
        containerDiv.style.borderRight = "none";
        labelHold.style.width = "100%";
        labelHold.style.height = "96%";
        labelHold.style.alignItems = "center";
        labelHold.style.transform = "rotate(270deg)";
        nameDiv.style.position = "absolute";
        nameDiv.style.lineHeight = "0.95";
        if (nameDiv.textContent.length < 10) {
          nameDiv.style.top = "20px";
          nameDiv.style.left = "93%";
          nameDiv.style.right = "2px";
        } else {
          nameDiv.style.left = "98%";
          nameDiv.style.top = "-1px";
          nameDiv.style.right = "-7px";
        }
        nameDiv.style.transform = "rotate(90deg)";
        nameDiv.style.paddingBottom = prodLength > 6 ? "30px" : "0px";
        inputPercent.style.width = "100%";
      }

      if (decoded.details.action === "document") {
        inputPercent.disabled = "";
        const scale = document.querySelector(".focussedd");

        // ...

        // Add an event listener to update centerPercent
        const scaleId = element?.raw_data?.scaleID; // Replace with your scale identifier

        // Generate a unique key for localStorage using scaleId and index
        const localStorageKey = `inputPercent_${scaleId}_${i}`;

        // Add an event listener to update centerPercent
        inputPercent.addEventListener("input", function () {
          centerPercent.textContent = `${inputPercent.value}%`;
          const required_map_document = document_map_required?.filter(
            (item) => element?.id == item?.content
          );
          if (
            scaleField?.parentElement?.classList.contains("holderDIV") &&
            required_map_document?.length > 0
          ) {
            scaleField?.parentElement?.classList.add("element_updated");
          }
          if (element.required) {
            isAnyRequiredElementEdited = true;
          }
          // if (scaleField?.parentElement?.classList.contains("holderDIV")) {
          //   scaleField?.parentElement?.classList.add("element_updated");
          // }

          // Store the current inputPercent value in localStorage using the unique key
          localStorage.setItem(localStorageKey, inputPercent.value);
        });

        // Retrieve and set the value from localStorage if available using the unique key
        const storedInputValue = localStorage.getItem(localStorageKey);
        if (storedInputValue !== null) {
          inputPercent.value = storedInputValue;
          centerPercent.textContent = `${inputPercent.value}%`;
        }
      }
    }
  } else if (scaleTypeHolder.textContent === "comparison_paired_scale") {
    const pairedScaleArray = document.createElement("div");
    pairedScaleArray.className = "paired_Scale_Array";
    pairedScaleArray.textContent = element?.raw_data?.pairedScaleArray || "";
    pairedScaleArray.style.display = "none";

    scaleHold.append(pairedScaleArray);
    const pairedScale = pairedScaleArray.textContent.split(",");
    console.log("This is the d++++!!!!!!!!!", pairedScale);

    for (let i = 0; i < pairedScale.length - 1; i++) {
      for (let j = i + 1; j < pairedScale.length; j++) {
        const circle = document.createElement("div");
        circle.className = "circle_label";
        circle.style.width = "127px";
        circle.style.height = "45%";
        circle.style.borderRadius = "12px";
        circle.style.padding = "12px 20px";
        circle.style.backgroundColor = element?.raw_data?.buttonColor;
        circle.style.display = "flex";
        circle.style.flexDirection = "column";
        circle.style.justifyContent = "center";
        circle.style.alignItems = "center";
        circle.style.marginLeft = "5px";
        circle.style.marginRight = "5px";
        circle.style.gap = "7px";

        const smallBox1 = document.createElement("div");
        smallBox1.className = "small_box";
        smallBox1.textContent = pairedScale[i];
        const smallBox2 = document.createElement("div");
        smallBox2.className = "small_box";
        smallBox2.textContent = pairedScale[j];

        smallBox1.style.width = "95%";
        smallBox2.style.width = "95%";
        smallBox1.style.background = element?.raw_data?.smallBoxBgColor;
        smallBox1.style.color = element?.raw_data?.fontColor;
        smallBox2.style.background = element?.raw_data?.smallBoxBgColor;
        smallBox2.style.color = element?.raw_data?.fontColor;
        smallBox1.style.height = "50%";
        smallBox2.style.height = "50%";
        smallBox1.style.display = "flex";
        smallBox2.style.display = "flex";
        smallBox1.style.justifyContent = "center";
        smallBox2.style.justifyContent = "center";
        smallBox1.style.alignItems = "center";
        smallBox2.style.alignItems = "center";
        smallBox1.style.fontWeight = "12px";
        smallBox2.style.fontWeight = "12px";

        function componentToHex(c) {
          var hex = c.toString(16);
          return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
          return (
            "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
          );
        }

        function invert(rgb) {
          rgb = [].slice
            .call(arguments)
            .join(",")
            .replace(/rgb\(|\)|rgba\(|\)|\s/gi, "")
            .split(",");
          for (var i = 0; i < rgb.length; i++)
            rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
          return rgbToHex(rgb[0], rgb[1], rgb[2]);
        }

        const smallBoxBgColor = smallBox1.style.backgroundColor;
        const smallBoxColor = smallBox1.style.color;

        const mouseoverBox1Func = () => {
          smallBox1.style.backgroundColor = invert(smallBoxBgColor);
          smallBox1.style.color = invert(smallBoxColor);
        }

        const mouseLeaveBox1Func = () => {
          smallBox1.style.backgroundColor = element?.raw_data?.smallBoxBgColor;
          smallBox1.style.color = element?.raw_data?.fontColor;
        }

        const mouseoverBox2Func = () => {
          smallBox2.style.backgroundColor = invert(smallBoxBgColor);
          smallBox2.style.color = invert(smallBoxColor);
        }

        const mouseLeaveBox2Func = () => {
          smallBox2.style.backgroundColor = element?.raw_data?.smallBoxBgColor;
          smallBox2.style.color = element?.raw_data?.fontColor;
        }

        smallBox1.addEventListener("mouseover", mouseoverBox1Func(), false);
        smallBox1.addEventListener("mouseout", mouseLeaveBox1Func(), false);

        smallBox2.addEventListener("mouseover", mouseoverBox2Func(), false);
        smallBox2.addEventListener("mouseout", mouseLeaveBox2Func(), false);

        circle.appendChild(smallBox1);
        circle.appendChild(smallBox2);

        scaleHold.style.textAlign = "center";
        scaleHold.style.height = "100%";
        labelHold.style.border = "";
        labelHold.style.height = "100%";
        labelHold.style.justifyContent = "center";
        labelHold.style.flexWrap = "wrap";
        labelHold.style.position = "relative";
        labelHold.style.marginLeft = "0px";
        scaleText.style.display = "none";
        labelHold.appendChild(circle);

        let orientation = element?.raw_data?.orientation;
        if (orientation === "vertical") {
          const orientation = document.createElement("div");
          orientation.className = "orientation";
          orientation.textContent = "vertical";
          orientation.style.display = "none";
          labelHold.appendChild(orientation);
          scaleHold.style.padding = "0px";
          labelHold.style.position = "absolute";
          circle.style.margin = "5px 0";
          circle.style.padding = "6px 12px";
          labelHold.style.height = "100%";
          labelHold.style.width = "100%";
          labelHold.style.display = "flex";
          labelHold.style.flexDirection = "column";
          labelHold.style.alignItems = "center";
        }

      if (decoded.details.action === "document") {
        smallBox1.removeEventListener("mouseover", mouseoverBox1Func(), false)
        smallBox1.removeEventListener("mouseout", mouseLeaveBox1Func(), false)
        smallBox2.removeEventListener("mouseover", mouseoverBox2Func(), false)
        smallBox2.removeEventListener("mouseout", mouseLeaveBox2Func(), false)
        
        let isClicked = false;
        const shouldHideFinalizeButton =
          localStorage.getItem("hideFinalizeButton");

        function setClickedCircleBackgroundColor(circle, bgColor, scaleID) {
          localStorage.setItem(
            `circleBgColor_${scaleID}_${circle.textContent}`,
            bgColor
          );
          localStorage.setItem(
            `lastClickedCircleID_${scaleID}`,
            circle.textContent,
            bgColor
          );
        }

        function getClickedCircleBackgroundColor(circle, scaleID) {
          const circleKey = `circleBgColor_${scaleID}_${circle.textContent}`;
          return localStorage.getItem(circleKey);
        }

        setTimeout(() => {
          let scales = document.querySelectorAll(".newScaleInput");
          console.log(scales);
          scales.forEach((scale) => {
            const scaleID = scale?.querySelector(".scaleId").textContent;
            const circlesInScale = scale.querySelectorAll(".circle_label");
            const lastClickedCircleID = localStorage.getItem(
              `lastClickedCircleID_${scaleID}`
            );

            circlesInScale.forEach((circle) => {
              const storedBgColor = getClickedCircleBackgroundColor(
                circle,
                scaleID
              );

              if (storedBgColor) {
                if (circle.textContent === lastClickedCircleID) {
                  circle.style.backgroundColor = storedBgColor;
                } else {
                  circle.style.backgroundColor;
                }
              }
            });
          });
        }, 1000);

        smallBox1.addEventListener("click", function () {
          if (!isClicked) {
            let scale =
            smallBox1.parentElement.parentElement.parentElement.parentElement;
            let holding = scale?.querySelector(".newScaleInput");

            console.log(
              "This is the background color",
              circle.style.backgroundColor
            );

            function componentToHex(c) {
              var hex = c.toString(16);
              return hex.length == 1 ? "0" + hex : hex;
            }

            function rgbToHex(r, g, b) {
              return (
                "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
              );
            }

            function invert(rgb) {
              rgb = [].slice
                .call(arguments)
                .join(",")
                .replace(/rgb\(|\)|rgba\(|\)|\s/gi, "")
                .split(",");
              for (var i = 0; i < rgb.length; i++)
                rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
              return rgbToHex(rgb[0], rgb[1], rgb[2]);
            }

            const circleBgColor = smallBox1.style.backgroundColor;

            smallBox1.style.backgroundColor = invert(circleBgColor);
            smallBox2.style.backgroundColor = circleBgColor

            // for (let i = 0; i < buttonCircle.length; i++) {
            //   if (buttonCircle[i].textContent !== circle.textContent) {
            //     buttonCircle[i].style.backgroundColor = circleBgColor;
            //   }
            // }

            let holdElem = scale?.querySelector(".holdElem");

            if (holdElem) {
              // If holdElem exists, update its text content
              holdElem.textContent = smallBox1[i];
            } else {
              // If holdElem doesn't exist, create a new one
              holdElem = document.createElement("div");
              holdElem.className = "holdElem";
              holdElem.style.display = "none";
              holdElem.textContent = smallBox1[i];
              holding?.appendChild(holdElem);
              console.log("This is holdEle", holdElem.textContent);
              if (scaleField?.parentElement?.classList.contains("holderDIV")) {
                scaleField?.parentElement?.classList.add("element_updated");
              }
            }

            const scaleID = scale?.querySelector(".scaleId")?.textContent;
            setClickedCircleBackgroundColor(
              circle,
              circle.style.backgroundColor,
              scaleID
            );

            localStorage.setItem(
              `lastClickedCircleID_${scaleID}`,
              circle.textContent
            );
          }
        });
      }
    }
    }
  }

  childDiv.id = "child";
  childDiv.style.display = "flex";
  childDiv.style.justifyContent = "space-between";
  // childDiv.style.margin = "0px";

  element1.className = "left_child";
  element1.style.marginLeft = "0px";
  element1.style.display = "none";
  element1.textContent = element?.raw_data?.left;
  childDiv.appendChild(element1);

  element2.className = "neutral_child";
  element2.textContent = element?.raw_data?.center;
  element2.style.display = "none";
  childDiv.appendChild(element2);

  element3.className = "right_child";
  element3.textContent = element?.raw_data?.right;
  element3.style.display = "none";
  childDiv.appendChild(element3);

  const orientation = element?.raw_data?.orentation;
  if (orientation === "nps_vertical") {
    childDiv.style.display = "flex";
    childDiv.style.flexDirection = "column";
    childDiv.style.justifyContent = "space-between";

    childDiv.style.alignItems = "flex-start";
    childDiv.style.width = "32%";
    childDiv.style.marginLeft = "auto";
    childDiv.style.height = "98%";

    // buttonCircleM.style.marginTop = "2px";
  }

  const stapelOrientation = element?.raw_data?.stapelOrientation;
  if (stapelOrientation === "stapel_vertical") {
    childDiv.style.display = "flex";
    childDiv.style.flexDirection = "column";
    childDiv.style.justifyContent = "space-between";

    childDiv.style.alignItems = "flex-start";
    childDiv.style.width = "32%";
    childDiv.style.marginLeft = "auto";
    childDiv.style.height = "98%";
  }

  const idHolder = document.createElement("h6");
  idHolder.className = "scaleId";
  idHolder.textContent = element?.raw_data?.scaleID;
  idHolder.style.display = "none";
  childDiv.appendChild(idHolder);

  scaleHold.append(childDiv);
  scaleField.append(scaleHold);

  if (element.data == "scale here") {
    scaleField.innerHTML = element.data;
  }
  if (element.data != "scale here" && decoded.details.action === "template") {
    const scaleHold = document.createElement("div");
    scaleHold.className = "scool_input";
    scaleHold.style.color = "black";
    scaleHold.style.width = "100%";
    scaleHold.style.height = "90%";
    scaleHold.style.padding = "10px";
    scaleHold.style.display = "none";

    // scaleField.append(scaleHold);

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
    scaleText.style.display = "none";
    scaleHold.append(scaleText);

    const labelHold = document.createElement("div");
    labelHold.className = "label_hold";
    labelHold.style.width = "100%";
    labelHold.style.height = "85%";
    labelHold.style.border = "1px solid black";
    labelHold.style.backgroundColor = "blue";
    // labelHold.style.display = "none";
    scaleHold.appendChild(labelHold);
    labelHold.style.display = "flex";
    // labelHold.style.flexWrap = "wrap";
    labelHold.style.justifyContent = "space-between";
    labelHold.style.alignItems = "center";
    // labelHold.style.margin = "0px";
    labelHold.style.display = "none";

    for (let i = 0; i < 11; i++) {
      const circle = document.createElement("div");
      // Set the styles for the circle
      circle.className = "circle_label";
      circle.style.width = "35%";
      circle.style.height = "35%";
      circle.style.borderRadius = "50%";
      circle.style.backgroundColor = "red";
      circle.style.top = "30%";
      circle.style.left = "30%";
      circle.style.display = "flex";
      circle.style.justifyContent = "center";
      circle.style.alignItems = "center";
      circle.style.marginLeft = "2px";
      circle.style.display = "none";

      circle.textContent = i;
      labelHold.append(circle);
    }
    // const parentDiv = document.createElement("div");
    // parentDiv.id = "parent";
    // parentDiv.style.margin = "0px";

    const childDiv = document.createElement("div");
    childDiv.id = "child";
    childDiv.style.display = "flex";
    childDiv.style.justifyContent = "space-between";
    // childDiv.style.margin = "0px";

    const element1 = document.createElement("h6");
    element1.className = "left_child";
    element1.style.marginLeft = "0px";
    element1.style.display = "none";
    element1.textContent = "Good";
    childDiv.appendChild(element1);

    const element2 = document.createElement("h6");
    element2.className = "neutral_child";
    element2.textContent = "Neutral";
    element2.style.display = "none";
    childDiv.appendChild(element2);

    const element3 = document.createElement("h6");
    element3.className = "right_child";
    element3.textContent = "Best";
    element3.style.display = "none";
    childDiv.appendChild(element3);
    scaleHold.append(childDiv);
    scaleField.append(scaleHold);

    // const iframe = document.createElement("iframe");
    // iframe.style.width = "90%";
    // iframe.style.height = "90%";
    // iframe.src = element.scale_url;

    // scaleField.addEventListener("resize", () => {
    //   iframe.style.width = scaleField.clientWidth + "px";
    //   iframe.style.height = scaleField.clientHeight + "px";
    // });

    // scaleField.append(iframe);
    scaleField.onclick = (e) => {
      // focuseddClassMaintain(e);
      table_dropdown_focuseddClassMaintain(e);
      handleClicked("newScale2");
      setSidebar(true);
    };
  }

  if (
    element.details === "Template scale" &&
    decoded.details.action === "document"
  ) {
    // const iframe = document.createElement("iframe");
    // iframe.style.width = "90%";
    // iframe.style.height = "90%";

    // Axios.post(
    //   "https://100035.pythonanywhere.com/api/nps_create_instance",
    //   {
    //     scale_id: element.scaleId,
    //   }
    // )
    //   .then((res) => {
    //     setIsLoading(false);
    //     // console.log(res, "scaleData");
    //     const lastInstance = res.data.response.instances.slice(-1)[0];
    //     const lastValue = Object.values(lastInstance)[0];
    //     iframe.src = lastValue;
    //     // console.log(lastValue);
    //   })
    //   .catch((err) => {
    //     setIsLoading(false);
    //     // console.log(err);
    //   });

    const scaleHold = document.createElement("div");
    scaleHold.className = "scool_input";
    scaleHold.style.color = "black";
    scaleHold.style.width = "100%";
    scaleHold.style.height = "90%";
    scaleHold.style.padding = "10px";
    scaleHold.style.display = "none";

    // scaleField.append(scaleHold);

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

    const labelHold = document.createElement("div");
    labelHold.className = "label_hold";
    labelHold.style.width = "100%";
    labelHold.style.height = "85%";
    labelHold.style.border = "1px solid black";
    labelHold.style.backgroundColor = "blue";
    // labelHold.style.display = "none";
    scaleHold.appendChild(labelHold);
    labelHold.style.display = "flex";
    // labelHold.style.flexWrap = "wrap";
    labelHold.style.justifyContent = "space-between";
    labelHold.style.alignItems = "center";
    // labelHold.style.margin = "0px";

    for (let i = 0; i < 11; i++) {
      const circle = document.createElement("div");
      // Set the styles for the circle
      circle.className = "circle_label";
      circle.style.width = "35%";
      circle.style.height = "35%";
      circle.style.borderRadius = "50%";
      circle.style.backgroundColor = "red";
      circle.style.top = "30%";
      circle.style.left = "30%";
      circle.style.display = "flex";
      circle.style.justifyContent = "center";
      circle.style.alignItems = "center";
      circle.style.marginLeft = "2px";

      circle.textContent = i;
      labelHold.append(circle);
    }
    // const parentDiv = document.createElement("div");
    // parentDiv.id = "parent";
    // parentDiv.style.margin = "0px";

    const childDiv = document.createElement("div");
    childDiv.id = "child";
    childDiv.style.display = "flex";
    childDiv.style.justifyContent = "space-between";
    // childDiv.style.margin = "0px";

    const element1 = document.createElement("h6");
    element1.className = "left_child";
    element1.style.marginLeft = "0px";
    element1.textContent = "Good";
    childDiv.appendChild(element1);

    const element2 = document.createElement("h6");
    element2.className = "neutral_child";
    element2.textContent = "Neutral";
    childDiv.appendChild(element2);

    const element3 = document.createElement("h6");
    element3.className = "right_child";
    element3.textContent = "Best";
    childDiv.appendChild(element3);
    scaleHold.append(childDiv);

    scaleField.addEventListener("resize", () => {
      scaleHold.style.width = scaleField.clientWidth + "px";
      scaleHold.style.height = scaleField.clientHeight + "px";
    });

    scaleField.append(scaleHold);
  }

  if (
    element.details === "Document instance" &&
    decoded.details.action === "document"
  ) {
    const iframe = document.createElement("iframe");
    iframe.style.width = "90%";
    iframe.style.height = "90%";
    iframe.src = element.scale_url;

    scaleField.addEventListener("resize", () => {
      iframe.style.width = scaleField.clientWidth + "px";
      iframe.style.height = scaleField.clientHeight + "px";
    });

    // scaleField.append(iframe);
  }

  const scaleIdHolder = document.createElement("div");

  scaleIdHolder.className = "scaleId_holder";
  scaleIdHolder.innerHTML = element.id;
  scaleIdHolder.style.display = "none";

  const labelHolder = document.createElement("div");
  labelHolder.className = "label_holder";
  labelHolder.style.display = "none";

  scaleField.onclick = (e) => {
    focuseddClassMaintain(e);
    table_dropdown_focuseddClassMaintain(e);
    handleClicked("newScale2");
    if (decoded.details.action === "template") {
      setSidebar(true);
    } else {
      setSidebar(false);
    }
    // console.log("This is the scale type", scaleTypeHolder.textContent);
  };
  // console.log(element);
  holderDIV.append(scaleField);
  holderDIV.append(scaleIdHolder);
  holderDIV.append(labelHolder);

  document
    .getElementsByClassName("midSection_container")
    [p - 1] // ?.item(0)
    ?.append(holderDIV);
}
export default createNewScaleInputField;
