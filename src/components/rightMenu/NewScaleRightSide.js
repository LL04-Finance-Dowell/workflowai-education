/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { useStateContext } from "../../contexts/contextProvider";
import Axios from "axios";
import jwt_decode from "jwt-decode";
import { useSearchParams } from "react-router-dom";
import { GrEmoji } from "react-icons/gr";
import Picker from "emoji-picker-react";
import useSelectedAnswer from "../../customHooks/useSelectedAnswers";

const ScaleRightSide = () => {
  const {
    sidebar,
    setIsLoading,
    scaleData,
    data,
    item,
    isDropped,
    companyId,
    custom1,
    setCustom1,
    custom2,
    setCustom2,
    custom3,
    setCustom3,
    customId,
    setScaleData,
    setScaleId,
    scaleId,
    setScaleTypeContent,
    scaleTypeContent,
    setConfirmRemove,
    confirmRemove,
  } = useStateContext();
  // const [selectedType, setSelectedType] = useState("");
  // const [addedAns, setAddedAns] = useState([]);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  const [formData, setFormData] = useState(new FormData());
  const [selectedType, setSelectedType] = useState("");
  // const [addedAns, setAddedAns] = useState([])
  const { addedAns, setAddedAns } = useSelectedAnswer();
  const [inputStr, setInputStr] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const [score, setScore] = useState(false);
  const [showBorder, setShowBorder] = useState(true);
  const [holdText, setHoldText] = useState("");
  const [isEmojiFormat, setIsEmojiFormat] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const [percentSumInputValue, setPercentSumInputValue] = useState("");
  const [percentSumLabelTexts, setPercentSumLabelTexts] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const [productCount, setProductCount] = useState(1);
  const [inputFields, setInputFields] = useState([
    <input key={0} type="text" placeholder="Product 1" required />,
  ]);

  const handlePairedScaleInputChange = (e) => {
    const { name, value } = e.target;
    formData.set(name, value);
  };

  const fontStyles = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Comic Sans MS",
    "Impact",
    "Arial Black",
  ];
  let scale = document.querySelector(".focussedd");
  let circles = scale?.querySelector(".circle_label");
  let scaleBg = scale?.querySelector(".label_hold");
  let percentSliderBg = scale?.querySelector(".percent-slider");
  let smallBoxBg = scale?.querySelector(".small_box");
  let stapelScaleBg = scale?.querySelector(".newScaleInput");
  // <<<<<<< HEAD
  let fontColor = scale?.querySelector(".scool_input");
  let fontColorStapel = scale?.querySelector(".newScaleInput");
  let fontFamilyStapel = scale?.querySelector(".newScaleInput");
  let stapelLeft = scale?.querySelector(".leftToolTip");
  let stapelRight = scale?.querySelector(".rightTooltip");
  let stapelUpperLimit = scale?.querySelector(".upper_scale_limit");
  let stapelSpaceUnit = scale?.querySelector(".space_unit");

  const [space, setSpace] = useState(stapelSpaceUnit ? Number(stapelSpaceUnit.textContent) : 0);
  const [upperLimit, setUpperLimit] = useState(stapelUpperLimit ? Number(stapelUpperLimit.textContent) : 0);
  // =======
  // let fontColor = scale?.firstChild;
  const element = JSON.parse(sessionStorage.getItem("cutItem"));
  // // console.log(scale);
  // // console.log(fontColor.style.color);
  // >>>>>>> 3173bb44e3ed7c230aaab9775e84cdf4bd2e6ee2
  let fontFamlity = scale?.firstChild;

  // if(!scale)
  if (fontColor) {
    // Get the computed background color in RGB format
    const rgbColor = getComputedStyle(fontColor).color;

    // Extract the RGB values
    const rgbValues = rgbColor.match(/\d+/g);

    // Convert each RGB value to hexadecimal
    fontColor =
      "#" +
      rgbValues
        .map((value) => parseInt(value).toString(16).padStart(2, "0"))
        .join("");

    // // console.log(fontColor);
  }

  if (fontColorStapel) {
    // Get the computed background color in RGB format
    const rgbColor = getComputedStyle(fontColorStapel).color;

    // Extract the RGB values
    const rgbValues = rgbColor.match(/\d+/g);

    // Convert each RGB value to hexadecimal
    fontColorStapel =
      "#" +
      rgbValues
        .map((value) => parseInt(value).toString(16).padStart(2, "0"))
        .join("");

    // // console.log(fontColor);
  }

  // // console.log(circles);
  if (circles) {
    // Get the computed background color in RGB format
    const rgbColor = getComputedStyle(circles).backgroundColor;

    // Extract the RGB values
    const rgbValues = rgbColor.match(/\d+/g);

    // Convert each RGB value to hexadecimal
    circles =
      "#" +
      rgbValues
        .map((value) => parseInt(value).toString(16).padStart(2, "0"))
        .join("");

    // // console.log(circles);
  }

  if (scaleBg) {
    // Get the computed background color in RGB format
    const rgbColor = getComputedStyle(scaleBg).backgroundColor;

    // Extract the RGB values
    const rgbValues = rgbColor.match(/\d+/g);

    // Convert each RGB value to hexadecimal
    scaleBg =
      "#" +
      rgbValues
        .map((value) => parseInt(value).toString(16).padStart(2, "0"))
        .join("");
  }

  if (stapelScaleBg) {
    // Get the computed background color in RGB format
    const rgbColor = getComputedStyle(stapelScaleBg).backgroundColor;

    // Extract the RGB values
    const rgbValues = rgbColor.match(/\d+/g);

    // Convert each RGB value to hexadecimal
    stapelScaleBg =
      "#" +
      rgbValues
        .map((value) => parseInt(value).toString(16).padStart(2, "0"))
        .join("");
  }

  if (percentSliderBg) {
    // Get the computed background color in RGB format
    const rgbColor = getComputedStyle(percentSliderBg).backgroundColor;

    // Extract the RGB values
    const rgbValues = rgbColor.match(/\d+/g);

    // Convert each RGB value to hexadecimal
    percentSliderBg =
      "#" +
      rgbValues
        .map((value) => parseInt(value).toString(16).padStart(2, "0"))
        .join("");
  }

  if (smallBoxBg) {
    // Get the computed background color in RGB format
    const rgbColor = getComputedStyle(smallBoxBg).backgroundColor;

    // Extract the RGB values
    const rgbValues = rgbColor.match(/\d+/g);

    // Convert each RGB value to hexadecimal
    smallBoxBg =
      "#" +
      rgbValues
        .map((value) => parseInt(value).toString(16).padStart(2, "0"))
        .join("");
  }

  // // console.log(scaleDisplay);

  const leftChild = scale?.querySelector(".left_child");
  const neutralChild = scale?.querySelector(".neutral_child");
  const rightChild = scale?.querySelector(".right_child");
  const npsLiteLeftChild = scale?.querySelector(".circle_0");
  const npsLiteCenterChild = scale?.querySelector(".circle_1");
  const npsLiteRightChild = scale?.querySelector(".circle_2");
  const scaleT = scale?.querySelector(".scale_text");
  const scaleTypeHolder = scale?.querySelector(".scaleTypeHolder");

  const [scaleTitle, setScaleTitle] = useState(scaleT ? scaleT.innerHTML : "");

  var scaleColorInput = document.getElementById("scale_color");
  if (scaleColorInput) {
    scaleColorInput.defaultValue = scaleBg;
  }

  var scaleColorStapel = document.getElementById("scale_color_stapel");
  if (scaleColorStapel) {
    scaleColorStapel.defaultValue = stapelScaleBg;
  }

  var scaleColorNpsLite = document.getElementById("scale_color_nps_lite");
  if (scaleColorNpsLite) {
    scaleColorNpsLite.defaultValue = circles;
  }

  var font_color = document.getElementById("font_color");
  if (font_color) {
    font_color.defaultValue = fontColor;
  }

  var font_colorStapel = document.getElementById("font_color_stapel");
  if (font_colorStapel) {
    font_colorStapel.defaultValue = fontColorStapel;
  }

  var npsLiteFontColor = document.getElementById("font_color_nps_lite");
  if (npsLiteFontColor) {
    npsLiteFontColor.defaultValue = fontColor;
  }

  var left = document.getElementById("left");
  if (left) {
    left.defaultValue = leftChild?.textContent;
  }
  var centre = document.getElementById("centre");
  if (centre) {
    centre.defaultValue = neutralChild?.textContent;
  }
  var right = document.getElementById("right");
  if (right) {
    right.defaultValue = rightChild?.textContent;
  }

  var leftText = document.getElementById("left_nps_lite");
  if (leftText) {
    leftText.defaultValue = npsLiteLeftChild?.textContent
      ? npsLiteLeftChild?.textContent
      : "";
  }

  var centerText = document.getElementById("center_nps_lite");
  if (centerText) {
    centerText.defaultValue = npsLiteCenterChild?.textContent
      ? npsLiteCenterChild?.textContent
      : "";
  }

  var rightText = document.getElementById("right_nps_lite");
  if (rightText) {
    rightText.defaultValue = npsLiteRightChild?.textContent
      ? npsLiteRightChild?.textContent
      : "";
  }

  var button_color = document.getElementById("button_color");
  if (button_color) {
    button_color.defaultValue = circles;
  }

  var button_colorStapel = document.getElementById("button_color_stapel");
  if (button_colorStapel) {
    button_colorStapel.defaultValue = circles;
  }
  var format = document.getElementById("format");
  var npsLiteFormat = document.getElementById("format_nps_lite");
  var likertScaleFormat = document.getElementById("label_type_linkert");
  const scaleDisplay = scale?.querySelector(".scool_input");

  // var imageLabel = scale?.querySelector(".images_label");
  var circleLabel = scale?.querySelector(".circle_label")?.textContent;
  const withEmoji = /\p{Extended_Pictographic}/u;

  if (scaleDisplay?.style.display !== "none") {
    if (format) {
      if (format.value !== "emoji") {
        format.selectedIndex = circleLabel?.indexOf("0") !== -1 ? 0 : 1;
      }
    }
    if (npsLiteFormat) {
      npsLiteFormat.selectedIndex = withEmoji.test(circleLabel) ? 1 : 0;
    }
    if (likertScaleFormat) {
      likertScaleFormat.selectedIndex =
        circleLabel?.indexOf("0") !== -1 ? 0 : 1;
    }
  }

  var likertFontColor = document.getElementById("font_color_likert");
  if (likertFontColor) {
    likertFontColor.defaultValue = fontColor;
  }

  var button_colorLikert = document.getElementById("button_color_likert");
  if (button_colorLikert) {
    button_colorLikert.defaultValue = circles;
  }
  var slider_color_percent_scale = document.getElementById(
    "slider_color_percent_scale"
  );
  if (slider_color_percent_scale) {
    slider_color_percent_scale.defaultValue = percentSliderBg;
    // }
  }
  var font_color_percent = document.getElementById("font_color_percent");
  if (font_color_percent) {
    font_color_percent.defaultValue = fontColor;
  }

  var percentSumSliderColor = document.getElementById(
    "slider_color_percent_sum_scale"
  );
  if (percentSumSliderColor) {
    percentSumSliderColor.defaultValue = percentSliderBg;
  }

  var percentSumFontColor = document.getElementById("font_color_percent_sum");
  if (percentSumFontColor) {
    percentSumFontColor.defaultValue = fontColor;
  }

  var pairedComparisonFontColor = document.getElementById(
    "font_color_comparison"
  );
  if (pairedComparisonFontColor) {
    pairedComparisonFontColor.defaultValue = fontColor;
  }

  var pairedComparisonRoundColor = document.getElementById(
    "button_color_Comparison"
  );
  if (pairedComparisonRoundColor) {
    pairedComparisonRoundColor.defaultValue = smallBoxBg;
  }

  var pairedComparisonScaleColor = document.getElementById(
    "scale_color_Comparison"
  );
  if (pairedComparisonScaleColor) {
    pairedComparisonScaleColor.defaultValue = circles;
  }

  if (scaleTypeHolder?.textContent === "percent_scale") {
    let percentSlider = scale?.querySelector(".percent-slider");
    let sliderValueDisplay = scale?.querySelector(".center-percent");
    function updateSliderValue() {
      let sliderValue = percentSlider.value;
      sliderValueDisplay.textContent = `${sliderValue}%`;
    }
    percentSlider?.addEventListener("input", updateSliderValue);
  }

  if (scaleTypeHolder?.textContent === "percent_sum_scale") {
    let percentSlider = scale?.querySelector(".percent-slider");
    let sliderValueDisplay = scale?.querySelector(".center-percent");
    function updateSliderValue() {
      let sliderValue = percentSlider.value;
      sliderValueDisplay.textContent = `${sliderValue}%`;
    }
    percentSlider?.addEventListener("input", updateSliderValue);
  }
  // console.log(leftChild.innerHTML);
  const handleFormat = () => {
    const format = document.getElementById("format");
    const selectedValue = format.value;
    if (selectedValue === "number") {
      document.getElementById("emoji").style.display = "none";
      document.getElementById("image").style.display = "none";
      setIsEmojiFormat(false);
    } else if (selectedValue === "emoji") {
      document.getElementById("emoji").style.display = "flex";
      document.getElementById("image").style.display = "none";
      setIsEmojiFormat(true);
    } else if (selectedValue === "image") {
      document.getElementById("image").style.display = "flex";
      document.getElementById("emoji").style.display = "none";
      setIsEmojiFormat(false);
    }
  };

  const handleFormatChange = (e) => {
    const format = e.target.value;
    if (format === "snipte") {
      document.getElementById("npsScaleForm").style.display = "none";
      document.getElementById("snippScaleForm").style.display = "flex";
      document.getElementById("npsLiteScaleForm").style.display = "none";
      document.getElementById("percentScaleForm").style.display = "none";
      document.getElementById("percentSumScaleForm").style.display = "none";
      document.getElementById("likertScaleForm").style.display = "none";
      document.getElementById("comparisonScaleForm").style.display = "none";
    } else if (format === "nps") {
      document.getElementById("snippScaleForm").style.display = "none";
      document.getElementById("npsScaleForm").style.display = "flex";
      document.getElementById("npsLiteScaleForm").style.display = "none";
      document.getElementById("percentScaleForm").style.display = "none";
      document.getElementById("percentSumScaleForm").style.display = "none";
      document.getElementById("likertScaleForm").style.display = "none";
      document.getElementById("comparisonScaleForm").style.display = "none";
    } else if (format === "nps_lite") {
      document.getElementById("snippScaleForm").style.display = "none";
      document.getElementById("npsScaleForm").style.display = "none";
      document.getElementById("npsLiteScaleForm").style.display = "flex";
      document.getElementById("likertScaleForm").style.display = "none";
      document.getElementById("percentScaleForm").style.display = "none";
      document.getElementById("percentSumScaleForm").style.display = "none";
      document.getElementById("comparisonScaleForm").style.display = "none";
    } else if (format === "likert") {
      document.getElementById("snippScaleForm").style.display = "none";
      document.getElementById("npsScaleForm").style.display = "none";
      document.getElementById("npsLiteScaleForm").style.display = "none";
      document.getElementById("likertScaleForm").style.display = "flex";
      document.getElementById("percentScaleForm").style.display = "none";
      document.getElementById("percentSumScaleForm").style.display = "none";
      document.getElementById("comparisonScaleForm").style.display = "none";
    } else if (format === "percent_scale") {
      document.getElementById("snippScaleForm").style.display = "none";
      document.getElementById("npsScaleForm").style.display = "none";
      document.getElementById("likertScaleForm").style.display = "none";
      document.getElementById("npsLiteScaleForm").style.display = "none";
      document.getElementById("percentScaleForm").style.display = "flex";
      document.getElementById("percentSumScaleForm").style.display = "none";
      document.getElementById("comparisonScaleForm").style.display = "none";
    } else if (format === "percent_sum_scale") {
      document.getElementById("snippScaleForm").style.display = "none";
      document.getElementById("npsScaleForm").style.display = "none";
      document.getElementById("likertScaleForm").style.display = "none";
      document.getElementById("npsLiteScaleForm").style.display = "none";
      document.getElementById("percentScaleForm").style.display = "none";
      document.getElementById("percentSumScaleForm").style.display = "flex";
      document.getElementById("comparisonScaleForm").style.display = "none";
    } else if (format === "comparison_paired_scale") {
      document.getElementById("snippScaleForm").style.display = "none";
      document.getElementById("npsScaleForm").style.display = "none";
      document.getElementById("likertScaleForm").style.display = "none";
      document.getElementById("npsLiteScaleForm").style.display = "none";
      document.getElementById("percentScaleForm").style.display = "none";
      document.getElementById("percentSumScaleForm").style.display = "none";
      document.getElementById("comparisonScaleForm").style.display = "flex";
    }
  };

  // const handleScaleType = (e) => {
  //   if((scaleTypeContent === "" || scaleTypeContent === "nps") && scaleTypeHolder?.textContent === "nps"){
  //     document.getElementById("npsScaleForm").style.display = "flex";
  //     document.getElementById("snippScaleForm").style.display = "none";
  //   }else if((scaleTypeContent === "" || scaleTypeContent === "snipte") && scaleTypeHolder?.textContent === "snipte") {
  //     document.getElementById("snippScaleForm").style.display = "flex";
  //     document.getElementById("npsScaleForm").style.display = "none";
  //   }
  // };

  const handleFormatStapel = () => {
    const format = document.getElementById("format_stapel");
    const selectedValue = format.value;
    if (selectedValue === "number") {
      document.getElementById("emoji_stapel").style.display = "none";
      document.getElementById("image").style.display = "none";
      setIsEmojiFormat(false);
    } else if (selectedValue === "emoji") {
      document.getElementById("emoji_stapel").style.display = "flex";
      document.getElementById("image").style.display = "none";
      setIsEmojiFormat(true);
    } else if (selectedValue === "image") {
      document.getElementById("image").style.display = "flex";
      document.getElementById("emoji").style.display = "none";
      setIsEmojiFormat(false);
    }
  };

  const handleFormatNpsLite = () => {
    const format = document.getElementById("format_nps_lite");
    const selectedValue = format.value;
    if (selectedValue === "text") {
      document.getElementById("emoji_nps_lite").style.display = "none";
    } else if (selectedValue === "emoji") {
      document.getElementById("emoji_nps_lite").style.display = "flex";
    }
  };

  // useEffect(() => {
  //   if (decoded.details.action === "template") {
  //     document.getElementById("npsScaleForm").style.display = "none";
  //     document.getElementById("snippScaleForm").style.display = "none";
  //   }
  // }, []);

  useEffect(() => {
    if (scaleTypeHolder?.textContent !== "") {
      setScaleTypeContent(scaleTypeHolder?.textContent);
    }

    if (decoded.details.action === "template") {
      if (scaleTypeContent === "" && scaleTypeHolder?.textContent === "") {
        document.getElementById("npsScaleForm").style.display = "none";
        document.getElementById("snippScaleForm").style.display = "none";
        document.getElementById("npsLiteScaleForm").style.display = "none";
        document.getElementById("likertScaleForm").style.display = "none";
        document.getElementById("percentScaleForm").style.display = "none";
        document.getElementById("percentSumScaleForm").style.display = "none";
        document.getElementById("comparisonScaleForm").style.display = "none";
      } else if (
        (scaleTypeContent === "" || scaleTypeContent === "nps") &&
        (scaleTypeHolder?.textContent === "nps" ||
          scaleTypeHolder?.textContent === "")
      ) {
        document.getElementById("npsScaleForm").style.display = "flex";
        document.getElementById("snippScaleForm").style.display = "none";
        document.getElementById("npsLiteScaleForm").style.display = "none";
        document.getElementById("likertScaleForm").style.display = "none";
        document.getElementById("percentScaleForm").style.display = "none";
        document.getElementById("percentSumScaleForm").style.display = "none";
        document.getElementById("comparisonScaleForm").style.display = "none";
      } else if (
        (scaleTypeContent === "" || scaleTypeContent === "snipte") &&
        (scaleTypeHolder?.textContent === "snipte" ||
          scaleTypeHolder?.textContent === "")
      ) {
        document.getElementById("snippScaleForm").style.display = "flex";
        document.getElementById("npsScaleForm").style.display = "none";
        document.getElementById("npsLiteScaleForm").style.display = "none";
        document.getElementById("likertScaleForm").style.display = "none";
        document.getElementById("percentScaleForm").style.display = "none";
        document.getElementById("percentSumScaleForm").style.display = "none";
        document.getElementById("comparisonScaleForm").style.display = "none";
      } else if (
        (scaleTypeContent === "" || scaleTypeContent === "nps_lite") &&
        (scaleTypeHolder?.textContent === "nps_lite" ||
          scaleTypeHolder?.textContent === "")
      ) {
        document.getElementById("npsLiteScaleForm").style.display = "flex";
        document.getElementById("npsScaleForm").style.display = "none";
        document.getElementById("snippScaleForm").style.display = "none";
        document.getElementById("likertScaleForm").style.display = "none";
        document.getElementById("percentScaleForm").style.display = "none";
        document.getElementById("percentSumScaleForm").style.display = "none";
        document.getElementById("comparisonScaleForm").style.display = "none";
      } else if (
        (scaleTypeContent === "" || scaleTypeContent === "likert") &&
        (scaleTypeHolder?.textContent === "likert" ||
          scaleTypeHolder?.textContent === "")
      ) {
        document.getElementById("likertScaleForm").style.display = "flex";
        document.getElementById("npsScaleForm").style.display = "none";
        document.getElementById("snippScaleForm").style.display = "none";
        document.getElementById("npsLiteScaleForm").style.display = "none";
        document.getElementById("percentScaleForm").style.display = "none";
        document.getElementById("percentSumScaleForm").style.display = "none";
        document.getElementById("comparisonScaleForm").style.display = "none";
      } else if (
        (scaleTypeContent === "" || scaleTypeContent === "percent_scale") &&
        (scaleTypeHolder?.textContent === "percent_scale" ||
          scaleTypeHolder?.textContent === "")
      ) {
        document.getElementById("likertScaleForm").style.display = "none";
        document.getElementById("npsScaleForm").style.display = "none";
        document.getElementById("snippScaleForm").style.display = "none";
        document.getElementById("npsLiteScaleForm").style.display = "none";
        document.getElementById("percentScaleForm").style.display = "flex";
        document.getElementById("comparisonScaleForm").style.display = "none";
        document.getElementById("percentSumScaleForm").style.display = "none";
      } else if (
        (scaleTypeContent === "" || scaleTypeContent === "percent_sum_scale") &&
        (scaleTypeHolder?.textContent === "percent_sum_scale" ||
          scaleTypeHolder?.textContent === "")
      ) {
        document.getElementById("likertScaleForm").style.display = "none";
        document.getElementById("npsScaleForm").style.display = "none";
        document.getElementById("snippScaleForm").style.display = "none";
        document.getElementById("npsLiteScaleForm").style.display = "none";
        document.getElementById("percentScaleForm").style.display = "none";
        document.getElementById("comparisonScaleForm").style.display = "none";
        document.getElementById("percentSumScaleForm").style.display = "flex";
      } else if (
        (scaleTypeContent === "" ||
          scaleTypeContent === "comparison_paired_scale") &&
        (scaleTypeHolder?.textContent === "comparison_paired_scale" ||
          scaleTypeHolder?.textContent === "")
      ) {
        document.getElementById("likertScaleForm").style.display = "none";
        document.getElementById("npsScaleForm").style.display = "none";
        document.getElementById("snippScaleForm").style.display = "none";
        document.getElementById("npsLiteScaleForm").style.display = "none";
        document.getElementById("percentScaleForm").style.display = "none";
        document.getElementById("percentSumScaleForm").style.display = "none";
        document.getElementById("comparisonScaleForm").style.display = "flex";
      }
    }
  }, []);

  const [labelType, setLabelType] = useState("Select Label Type");
  const [labelScale, setLabelScale] = useState("--Select Choice--");
  const [labelTexts, setLabelTexts] = useState([]);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null); // Track active emoji picker for text label type
  const userDetails = JSON.parse(sessionStorage.getItem("userDetail"));
  useEffect(() => {
    // Fetch saved data from storage (localStorage, sessionStorage, etc.)
    const savedLabelScale = localStorage.getItem("labelScale");
    const savedLabelTexts = JSON.parse(localStorage.getItem("labelTexts"));

    // Set the initial state with fetched data
    setLabelScale(savedLabelScale || ""); // Use empty string as a fallback
    setLabelTexts(savedLabelTexts || []); // Use an empty array as a fallback
  }, []);

  const handleLabelTypeChange = (event) => {
    const selectedValue = event.target.value;
    setLabelType(selectedValue);
    setLabelTexts([]); // Reset labelTexts when changing label type
    setSelectedEmojis([]); // Reset selectedEmojis when changing label type
    setActiveEmojiPicker(null); // Reset active emoji picker when changing label type
  };

  const handleLabelScaleChange = (event) => {
    const selectedValue = event.target.value;
    setLabelScale(selectedValue);

    // Create new input fields based on the selected value
    if (labelType === "Text") {
      setLabelTexts(
        Array.from({ length: Number(selectedValue) }, (_, index) => "")
      );
      setSelectedEmojis(
        Array.from({ length: Number(selectedValue) }, () => "")
      );
      setActiveEmojiPicker(null); // Reset active emoji picker for text label type
    }
  };

  var likertText = document.querySelectorAll("label-text-input");
  const updatedLabels = labelType === "Text" ? labelTexts : selectedEmojis;
  if (likertText) {
    likertText.defaultValue = updatedLabels;
  }

  const handleEmojiChange = (index, emoji) => {
    // Check if the emoji is already selected for another input
    if (selectedEmojis.includes(emoji)) {
      alert(
        "This emoji is already selected for another input. Please select a different emoji."
      );
      return;
    }

    const updatedSelectedEmojis = [...selectedEmojis];
    updatedSelectedEmojis[index] = emoji;
    setSelectedEmojis(updatedSelectedEmojis);
  };

  const handleLabelTextChange = (index, event) => {
    const updatedLabelTexts = [...labelTexts];
    updatedLabelTexts[index] = event.target.value;

    // Update the state variable
    setLabelTexts(updatedLabelTexts);

    // Save the updated data to storage
    localStorage.setItem("labelTexts", JSON.stringify(updatedLabelTexts));
  };

  const areAllTextInputsFilled = labelTexts.every(
    (labelText) => labelText.trim() !== ""
  );
  const areAllImageEmojisFilled = selectedEmojis.some((emoji) => emoji);

  const isUpdateButtonDisabled =
    (labelType === "Text" &&
      (!areAllTextInputsFilled || labelScale === "--Select Choice--")) ||
    (labelType === "Image" &&
      (!areAllImageEmojisFilled || labelScale === "--Select Choice--"));

  const [selectedImages, setSelectedImages] = useState([]);

  const handleImage = (event) => {
    const files = Array.from(event.target.files);

    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxDimension = 13; // Maximum dimension for the resized image
            let width = img.width;
            let height = img.height;

            if (width > height && width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            } else if (height > width && height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            } else if (width === height && width > maxDimension) {
              width = height = maxDimension;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL());
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises)
      .then((imageData) => {
        setSelectedImages((prevImages) => [...prevImages, ...imageData]);
      })
      .catch((error) => {
        console.error("Error uploading images:", error);
      });
  };

  const onEmojiClick = (emojiObject, inputId) => {
    const emoji = emojiObject.emoji;
    if (inputStr.includes(emoji)) {
      alert("The emoji is already selected");
    } else {
      const inputRefToUpdate = inputId === "emojiInp1" ? inputRef1 : inputRef2;

      const start = inputRefToUpdate.current.selectionStart;
      const end = inputRefToUpdate.current.selectionEnd;
      const textBeforeCursor = inputStr.slice(0, start);
      const textAfterCursor = inputStr.slice(end);

      const newInputStr = textBeforeCursor + emoji + textAfterCursor;

      setInputStr(newInputStr);

      // Move the cursor position to after the inserted emoji
      const newCursorPosition = start + emoji.length;
      inputRefToUpdate.current.setSelectionRange(
        newCursorPosition,
        newCursorPosition
      );

      setShowPicker(false);
    }
  };

  const [borderSize, setBorderSize] = useState(
    Number(localStorage.getItem("borderSize")) || 0
  );
  const [borderColor, setBorderColor] = useState(
    localStorage.getItem("borderColor") || "#000000"
  );
  const [showSlider, setShowSlider] = useState(false);

  const [iframeKey, setIframeKey] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  var decoded = jwt_decode(token);
  // console.log(data, "data");
  // console.log(companyId);

  const holderDIV = document.querySelector(".focussedd");
  // const scaleId = holderDIV?.children[1].innerHTML;
  const label = holderDIV?.children[2];

  const handleChange = (e) => {
    label.innerHTML = e.target.value;
  };

  useEffect(() => {
    setCustom1(localStorage.getItem("inputValue1"));
    setCustom2(localStorage.getItem("inputValue2"));
    setCustom3(localStorage.getItem("inputValue3"));
    localStorage.setItem("borderSize", borderSize === "0");
    localStorage.setItem("borderColor", borderColor === "black");
  }, [borderSize, borderColor]);

  // useEffect(() => {
  //   // Access the iframe's window object and add an event listener to it
  //   const iframeWindow = document.getElementById("update_ifr");
  //   iframeWindow.addEventListener('click', handleClick);

  //   // Remove the event listener when the component unmounts
  //   return () => {
  //     iframeWindow.removeEventListener('blur', handleClick);
  //   };
  // }, []);
  // function handleClick(event) {
  //   // console.log('Click event inside iframe:', event);
  //   setIframeKey(prevKey => prevKey + 1);
  // }

  function sendMessage() {
    const message =
      decoded.details.action === "document"
        ? "Document saved"
        : "Template saved";
    const iframe = document.querySelector("iframe");
    iframe?.contentWindow?.postMessage(message, "*");
  }

  const handleProductCountChange = (e) => {
    const newCount = parseInt(e.target.value, 10) || 0;
    setProductCount(newCount);

    // Update the input fields array
    const newInputFields = [];
    for (let i = 0; i < newCount; i++) {
      newInputFields.push(
        <input key={i} type="text" placeholder={`Product ${i + 1}`} required />
      );
    }
    setInputFields(newInputFields);
  };

  console.log(scale);

  const handleInputChange = (event) => {
    const selectedValue = event.target.value;
    setPercentSumInputValue(selectedValue);
    if (selectedValue == "") {
      setPercentSumLabelTexts([]);
    }
  };

  const handleKeyDownPress = (event) => {
    if (event.key === "Enter") {
      const selectedValue = event.target.value;
      if (Number(selectedValue) >= 2 && Number(selectedValue) <= 10) {
        setPercentSumLabelTexts(
          Array.from({ length: Number(selectedValue) }, (_, index) => "")
        );
      } else {
        alert(
          `You entered ${selectedValue}. Product Count value should be between 2 to 10 only`
        );
        setPercentSumInputValue("");
      }
    }
  };

  const handlePercentSumLabelTextChange = (index, event) => {
    const updatedLabelTexts = [...percentSumLabelTexts];
    updatedLabelTexts[index] = event.target.value;
    setPercentSumLabelTexts(updatedLabelTexts);

    let productNames = document.getElementById("product_count_label");
    let inputFields = productNames?.querySelectorAll("input");
    const hasInputValues = [...inputFields].every(
      (inputField) => inputField.value != ""
    );
    if (hasInputValues) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };
  // paired_comparison scale
  const [pairedInputValue, setPairedInputValue] = useState("");
  const [pairedLabelTexts, setPairedLabelTexts] = useState([]);

  const handlePairedInputChange = (event) => {
    const selectedValue = event.target.value;
    setPairedInputValue(selectedValue);
    if (selectedValue == "") {
      setPairedInputValue([]);
    }
  };

  const itemCountcombinedOnChange = (event) => {
    handlePairedInputChange(event);
    handlePairedScaleInputChange(event);
  };

  const scaleNameCombinedOnChange = (event) => {
    setScaleTitle(event.target.value);
    handlePairedScaleInputChange(event);
  };

  const handlePairedKeyDownPress = (event) => {
    if (event.key === "Enter") {
      const selectedValue = event.target.value;
      if (Number(selectedValue) >= 2 && Number(selectedValue) <= 100) {
        setPairedLabelTexts(
          Array.from({ length: Number(selectedValue) }, (_, index) => "")
        );
      } else {
        alert(
          `You entered ${selectedValue}. Item Count value should be between 2 to 100 only`
        );
        setPercentSumInputValue("");
      }
    }
  };

  const handlePairedLabelTextChange = (index, event) => {
    const updatedLabelTexts = [...pairedLabelTexts];
    updatedLabelTexts[index] = event.target.value;
    setPairedLabelTexts(updatedLabelTexts);

    let ItemNames = document.getElementById("item_count_label");
    let inputFields = ItemNames?.querySelectorAll("input");
    const hasInputValues = [...inputFields].every(
      (inputField) => inputField.value != ""
    );
    if (hasInputValues) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };

  const handleUpdates = () => {
    const scaleType = document.getElementById("scaleType");
    console.log("Content prop", scaleTypeContent);
    setScaleTypeContent(scaleType ? scaleType.value : scaleTypeContent);
    const scaleTypeHolder = scale?.querySelector(".scaleTypeHolder");
    scaleTypeHolder.textContent = scaleType
      ? scaleType.value
      : scaleTypeContent;
    if (
      scaleType
        ? scaleType.value === "nps" || scaleTypeContent === "nps"
        : scaleTypeContent === "nps" || scaleTypeHolder?.textContent === "nps"
    ) {
      const scale = document.querySelector(".focussedd");
      // console.log(scale);
      const circles = scale?.querySelector(".circle_label");
      // console.log(circles);
      const btnUpdateButton = document.getElementById("button_color");
      const emojiInp = document.getElementById("emojiInp").value;
      const btnUpdateScale = document.getElementById("scale_color");
      const btnUpdateFontColor = document.getElementById("font_color");
      const btnUpdateScaleFont = document.getElementById("font_style");
      const beNametnUpdateScal = document.getElementById("scaleLabel");

      const btnUpdateLeft = document.getElementById("left");
      const btnUpdateRight = document.getElementById("right");
      const btnUpdateCenter = document.getElementById("centre");

      const button = scale?.querySelector(".label_hold");
      const scaleText = scale?.querySelector(".scale_text");
      const button4 = scale?.querySelector(".scool_input");
      const labelHold = scale?.querySelector(".label_hold");
      const buttonImage = scale?.querySelectorAll(".image_label");
      const buttonCircleM = scale?.querySelector(".circle_label");
      const buttonChild = scale?.querySelector("#child");
      const buttonChildLeft = scale?.querySelector(".left_child");
      const buttonChildRight = scale?.querySelector(".right_child");
      const buttonChildNeutral = scale?.querySelector(".neutral_child");
      const optionSelect = document.getElementById("format");
      const option =
        document.querySelector("#orientationId").options[
          document.querySelector("#orientationId").selectedIndex
        ];

      // console.log(idHolder);
      let timeId = document.getElementById("timeId");
      let time = document.getElementById("time");

      let tempText = scale?.querySelector(".tempText");
      const selectedOption = optionSelect.value;
      tempText?.remove();

      const nps_vertical = document.createElement("h2");
      nps_vertical.className = "nps_vertical";
      nps_vertical.style.display = "none";
      nps_vertical.textContent = "";

      if (option.value === "Horizontal") {
        nps_vertical.textContent = "";

        button4.style.border = "block";
        button4.style.textAlign = "center";
        button.style.display = "flex";
        button.style.flexDirection = "row";
        button.style.alignItems = "center";
        button.style.height = "85%";
        button.style.width = "100%";
        button.style.flexDirection = "row";
        buttonChildRight.style.marginTop = "0px";
        buttonChildNeutral.style.marginTop = "0px";
        buttonChild.style.flexDirection = "row";
        buttonChild.style.justifyContent = "space-between";
        buttonChild.style.alignItems = "center";
        button.style.position = "";
        buttonChild.style.marginLeft = "0px";
        button.style.marginLeft = "0px";
        labelHold.style.transform = "";
        buttonChild.style.width = "";
        buttonChild.style.height = "";
      }

      if (option.value === "Vertical") {
        nps_vertical.textContent = "nps_vertical";
        button4.style.overflow = "hidden";
        labelHold.style.height = "100%";
        labelHold.style.top = "50%";
        labelHold.style.left = "50%";
        labelHold.style.transform = "translate(-50%, -50%)";
        button4.style.border = "none";
        button4.style.textAlign = "center";
        button.style.width = "100%";
        button.style.position = "absolute";
        button.style.flexDirection = "column";
        button.style.alignItems = "center";
        button.style.marginTop = "0";
        buttonChild.style.display = "flex";
        buttonChild.style.flexDirection = "column";
        buttonChild.style.justifyContent = "space-between";

        buttonChild.style.alignItems = "flex-start";
        buttonChild.style.width = "32%";
        buttonChild.style.marginLeft = "auto";
        buttonChild.style.height = "98%";

        buttonCircleM.style.marginTop = "2px";
      }
      const orientation = scale?.querySelector(".nps_vertical")?.remove();
      button4.appendChild(nps_vertical);

      const prepareImageLabels = () => {
        const imageLabels = {};

        const repeatedImages = [];
        const selectedCount = Math.min(selectedImages.length, 11); // Replace 11 with the actual label count

        for (let i = 0; i < 11; i++) {
          // Replace 11 with the actual label count
          const imageIndex = i % selectedCount;
          repeatedImages.push(selectedImages[imageIndex]);
        }

        for (let i = 0; i < 11; i++) {
          // Replace 11 with the actual label count
          imageLabels[i] = repeatedImages[i];
        }

        return imageLabels;
      };
      const prepareEmojiLabels = () => {
        const emojiFormat = /(\p{Emoji}|\uFE0F)/gu;
        const emojis = inputStr
          .split(emojiFormat)
          .filter((emoji) => emoji !== "");

        const emojiLabels = {};

        const repeatedEmoji = [];
        const selectedCount = Math.min(emojis.length, 11); // Replace 11 with the actual label count

        for (let i = 0; i < 11; i++) {
          // Replace 11 with the actual label count
          const emojindex = i % selectedCount;
          repeatedEmoji.push(emojis[emojindex]);
        }

        for (let i = 0; i < 11; i++) {
          // Replace 11 with the actual label count
          emojiLabels[i] = repeatedEmoji[i];
        }

        return emojiLabels;
      };
      const emojiLabels = prepareEmojiLabels();
      const imageLabels = prepareImageLabels();
      // console.log(imageLabels);

      if (
        idHolder.textContent === "scale Id" ||
        idHolder.textContent === "id"
      ) {
        setIsLoading(true);
        // console.log("post req");
        Axios.post("https://100035.pythonanywhere.com/api/nps_create/", {
          user: "true",
          username: userDetails === null ? " " : userDetails.userinfo.username,
          orientation: option?.value,
          scalecolor: btnUpdateScale.value,
          roundcolor: btnUpdateButton.value,
          fontcolor: btnUpdateFontColor.value,
          fomat: "numbers",
          allow_resp: true,
          show_total_score: true,
          no_of_scales: 6,
          time: timeId.style.display === "none" ? "00" : time?.value,
          name: beNametnUpdateScal.value,
          left: btnUpdateLeft.value,
          right: btnUpdateRight.value,
          center: btnUpdateCenter.value,
          image_label_format: imageLabels,
          fontstyle: btnUpdateScaleFont.value,
          custom_emoji_format: emojiLabels,
        })
          .then((res) => {
            setIsLoading(false);

            sendMessage();
            setScaleData(res.data.data.scale_id);
            const id = res.data.data.scale_id;
            // var successObj = JSON.parse(success);
            // const id = successObj.inserted_id;
            console.log("This is the scale id", id);
            if (id.length) {
              setScaleId(id && id);
              const idHolder = scale?.querySelector(".scaleId");
              idHolder.textContent = id && id;
            }

            labelHold.innerHTML = "";

            if (beNametnUpdateScal.value !== "") {
              scaleText.textContent = beNametnUpdateScal.value;
              scaleText.style.display = "none";
            }

            if (btnUpdateFontColor.value !== "") {
              button4.style.color = btnUpdateFontColor.value;
            }

            button4.style.display = "block";
            if (btnUpdateScale.value !== "") {
              button.style.backgroundColor = btnUpdateScale.value;
            }

            if (btnUpdateScaleFont.value !== "") {
              button4.style.fontFamily = btnUpdateScaleFont.value;
            }

            buttonChildLeft.textContent = btnUpdateLeft.value;
            buttonChildLeft.style.display = "none";

            buttonChildRight.textContent = btnUpdateRight.value;
            buttonChildRight.style.display = "none";

            buttonChildNeutral.style.display = "none";
            buttonChildNeutral.textContent = btnUpdateCenter.value;

            for (let i = 0; i <= 10; i++) {
              const selectedOption = optionSelect.value;
              const circle = document.createElement("div");
              circle.className = "circle_label";
              circle.textContent = i;

              // Apply circular background using inline style
              circle.style.width = "30px";
              circle.style.height = "24px";
              circle.style.borderRadius = "50%";
              circle.style.display = "flex";
              circle.style.justifyContent = "center";
              circle.style.alignItems = "center";
              circle.style.backgroundColor = btnUpdateButton.value;
              labelHold.style.gap = "5px";
              labelHold.style.height = "100%";
              labelHold.style.justifyContent = "space-evenly";
              labelHold.style.position = "relative";
              button4.style.height = "100%";
              button4.style.padding = "";
              labelHold.appendChild(circle);

              if (circle.textContent === "0" || i === 0) {
                circle.title = res.data.data.settings.left
              }
              else if (circle.textContent === "5" || i === 5) {
                circle.title = res.data.data.settings.center
              } else if (circle.textContent === "10" || i === 10) {
                circle.title = res.data.data.settings.right
              }

              if (selectedOption === "emoji" && emojiInp !== "") {
                console.log(selectedOption);
                // Set the text content of the div to the corresponding emoji
                const emojiFormat = /(\p{Emoji}|\uFE0F)/gu;
                const emojis = emojiInp
                  .split(emojiFormat)
                  .filter((emoji) => emoji !== "");
                console.log(emojis);
                circle.textContent = emojis[i % emojis.length];
              } else {
                // Set the text content of the div to the number
                circle.textContent = i;
              }
            }

            // console.log(res);
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err);
          });
      } else {
        setIsLoading(true);
        // console.log("PUT req");
        // console.log(idHolder.textContent);
        Axios.put("https://100035.pythonanywhere.com/api/nps_create/", {
          user: "true",
          scale_id: idHolder.textContent,
          username: userDetails === null ? " " : userDetails.userinfo.username,
          orientation: option?.value,
          scalecolor: btnUpdateScale.value,
          roundcolor: btnUpdateButton.value,
          fontcolor: btnUpdateFontColor.value,
          fomat: selectedOption,
          allow_resp: true,
          show_total_score: true,
          no_of_scales: 6,
          time: timeId?.style?.display === "none" ? "00" : time?.value,
          name: beNametnUpdateScal.value,
          left: btnUpdateLeft.value,
          right: btnUpdateRight.value,
          center: btnUpdateCenter.value,
          label_images: { 0: "imagefile", 1: "imagefile", 2: "imagefile" },
          fontstyle: btnUpdateScaleFont.value,
          custom_emoji_format: emojiLabels,
        })
          .then((res) => {
            if (res.status == 200) {
              setIsLoading(false);
              sendMessage();
              setScaleData(res.data);
              // console.log(res.data.data.data);
              setScaleId(scaleId);
              // console.log(res);
              // console.log("This is the still scale", scale);

              labelHold.innerHTML = "";

              if (beNametnUpdateScal.value !== "") {
                scaleText.textContent = beNametnUpdateScal.value;
              }

              if (btnUpdateFontColor.value !== "") {
                button4.style.color = btnUpdateFontColor.value;
              }

              button4.style.display = "block";
              if (btnUpdateScale.value !== "") {
                button.style.backgroundColor = btnUpdateScale.value;
              }

              if (btnUpdateScaleFont.value !== "") {
                button4.style.fontFamily = btnUpdateScaleFont.value;
              }

              buttonChildLeft.textContent = btnUpdateLeft.value;
              buttonChildLeft.style.display = "none";

              buttonChildRight.textContent = btnUpdateRight.value;
              buttonChildRight.style.display = "none";

              buttonChildNeutral.style.display = "none";
              buttonChildNeutral.textContent = btnUpdateCenter.value;

              for (let i = 0; i <= 10; i++) {
                const selectedOption = optionSelect.value;
                const circle = document.createElement("div");
                circle.className = "circle_label";
                circle.textContent = i;

                // Apply circular background using inline style
                circle.style.width = "40px";
                circle.style.height = "24px";
                circle.style.borderRadius = "50%";
                circle.style.display = "flex";
                circle.style.justifyContent = "center";
                circle.style.alignItems = "center";
                circle.style.backgroundColor = btnUpdateButton.value;
                labelHold.style.gap = "5px";
                labelHold.style.height = "100%";
                labelHold.style.justifyContent = "space-evenly";
                labelHold.style.position = "relative";
                button4.style.height = "100%";
                button4.style.padding = "";
                labelHold.appendChild(circle);

                if (circle.textContent === "0" || i === 0) {
                  circle.title = res.data.data.settings.left
                }
                else if (circle.textContent === "5" || i === 5) {
                  circle.title = res.data.data.settings.center
                } else if (circle.textContent === "10" || i === 10) {
                  circle.title = res.data.data.settings.right
                }

                if (selectedOption === "emoji" && emojiInp !== "") {
                  console.log(selectedOption);
                  // Set the text content of the div to the corresponding emoji
                  const emojiFormat = /(\p{Emoji}|\uFE0F)/gu;
                  const emojis = emojiInp
                    .split(emojiFormat)
                    .filter((emoji) => emoji !== "");
                  console.log(emojis);
                  circle.textContent = emojis[i % emojis.length];
                } else {
                  // Set the text content of the div to the number
                  circle.textContent = i;
                }
              }
            }
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err.message);
          });
      }
    } else if (
      scaleType
        ? scaleType.value === "snipte" || scaleTypeContent === "snipte"
        : scaleTypeContent === "snipte" ||
          scaleTypeHolder?.textContent === "snipte"
    ) {
      const scale = document.querySelector(".focussedd");
      // console.log(scale);

      const stapelId = scale?.querySelector(".scaleId");
      const btnUpdateScale = document.getElementById("scale_color_stapel");
      const btnUpdateFontColor = document.getElementById("font_color_stapel");
      const btnUpdateButton = document.getElementById("button_color_stapel");
      const beNametnUpdateScal = document.getElementById("scaleLabel_stapel");
      const btnUpdateLeft = document.getElementById("leftStapel");
      const btnUpdateRight = document.getElementById("rightStapel");

      const scaleField = scale?.querySelector(".newScaleInput");
      const savedStapelScaleArr = scale?.querySelector(".stapelScaleArray");
      const savedOptionHolder = scale?.querySelector(".stapelOptionHolder");
      const btnUpdateScaleFontStapel =
        document.getElementById("font_style_stapel");
      const optionSelect = document.getElementById("format_stapel");
      const option = document.querySelector("#orientationIdStapel").options[
        document.querySelector("#orientationIdStapel").selectedIndex
      ];
      let timeId = document.getElementById("timeId_stapel");
      let time = document.getElementById("time_stapel");
      const upperVal = parseInt(document.getElementById("upperVal").value, 10)
      const spacing = parseInt(document.getElementById("spacing").value, 10);

      const scaleTypeHolder = document.createElement("h6");
      scaleTypeHolder.className = "scaleTypeHolder";
      scaleTypeHolder.textContent = scaleType
        ? scaleType.value
        : scaleTypeContent;
      scaleTypeHolder.style.display = "none";

      const scaleText = document.createElement("div");
      scaleText.className = "scale_text";
      scaleText.textContent = "Untitled-file_scale";
      scaleText.style.display = "none";

      const upperScaleimit = document.createElement("h6");
      upperScaleimit.className = "upper_scale_limit";
      upperScaleimit.textContent = "";
      upperScaleimit.style.display = "none";

      const spaceUnit = document.createElement("h6");
      spaceUnit.className = "space_unit";
      spaceUnit.textContent = "";
      spaceUnit.style.display = "none";

      const stapelScaleArray = document.createElement("div");
      stapelScaleArray.className = "stapelScaleArray";
      stapelScaleArray.textContent = "";
      stapelScaleArray.style.display = "none";

      // Construct row of values
      const selectedOption = optionSelect.value;
      const optionHolder = document.createElement("div");
      optionHolder.className = "stapelOptionHolder";
      optionHolder.style.display = "none";

      const otherComponent = document.createElement("h6");
      otherComponent.className = "otherComponent";
      otherComponent.style.display = "none";
      otherComponent.textContent = ""

      const prepareEmojiLabels = () => {
        const emojiFormat = /(\p{Emoji}|\uFE0F)/gu;
        const emojis = inputStr
          .split(emojiFormat)
          .filter((emoji) => emoji !== "");

        const emojiLabels = {};
        let j = 0;
        let valRange =
        upperLimit % space !== 0
            ? Math.floor(upperLimit / space) * 2
            : upperLimit;
            console.log("This is upp",  space);
        for (let i = valRange * -1; i <= valRange; i += spacing) {
          if (i !== 0) {
            const emojiIndex = j;
            emojiLabels[i] = emojis[emojiIndex];
            j++;
            console.log("This is I",i);
            console.log(Math.floor(Number(upperLimit) / Number(space)));
          }
        }
        console.log("This is the scale",scale);
        return emojiLabels;
      };
      const emojiLabels = prepareEmojiLabels()

      if (
        idHolder.textContent === "scale Id" ||
        idHolder.textContent === "id"
      ) {
        setIsLoading(true);
        Axios.post(
          "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/",
          {
            user: "true",
            username:
              userDetails === null ? " " : userDetails.userinfo.username,
            orientation: option?.value,
            spacing_unit: spacing,
            scale_upper_limit: upperVal,
            scalecolor: btnUpdateScale.value,
            roundcolor: btnUpdateButton.value,
            fontcolor: btnUpdateFontColor.value,
            fomat: selectedOption,
            time: timeId.style.display === "none" ? "00" : time?.value,
            name: beNametnUpdateScal.value,
            left: btnUpdateLeft.value,
            right: btnUpdateRight.value,
            label_images: { 0: "imagefile", 1: "imagefile", 2: "imagefile" },
            fontstyle: btnUpdateScaleFontStapel.value,
            custom_emoji_format: emojiLabels,
          }
        )
          .then((res) => {
            setIsLoading(false);
            sendMessage();
            setScaleData(res.data.data.scale_id);
            const id = res.data.data.scale_id;

            if (id.length) {
              setScaleId(id && id);
              const idHolder = scale?.querySelector(".scaleId");
              idHolder.textContent = id && id;
            }

            console.log(
              "This is scale type holder",
              scaleTypeHolder?.textContent
            );
            const scaleArr = res.data.data.settings.scale;
            const fomart = res.data.data.settings.fomat;

            // Clear existing values
            // labelHold.innerHTML = "";
            scaleField.innerHTML = "";

            for (let i = 0; i < scaleArr.length; i++) {
              const circle = document.createElement("div");
              circle.className = "circle_label";
              circle.textContent = scaleArr[i];
              scaleField.append(circle);
              circle.style.width = "35px";
              circle.style.height = "35px";
              circle.style.borderRadius = "50%";
              circle.style.display = "flex";
              circle.style.flexDirection = "column";
              circle.style.justifyContent = "center";
              circle.style.alignItems = "center";
              circle.style.margin = "0 2px 2px 0";
              circle.style.backgroundColor = res.data.data.settings.roundcolor;
              if (fomart === "emoji") {
                // Set the text content of the div to the corresponding emoji
                circle.textContent =
                  res.data.data.settings.custom_emoji_format[scaleArr[i]];
                  circle.style.fontSize = "1.8vw";
              } else {
                // Set the text content of the div to the number
                circle.textContent = scaleArr[i];
              }
              if (i === 0) {
                var left = document.createElement("span");
                left.className = "leftToolTip";
                left.innerHTML = res.data.data.settings.left;
                left.style.visibility = "hidden";
                left.style.position = "absolute";
                left.style.zIndex = "1";
                left.style.bottom = option.value === "Vertical" ? " " : "7px";
                left.style.top = option.value === "Vertical" ? "5%" : "";
                left.style.left = option.value === "Vertical" ? "" : "5%";
                left.style.right = option.value === "Vertical" ? "5%" : "";
                left.style.fontSize = "small";
                left.style.writingMode =
                  option.value === "Vertical" ? "tb-rl" : "";
                left.style.backgroundColor = "#272828";
                left.style.color = "#EEEFEF";
                left.style.borderRadius = "3px"
                circle.append(left);

                circle.title = res.data.data.settings.left
              } else if (i === scaleArr.length - 1) {
                var right = document.createElement("span");
                right.className = "rightTooltip";
                right.innerHTML = res.data.data.settings.right;
                right.style.display = "none";
                right.style.position = "absolute";
                right.style.zIndex = "1";
                right.style.bottom = "7px";
                right.style.right = "5%";
                right.style.backgroundColor = "#272828";
                right.style.color = "#EEEFEF";
                right.style.fontSize = "small";
                right.style.writingMode =
                  option.value === "Vertical" ? "tb-rl" : "";
                right.style.width === "100%"
                right.style.padding === "0 20px"
                right.style.borderRadius = "3px"
                circle.append(right);
                
                circle.title = res.data.data.settings.right
              }
            }

            scaleField.style.backgroundColor = res.data.data.settings.scalecolor;
            scaleField.style.color = res.data.data.settings.fontcolor;
            scaleText.textContent = res.data.data.settings.name;
            scaleField.style.fontFamily = res.data.data.settings.fontstyle;
            optionHolder.textContent = res.data.data.settings.fomat;
            upperScaleimit.textContent = res.data.data.settings.scale_upper_limit
            spaceUnit.textContent = res.data.data.settings.spacing_unit
            scaleField.appendChild(optionHolder);
            stapelScaleArray.textContent = res.data.data.settings.scale;
            scaleField.append(stapelScaleArray);
            scaleField.append(scaleTypeHolder);
            scaleField.append(scaleText);
            scaleField.append(upperScaleimit)
            scaleField.append(spaceUnit)
            scaleField.appendChild(otherComponent);
            const idHolder = document.createElement("h6");
            idHolder.className = "scaleId";
            idHolder.textContent = id && id;
            idHolder.style.display = "none";
            scaleField.append(idHolder);

            if (option.value === "Horizontal") {
              scaleField.style.display = "flex";
              scaleField.style.flexDirection = "row";
              scaleField.style.alignItems = "center";
              scaleField.style.justifyContent = "center";
            } else if (option.value === "Vertical") {
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
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err);
          });
      } else {
        setIsLoading(true);
        // console.log("PUT req");
        // console.log(idHolder.textContent);
        Axios.put(
          "https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/",
          {
            scale_id: idHolder.textContent,
            fomat: selectedOption,
            scale_upper_limit: upperVal,
            spacing_unit: spacing,
            scalecolor: btnUpdateScale.value,
            roundcolor: btnUpdateButton.value,
            fontcolor: btnUpdateFontColor.value,
            time: timeId?.style?.display === "none" ? "00" : time?.value,
            name: beNametnUpdateScal.value,
            left: btnUpdateLeft.value,
            right: btnUpdateRight.value,
            label_images: { 0: "imagefile", 1: "imagefile", 2: "imagefile" },
            fontstyle: btnUpdateScaleFontStapel.value,
            custom_emoji_format: emojiLabels,
          }
        )
          .then((res) => {
            if (res.status == 200) {
              setIsLoading(false);
              sendMessage();
              setScaleData(res.data);
              setScaleId(scaleId);
              console.log("This is the data", res.data.data.settings);
              savedStapelScaleArr.textContent = res.data.data.settings.scale;
              savedOptionHolder.textContent = res.data.data.settings.fomat;
              const scaleArr = res.data.data.settings.scale;
              const fomart = res.data.data.settings.fomat;

              // Clear existing values
              //labelHold.innerHTML = "";
              scaleField.innerHTML = "";
              for (let i = 0; i < scaleArr.length; i++) {
                const circle = document.createElement("div");
                circle.className = "circle_label";
                circle.textContent = scaleArr[i];
                scaleField.append(circle);
                circle.style.width = "35px";
                circle.style.height = "35px";
                circle.style.borderRadius = "50%";
                circle.style.display = "flex";
                circle.style.flexDirection = "column";
                circle.style.justifyContent = "center";
                circle.style.alignItems = "center";
                circle.style.margin = "0 2px 2px 0";
                circle.style.backgroundColor =
                  res.data.data.settings.roundcolor;
                if (fomart === "emoji") {
                  // Set the text content of the div to the corresponding emoji
                  circle.textContent =
                    res.data.data.settings.custom_emoji_format[scaleArr[i]];
                  circle.style.fontSize = "1.8vw";
                } else {
                  // Set the text content of the div to the number
                  circle.textContent = scaleArr[i];
                }
                if (i === 0) {
                  var left = document.createElement("span");
                  left.className = "leftToolTip";
                  left.innerHTML = res.data.data.settings.left;
                  left.style.visibility = "hidden";
                  left.style.position = "absolute";
                  left.style.zIndex = "1";
                  left.style.bottom = option.value === "Vertical" ? " " : "7px";
                  left.style.top = option.value === "Vertical" ? "5%" : "";
                  left.style.left = option.value === "Vertical" ? "" : "5%";
                  left.style.right = option.value === "Vertical" ? "5%" : "";
                  left.style.fontSize = "small";
                  left.style.writingMode =
                    option.value === "Vertical" ? "tb-rl" : "";
                  left.style.backgroundColor = "#272828";
                  left.style.color = "#EEEFEF";
                  circle.append(left)

                  circle.title = res.data.data.settings.left
                } else if (i === scaleArr.length - 1) {
                  var right = document.createElement("span");
                  right.className = "rightTooltip";
                  right.innerHTML = res.data.data.settings.right;
                  right.style.display = "none";
                  right.style.position = "absolute";
                  right.style.zIndex = "1";
                  right.style.bottom = "7px";
                  right.style.right = "5%";
                  right.style.backgroundColor = "#272828";
                  right.style.color = "#EEEFEF";
                  right.style.fontSize = "small";
                  right.style.writingMode =
                    option.value === "Vertical" ? "tb-rl" : "";
                  circle.append(right);
                  
                  circle.title = res.data.data.settings.right
                }
              }

              scaleField.style.backgroundColor =
                res.data.data.settings.scalecolor;
              scaleField.style.color = res.data.data.settings.fontcolor;
              scaleField.style.fontFamily = res.data.data.settings.fontstyle;
              scaleText.textContent = res.data.data.settings.name;
              optionHolder.textContent = res.data.data.settings.fomat;
              upperScaleimit.textContent = res.data.data.settings.scale_upper_limit
              spaceUnit.textContent = res.data.data.settings.spacing_unit
              scaleField.appendChild(optionHolder);
              stapelScaleArray.textContent = res.data.data.settings.scale;
              scaleField.append(stapelScaleArray);
              scaleField.append(scaleTypeHolder);
              scaleField.append(scaleText);
              scaleField.append(upperScaleimit)
              scaleField.append(spaceUnit)
              scaleField.appendChild(otherComponent);
              const idHolder = document.createElement("h6");
              idHolder.className = "scaleId";
              idHolder.textContent = stapelId.textContent;
              idHolder.style.display = "none";
              scaleField.append(idHolder);

              if (option.value === "Horizontal") {
                scaleField.style.display = "flex";
                scaleField.style.flexDirection = "row";
                scaleField.style.alignItems = "center";
                scaleField.style.justifyContent = "center";
              } else if (option.value === "Vertical") {
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
            }

            console.log("scaleConet", scaleTypeContent);

            console.log("scaleConet", scaleTypeHolder?.textContent);
            console.log("Scalefield", scaleField);
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err.message);
          });
      }
      // if (btnUpdateScales.value !=="") {
      //   button4.style.textContent = btnUpdateScales.value;
      // }
      // if (btnUpdateScore.value !=="") {
      //   buttonChild.style.color = btnUpdateScore.value;
      // }
      // if (beNametnUpdateScal.value !== "") {
      //   scaleText.textContent = beNametnUpdateScal.value;
      // }
    } else if (
      scaleType
        ? scaleType.value === "nps_lite" || scaleTypeContent === "nps_lite"
        : scaleTypeContent === "nps_lite" ||
          scaleTypeHolder?.textContent === "nps_lite"
    ) {
      const btnUpdateScale = document.getElementById("scale_color_nps_lite");
      const btnUpdateFontColor = document.getElementById("font_color_nps_lite");
      const btnUpdateScaleFont = document.getElementById("font_style_nps_lite");
      const beNametnUpdateScal = document.getElementById(
        "scale_label_nps_lite"
      );

      const btnUpdateLeft = document.getElementById("left_nps_lite");
      const btnUpdateRight = document.getElementById("right_nps_lite");
      const btnUpdateCenter = document.getElementById("center_nps_lite");
      const optionSelect = document.getElementById("format_nps_lite");

      const button = scale?.querySelector(".label_hold");
      const scaleText = scale?.querySelector(".scale_text");
      const button4 = scale?.querySelector(".scool_input");

      const buttonChildLeft = scale?.querySelector(".left_child");
      const buttonChildRight = scale?.querySelector(".right_child");
      const buttonChildNeutral = scale?.querySelector(".neutral_child");

      const option = document.querySelector("#orientationId_nps_lite").options[
        document.querySelector("#orientationId_nps_lite").selectedIndex
      ];
      let timeId = document.getElementById("timeId_nps_lite");
      let time = document.getElementById("time_nps_lite");
      const emojiInp = document.getElementById("emoji_inp_nps_lite").value;

      let labelHold = scale?.querySelector(".label_hold");
      labelHold.style.display = "";
      let tempText = scale?.querySelector(".tempText");
      tempText?.remove();

      buttonChildLeft.textContent = "";
      buttonChildNeutral.textContent = "";
      buttonChildRight.textContent = "";

      const selectedOption = optionSelect.value;

      const orientation = document.createElement("div");
      orientation.className = "orientation";
      orientation.textContent = option.value;
      orientation.style.display = "none";
      button4.appendChild(orientation);

      const prepareEmojiLabels = () => {
        const emojiFormat = /(\p{Emoji}|\uFE0F)/gu;
        const emojis = inputStr
          .split(emojiFormat)
          .filter((emoji) => emoji !== "");

        const emojiLabels = {};

        const repeatedEmoji = [];
        const selectedCount = Math.min(emojis.length, 3);

        for (let i = 0; i < 3; i++) {
          const emojindex = i % selectedCount;
          repeatedEmoji.push(emojis[emojindex]);
        }

        for (let i = 0; i < 3; i++) {
          emojiLabels[i] = repeatedEmoji[i];
        }

        return emojiLabels;
      };

      const emojiLabels = prepareEmojiLabels();

      if (option.value === "Horizontal") {
        button4.style.border = "block";
        button4.style.display = "block";
        button4.style.textAlign = "center";
        button.style.alignItems = "center";
        button.style.height = "85%";
        button.style.width = "100%";
        button.style.display = "flex";
        button.style.flexDirection = "row";
        button.style.justifyContent = "center";
        button.style.position = "relative";
        button.style.marginLeft = "0px";
      }

      if (option.value === "Vertical") {
        const orientation = document.createElement("h2");
        orientation.className = "nps_lite_orientation";
        orientation.textContent = "Vertical";
        orientation.style.display = "none";
        button4.appendChild(orientation);

        button4.style.display = "flex";
        button4.style.alignItems = "center";
        button4.style.justifyContent = "center";
        
        button4.style.border = "none";
        button4.style.textAlign = "center";
        button.style.height = "auto";
        button.style.width = "50%";
        button.style.position = "absolute";
        button.style.display = "flex";
        button.style.flexDirection = "column";
        button.style.alignItems = "center";
        button.style.marginTop = "0";
      }

      if (
        idHolder.textContent === "scale Id" ||
        idHolder.textContent === "id"
      ) {
        setIsLoading(true);
        // console.log("post req");
        Axios.post(
          "https://100035.pythonanywhere.com/nps-lite/api/nps-lite-settings/",
          {
            user: "true",
            username:
              userDetails === null ? " " : userDetails.userinfo.username,
            orientation: option?.value,
            scalecolor: btnUpdateScale.value,
            fontcolor: btnUpdateFontColor.value,
            template_name: "temp202",
            no_of_scales: 6,
            time: timeId.style.display === "none" ? "00" : time?.value,
            name: beNametnUpdateScal.value,
            left: btnUpdateLeft.value,
            right: btnUpdateRight.value,
            center: btnUpdateCenter.value,
            fontstyle: btnUpdateScaleFont.value,
            fomat: selectedOption,
            custom_emoji_format: emojiLabels,
          }
        )
          .then((res) => {
            setIsLoading(false);
            sendMessage();
            setScaleData(res.data);
            const id = res.data.data.scale_id;
            console.log("This is the id", id);
            if (id.length) {
              setScaleId(id && id);
              const idHolder = scale?.querySelector(".scaleId");
              idHolder.textContent = id && id;
            }
            // console.log(res);

            button4.style.height = "100%";
            labelHold.innerHTML = "";
            labelHold.style.border = "";
            labelHold.style.height = "100%";
            const {
              fomat,
              left,
              center,
              right,
              scalecolor,
              name,
              fontcolor,
              fontstyle,
              custom_emoji_format,
            } = res.data.data.settings;
            const textValues = [left, center, right];

            const npsLiteTextArray = document.createElement("div");
            npsLiteTextArray.className = "nps_lite_text";
            npsLiteTextArray.textContent = [...textValues];
            npsLiteTextArray.style.display = "none";
            labelHold.append(npsLiteTextArray);

            for (let i = 0; i < textValues.length; i++) {
              const circle = document.createElement("div");
              circle.className = `circle_label circle_${i}`;
              circle.textContent = textValues[i];

              circle.style.borderRadius = "25px";
              circle.style.padding = "12px 27px";
              circle.style.margin = "0 auto";
              circle.style.display = "flex";
              circle.style.justifyContent = "center";
              circle.style.alignItems = "center";
              circle.style.width = "27%";
              circle.style.height = "35%";
              circle.style.fontSize = "18px";
              circle.style.backgroundColor = scalecolor;

              if (option.value === "Vertical") {
                circle.style.margin = "10px 0";
                circle.style.padding = "10px 30px";
              }

              labelHold.appendChild(circle);

              if (fomat === "emoji" && emojiInp !== "") {
                // Set the text content of the div to the corresponding emoji
                circle.textContent = custom_emoji_format[i];
              } else {
                circle.textContent = textValues[i];
              }
            }

            scaleText.textContent = name;
            scaleText.style.display = "none";
            button4.style.color = fontcolor;
            button4.style.fontFamily = fontstyle;
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err);
          });
      } else {
        setIsLoading(true);
        // console.log("PUT req");
        // console.log(idHolder.textContent);
        Axios.put(
          "https://100035.pythonanywhere.com/nps-lite/api/nps-lite-settings",
          {
            scale_id: idHolder.textContent,
            user: "true",
            username:
              userDetails === null ? " " : userDetails.userinfo.username,
            orientation: option?.value,
            scalecolor: btnUpdateScale.value,
            fontcolor: btnUpdateFontColor.value,
            template_name: "temp202",
            no_of_scales: 6,
            time: timeId.style.display === "none" ? "00" : time?.value,
            name: beNametnUpdateScal.value,
            left: btnUpdateLeft.value,
            right: btnUpdateRight.value,
            center: btnUpdateCenter.value,
            fontstyle: btnUpdateScaleFont.value,
            fomat: selectedOption,
            custom_emoji_format: emojiLabels,
          }
        )
          .then((res) => {
            if (res.status == 200) {
              setIsLoading(false);
              sendMessage();
              setScaleData(res.data);
              setScaleId(scaleId);
              // console.log(res);
              // console.log("This is the still scale", scale);

              button4.style.height = "100%";
              labelHold.innerHTML = "";
              labelHold.style.border = "";
              labelHold.style.height = "100%";
              const {
                fomat,
                left,
                center,
                right,
                scalecolor,
                name,
                fontcolor,
                fontstyle,
                custom_emoji_format,
              } = res.data.data;
              const textValues = [left, center, right];

              const npsLiteTextArray = document.createElement("div");
              npsLiteTextArray.className = "nps_lite_text";
              npsLiteTextArray.textContent = [...textValues];
              npsLiteTextArray.style.display = "none";
              labelHold.append(npsLiteTextArray);

              for (let i = 0; i < textValues.length; i++) {
                const circle = document.createElement("div");
                circle.className = `circle_label circle_${i}`;
                circle.textContent = textValues[i];

                circle.style.borderRadius = "25px";
                circle.style.padding = "12px 27px";
                circle.style.margin = "0 auto";
                circle.style.display = "flex";
                circle.style.justifyContent = "center";
                circle.style.alignItems = "center";
                circle.style.width = "27%";
                circle.style.height = "35%";
                circle.style.fontSize = "18px";
                circle.style.backgroundColor = scalecolor;

                if (option.value === "Vertical") {
                  circle.style.margin = "10px 0";
                  circle.style.padding = "10px 30px";
                }

                labelHold.appendChild(circle);

                if (fomat === "emoji" && emojiInp !== "") {
                  // Set the text content of the div to the corresponding emoji
                  circle.textContent = custom_emoji_format[i];
                } else {
                  circle.textContent = textValues[i];
                }
              }

              scaleText.textContent = name;
              scaleText.style.display = "none";
              button4.style.color = fontcolor;
              button4.style.fontFamily = fontstyle;
            }
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err.message);
          });
      }
    } else if (
      scaleType
        ? scaleType.value === "likert" || scaleTypeContent === "likert"
        : scaleTypeContent === "likert" ||
          scaleTypeHolder?.textContent === "likert"
    ) {
      const scale = document.querySelector(".focussedd");
      // console.log(scale);

      const btnUpdateScale = document.getElementById("scale_color_stapel");
      const btnUpdateFontColor = document.getElementById("font_color_likert");
      const btnUpdateButton = document.getElementById("button_color_likert");
      const beNametnUpdateScal = document.getElementById("scaleLabel_Likert");

      const btnUpdateLeft = document.getElementById("left");
      const btnUpdateRight = document.getElementById("right");
      const btnUpdateCenter = document.getElementById("centre");

      const buttonChildLeft = scale?.querySelector(".left_child");
      const buttonChildRight = scale?.querySelector(".right_child");
      const buttonChildNeutral = scale?.querySelector(".neutral_child");

      const button = scale?.querySelector(".label_hold");
      const scaleText = scale?.querySelector(".scale_text");
      const button4 = scale?.querySelector(".scool_input");
      const font = scale?.querySelector(".newScaleInput");

      const btnUpdateScaleFontLinkert =
        document.getElementById("font_style_likert");
      const option = document.querySelector("#orientationIdLinkert").options[
        document.querySelector("#orientationIdLinkert").selectedIndex
      ];
      let timeId = document.getElementById("timeId_likert");
      let time = document.getElementById("time_likert");
      let tempText = scale?.querySelector(".tempText");
      const labelHold = scale?.querySelector(".label_hold");
      // const labelScaleSelection = document.getElementById("labelScaleLinkert");
      // const optionSelect = document.getElementById("label_type_linkert");
      const likertNumberScale = document.getElementById("likert_no_scale");
      tempText?.remove();
      // Clear existing labels
      labelHold.innerHTML = "";

      if (btnUpdateLeft.value !== "") {
        buttonChildLeft.textContent = "";
      }
      if (btnUpdateCenter.value !== "") {
        buttonChildNeutral.textContent = "";
      }

      if (btnUpdateRight.value !== "") {
        buttonChildRight.textContent = "";
      }

      const numberOfScalesValue = Number(likertNumberScale.value);
      const labelTypeForPut = labelType === "Text" ? "text" : "emoji";
      const updatedLabelInput =
        labelType === "Text" ? labelTexts : selectedEmojis;
      const updatedLabels = labelType === "Text" ? labelTexts : selectedEmojis;

      const customEmojiFormat = updatedLabels.reduce((acc, label, index) => {
        acc[`${index + 1}`] = label;
        return acc;
      }, {});

      const updatedLabelScale =
        labelType === "Text" ? Number(labelScale) : selectedEmojis.length;
      // Remove any previous circles from the labelHold
      labelHold.innerHTML = "";
      const numRows = Math.ceil(updatedLabelScale / 3);
      const numColumns = Math.min(updatedLabelScale, 3);

      const likertScaleArray = document.createElement("div");
      likertScaleArray.className = "likert_Scale_Array";
      likertScaleArray.textContent = updatedLabels;
      likertScaleArray.style.display = "none";
      labelHold.append(likertScaleArray);
      // // Update labelHold grid styles
      labelHold.style.display = "grid";
      labelHold.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
      labelHold.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
      // Update circles with new labels

      if (option.value === "Horizontal") {
        button4.style.border = "block";
        button4.style.textAlign = "center";
        button4.style.alignItems = "center";
        button.style.height = "85%";
        button.style.width = "96%";
        button.style.display = "flex";
        button.style.flexDirection = "row";
        button.style.justifyContent = "center";
        button.style.position = "absolute";
        labelHold.style.display = "grid";
        labelHold.style.marginTop = "-10px";
        labelHold.style.paddingLeft = "0%";
        labelHold.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
        labelHold.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
        labelHold.style.overflowX = "hidden";
        labelHold.style.overflowY = "hidden";
      }

      if (option.value === "Vertical") {
        const orientation = document.createElement("div");
        orientation.className = "orientation";
        orientation.textContent = "vertical";
        orientation.style.display = "none";
        labelHold.appendChild(orientation);
        button.style.padding = "5px 10px";
        button.style.margin = "10px 0";
        button4.style.border = "none";
        labelHold.style.height = "96%";
        labelHold.style.width = "60%";
        labelHold.style.position = "absolute";
        button.style.display = "flex";
        button.style.flexDirection = "column";
        button.style.justifyContent = "center";
        button.style.alignItems = "center";
        button.style.marginTop = "-2px";  
        labelHold.style.marginLeft = "11%";
        labelHold.style.overflowY = "hidden"; 
        labelHold.style.overflowX = "hidden";
      }

      const basePayload = {
        user: "yes",
        username: userDetails === null ? " " : userDetails.userinfo.username,
        instance_id: "2",
        orientation: option?.value,
        fontstyle: btnUpdateScaleFontLinkert.value,
        scale_name: beNametnUpdateScal.value,
        no_of_scales: numberOfScalesValue,
        font_color: btnUpdateFontColor.value,
        round_color: btnUpdateButton.value,
        scale_color: "red",
        label_type: labelTypeForPut,
        label_scale_selection: updatedLabelScale,
        time: timeId.style.display === "none" ? "00" : time?.value,
        fomat: labelTypeForPut,
      };

      // Create a dynamic payload by conditionally adding fields
      const dynamicPayload = {
        ...basePayload,
        // Conditionally add either 'custom_emoji_format' or 'label_scale_input'
        ...(labelType === "Text"
          ? { label_scale_input: updatedLabels }
          : {
              label_scale_input: updatedLabels,
              custom_emoji_format: customEmojiFormat,
            }),
      };

      // for put request
      const basePayloadPut = {
        scale_id: idHolder.textContent,
        user: "yes",
        instance_id: "2",
        username: userDetails === null ? " " : userDetails.userinfo.username,
        fontstyle: btnUpdateScaleFontLinkert.value,
        orientation: option?.value,
        scale_name: beNametnUpdateScal.value,
        no_of_scales: numberOfScalesValue,
        font_color: btnUpdateFontColor.value,
        round_color: btnUpdateButton.value,
        label_type: labelTypeForPut,
        label_scale_selection: updatedLabelScale,
        label_scale_input: updatedLabelInput,
        custom_emoji_format: customEmojiFormat,
        scale_color: "red",
        time: timeId.style.display === "none" ? "00" : time?.value,
        fomat: labelTypeForPut,
      };

      const dynamicPayloadPut = {
        ...basePayloadPut,
        // Conditionally add either 'custom_emoji_format' or 'label_scale_input'
        ...(labelType === "Text"
          ? { label_scale_input: updatedLabels }
          : {
              label_scale_input: updatedLabels,
              custom_emoji_format: customEmojiFormat,
            }),
      };

      if (
        idHolder.textContent === "scale Id" ||
        idHolder.textContent === "id"
      ) {
        setIsLoading(true);
        console.log("post req");
        Axios.post(
          "https://100035.pythonanywhere.com/likert/likert-scale_create/",
          dynamicPayload
        )
          .then((res) => {
            setIsLoading(false);
            sendMessage();
            setScaleData(res.data);
            const success = res.data.success;
            var successObj = JSON.parse(success);
            const id = successObj.inserted_id;
            // console.log(id);
            if (id.length) {
              setScaleId(id && id);
              const idHolder = scale?.querySelector(".scaleId");
              idHolder.textContent = id && id;
            }

            const settings = res.data.data.settings;
            if (settings.name) {
              scaleText.textContent = settings.name;
              scaleText.style.display = "none";
            }

            if (settings.font_color) {
              button4.style.color = settings.font_color;
            }

            if (settings.fontstyle) {
              button4.style.fontFamily = settings.fontstyle;
            }

            button4.style.display = "block";

            for (let i = 0; i < updatedLabelScale; i++) {
              const circle = document.createElement("div");
              circle.className = "circle_label";
              circle.style.width = "80%";
              circle.style.height = "60%";
              circle.style.borderRadius = "25px";
              circle.style.padding = "6px 12px";
              circle.style.backgroundColor = settings.round_color;
              circle.style.display = "flex";
              circle.style.justifyContent = "center";
              circle.style.alignItems = "center";
              circle.style.marginLeft = "5px";
              circle.style.marginRight = "5px";
              circle.addEventListener("mouseover", () => {
                circle.style.backgroundColor = "green"; // Change the color on hover
              });
              circle.addEventListener("mouseout", () => {
                circle.style.backgroundColor = settings.round_color; // Reset the color when not hovered
              });

              // Set the text content to the appropriate label (either text or emoji)
              circle.textContent = updatedLabels[i] || "";
              if (option.value === "Vertical") {
                circle.style.margin = "5px 0";
                circle.style.padding = "6px 12px";
              }

              labelHold.style.border = "";
              labelHold.appendChild(circle);
            }

            console.log("This is the likert scale response", res.data.data);
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err);
          });
      } else {
        setIsLoading(true);
        sendMessage();
        // console.log("PUT req");
        // console.log(idHolder.textContent);
        const timestamp = new Date().getTime(); // Generate a unique timestamp
        const apiUrl = `https://100035.pythonanywhere.com/likert/likert-scale_create/?timestamp=${timestamp}`;
        Axios.put(apiUrl, dynamicPayloadPut)
          .then((res) => {
            if (res.status == 200) {
              setIsLoading(false);
              sendMessage();
              setScaleData(res.data);
              setScaleId(scaleId);
              // console.log(res);
              // console.log("This is the still scale", scale);

              const settings = res.data.data;
              // Update the value
              if (settings.font_color) {
                button4.style.color = settings.font_color;
              }

              if (settings.fontstyle) {
                button4.style.fontFamily = settings.fontstyle;
              }

              if (settings.name) {
                scaleText.textContent = settings.name;
                scaleText.style.display = "none";
              }

              button4.style.display = "block";
              for (let i = 0; i < updatedLabelScale; i++) {
                const circle = document.createElement("div");
                circle.className = "circle_label";
                circle.style.width = "80%";
                circle.style.height = "60%";
                circle.style.borderRadius = "25px";
                circle.style.padding = "6px 12px";
                circle.style.backgroundColor = settings.round_color;
                circle.style.display = "flex";
                circle.style.justifyContent = "center";
                circle.style.alignItems = "center";
                circle.style.marginLeft = "5px";
                circle.style.marginRight = "5px";
                circle.addEventListener("mouseover", () => {
                  circle.style.backgroundColor = "green"; // Change the color on hover
                });
                circle.addEventListener("mouseout", () => {
                  circle.style.backgroundColor = settings.round_color; // Reset the color when not hovered
                });
                // Set the text content to the appropriate label (either text or emoji)
                circle.textContent = updatedLabels[i] || "";

                if (option.value === "Vertical") {
                  circle.style.margin = "5px 0";
                }

                labelHold.appendChild(circle);
                labelHold.style.marginTop = "-10px";
              }
              console.log("This is it+++++++______", likertScaleArray);
            }
          })
          .catch((err) => {
            setIsLoading(false);
          });
      }
    } else if (
      scaleType
        ? scaleType.value === "percent_scale" ||
          scaleTypeContent === "percent_scale"
        : scaleTypeContent === "percent_scale" ||
          scaleTypeHolder?.textContent === "percent_scale"
    ) {
      const scale = document.querySelector(".focussedd");
      const btnUpdateScale = document.getElementById(
        "slider_color_percent_scale"
      );
      const btnUpdateFontColor = document.getElementById("font_color_percent");
      const btnUpdateScaleFont = document.getElementById("font_style_percent");
      const beNametnUpdateScal = document.getElementById("scale_label_percent");

      const button = scale?.querySelector(".label_hold");
      const scaleText = scale?.querySelector(".scale_text");
      const button4 = scale?.querySelector(".scool_input");

      button4.style.display = "block";
      const buttonChildLeft = scale?.querySelector(".left_child");
      const buttonChildRight = scale?.querySelector(".right_child");
      const buttonChildNeutral = scale?.querySelector(".neutral_child");

      const option = document.querySelector("#orientationId_percent").options[
        document.querySelector("#orientationId_percent").selectedIndex
      ];

      let time = document.getElementById("time_percent");

      let labelHold = scale?.querySelector(".label_hold");

      let tempText = scale?.querySelector(".tempText");
      tempText?.remove();

      buttonChildLeft.textContent = "";
      buttonChildNeutral.textContent = "";
      buttonChildRight.textContent = "";

      const existingLabelHolds = scale?.querySelectorAll(".label_hold");
      existingLabelHolds.forEach((label) => {
        label.remove();
      });

      const product_percent_scale = document.getElementById(
        "product_percent_scale"
      ).value;

      const containerDiv = document.createElement("div");
      containerDiv.className = "label_hold";
      containerDiv.style.display = "flex";
      containerDiv.style.justifyContent = "center";
      containerDiv.style.alignItems = "center";
      containerDiv.style.flexDirection = "column";
      containerDiv.style.height = "100%";

      let product_names = document.getElementById("product_name");
      console.log(product_names.length);
      let inputFields = product_names?.querySelectorAll("input");

      let productNames = [];
      for (let i = 0; i < inputFields.length; i++) {
        productNames.push(inputFields[i].value);
      }
      console.log(productNames);

      if (
        idHolder.textContent === "scale Id" ||
        idHolder.textContent === "id"
      ) {
        setIsLoading(true);
        console.log("post req");
        Axios.post(
          "https://100035.pythonanywhere.com/percent/api/percent_settings_create/",
          {
            username:
              userDetails === null ? " " : userDetails.userinfo.username,
            time: time.value,
            scale_name: beNametnUpdateScal.value,
            no_of_scale: 1,
            orientation: option.value,
            scale_color: btnUpdateScale.value,
            product_count: Number(product_percent_scale),
            product_names: productNames,
            user: "yes",
          }
        )
          .then((res) => {
            setIsLoading(false);
            sendMessage();
            setScaleData(res.data);
            const success = res.data.success;
            var successObj = JSON.parse(success);
            const id = successObj.inserted_id;
            console.log(id);
            if (id.length) {
              setScaleId(id && id);
              const idHolder = scale?.querySelector(".scaleId");
              idHolder.textContent = id && id;
            }

            const {
              name,
              orientation,
              fontcolor,
              fontstyle,
              scale_color,
              product_count,
              product_names,
            } = res.data.data.settings;
            console.log(name, product_count, product_names);

            for (let i = 0; i < product_count; i++) {
              let newLabelHold = labelHold.cloneNode(true);
              newLabelHold.classList.add("containerDIV");
              newLabelHold.classList.remove("label_hold");
              newLabelHold.innerHTML = "";
              newLabelHold.style = "";

              newLabelHold.style.padding = "10px 15px";
              newLabelHold.style.width = "95%";
              newLabelHold.style.borderTop = "1px solid gray";
              newLabelHold.style.borderBottom = "1px solid gray";
              button4.style.height = "93%";

              let nameDiv = document.createElement("div");
              nameDiv.className = "product_name";
              nameDiv.style.textAlign = "center";
              nameDiv.style.fontWeight = "700";
              nameDiv.textContent = product_names[i];

              newLabelHold.insertBefore(nameDiv, newLabelHold.firstChild);
              let inputPercent = document.createElement("input");
              inputPercent.type = "range";
              inputPercent.min = "0";
              inputPercent.value = "50";
              inputPercent.max = "100";
              inputPercent.className = "percent-slider";
              inputPercent.disabled = "true";
              inputPercent.style.width = "100%";
              inputPercent.style.cursor = "pointer";
              inputPercent.style.background = scale_color;
              inputPercent.style.webkitAppearance = "none";
              inputPercent.style.borderRadius = "10px";

              newLabelHold.appendChild(inputPercent);

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
              inputPercent.addEventListener("input", () => {
                centerPercent.textContent = `${inputPercent.value}%`
                  ? `${inputPercent.value}%`
                  : "50%";
              });
              centerPercent.className = "center-percent";
              percentChilds.appendChild(centerPercent);

              let rightPercent = document.createElement("div");
              rightPercent.textContent = "100";
              rightPercent.className = "right-percent";
              percentChilds.appendChild(rightPercent);

              containerDiv.appendChild(newLabelHold);

              newLabelHold.appendChild(percentChilds);
              button4.appendChild(containerDiv);

              if (orientation === "Horizontal") {
                const orient = scale?.querySelectorAll(".orientation");

                orient?.forEach((e) => e?.remove());
                button4.style.border = "block";
                button4.style.textAlign = "center";
                button.style.marginTop = "10px";
                button.style.alignItems = "center";
                button.style.height = "85%";
                button.style.width = "100%";
                button.style.flexDirection = "row";
                button.style.position = "relative";
                button.style.marginLeft = "0px";
              }

              if (orientation === "Vertical") {
                let orientation = document.createElement("h2");
                orientation.className = "orientation";
                orientation.textContent = "Vertical";
                orientation.style.display = "none";
                button4.appendChild(orientation);

                containerDiv.style.transform = "rotate(270deg)";
                containerDiv.style.width = "100%";
                inputPercent.style.marginTop = "20px";
                nameDiv.style.position = "absolute";
                nameDiv.style.lineHeight = "0.85";
                if (nameDiv.textContent.length < 10) {
                  nameDiv.style.top = "20px";
                  nameDiv.style.left = "93%";
                  nameDiv.style.right = "-17px";
                  newLabelHold.style.padding = "0px 20px 10px 14px"
                  
                } else {
                  newLabelHold.style.padding = "0px 17px 37px 14px";
                  nameDiv.style.left = "101%";
                  nameDiv.style.top = "4px";
                  nameDiv.style.right = "-22px";
                }
                
                nameDiv.style.transform = "rotate(90deg)";
                newLabelHold.style.position = "relative";
                newLabelHold.style.width = "85%";
                percentChilds.style.alignItems = "start";
                percentChilds.style.height = "100%";

                if (inputFields.length == 1) {
                  scaleText.style.display = "none";
                  newLabelHold.style.marginTop = "207px"
                  newLabelHold.style.width = "25vw"

                }
              }

              scaleText.textContent = name;
              scaleText.style.display = "none";
              button4.style.color = fontcolor;
              button4.style.fontFamily = fontstyle;
            }
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
          });
      } else {
        setIsLoading(true);
        console.log("PUT req");
        console.log(idHolder.textContent);
        Axios.put(
          "https://100035.pythonanywhere.com/percent/api/percent_settings_create/",
          {
            scale_id: idHolder.textContent,
            username:
              userDetails === null ? " " : userDetails.userinfo.username,
            time: time.value,
            scale_name: beNametnUpdateScal.value,
            no_of_scale: 1,
            orientation: option.value,
            scale_color: btnUpdateScale.value,
            product_count: Number(product_percent_scale),
            product_names: productNames,
            user: "yes",
          }
        )
          .then((res) => {
            if (res.status == 200) {
              setIsLoading(false);
              sendMessage();
              setScaleData(res.data);
              setScaleId(scaleId);
              console.log(res);
              console.log("This is the still scale", scale);

              const {
                name,
                orientation,
                fontcolor,
                fontstyle,
                scale_color,
                product_count,
                product_names,
              } = res.data.data;

              for (let i = 0; i < product_count; i++) {
                let newLabelHold = labelHold.cloneNode(true);
                newLabelHold.classList.add("containerDIV");
                newLabelHold.classList.remove("label_hold");
                newLabelHold.innerHTML = "";
                newLabelHold.style = "";

                newLabelHold.style.padding = "10px 15px";
                newLabelHold.style.width = "95%";
                newLabelHold.style.borderTop = "1px solid gray";
                newLabelHold.style.borderBottom = "1px solid gray";
                button4.style.height = "93%";

                let nameDiv = document.createElement("div");
                nameDiv.className = "product_name";
                nameDiv.style.textAlign = "center";
                nameDiv.style.fontWeight = "700";
                nameDiv.textContent = product_names[i];

                newLabelHold.insertBefore(nameDiv, newLabelHold.firstChild);
                let inputPercent = document.createElement("input");
                inputPercent.type = "range";
                inputPercent.min = "0";
                inputPercent.value = "50";
                inputPercent.max = "100";
                inputPercent.className = "percent-slider";
                inputPercent.disabled = "true";
                inputPercent.style.width = "100%";
                inputPercent.style.cursor = "pointer";
                inputPercent.style.background = scale_color;
                inputPercent.style.webkitAppearance = "none";
                inputPercent.style.borderRadius = "10px";

                newLabelHold.appendChild(inputPercent);

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
                inputPercent.addEventListener("input", () => {
                  centerPercent.textContent = `${inputPercent.value}%`
                    ? `${inputPercent.value}%`
                    : "50%";
                });
                centerPercent.className = "center-percent";
                percentChilds.appendChild(centerPercent);

                let rightPercent = document.createElement("div");
                rightPercent.textContent = "100";
                rightPercent.className = "right-percent";
                percentChilds.appendChild(rightPercent);

                containerDiv.appendChild(newLabelHold);

                newLabelHold.appendChild(percentChilds);
                button4.appendChild(containerDiv);

                if (orientation === "Horizontal") {
                  const orient = scale?.querySelectorAll(".orientation");

                  orient?.forEach((e) => e?.remove());
                  button4.style.border = "block";
                  button4.style.textAlign = "center";
                  button.style.marginTop = "10px";
                  button.style.alignItems = "center";
                  button.style.height = "85%";
                  button.style.width = "100%";
                  button.style.flexDirection = "row";
                  button.style.position = "relative";
                  button.style.marginLeft = "0px";
                }

                if (orientation === "Vertical") {
                  let orientation = document.createElement("h2");
                  orientation.className = "orientation";
                  orientation.textContent = "Vertical";
                  orientation.style.display = "none";
                  button4.appendChild(orientation);

                  containerDiv.style.transform = "rotate(270deg)";
                  containerDiv.style.width = "100%";
                  inputPercent.style.marginTop = "20px";
                  nameDiv.style.position = "absolute";
                  nameDiv.style.lineHeight = "0.85";
                  if (nameDiv.textContent.length < 10) {
                    nameDiv.style.top = "20px";
                    nameDiv.style.left = "93%";
                    nameDiv.style.right = "-17px";
                    newLabelHold.style.padding = "0px 20px 10px 14px"
                    
                  } else {
                    newLabelHold.style.padding = "0px 17px 37px 14px";
                    nameDiv.style.left = "101%";
                    nameDiv.style.top = "4px";
                    nameDiv.style.right = "-22px";
                  }
                  
                  nameDiv.style.transform = "rotate(90deg)";
                  newLabelHold.style.position = "relative";
                  newLabelHold.style.width = "85%";
                  percentChilds.style.alignItems = "start";
                  percentChilds.style.height = "100%";

                  if (inputFields.length == 1) {
                    scaleText.style.display = "none";
                    newLabelHold.style.marginTop = "207px"
                    newLabelHold.style.width = "25vw"
  
                  }
                }

                scaleText.textContent = name;
                scaleText.style.display = "none";
                button4.style.color = fontcolor;
                button4.style.fontFamily = fontstyle;
              }
            }
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err.message);
          });
      }
    } else if (
      scaleType
        ? scaleType.value === "percent_sum_scale" ||
          scaleTypeContent === "percent_sum_scale"
        : scaleTypeContent === "percent_sum_scale" ||
          scaleTypeHolder?.textContent === "percent_sum_scale"
    ) {
      const scale = document.querySelector(".focussedd");
      const btnUpdateScale = document.getElementById(
        "slider_color_percent_sum_scale"
      );
      const btnUpdateFontColor = document.getElementById(
        "font_color_percent_sum"
      );
      const btnUpdateScaleFont = document.getElementById(
        "font_style_percent_sum"
      );
      const beNametnUpdateScal = document.getElementById(
        "scale_label_percent_sum"
      );

      const button = scale?.querySelector(".label_hold");
      const scaleText = scale?.querySelector(".scale_text");
      const button4 = scale?.querySelector(".scool_input");

      button4.style.display = "block";
      const buttonChildLeft = scale?.querySelector(".left_child");
      const buttonChildRight = scale?.querySelector(".right_child");
      const buttonChildNeutral = scale?.querySelector(".neutral_child");

      const option = document.querySelector("#orientationId_percent_sum")
        .options[
        document.querySelector("#orientationId_percent_sum").selectedIndex
      ];

      let time = document.getElementById("time_percent_sum");

      let labelHold = scale?.querySelector(".label_hold");

      let tempText = scale?.querySelector(".tempText");
      tempText?.remove();

      buttonChildLeft.textContent = "";
      buttonChildNeutral.textContent = "";
      buttonChildRight.textContent = "";

      const existingLabelHolds = scale?.querySelectorAll(".label_hold");
      existingLabelHolds.forEach((label) => {
        label.remove();
      });

      const percentSumProductCount = document.getElementById(
        "percent_sum_product_count"
      ).value;

      const containerDiv = document.createElement("div");
      containerDiv.className = "label_hold";
      containerDiv.style.display = "flex";
      containerDiv.style.justifyContent = "center";
      containerDiv.style.alignItems = "center";
      containerDiv.style.flexDirection = "column";
      containerDiv.style.height = "100%";
      

      let productNames = document.getElementById("product_count_label");
      let inputFields = productNames?.querySelectorAll("input");

      let productNameLabels = [];
      for (let i = 0; i < inputFields.length; i++) {
        productNameLabels.push(inputFields[i].value);
      }

      if (
        idHolder.textContent === "scale Id" ||
        idHolder.textContent === "id"
      ) {
        setIsLoading(true);
        Axios.post(
          "https://100035.pythonanywhere.com/percent-sum/percent-sum-settings",
          {
            username:
              userDetails === null ? " " : userDetails.userinfo.username,
            time: time.value,
            scale_name: beNametnUpdateScal.value,
            no_of_scale: 1,
            orientation: option.value,
            scale_color: btnUpdateScale.value,
            fontcolor: btnUpdateFontColor.value,
            fontstyle: btnUpdateScaleFont.value,
            product_count: Number(percentSumProductCount),
            product_names: productNameLabels,
            user: "yes",
          }
        )
          .then((res) => {
            setIsLoading(false);
            sendMessage();
            setScaleData(res.data);
            const success = res.data.success;
            var successObj = JSON.parse(success);
            const id = successObj.inserted_id;
            if (id.length) {
              setScaleId(id && id);
              const idHolder = scale?.querySelector(".scaleId");
              idHolder.textContent = id && id;
            }

            const {
              name,
              orientation,
              fontcolor,
              fontstyle,
              scale_color,
              product_count,
              product_names,
            } = res.data.data.settings;

            for (let i = 0; i < product_count; i++) {
              let newLabelHold = labelHold.cloneNode(true);
              newLabelHold.classList.add("containerDIV");
              newLabelHold.classList.remove("label_hold");
              newLabelHold.innerHTML = "";
              newLabelHold.style = "";
              newLabelHold.style.padding = "10px 15px";
              newLabelHold.style.width = "95%";
              newLabelHold.style.borderTop = "1px solid gray";
              newLabelHold.style.borderBottom = "1px solid gray";
              button4.style.height = "92%";

              let nameDiv = document.createElement("div");
              nameDiv.className = "product_name";
              nameDiv.style.textAlign = "center";
              nameDiv.style.fontWeight = "700";
              nameDiv.textContent = product_names[i];
              newLabelHold.insertBefore(nameDiv, newLabelHold.firstChild);

              let inputPercent = document.createElement("input");
              inputPercent.type = "range";
              inputPercent.disabled = "true";
              inputPercent.min = "0";
              inputPercent.value = "50";
              inputPercent.max = "100";
              inputPercent.className = "percent-slider";
              inputPercent.style.width = "100%";
              inputPercent.style.cursor = "pointer";
              inputPercent.style.background = scale_color;
              inputPercent.style.webkitAppearance = "none";
              inputPercent.style.borderRadius = "10px";
              newLabelHold.appendChild(inputPercent);

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
              inputPercent.addEventListener("input", () => {
                centerPercent.textContent = `${inputPercent.value}%`
                  ? `${inputPercent.value}%`
                  : "50%";
              });
              centerPercent.className = "center-percent";
              percentChilds.appendChild(centerPercent);

              let rightPercent = document.createElement("div");
              rightPercent.textContent = "100";
              rightPercent.className = "right-percent";
              percentChilds.appendChild(rightPercent);

              containerDiv.appendChild(newLabelHold);

              newLabelHold.appendChild(percentChilds);
              button4.appendChild(containerDiv);

              if (orientation === "Horizontal") {
                scale?.querySelector(".orientation")?.remove();
                button4.style.border = "block";
                button4.style.textAlign = "center";
                button.style.alignItems = "center";
                button.style.height = "100%";
                button.style.width = "100%";
                button.style.flexDirection = "row";
                button.style.position = "relative";
                button.style.marginLeft = "0px";
              }

              if (orientation === "Vertical") {
                const orientation = document.createElement("h2");
                orientation.className = "orientation";
                orientation.textContent = "Vertical";
                orientation.style.display = "none";
                button4.appendChild(orientation);

                containerDiv.style.transform = "rotate(270deg)";
                containerDiv.style.width = "100%";
                inputPercent.style.marginTop = "20px";
                nameDiv.style.position = "absolute";
                nameDiv.style.lineHeight = "0.85";
                if (nameDiv.textContent.length < 10) {
                  nameDiv.style.top = "20px";
                  nameDiv.style.left = "93%";
                  nameDiv.style.right = "-17px";
                } else {
                  nameDiv.style.left = "101%";
                  nameDiv.style.top = "4px";
                  nameDiv.style.right = "-22px";
                }
                newLabelHold.style.padding =
                  nameDiv.textContent.length < 9
                    ? "0px 20px 10px 14px"
                    : "0px 17px 37px 14px";
                nameDiv.style.transform = "rotate(90deg)";
                newLabelHold.style.position = "relative";
                newLabelHold.style.width = "85%";
                percentChilds.style.alignItems = "start";
                percentChilds.style.height = "100%";
              }
              scaleText.textContent = name;
              scaleText.style.display = "none";
              button4.style.color = fontcolor;
              button4.style.fontFamily = fontstyle;
            }
          })
          .catch((err) => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(true);
        Axios.put(
          "https://100035.pythonanywhere.com/percent-sum/percent-sum-settings",
          {
            scale_id: idHolder.textContent,
            username:
              userDetails === null ? " " : userDetails.userinfo.username,
            time: time.value,
            scale_name: beNametnUpdateScal.value,
            no_of_scale: 1,
            orientation: option.value,
            scale_color: btnUpdateScale.value,
            fontcolor: btnUpdateFontColor.value,
            fontstyle: btnUpdateScaleFont.value,
            product_count: Number(percentSumProductCount),
            product_names: productNameLabels,
            user: "yes",
          }
        )
          .then((res) => {
            if (res.status == 200) {
              setIsLoading(false);
              sendMessage();
              setScaleData(res.data);
              setScaleId(scaleId);

              const {
                name,
                orientation,
                fontcolor,
                fontstyle,
                scale_color,
                product_count,
                product_names,
              } = res.data.data;

              for (let i = 0; i < product_count; i++) {
                let newLabelHold = labelHold.cloneNode(true);
                newLabelHold.classList.add("containerDIV");
                newLabelHold.classList.remove("label_hold");
                newLabelHold.innerHTML = "";
                newLabelHold.style = "";
                newLabelHold.style.padding = "10px 15px";
                newLabelHold.style.width = "95%";
                newLabelHold.style.borderBottom = "1px solid gray";
                newLabelHold.style.borderTop = "1px solid gray";
                button4.style.height = "92%";

                let nameDiv = document.createElement("div");
                nameDiv.className = "product_name";
                nameDiv.style.textAlign = "center";
                nameDiv.style.fontWeight = "700";
                nameDiv.textContent = product_names[i];
                newLabelHold.insertBefore(nameDiv, newLabelHold.firstChild);

                let inputPercent = document.createElement("input");
                inputPercent.type = "range";
                inputPercent.disabled = "true";
                inputPercent.min = "0";
                inputPercent.value = "50";
                inputPercent.max = "100";
                inputPercent.className = "percent-slider";
                inputPercent.style.width = "100%";
                inputPercent.style.cursor = "pointer";
                inputPercent.style.background = scale_color;
                inputPercent.style.webkitAppearance = "none";
                inputPercent.style.borderRadius = "10px";
                newLabelHold.appendChild(inputPercent);

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
                inputPercent.addEventListener("input", () => {
                  centerPercent.textContent = `${inputPercent.value}%`
                    ? `${inputPercent.value}%`
                    : "50%";
                });
                centerPercent.className = "center-percent";
                percentChilds.appendChild(centerPercent);

                let rightPercent = document.createElement("div");
                rightPercent.textContent = "100";
                rightPercent.className = "right-percent";
                percentChilds.appendChild(rightPercent);

                containerDiv.appendChild(newLabelHold);

                newLabelHold.appendChild(percentChilds);
                button4.appendChild(containerDiv);

                if (orientation === "Horizontal") {
                  scale?.querySelector(".orientation")?.remove();
                  button4.style.border = "block";
                  button4.style.textAlign = "center";
                  button.style.marginTop = "10px";
                  button.style.alignItems = "center";
                  button.style.height = "100%";
                  button.style.width = "100%";
                  button.style.flexDirection = "row";
                  button.style.position = "relative";
                  button.style.marginLeft = "0px";
                }

                if (orientation === "Vertical") {
                  const orientation = document.createElement("h2");
                  orientation.className = "orientation";
                  orientation.textContent = "Vertical";
                  orientation.style.display = "none";
                  button4.appendChild(orientation);

                  containerDiv.style.transform = "rotate(270deg)";
                  containerDiv.style.width = "100%";
                  inputPercent.style.marginTop = "20px";
                  nameDiv.style.position = "absolute";
                  nameDiv.style.lineHeight = "0.85";
                  if (nameDiv.textContent.length < 10) {
                    nameDiv.style.top = "20px";
                    nameDiv.style.left = "93%";
                    nameDiv.style.right = "-17px";
                  } else {
                    nameDiv.style.left = "101%";
                    nameDiv.style.top = "4px";
                    nameDiv.style.right = "-22px";
                  }
                  newLabelHold.style.padding =
                    nameDiv.textContent.length < 9
                      ? "0px 20px 10px 14px"
                      : "0px 17px 37px 14px";
                  nameDiv.style.transform = "rotate(90deg)";
                  newLabelHold.style.position = "relative";
                  newLabelHold.style.width = "85%";
                  percentChilds.style.alignItems = "start";
                  percentChilds.style.height = "100%";
                }
                scaleText.textContent = name;
                button4.style.color = fontcolor;
                button4.style.fontFamily = fontstyle;
              }
            }
          })
          .catch((err) => {
            setIsLoading(false);
          });
      }
    } else if (
      scaleType
        ? scaleType.value === "comparison_paired_scale" ||
          scaleTypeContent === "comparison_paired_scale"
        : scaleTypeContent === "comparison_paired_scale" ||
          scaleTypeHolder?.textContent === "comparison_paired_scale"
    ) {
      const scale = document.querySelector(".focussedd");
      const btnUpdateScaleColor = document.getElementById(
        "scale_color_Comparison"
      );
      const btnUpdateScale = document.getElementById("button_color_Comparison");
      const btnUpdateFontColor = document.getElementById(
        "font_color_comparison"
      );
      const btnUpdateScaleFont = document.getElementById(
        "font_style_comparison"
      );
      const beNametnUpdateScal = document.getElementById(
        "scale_label_Comparison"
      );

      const button = scale?.querySelector(".label_hold");
      const scaleText = scale?.querySelector(".scale_text");
      const button4 = scale?.querySelector(".scool_input");
      const numberOfItemsToPair = parseInt(pairedInputValue);
      const updatedPairedLabels = pairedLabelTexts.filter(
        (label) => label.trim() !== ""
      );
      // Check if there are at least 2 items to create pairs
      if (updatedPairedLabels.length < 2) {
        alert("You need at least 2 paired items.");
        return; // Don't proceed if there are less than 2 items
      }

      // Construct the item_list array dynamically based on the input values
      const itemList = pairedLabelTexts;

      button4.style.display = "block";
      const buttonChildLeft = scale?.querySelector(".left_child");
      const buttonChildRight = scale?.querySelector(".right_child");
      const buttonChildNeutral = scale?.querySelector(".neutral_child");

      const option = document.querySelector("#orientationIdComaprison").options[
        document.querySelector("#orientationIdComaprison").selectedIndex
      ];

      let time = document.getElementById("time_comparison");

      let labelHold = scale?.querySelector(".label_hold");

      let tempText = scale?.querySelector(".tempText");
      tempText?.remove();

      buttonChildLeft.textContent = "";
      buttonChildNeutral.textContent = "";
      buttonChildRight.textContent = "";

      labelHold.innerHTML = "";

      const pairedScaleArray = document.createElement("div");
      pairedScaleArray.className = "paired_Scale_Array";
      pairedScaleArray.textContent = updatedPairedLabels;
      pairedScaleArray.style.display = "none";
      labelHold.append(pairedScaleArray);

      // Update circles with new labels

      if (option.value === "Horizontal") {
        button4.style.border = "block";
        button4.style.textAlign = "center";
        button.style.display = "flex";
        button.style.flexDirection = "row";
        // button.style.marginTop = "5%";
        button.style.alignItems = "center";
        // buttonCircle.style.flexDirection = "row";
        button.style.height = "85%";
        button.style.width = "100%";
        button.style.flexDirection = "row";
        button.style.position = "relative";
        button.style.marginLeft = "0px";
      }

      if (option.value === "Vertical") {
        let orientation = document.createElement("h2");
        orientation.className = "orientation";
        orientation.textContent = "vertical";
        orientation.style.display = "none";
        button4.appendChild(orientation);
        button4.style.border = "none";
        button4.style.textAlign = "center";
        button4.style.padding = "0px";
        button.style.height = "100%";
        button.style.width = "100%";
        button.style.position = "absolute";
        button.style.display = "flex";
        button.style.flexDirection = "column";
        button.style.alignItems = "center";
      }

      if (
        idHolder.textContent === "scale Id" ||
        idHolder.textContent === "id"
      ) {
        formData.delete("item_list");
        const updatedLabelTexts = [...pairedLabelTexts];
        for (const updatedLabelText of updatedLabelTexts) {
          formData.append("item_list", updatedLabelText);
        }
        formData.append("username", userDetails === null ? " " : userDetails.userinfo.username);
        formData.append("user", "yes");
        setIsLoading(true);
        console.log("post req");
        Axios.post(
          "https://100035.pythonanywhere.com/paired-comparison/paired-comparison-settings/",
          formData
        )
          .then((res) => {
            setIsLoading(false);
            sendMessage();
            setScaleData(res.data);
            const success = res.data.success;
            var successObj = JSON.parse(success);
            const id = successObj.inserted_id;
            console.log(id);
            if (id.length) {
              setScaleId(id && id);
              const idHolder = scale?.querySelector(".scaleId");
              idHolder.textContent = id && id;
            }
            console.log(res);
            const settings = res.data.data.settings;
            console.log(settings);
            scaleText.textContent = settings.name;
            scaleText.style.display = "none";

            if (settings.fontcolor) {
              button4.style.color = settings.fontcolor;
            }

            if (settings.fontstyle) {
              button4.style.fontFamily = settings.fontstyle;
            }

            button4.style.display = "block";
            button4.style.height = "100%";
            labelHold.style.border = "";
            labelHold.style.height = "100%";
            labelHold.style.justifyContent = "center";
            labelHold.style.flexWrap = "wrap";
            for (let i = 0; i < settings.item_list.length - 1; i++) {
              for (let j = i + 1; j < settings.item_list.length; j++) {
                const circle = document.createElement("div");
                circle.className = "circle_label";
                circle.style.width = "127px";
                circle.style.height = "45%";
                circle.style.borderRadius = "12px";
                circle.style.padding = "12px 20px";
                circle.style.backgroundColor = settings.scalecolor;
                circle.style.display = "flex";
                circle.style.flexDirection = "column";
                circle.style.justifyContent = "center";
                circle.style.alignItems = "center";
                circle.style.marginLeft = "5px";
                circle.style.marginRight = "5px";
                circle.style.gap = "7px";

                const smallBox1 = document.createElement("div");
                smallBox1.className = "small_box";
                smallBox1.textContent = settings.item_list[i];
                const smallBox2 = document.createElement("div");
                smallBox2.className = "small_box";
                smallBox2.textContent = settings.item_list[j];
                smallBox1.style.width = "95%";
                smallBox2.style.width = "95%";
                smallBox1.style.backgroundColor = settings.roundcolor;
                smallBox1.style.color = settings.fontcolor;
                smallBox2.style.backgroundColor = settings.roundcolor;
                smallBox2.style.color = settings.fontcolor;
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
                    "#" +
                    componentToHex(r) +
                    componentToHex(g) +
                    componentToHex(b)
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

                smallBox1.addEventListener("mouseover", () => {
                  smallBox1.style.backgroundColor = invert(smallBoxBgColor);
                  smallBox1.style.color = invert(smallBoxColor);
                });
                smallBox1.addEventListener("mouseout", () => {
                  smallBox1.style.backgroundColor = settings.roundcolor;
                  smallBox1.style.color = settings.fontcolor;
                });

                smallBox2.addEventListener("mouseover", () => {
                  smallBox2.style.backgroundColor = invert(smallBoxBgColor);
                  smallBox2.style.color = invert(smallBoxColor);
                });
                smallBox2.addEventListener("mouseout", () => {
                  smallBox2.style.backgroundColor = settings.roundcolor;
                  smallBox2.style.color = settings.fontcolor;
                });

                circle.appendChild(smallBox1);
                circle.appendChild(smallBox2);

                if (option.value === "Vertical") {
                  circle.style.margin = "5px 0";
                  circle.style.padding = "6px 12px";
                }

                labelHold.appendChild(circle);
              }
            }
          })
          .catch((err) => {
            if (err) {
              let message = err.response.data.error;
              alert(
                `${
                  message[0].toUpperCase() + message.slice(1)
                }. All fields are required.`
              );
            }
            setIsLoading(false);
            console.log(err);
          });
      } else {
        formData.delete("item_list");
        const updatedLabelTexts = [...pairedLabelTexts];
        for (const updatedLabelText of updatedLabelTexts) {
          formData.append("item_list", updatedLabelText);
        }
        formData.append("scale_id", idHolder.textContent);
        formData.append("username", userDetails === null ? " " : userDetails.userinfo.username);
        formData.append("user", "yes");
        setIsLoading(true);
        console.log("PUT req");
        console.log(idHolder.textContent);
        Axios.put(
          "https://100035.pythonanywhere.com/paired-comparison/paired-comparison-settings",
          formData
        )
          .then((res) => {
            if (res.status == 200) {
              setIsLoading(false);
              sendMessage();
              setScaleData(res.data);
              setScaleId(scaleId);
              console.log(res);
              console.log("This is the still scale", scale);

              const settings = res.data.data;
              console.log(settings);
              scaleText.textContent = settings.name;
              scaleText.style.display = "none";

              if (settings.fontcolor) {
                button4.style.color = settings.fontcolor;
              }

              if (settings.fontstyle) {
                button4.style.fontFamily = settings.fontstyle;
              }

              button4.style.display = "block";
              button4.style.height = "100%";
              labelHold.style.border = "";
              labelHold.style.height = "100%";
              labelHold.style.justifyContent = "center";
              labelHold.style.flexWrap = "wrap";
              for (let i = 0; i < settings.item_list.length - 1; i++) {
                for (let j = i + 1; j < settings.item_list.length; j++) {
                  const circle = document.createElement("div");
                  circle.className = "circle_label";
                  circle.style.width = "127px";
                  circle.style.height = "45%";
                  circle.style.borderRadius = "12px";
                  circle.style.padding = "12px 20px";
                  circle.style.backgroundColor = settings.scalecolor;
                  circle.style.display = "flex";
                  circle.style.flexDirection = "column";
                  circle.style.justifyContent = "center";
                  circle.style.alignItems = "center";
                  circle.style.marginLeft = "5px";
                  circle.style.marginRight = "5px";
                  circle.style.gap = "7px";

                  const smallBox1 = document.createElement("div");
                  smallBox1.className = "small_box";
                  smallBox1.textContent = settings.item_list[i];
                  const smallBox2 = document.createElement("div");
                  smallBox2.className = "small_box";
                  smallBox2.textContent = settings.item_list[j];

                  smallBox1.style.width = "95%";
                  smallBox2.style.width = "95%";
                  smallBox1.style.background = settings.roundcolor;
                  smallBox1.style.color = settings.fontcolor;
                  smallBox2.style.background = settings.roundcolor;
                  smallBox2.style.color = settings.fontcolor;
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
                      "#" +
                      componentToHex(r) +
                      componentToHex(g) +
                      componentToHex(b)
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

                  smallBox1.addEventListener("mouseover", () => {
                    smallBox1.style.backgroundColor = invert(smallBoxBgColor);
                    smallBox1.style.color = invert(smallBoxColor);
                  });
                  smallBox1.addEventListener("mouseout", () => {
                    smallBox1.style.backgroundColor = settings.roundcolor;
                    smallBox1.style.color = settings.fontcolor;
                  });

                  smallBox2.addEventListener("mouseover", () => {
                    smallBox2.style.backgroundColor = invert(smallBoxBgColor);
                    smallBox2.style.color = invert(smallBoxColor);
                  });
                  smallBox2.addEventListener("mouseout", () => {
                    smallBox2.style.backgroundColor = settings.roundcolor;
                    smallBox2.style.color = settings.fontcolor;
                  });

                  circle.appendChild(smallBox1);
                  circle.appendChild(smallBox2);

                  if (option.value === "Vertical") {
                    circle.style.margin = "5px 0";
                    circle.style.padding = "6px 12px";
                  }

                  labelHold.appendChild(circle);
                }
              }
            }
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err.message);
          });
      }
    }
  };
  const idHolder = scale?.querySelector(".scaleId");
  console.log(idHolder);
  console.log(scaleId);
  function showIframe() {
    const divIframeRight = document.getElementById("iframeRight");
    const divSettingRight = document.getElementById("settingRight");
    const updateScale = document.getElementById("updateScale");
    const setScale = document.getElementById("setScale");
    divIframeRight.style.display = "block";
    updateScale.style.borderBottom = "2px solid lightgreen";
    setScale.style.border = "none";
    divSettingRight.style.display = "none";
    const border = document.getElementById("border");
    border.style.display = "none";
  }

  function showIframeDo() {
    const divIframeRight = document.getElementById("iframeRight");
    const divSettingRight = document.getElementById("settingRight");
    const updateScale = document.getElementById("updateScale");
    const setScale = document.getElementById("setScale");
    divIframeRight.style.display = "block";
    updateScale.style.borderBottom = "2px solid lightgreen";
    setScale.style.border = "none";
    divSettingRight.style.display = "none";
    const border = document.getElementById("border");
    border.style.display = "block";
  }

  function showSetting() {
    const divIframeRight = document.getElementById("iframeRight");
    const divSettingRight = document.getElementById("settingRight");
    const setScale = document.getElementById("setScale");
    const updateScale = document.getElementById("updateScale");

    divIframeRight.style.display = "none";
    updateScale.style.border = "none";
    setScale.style.borderBottom = "2px solid lightgreen";
    divSettingRight.style.display = "block";
    const border = document.getElementById("border");
    border.style.display = "block";
  }

  const showSingle = () => {
    const divSingleRight = document.getElementById("singleScale");
    const divMultiRight = document.getElementById("multiScale");
    const divInVisible = document.getElementById("invisible");
    divSingleRight.style.display = "block";
    divMultiRight.style.display = "none";
    divInVisible.style.display = "block";
    divSingleRight.style.marginTop = "10px";
  };

  const showMulti = () => {
    const divSingleRight = document.getElementById("singleScale");
    const divMultiRight = document.getElementById("multiScale");
    const divInVisible = document.getElementById("invisible");
    divSingleRight.style.display = "none";
    divMultiRight.style.display = "block";
    divInVisible.style.display = "block";
    divMultiRight.style.marginTop = "10px";
  };

  // const iframeSrc = `https://100035.pythonanywhere.com/nps-editor/settings/${scaleId}`;
  // // console.log(iframeSrc, "iframeSrc");

  function removeScale() {
    // const focusseddElmnt = document.querySelector(".focussedd");
    // if (focusseddElmnt.classList.contains("holderDIV")) {
    //   document.querySelector(".focussedd").remove();
    // }
    setConfirmRemove(!confirmRemove)
    const rscale = document.getElementsByClassName("newScaleInput")
    if(rscale.length === 1) {
      setScaleTypeContent("")
    }
    console.log("Remove scale length", rscale.length)
  }

  const myArray = Object.values(data)[0];
  //console.log(myArray);
  function excludeElementsWithAttributeValue(arr, attribute, valueToExclude) {
    return arr?.filter(function (element) {
      // // console.log(element);
      // // console.log(attribute);
      // // console.log(valueToExclude);
      // // console.log(arr);
      return (
        element.hasOwnProperty(attribute) &&
        element[attribute] !== valueToExclude
      );
    });
  }

  var newArray = excludeElementsWithAttributeValue(
    myArray,
    "type",
    "NEW_SCALE_INPUT"
  );
  console.log("Try this", newArray);

  const filteredArray = newArray?.filter((obj) => !customId.includes(obj.id));
  // // console.log(filteredArray);

  const elems = document.getElementsByClassName("holderDIV");
  for (let index = 0; index < elems.length; index++) {
    const element = elems[index];
    // // console.log(element.children[0]);
  }

  const [selectedElementId, setSelectedElementId] = useState(null);
  const [availableTextElements, setAvailableTextElements] = useState(newArray);

  useEffect(() => {
    // Save the availableTextElements state to local storage whenever it changes
    localStorage.setItem(
      "availableTextElements",
      JSON.stringify(availableTextElements)
    );
  }, [availableTextElements]);

  const removeSelectedOption = () => {
    // if (selectedElementId) {
    //   console.log(`Removing option with ID: ${selectedElementId}`);
    //   setAvailableTextElements((prevOptions) =>
    //     prevOptions.filter((element) => element.id !== selectedElementId)
    //   );
    //   setSelectedElementId(null);
    //   console.log(`Updated availableTextElements:`, availableTextElements);
    // }
    let selectField = document.getElementById("select1");
    var selectedValues = {};
    const options = selectField.options;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.selected) {
        selectedValues[option.value] = option.id;
        console.log("This is option 2", option);
      }
    }

    console.log("This is the selected value", selectedValues);
    setSelectedOptions(selectedValues);
    console.log("This is the selected options", selectedOptions);

    let selectedOption = selectField.options[selectField.selectedIndex];
    let selectedElementId = selectedOption.id;
    console.log(selectedElementId, "selectedElementId");
    const scale = document.querySelector(".focussedd");
    const otherComponent = scale?.querySelector(".otherComponent");
    otherComponent.textContent = selectedOption.value + " " + selectedOption.id;
    console.log("Other Component", otherComponent.textContent);
    let elementString = sessionStorage.getItem("elements");
    let elemArray = [];
    if (elementString !== null) {
      elemArray = JSON.parse(elementString);
    }
    console.log(elemArray);
    console.log(`"${selectedOption.value}"`);
    elemArray.push(selectedOption.value + " " + selectedOption.id);
    let string = JSON.stringify(elemArray);
    sessionStorage.setItem("elements", string);
  };

  function scaleSubmit(e) {
    e.preventDefault();
    console.log(selectedOptions);
    console.log(selectedOptions[0]);
    const scale = document.querySelector(".focussedd");
    const idHolder = scale?.querySelector(".scaleId");
    console.log("This is the scale Id", idHolder.textContent);
    removeSelectedOption(); // Call this function to remove the selected option
    console.log(
      removeSelectedOption(),
      "what shall I do@@@@@@@@@@@@@!!!!!!!!!!!!!!"
    );
    e.preventDefault();
    setIsLoading(true);
    Axios.post("https://100035.pythonanywhere.com/api/nps_custom_data/", {
      template_id: decoded.details._id,
      scale_id: idHolder.textContent,
      custom_input_groupings: selectedOptions,
      scale_label: scaleTitle,
    })
      .then((res) => {
        if (res.status == 200) {
          setIsLoading(false);
          sendMessage();
          console.log(res.data);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }

  const handleSelect = (event) => {
    let selectField = document.getElementById("select1");
    var selectedValues = {};
    const options = selectField.options;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.selected) {
        selectedValues[option.value] = option.id;
        console.log("This is option", option);
      }
    }

    console.log(selectedValues);
    setSelectedOptions(selectedValues);

    let selectedOption = selectField.options[selectField.selectedIndex];
    let selectedElementId = selectedOption.id;
    console.log(selectedElementId, "selectedElementId");

    // const selectedElements = myArray.find(
    //   (element) => element.id === selectedElementId
    // );

    const selectedElements = document.getElementById(`${selectedElementId}`);

    setSelectedElementId(selectedElements.id);
    console.log(selectedElements, "selectedElement");
    console.log(selectedElementId, "dhhhhhhhhh+++++++++++@@@@@@!!!!!!!!!");

    let divElement = document.getElementById(selectedElements.id);
    // console.log(divElement.id, "divElement");

    // Remove the green border from the previously selected option
    let previousOptionId = selectField.getAttribute("data-prev-option");
    if (previousOptionId) {
      let previousOptionDiv = document.getElementById(previousOptionId);
      previousOptionDiv.parentElement.style.border = "doted";
    }

    // Add the green border to the currently selected option
    divElement.parentElement.style.border = "2px solid green";

    divElement.focus();

    // Store the ID of the currently selected option as the previous option
    selectField.setAttribute("data-prev-option", selectedElements.id);
  };

  let otherElementsArray = [];
  const txt = document.getElementsByClassName("textInput");
  for (let i = 0; i < txt.length; i++) {
    otherElementsArray.push("TEXT_INPUT " + txt[i].id);
  }

  const img = document.getElementsByClassName("imageInput");
  for (let i = 0; i < img.length; i++) {
    otherElementsArray.push("IMAGE_INPUT " + img[i].id);
  }

  const tables = document.getElementsByClassName("tableInput");
  for (let i = 0; i < tables.length; i++) {
    otherElementsArray.push("TABLE_INPUT " + tables[i].id);
  }

  const containerElements = document.getElementsByClassName("containerInput");
  for (let i = 0; i < containerElements.length; i++) {
    otherElementsArray.push("CONTAINER_INPUT " + containerElements[i].id);
  }

  const sign = document.getElementsByClassName("signInput");
  for (let i = 0; i < sign.length; i++) {
    otherElementsArray.push("SIGN_INPUT " + sign[i].id);
  }

  const date = document.getElementsByClassName("dateInput");
  for (let i = 0; i < date.length; i++) {
    otherElementsArray.push("DATE_INPUT " + date[i].id);
  }

  const dropDowns = document.getElementsByClassName("dropdownInput");
  for (let i = 0; i < dropDowns.length; i++) {
    otherElementsArray.push("DROPDOWN_INPUT " + dropDowns[i].id);
  }

  const iframes = document.getElementsByClassName("iframeInput");
  for (let i = 0; i < iframes.length; i++) {
    otherElementsArray.push("IFRAME_INPUT " + iframes[i].id);
  }

  const buttons = document.getElementsByClassName("buttonInput");
  for (let i = 0; i < buttons.length; i++) {
    otherElementsArray.push("BUTTON_INPUT " + buttons[i].id);
  }

  const emails = document.getElementsByClassName("emailButton");
  for (let i = 0; i < emails.length; i++) {
    otherElementsArray.push("FORM " + emails[i].id);
  }

  const imageCanva = document.getElementsByClassName("cameraInput");
  for (let i = 0; i < imageCanva.length; i++) {
    otherElementsArray.push("CAMERA_INPUT " + imageCanva[i].id);
  }

  const payments = document.getElementsByClassName("paymentInput");
  for (let i = 0; i < payments.length; i++) {
    otherElementsArray.push("PAYMENT_INPUT " + payments[i].id);
  }

  let elementString = sessionStorage.getItem("elements");
  let elemArray = [];
  if (elementString !== null) {
    elemArray = JSON.parse(elementString);
  }
  console.log(elemArray);
  if (elemArray !== null) {
    for (let i = 0; i < elemArray.length; i++) {
      for (let j = 0; j < otherElementsArray.length; j++) {
        if (elemArray[i] === otherElementsArray[j]) {
          let storedIndex = otherElementsArray.indexOf(otherElementsArray[j]);
          otherElementsArray.splice(storedIndex, 1);
        }
      }
    }
  }
  // console.log(`"${selectedOption.value + " " + selectedOption.id}"`);
  // elemArray.push(selectedOption.value + " " + selectedOption.id);
  // let string = JSON.stringify(elemArray);
  // localStorage.setItem("elements", string);

  console.log("The other elements", otherElementsArray);

  const options = otherElementsArray.map((element, index) => (
    <option
      key={index}
      value={element.split(" ")[0]}
      id={element.split(" ")[1]}
    >
      {element}
    </option>
  ));

  // const options = availableTextElements.map((element, index) => (
  //   <option key={index} value={element.type} id={element.id}>
  //     {`${element.type} ${element.id}`}
  //   </option>
  // ));

  console.log(options, "ava++++++++++++++____");

  const handleBorderSizeChange = (e) => {
    setBorderSize(e.target.value);

    const box = document.getElementsByClassName("focussedd")[0];
    box.style.borderWidth = `${borderSize}px`;
  };

  const handleBorderColorChange = (e) => {
    setBorderColor(e.target.value);
    const box = document.getElementsByClassName("focussedd")[0];
    box.style.borderColor = `${borderColor}`;
  };
  const handleRangeBlur = (e) => {
    e.target.focus();
  };
  const refreshIframe = () => {
    var container = document.getElementById("settingSelect");
    var content = container.innerHTML;
    container.innerHTML = content;
  };

  const onScoreChange = (e) => {
    let scoreId = document.getElementById("scoreInput");
    if (e.target.checked) {
      scoreId.style.display = "flex";
    } else {
      scoreId.style.display = "none";
    }
  };

  const onTimeChange = (e) => {
    let timeId = document.getElementById("timeId");
    if (e.target.checked) {
      timeId.style.display = "flex";
    } else {
      timeId.style.display = "none";
    }
  };

  const onTimeChangeStapel = (e) => {
    let timeId = document.getElementById("timeId_stapel");
    if (e.target.checked) {
      timeId.style.display = "flex";
    } else {
      timeId.style.display = "none";
    }
  };

  const onTimeChangeNpsLite = (e) => {
    let timeId = document.getElementById("timeId_nps_lite");
    if (e.target.checked) {
      timeId.style.display = "flex";
    } else {
      timeId.style.display = "none";
    }
  };

  const onTimeChangeLikert = (e) => {
    let timeId = document.getElementById("timeId_likert");
    if (e.target.checked) {
      timeId.style.display = "flex";
    } else {
      timeId.style.display = "none";
    }
  };

  const onTimeChangePercent = (e) => {
    let timeId = document.getElementById("timeId_percent");
    if (e.target.checked) {
      timeId.style.display = "flex";
    } else {
      timeId.style.display = "none";
    }
  };

  const onTimeChangePercentSum = (e) => {
    let timeId = document.getElementById("timeId_percent_sum");
    if (e.target.checked) {
      timeId.style.display = "flex";
    } else {
      timeId.style.display = "none";
    }
  };
  const onTimeChangeComparison = (e) => {
    let timeId = document.getElementById("timeId_comparison");
    if (e.target.checked) {
      timeId.style.display = "flex";
    } else {
      timeId.style.display = "none";
    }
  };

  const timecombinedOnChange = (event) => {
    onTimeChangeComparison(event);
    handlePairedScaleInputChange(event);
  };

  // const upperVal = Math.min(10, parseInt(document.getElementById('upperVal').value, 10));
  // if (upperVal !==null) {
  //   const upperVal = Math.min(10, parseInt(document.getElementById('upperVal').value, 10));
  //   return (
  //     upperVal
  //   );
  // };

  return (
    <>
      {decoded.details.action === "document" ? (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              // borderRadius: "20px",
              // backgroundColor: "red",
            }}
          >
            <button
              style={{
                width: "100%",
                border: "none",
                fontWeight: "600",
              }}
              id="updateScale"
              className="py-2 bg-white border-none"
              // style={{"}}
              // onClick={showIframe}
            >
              Appearance
            </button>
            <button
              style={{
                width: "100%",
                border: "none",
                fontWeight: "600",
              }}
              id="setScale"
              className="py-2 bg-white border-none"
              // style={{ bordern: "none", outline: "none" }}
              // onClick={showSetting}
            >
              Configurations
            </button>
          </div>
          <div id="iframeRight">
            <div className="mb-4"></div>
          </div>
          {showBorder === true ? (
            <>
              <hr />
              <Row className="pt-4">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h6 style={{ marginRight: "10rem" }}>Border</h6>
                  <label className="switch">
                    <input
                      type="checkbox"
                      onClick={() => setShowSlider(!showSlider)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                {showSlider && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#abab",
                      gap: "10px",
                      height: "40px",
                      width: "90%",
                    }}
                  >
                    <input
                      type="color"
                      value={borderColor}
                      onChange={handleBorderColorChange}
                      id="color"
                      style={{ border: "none", width: "10%", height: "15px" }}
                    />
                    <input
                      type="range"
                      min="-10"
                      max="20"
                      value={borderSize}
                      onChange={handleBorderSizeChange}
                      id="range"
                      className="range-color"
                    />
                  </div>
                )}
              </Row>
              <hr />
            </>
          ) : (
            ""
          )}
          <div id="settingRight" style={{ display: "none" }}>
            {/* iframe */}
            <div>
              {/* <Form.Control
          type="text"
          placeholder={`${decoded.details._id}_scl1`}
          disabled
          className="mb-4"
        // id="iframe_src"
        // onChange={handleChange}
        /> */}
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <button
              style={{
                width: "100%",
                border: "none",
                fontWeight: "600",
              }}
              id="updateScale"
              className="py-2 bg-white border-none"
              // style={{"}}
              onClick={showIframe}
            >
              Appearance
            </button>
            <button
              style={{
                width: "100%",
                border: "none",
                fontWeight: "600",
              }}
              id="setScale"
              className="py-2 bg-white border-none"
              // style={{ bordern: "none", outline: "none" }}
              onClick={showSetting}
            >
              Configurations
            </button>
          </div>

          <div
            style={{
              width: "100%",
              overflowY: "auto",
              paddingTop: "5px",
              paddingBottom: "5px",
              paddingLeft: "12px",
              paddingRight: "12px",
              marginTop: "15px",
              fontSize: "10px",
            }}
            id="iframeRight"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                width: "100%",
                paddingLeft: "12px",
              }}
            >
              <div>
                {scaleTypeHolder?.textContent === "" &&
                scaleTypeContent === "" ? (
                  <div>
                    <div
                      style={{
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        // alignItems: "center",
                        fontWeight: "600",
                        fontSize: "16px",
                        marginLeft: "0",
                      }}
                    >
                      <div>
                        <select
                          id="scaleType"
                          onChange={handleFormatChange}
                          // onChange={handleDateMethod}
                          className="select border-0 bg-white rounded w-100 h-75 p-2"
                          //multiple
                          style={{ marginBottom: "6px", width: "100%" }}
                        >
                          <option>Select Scale</option>
                          <option value="snipte">Stapel Scale</option>
                          <option value="nps">Nps Scale</option>
                          <option value="nps_lite">Nps Lite Scale</option>
                          <option value="likert">Likert Scale</option>
                          <option value="percent_scale">Percent Scale</option>
                          <option value="percent_sum_scale">
                            Percent-Sum Scale
                          </option>
                          <option value="comparison_paired_scale">
                            Paired Comparison Scale
                          </option>
                        </select>
                      </div>
                      {/* <select
                        style={{
                          width: "180px",
                          height: "35px",
                          display: "flex",
                          justifyContent: "center",
                          gap: "5rem",
                          backgroundColor: "transparent",
                          outline: "none",
                          border: "none",
                          fontWeight: "600",
                        }}
                       
                      >
                        
                      </select> */}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div id="npsScaleForm">
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                  // overflowY: "auto",
                  // paddingTop: "5px",
                  // paddingBottom: "5px",
                  // paddingLeft: "12px",
                  // paddingRight: "12px",
                  marginTop: "15px",
                  fontSize: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    flexDirection: "column",
                    // gap: "5px",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h1
                      id="headerText"
                      style={{ margin: "auto 0", fontSize: "15px" }}
                    >
                      Edit {scaleTitle}
                    </h1>
                  </div>
                  <h6 style={{ fontSize: "12px" }}>Orientation</h6>
                  <div
                    style={{
                      backgroundColor: "#e8e8e8",
                      // padding: "5px 10px",
                      borderRadius: "10px",
                      padding: "5px 7px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <select
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        // borderRadius: "10px",
                        // padding: "3px 10px",
                        height: "15px",
                        border: "none",
                        justifyContent: "center",
                        outline: "none",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        margin: "0 auto",
                      }}
                      className="bg-gray-800"
                      id="orientationId"
                    >
                      <option value="Horizontal" style={{ color: "black" }}>
                        Horizontal
                      </option>
                      <option value="Vertical" style={{ color: "black" }}>
                        Vertical
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    // justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "10px",
                    // alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Scale Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          // defaultValue={
                          //   scaleDisplay.style.display !== "none" ? scaleBg : ""
                          // }
                          // defaultValue={
                          //   // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                          //   !scaleDisplay
                          //     ? undefined
                          //     : scaleDisplay === "none"
                          //     ? undefined
                          //     : scaleBg
                          // }
                          // defaultValue={scale && scaleBg}
                          // defaultValue={
                          //   document
                          //     ?.querySelector(".focussedd")
                          //     ?.querySelector(".label_hold")?.style?.backgroundColor
                          // }
                          id="scale_color"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Button Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          // defaultValue={
                          //   // scaleDisplay.style?.display !== "none" ? circles : ""
                          //   // scaleDisplay?.style?.display ? scaleDisplay.style.display ==="block" ? circles : ""
                          // }
                          // defaultValue={
                          //   scaleDisplay.style.display === "none"
                          //     ? undefined
                          //     : circles
                          // }
                          // defaultValue={
                          //   // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                          //   !scaleDisplay
                          //     ? undefined
                          //     : scaleDisplay === "none"
                          //     ? undefined
                          //     : circles
                          // }
                          // defaultValue={circles ? circles : ""}
                          id="button_color"
                        />
                        {/* <BiChevronDown
                    size={20}
                    ref={ref}
                    style={{ fontSize: "12px", width: "4px" }}
                  /> */}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          // defaultValue={
                          //   // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                          //   !scaleDisplay
                          //     ? undefined
                          //     : scaleDisplay === "none"
                          //     ? undefined
                          //     : fontColor
                          // }
                          // defaultValue={
                          //   scaleDisplay.style.display === "none"
                          //     ? undefined
                          //     : fontColor
                          // }
                          // defaultValue={
                          //   scaleDisplay.style.display !== "none" ? fontColor : ""
                          // }
                          // defaultValue={fontColor ? fontColor : ""}
                          id="font_color"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Style
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="font_style"
                          defaultValue={
                            // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                            fontFamlity
                              ? fontFamlity.style.fontFamily
                              : "Select"
                          }
                        >
                          <option style={{ fontSize: "11px" }}>Select</option>
                          {fontStyles.map((fontStyle, index) => (
                            <option key={index} value={fontStyle}>
                              {fontStyle}
                            </option>
                          ))}
                        </select>
                        {/* <BiChevronDown
                    size={20}
                    ref={ref}
                    style={{ fontSize: "12px", width: "4px" }}
                  /> */}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Format
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "70px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="format"
                          onChange={handleFormat}
                        >
                          <option value="number">Number</option>
                          {/* <option value="image">Image</option> */}
                          <option value="emoji">Emoji</option>
                        </select>
                        {/* <BiChevronDown
                    size={20}
                    ref={ref}
                    style={{ fontSize: "12px", width: "4px" }}
                  /> */}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "none",
                        flexDirection: "column",
                        gap: "2px",
                        width: "90%",
                      }}
                      id="emoji"
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Select Emoji
                      </h6>
                      <div
                        style={{
                          position: "relative",
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          ref={inputRef1}
                          data-input-id="emojiInp1"
                          style={{
                            width: "100%",
                            height: "18px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="emojiInp"
                          value={inputStr}
                          onChange={(e) => setInputStr(e.target.value)}
                        />

                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: "-140px",
                            zIndex: 1,
                            maxWidth: "200%",
                            maxHeight: "300px",
                          }}
                        >
                          {showPicker && (
                            <Picker
                              onEmojiClick={(emojiObject) =>
                                onEmojiClick(emojiObject, "emojiInp1")
                              }
                            />
                          )}
                        </div>
                        <GrEmoji
                          style={{
                            position: "absolute",
                            zIndex: "1",
                            backgroundColor: "#e8e8e8",
                            right: "-14px",
                            // top: "1px",
                          }}
                          onClick={() =>
                            inputStr.length === 22
                              ? ""
                              : setShowPicker(!showPicker)
                          }
                        />
                      </div>
                      {inputStr.length < 22 || inputStr.length > 22 ? (
                        <p style={{ fontSize: "small", color: "red" }}>
                          select 11 emojis
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div
                      style={{
                        display: "none",
                        flexDirection: "column",
                        gap: "1px",
                      }}
                      id="image"
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "10px" }}>
                        Upload Image
                      </h6>
                      <div
                        style={{
                          position: "relative",
                          // backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          style={{
                            width: "100px",
                            // height: "18px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          type="file"
                          onChange={handleImage}
                        />
                        {selectedImages.length > 0 && (
                          <div
                            style={{
                              // display: "flex",
                              // flexDirection: "row",
                              width: "100%",
                              gap: "2px",
                              padding: "5px",
                            }}
                            id="ImageUpload"
                          >
                            {selectedImages.map((imageData, index) => (
                              <img
                                key={index}
                                src={imageData}
                                alt={`Uploaded ${index}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Left
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          // defaultValue={leftChild ? leftChild.innerHTML : ""}
                          // defaultValue={
                          //   scaleDisplay.style.display === "none"
                          //     ? ""
                          //     : leftChild.innerHTML
                          // }
                          // defaultValue={
                          //   // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                          //   leftChild ? leftChild.innerHTML : ""
                          // }
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          id="left"
                          disabled={
                            isEmojiFormat === true &&
                            (inputStr.length < 22 || inputStr.length > 22)
                              ? true
                              : false
                          }
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Centre
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          // defaultValue={
                          //   // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                          //   neutralChild ? neutralChild.innerHTML : ""
                          // }
                          id="centre"
                          disabled={
                            isEmojiFormat === true &&
                            (inputStr.length < 22 || inputStr.length > 22)
                              ? true
                              : false
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Right
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            width: "100%",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          // defaultValue={
                          //   // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                          //   rightChild ? rightChild.innerHTML : ""
                          // }
                          id="right"
                          disabled={
                            isEmojiFormat === true &&
                            (inputStr.length < 22 || inputStr.length > 22)
                              ? true
                              : false
                          }
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Scale label
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          onChange={(e) => setScaleTitle(e.target.value)}
                          // defaultValue={leftChild ? leftChild.innerHTML : ""}
                          // defaultValue={
                          //   scaleDisplay.style.display === "none"
                          //     ? ""
                          //     : leftChild.innerHTML
                          // }
                          defaultValue={
                            // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                            scaleT ? scaleT.innerHTML : ""
                          }
                          style={{
                            width: "82px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          id="scaleLabel"
                          disabled={
                            isEmojiFormat === true &&
                            (inputStr.length < 22 || inputStr.length > 22)
                              ? true
                              : false
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Number of scales
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="scales"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      // gap: "2px",
                      alignItems: "center",
                      justifyContent: "space-between      ",
                    }}
                  >
                    <h6 style={{ fontSize: "12px" }}>Time(sec)</h6>

                    <div class="form-check form-switch">
                      <input
                        style={{ cursor: "pointer" }}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        // onChange={(e) => setIsSwitchEnabled(e.target.checked)}
                        onChange={onTimeChange}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="timeId"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="time"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      // gap: "2px",
                      alignItems: "center",
                      justifyContent: "space-between      ",
                    }}
                  >
                    <h6 style={{ fontSize: "12px" }}>
                      Show total score for all instances
                    </h6>

                    <div class="form-check form-switch">
                      <input
                        style={{ cursor: "pointer" }}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        // onChange={(e) => setScore(e.target.checked)}
                        onChange={onScoreChange}
                      />
                    </div>
                  </div>

                  {/* {score && ( */}
                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="scoreInput"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="score"
                      />
                    </div>
                  </div>
                  {/* // )} */}
                </div>
                <hr />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    padding: "0 5px",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h6 style={{ fontSize: "13px" }}>Grouped Elements</h6>
                    <div
                      style={{ display: "flex", gap: "10px", padding: "5px" }}
                    >
                      <Button
                        id="updateSingleScale"
                        type="button"
                        variant="secondary"
                        onClick={showSingle}
                        style={{ fontSize: "13px" }}
                      >
                        Single Select
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={showMulti}
                        style={{ fontSize: "13px" }}
                      >
                        Multi Select
                      </Button>
                    </div>
                    <hr />
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        // padding: "10px 10px",
                        borderRadius: "10px",
                        // padding: "5px 7px",
                        width: "100%",
                        margin: "0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="shadow-sm p-3 bg-white rounded "
                    >
                      <select
                        style={{
                          width: "100%",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          // borderRadius: "10px",
                          // padding: "3px 10px",
                          // height: "15px",
                          border: "none",
                          justifyContent: "center",
                          outline: "none",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px",
                          margin: "0 auto",
                        }}
                        className="bg-gray-800"
                      >
                        <option style={{ color: "black" }}>
                          Nothing Selected
                        </option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h6 style={{ fontSize: "13px" }}>User Permissions</h6>
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        // padding: "10px 10px",
                        borderRadius: "10px",
                        // padding: "2px 0",

                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="shadow-sm p-3 bg-white rounded"
                    >
                      <select
                        style={{
                          width: "100%",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          // borderRadius: "10px",
                          // padding: "3px 10px",
                          // height: "15px",
                          border: "none",
                          justifyContent: "center",
                          outline: "none",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px",
                          margin: "0 auto",
                        }}
                        className="bg-gray-800"
                      >
                        <option style={{ color: "black" }}>
                          Nothing Selected
                        </option>
                      </select>
                    </div>

                    <br />
                    {/* <SelectAnsAndQuestion
                      selectedType={selectedType}
                      setSelectedType={setSelectedType}
                      setAddedAns={setAddedAns}
                      addedAns={addedAns}
                    /> */}
                    <br />

                    <div>
                      <Button
                        id="button_id"
                        type="button"
                        width="50%"
                        marginTop="60px"
                        onClick={handleUpdates}
                        disabled={
                          isEmojiFormat === true &&
                          (inputStr.length < 22 || inputStr.length > 22)
                            ? true
                            : false
                        }
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div id="snippScaleForm">
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                  // overflowY: "auto",
                  // paddingTop: "5px",
                  // paddingBottom: "5px",
                  // paddingLeft: "12px",
                  // paddingRight: "12px",
                  marginTop: "15px",
                  fontSize: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    flexDirection: "column",
                    // gap: "5px",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h1
                      id="headerText"
                      style={{ margin: "auto 0", fontSize: "15px" }}
                    >
                      Edit {scaleTitle}
                    </h1>
                  </div>
                  <h6 style={{ fontSize: "12px" }}>Orientation</h6>
                  <div
                    style={{
                      backgroundColor: "#e8e8e8",
                      // padding: "5px 10px",
                      borderRadius: "10px",
                      padding: "5px 7px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <select
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        // borderRadius: "10px",
                        // padding: "3px 10px",
                        height: "15px",
                        border: "none",
                        justifyContent: "center",
                        outline: "none",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        margin: "0 auto",
                      }}
                      className="bg-gray-800"
                      id="orientationIdStapel"
                    >
                      <option value="Horizontal" style={{ color: "black" }}>
                        Horizontal
                      </option>
                      <option value="Vertical" style={{ color: "black" }}>
                        Vertical
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Scale Limit
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "5px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="number"
                        style={{
                          width: "100px",
                          height: "12px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="upperVal"
                        onChange={(e) => setUpperLimit(e.target.value)}
                        defaultValue={upperLimit}
                        // onChange={upperValueChange}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Spacing Unit
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="number"
                        style={{
                          width: "100px",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="spacing"
                        onChange={(e) => setSpace(e.target.value)}
                        // value={-upperVal}
                        defaultValue={space}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    // justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "10px",
                    // alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Scale Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="scale_color_stapel"
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Round Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="button_color_stapel"
                        />
                        {/* <BiChevronDown
                    size={20}
                    ref={ref}
                    style={{ fontSize: "12px", width: "4px" }}
                  /> */}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="font_color_stapel"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Style
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="font_style_stapel"
                          defaultValue={
                            // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                            fontFamilyStapel
                              ? fontFamilyStapel.style.fontFamily
                              : "Select"
                          }
                        >
                          <option style={{ fontSize: "11px" }}>Select</option>
                          {fontStyles.map((fontStyle, index) => (
                            <option key={index} value={fontStyle}>
                              {fontStyle}
                            </option>
                          ))}
                        </select>
                        {/* <BiChevronDown
                    size={20}
                    ref={ref}
                    style={{ fontSize: "12px", width: "4px" }}
                  /> */}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Format
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "90%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "80px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="format_stapel"
                          onChange={handleFormatStapel}
                        >
                          <option value="number">Number</option>
                          <option value="image">Image</option>
                          <option value="emoji">Emoji</option>
                        </select>
                        {/* <BiChevronDown
                    size={20}
                    ref={ref}
                    style={{ fontSize: "12px", width: "4px" }}
                  /> */}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "none",
                        flexDirection: "column",
                        gap: "2px",
                        width: "90%",
                      }}
                      id="emoji_stapel"
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Select Emoji
                      </h6>
                      <div
                        style={{
                          position: "relative",
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          //height: "30px",
                          width: "100%",
                          display: "flex",
                          // justifyContent: "center",
                          // alignItems: "center",
                        }}
                      >
                        <input
                          ref={inputRef2}
                          data-input-id="emojiInp2"
                          style={{
                            width: "100%",
                            height: "18px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="emojiInp_stapel"
                          value={inputStr}
                          onChange={(e) => setInputStr(e.target.value)}
                        />

                        <div
                          style={{
                            position: "absolute",
                            //top: "100%",
                            left: "-140px",
                            zIndex: 1,
                            maxWidth: "200%",
                            maxHeight: "300px",
                            //overflowY: "auto",
                            //padding: "5px",
                          }}
                        >
                          {showPicker && (
                            <Picker
                              onEmojiClick={(emojiObject) =>
                                onEmojiClick(emojiObject, "emojiInp2")
                              }
                            />
                          )}
                        </div>
                        <GrEmoji
                          style={{
                            position: "absolute",
                            zIndex: "1",
                            backgroundColor: "#e8e8e8",
                            right: "-14px",
                            // top: "1px",
                          }}
                          onClick={() =>
                            inputStr.length ===
                            Math.floor(upperLimit / space) * 2 * 2
                              ? ""
                              : setShowPicker(!showPicker)
                          }
                        />
                      </div>
                      {inputStr.length <
                        Math.floor(upperLimit / space) * 2 * 2 ||
                      inputStr.length >
                        Math.floor(upperLimit / space) * 2 * 2 ? (
                        <p style={{ fontSize: "small", color: "red" }}>
                          select {Math.floor(upperLimit / space) * 2} emojis
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div
                      style={{
                        display: "none",
                        flexDirection: "column",
                        gap: "1px",
                      }}
                      id="image"
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "10px" }}>
                        Upload Image
                      </h6>
                      <div
                        style={{
                          position: "relative",
                          // backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          style={{
                            width: "100px",
                            // height: "18px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          type="file"
                          onChange={handleImage}
                        />
                        {selectedImages.length > 0 && (
                          <div
                            style={{
                              // display: "flex",
                              // flexDirection: "row",
                              width: "100%",
                              gap: "2px",
                              padding: "5px",
                            }}
                            id="ImageUpload"
                          >
                            {selectedImages.map((imageData, index) => (
                              <img
                                key={index}
                                src={imageData}
                                alt={`Uploaded ${index}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Left
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          id="leftStapel"
                          disabled={
                            isEmojiFormat === true &&
                            (inputStr.length <
                              Math.floor(upperLimit / space) * 2 * 2 ||
                              inputStr.length >
                                Math.floor(upperLimit / space) * 2 * 2)
                              ? true
                              : false
                          }
                          defaultValue={stapelLeft ? stapelLeft.textContent : ""}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Right
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            width: "100%",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          // defaultValue={
                          //   // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                          //   rightChild ? rightChild.innerHTML : ""
                          // }
                          id="rightStapel"
                          disabled={
                            isEmojiFormat === true &&
                            (inputStr.length <
                              Math.floor(upperLimit / space) * 2 * 2 ||
                              inputStr.length >
                                Math.floor(upperLimit / space) * 2 * 2)
                              ? true
                              : false
                          }

                          defaultValue={stapelRight ? stapelRight.textContent : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Scale label
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "5px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        onChange={(e) => setScaleTitle(e.target.value)}
                        defaultValue={scaleT ? scaleT.innerHTML : ""}
                        style={{
                          width: "82px",
                          height: "12px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="scaleLabel_stapel"
                        disabled={
                          isEmojiFormat === true &&
                          (inputStr.length <
                            Math.floor(upperLimit / space) * 2 * 2 ||
                            inputStr.length >
                              Math.floor(upperLimit / space) * 2 * 2)
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Number of scales
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="scales_stapel"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      // gap: "2px",
                      alignItems: "center",
                      justifyContent: "space-between      ",
                    }}
                  >
                    <h6 style={{ fontSize: "12px" }}>Time(sec)</h6>

                    <div class="form-check form-switch">
                      <input
                        style={{ cursor: "pointer" }}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        // onChange={(e) => setIsSwitchEnabled(e.target.checked)}
                        onChange={onTimeChangeStapel}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="timeId_stapel"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="time_stapel"
                      />
                    </div>
                  </div>
                  {/* // )} */}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    padding: "0 5px",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                  ></div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                      <Button
                        id="button_id"
                        type="button"
                        width="50%"
                        marginTop="60px"
                        onClick={handleUpdates}
                        disabled={
                          isEmojiFormat === true &&
                          (inputStr.length <
                            Math.floor(upperLimit / space) * 2 * 2 ||
                            inputStr.length >
                              Math.floor(upperLimit / space) * 2 * 2)
                            ? true
                            : false
                        }
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div id="npsLiteScaleForm">
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                  // overflowY: "auto",
                  // paddingTop: "5px",
                  // paddingBottom: "5px",
                  // paddingLeft: "12px",
                  // paddingRight: "12px",
                  marginTop: "15px",
                  fontSize: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h1
                      id="headerText"
                      style={{ margin: "auto 0", fontSize: "15px" }}
                    >
                      Edit {scaleTitle}
                    </h1>
                  </div>
                  <h6 style={{ fontSize: "12px" }}>Orientation</h6>
                  <div
                    style={{
                      backgroundColor: "#e8e8e8",
                      borderRadius: "10px",
                      padding: "5px 7px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <select
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        height: "15px",
                        border: "none",
                        justifyContent: "center",
                        outline: "none",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        margin: "0 auto",
                      }}
                      className="bg-gray-800"
                      id="orientationId_nps_lite"
                    >
                      <option value="Horizontal" style={{ color: "black" }}>
                        Horizontal
                      </option>
                      <option value="Vertical" style={{ color: "black" }}>
                        Vertical
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Scale Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="scale_color_nps_lite"
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="font_color_nps_lite"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Style
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="font_style_nps_lite"
                          defaultValue={
                            fontFamlity
                              ? fontFamlity.style.fontFamily
                              : "Select"
                          }
                        >
                          <option style={{ fontSize: "11px" }}>Select</option>
                          {fontStyles.map((fontStyle, index) => (
                            <option key={index} value={fontStyle}>
                              {fontStyle}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Scale label
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          onChange={(e) => setScaleTitle(e.target.value)}
                          defaultValue={scaleT ? scaleT.innerHTML : ""}
                          style={{
                            width: "82px",
                            height: "12px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          id="scale_label_nps_lite"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Format
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "70px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="format_nps_lite"
                          onChange={handleFormatNpsLite}
                        >
                          <option value="text">Text</option>
                          <option value="emoji">Emoji</option>
                        </select>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "none",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                      id="emoji_nps_lite"
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Select Emoji
                      </h6>
                      <div
                        style={{
                          position: "relative",
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="emoji_inp_nps_lite"
                          value={inputStr}
                          onChange={(e) => setInputStr(e.target.value)}
                        />
                        <div
                          style={{
                            position: "absolute",
                            // top: "100%",
                            left: "-140px",
                            zIndex: 1,
                            maxWidth: "290px",
                            maxHeight: "300px",
                            // overflowY: "auto",
                            // padding: "5px",
                          }}
                        >
                          {showPicker && <Picker onEmojiClick={onEmojiClick} />}
                        </div>
                        <GrEmoji
                          style={{
                            position: "absolute",
                            zIndex: "1",
                            backgroundColor: "#e8e8e8",
                            right: "-14px",
                          }}
                          onClick={() => setShowPicker(!showPicker)}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                      margin: "auto 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Left
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          id="left_nps_lite"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Centre
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          id="center_nps_lite"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Right
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            width: "100%",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          id="right_nps_lite"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Number of Scales
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="1"
                          style={{
                            width: "100%",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          id="scale_nps_lite"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h6 style={{ fontSize: "12px" }}>Time(sec)</h6>
                    <div class="form-check form-switch">
                      <input
                        style={{ cursor: "pointer" }}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        onChange={onTimeChangeNpsLite}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="timeId_nps_lite"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="time_nps_lite"
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="scoreInput"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="score"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    id="button_id"
                    type="button"
                    width="50%"
                    marginTop="60px"
                    onClick={handleUpdates}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </div>
            <div id="likertScaleForm">
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                  overflowY: "auto",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  marginTop: "15px",
                  fontSize: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    flexDirection: "column",
                    // gap: "5px",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h1
                      id="headerText"
                      style={{ margin: "auto 0", fontSize: "15px" }}
                    >
                      Edit {scaleTitle}
                    </h1>
                  </div>
                  <h6 style={{ fontSize: "12px" }}>Orientation</h6>
                  <div
                    style={{
                      backgroundColor: "#e8e8e8",
                      // padding: "5px 10px",
                      borderRadius: "10px",
                      padding: "5px 7px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <select
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        // borderRadius: "10px",
                        // padding: "3px 10px",
                        height: "15px",
                        border: "none",
                        justifyContent: "center",
                        outline: "none",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        margin: "0 auto",
                      }}
                      className="bg-gray-800"
                      id="orientationIdLinkert"
                    >
                      <option style={{ color: "black" }}>Choose..</option>
                      <option value="Horizontal" style={{ color: "black" }}>
                        Horizontal
                      </option>
                      <option value="Vertical" style={{ color: "black" }}>
                        Vertical
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Name of Scale
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "5px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        onChange={(e) => setScaleTitle(e.target.value)}
                        defaultValue={scaleT ? scaleT.innerHTML : ""}
                        style={{
                          width: "82px",
                          height: "12px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="scaleLabel_Likert"
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Number of Scale
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100px",
                          height: "12px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="likert_no_scale"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "10px",
                    // alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="font_color_likert"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Round Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="button_color_likert"
                        />
                        {/* <BiChevronDown
                    size={20}
                    ref={ref}
                    style={{ fontSize: "12px", width: "4px" }}
                  /> */}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Label Type
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "102%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          onChange={handleLabelTypeChange}
                          value={labelType}
                          style={{
                            width: "100%",
                            backgroundColor: "transparent",
                            // borderRadius: "10px",
                            // padding: "3px 10px",
                            height: "16px",
                            border: "none",
                            justifyContent: "center",
                            outline: "none",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "12px",
                            margin: "0 auto",
                          }}
                          className="bg-gray-800"
                          id="label_type_linkert"
                        >
                          <option style={{ color: "black" }}>
                            Select Label Type
                          </option>
                          <option value="Text" style={{ color: "black" }}>
                            Text
                          </option>
                          <option value="Image" style={{ color: "black" }}>
                            Image
                          </option>
                        </select>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Style
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 3px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="font_style_likert"
                          defaultValue={
                            // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                            fontFamlity
                              ? fontFamlity.style.fontFamily
                              : "Select"
                          }
                        >
                          <option style={{ fontSize: "11px" }}>Select</option>
                          {fontStyles.map((fontStyle, index) => (
                            <option key={index} value={fontStyle}>
                              {fontStyle}
                            </option>
                          ))}
                        </select>
                        {/* <BiChevronDown
                    size={20}
                    ref={ref}
                    style={{ fontSize: "12px", width: "4px" }}
                  /> */}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "7px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Label Scale Selection
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <select
                        onChange={handleLabelScaleChange}
                        style={{
                          width: "100%",
                          backgroundColor: "transparent",
                          height: "15px",
                          border: "none",
                          justifyContent: "center",
                          outline: "none",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px",
                          margin: "0 auto",
                        }}
                        className="bg-gray-800"
                        id="labelScaleLinkert"
                        value={labelScale}
                      >
                        <option style={{ color: "black" }}>
                          --Select Choice--
                        </option>
                        <option value="2" style={{ color: "black" }}>
                          Yes/No
                        </option>
                        <option value="3" style={{ color: "black" }}>
                          3 Points Scales
                        </option>
                        <option value="4" style={{ color: "black" }}>
                          4 Points Scales
                        </option>
                        <option value="5" style={{ color: "black" }}>
                          5 Points Scales
                        </option>
                        <option value="7" style={{ color: "black" }}>
                          7 Points Scales
                        </option>
                        <option value="9" style={{ color: "black" }}>
                          9 Points Scales
                        </option>
                      </select>
                    </div>
                    {/* Add a section for the user to input labels */}
                    {/* Add a section for the user to input labels */}
                    {labelType === "Text" &&
                      labelScale !== "--Select Choice--" && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "7px",
                          }}
                          className="label-text-container"
                        >
                          <h6>Text Labels</h6>
                          {labelTexts.map((labelText, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                gap: "7px",
                                alignItems: "center",
                              }}
                            >
                              <label>{`Label Input ${index + 1}`}</label>
                              <div
                                style={{
                                  width: "150px",
                                  height: "20px",
                                  backgroundColor: "#e8e8e8",
                                  borderRadius: "5px",
                                  display: "flex",
                                  alignItems: "center",
                                  paddingLeft: "5px",
                                }}
                              >
                                <input
                                  type="text"
                                  value={labelText}
                                  onChange={(event) =>
                                    handleLabelTextChange(index, event)
                                  }
                                  className="label-text-input"
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    outline: "none",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    {labelType === "Image" &&
                      labelScale !== "--Select Choice--" && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "7px",
                          }}
                          id="label-image-container"
                        >
                          <h6>Image Labels</h6>
                          {Array.from(
                            { length: Number(labelScale) },
                            (_, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  gap: "7px",
                                  alignItems: "center",
                                }}
                              >
                                <label>{`Label Input ${index + 1}`}</label>
                                <div
                                  style={{
                                    width: "150px",
                                    height: "20px",
                                    backgroundColor: "#e8e8e8",
                                    borderRadius: "5px",
                                    display: "flex",
                                    alignItems: "center",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={selectedEmojis[index]}
                                    onChange={(event) =>
                                      handleEmojiChange(index, event)
                                    }
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      outline: "none",
                                    }}
                                    id="label_image"
                                  />
                                  <span style={{ marginLeft: "5px" }}>
                                    <GrEmoji
                                      onClick={() =>
                                        setActiveEmojiPicker(index)
                                      }
                                    />
                                    {activeEmojiPicker === index && (
                                      <Picker
                                        onEmojiClick={(emojiObject) => {
                                          handleEmojiChange(
                                            index,
                                            emojiObject.emoji
                                          );
                                          setActiveEmojiPicker(null);
                                        }}
                                      />
                                    )}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      // gap: "2px",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h6 style={{ fontSize: "12px" }}>Time(sec)</h6>

                    <div class="form-check form-switch">
                      <input
                        style={{ cursor: "pointer" }}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        // onChange={(e) => setIsSwitchEnabled(e.target.checked)}
                        onChange={onTimeChangeLikert}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="timeId_likert"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="time_likert"
                      />
                    </div>
                  </div>
                  {/* // )} */}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    padding: "0 5px",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                  ></div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                      <Button
                        id="button_id"
                        type="button"
                        width="50%"
                        marginTop="60px"
                        onClick={handleUpdates}
                        disabled={isUpdateButtonDisabled} // Disable the button if any text or image input is empty
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div id="comparisonScaleForm">
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                  overflowY: "auto",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  marginTop: "15px",
                  fontSize: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    flexDirection: "column",
                    // gap: "5px",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h1
                      id="headerText"
                      style={{ margin: "auto 0", fontSize: "15px" }}
                    >
                      Edit {scaleTitle}
                    </h1>
                  </div>
                  <h6 style={{ fontSize: "12px" }}>Orientation</h6>
                  <div
                    style={{
                      backgroundColor: "#e8e8e8",
                      // padding: "5px 10px",
                      borderRadius: "10px",
                      padding: "5px 7px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <select
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        // borderRadius: "10px",
                        // padding: "3px 10px",
                        height: "15px",
                        border: "none",
                        justifyContent: "center",
                        outline: "none",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        margin: "0 auto",
                      }}
                      name="orientation"
                      onChange={handlePairedScaleInputChange}
                      className="bg-gray-800"
                      id="orientationIdComaprison"
                    >
                      <option style={{ color: "black" }}>Choose..</option>
                      <option value="Horizontal" style={{ color: "black" }}>
                        Horizontal
                      </option>
                      <option value="Vertical" style={{ color: "black" }}>
                        Vertical
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Name of Scale
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "5px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        name="scale_name"
                        onChange={scaleNameCombinedOnChange}
                        defaultValue={scaleT ? scaleT.innerHTML : ""}
                        style={{
                          width: "82px",
                          height: "12px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="scale_label_Comparison"
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Number of Scale
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100px",
                          height: "12px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="Comparison_no_scale"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "10px",
                    // alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Scale Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          name="scalecolor"
                          onChange={handlePairedScaleInputChange}
                          id="scale_color_Comparison"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Round Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          name="roundcolor"
                          onChange={handlePairedScaleInputChange}
                          id="button_color_Comparison"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          name="fontcolor"
                          onChange={handlePairedScaleInputChange}
                          id="font_color_comparison"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Style
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          name="fontstyle"
                          onChange={handlePairedScaleInputChange}
                          id="font_style_comparison"
                          defaultValue={
                            // !scaleDisplay ? undefined ? scaleDisplay="none" ? undefined : scaleBg
                            fontFamlity
                              ? fontFamlity.style.fontFamily
                              : "Select"
                          }
                        >
                          <option style={{ fontSize: "11px" }}>Select</option>
                          {fontStyles.map((fontStyle, index) => (
                            <option key={index} value={fontStyle}>
                              {fontStyle}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Number of Item
                    </h6>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#e8e8e8",
                      padding: "3px 7px",
                      borderRadius: "7px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={pairedInputValue}
                      name="item_count"
                      onChange={itemCountcombinedOnChange}
                      onKeyDown={handlePairedKeyDownPress}
                      placeholder="0"
                      style={{
                        width: "100%",
                        height: "15px",
                        display: "flex",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        alignItems: "center",
                      }}
                      id="paired_item_count"
                    />
                  </div>
                  {pairedInputValue &&
                    Number(pairedInputValue) >= 2 &&
                    Number(pairedInputValue) <= 100 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "7px",
                        }}
                        id="item_count_label"
                      >
                        {pairedLabelTexts.map((pairedLabelText, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              gap: "7px",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "150px",
                                height: "20px",
                                backgroundColor: "#e8e8e8",
                                borderRadius: "5px",
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "5px",
                              }}
                            >
                              <input
                                type="text"
                                value={pairedLabelText}
                                onChange={(event) =>
                                  handlePairedLabelTextChange(index, event)
                                }
                                placeholder={`Paired ${index + 1}`}
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  outline: "none",
                                }}
                                id="paired_item_${index}"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  <div
                    style={{
                      display: "flex",
                      // gap: "2px",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h6 style={{ fontSize: "12px" }}>Time(sec)</h6>

                    <div class="form-check form-switch">
                      <input
                        style={{ cursor: "pointer" }}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        // onChange={(e) => setIsSwitchEnabled(e.target.checked)}
                        onChange={onTimeChangeComparison}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="timeId_comparison"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        name="time"
                        onChange={handlePairedScaleInputChange}
                        id="time_comparison"
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="scoreInput"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        onChange={handlePairedScaleInputChange}
                        id="score"
                      />
                    </div>
                  </div>
                  {/* // )} */}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    padding: "0 5px",
                    gap: "10px",
                  }}
                >
                  <div>
                    <Button
                      id="button_id"
                      type="button"
                      width="50%"
                      marginTop="60px"
                      disabled={isSubmitDisabled}
                      onClick={handleUpdates}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            <div id="percentScaleForm">
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                  overflowY: "auto",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  marginTop: "15px",
                  fontSize: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h1
                      id="headerText"
                      style={{ margin: "auto 0", fontSize: "15px" }}
                    >
                      Edit {scaleTitle}
                    </h1>
                  </div>
                  <h6 style={{ fontSize: "12px" }}>Orientation</h6>
                  <div
                    style={{
                      backgroundColor: "#e8e8e8",
                      borderRadius: "10px",
                      padding: "5px 7px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <select
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        height: "15px",
                        border: "none",
                        justifyContent: "center",
                        outline: "none",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        margin: "0 auto",
                      }}
                      className="bg-gray-800"
                      id="orientationId_percent"
                    >
                      <option value="Horizontal" style={{ color: "black" }}>
                        Horizontal
                      </option>
                      <option value="Vertical" style={{ color: "black" }}>
                        Vertical
                      </option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Slider Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          // defaultValue="red"
                          id="slider_color_percent_scale"
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="font_color_percent"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Style
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="font_style_percent"
                          defaultValue={
                            fontFamlity
                              ? fontFamlity.style.fontFamily
                              : "Select"
                          }
                        >
                          <option style={{ fontSize: "11px" }}>Select</option>
                          {fontStyles.map((fontStyle, index) => (
                            <option key={index} value={fontStyle}>
                              {fontStyle}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Scale label
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          // height: "30px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          onChange={(e) => setScaleTitle(e.target.value)}
                          defaultValue={scaleT ? scaleT.innerHTML : ""}
                          style={{
                            width: "82px",
                            height: "12px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          id="scale_label_percent"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Product count
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "5px 7px",
                        borderRadius: "7px",
                        // height: "30px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="number"
                        // onChange={(e) => setScaleTitle(e.target.value)}
                        // defaultValue={scaleT ? scaleT.innerHTML : ""}
                        style={{
                          width: "100%",
                          height: "12px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        min="1"
                        max="10"
                        id="product_percent_scale"
                        value={productCount}
                        onChange={handleProductCountChange}
                      />
                    </div>
                    <div id="product_name">
                      {inputFields.map((inputField, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: "6px",
                          }}
                        >
                          <p style={{ margin: "auto 0" }}>Label {index + 1}</p>
                          <div>{inputField}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h6 style={{ fontSize: "12px" }}>Time(sec)</h6>
                    <div class="form-check form-switch">
                      <input
                        style={{ cursor: "pointer" }}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        onChange={onTimeChangePercent}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="timeId_percent"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="time_percent"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="scoreInput"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="score"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    id="button_id"
                    type="button"
                    width="50%"
                    marginTop="60px"
                    onClick={handleUpdates}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </div>
            <div id="percentSumScaleForm">
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                  overflowY: "auto",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  marginTop: "15px",
                  fontSize: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <h1
                      id="headerText"
                      style={{ margin: "auto 0", fontSize: "15px" }}
                    >
                      Edit {scaleTitle}
                    </h1>
                  </div>
                  <h6 style={{ fontSize: "12px" }}>Orientation</h6>
                  <div
                    style={{
                      backgroundColor: "#e8e8e8",
                      borderRadius: "10px",
                      padding: "5px 7px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <select
                      style={{
                        width: "100%",
                        backgroundColor: "transparent",
                        height: "15px",
                        border: "none",
                        justifyContent: "center",
                        outline: "none",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        margin: "0 auto",
                      }}
                      className="bg-gray-800"
                      id="orientationId_percent_sum"
                    >
                      <option value="Horizontal" style={{ color: "black" }}>
                        Horizontal
                      </option>
                      <option value="Vertical" style={{ color: "black" }}>
                        Vertical
                      </option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Slider Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="slider_color_percent_sum_scale"
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Color
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          style={{
                            width: "100px",
                            height: "12px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          id="font_color_percent_sum"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Font Style
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "3px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <select
                          style={{
                            width: "100px",
                            height: "15px",
                            display: "flex",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            alignItems: "center",
                          }}
                          id="font_style_percent_sum"
                          defaultValue={
                            fontFamlity
                              ? fontFamlity.style.fontFamily
                              : "Select"
                          }
                        >
                          <option style={{ fontSize: "11px" }}>Select</option>
                          {fontStyles.map((fontStyle, index) => (
                            <option key={index} value={fontStyle}>
                              {fontStyle}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                        Name of Scale
                      </h6>
                      <div
                        style={{
                          backgroundColor: "#e8e8e8",
                          padding: "5px 7px",
                          borderRadius: "7px",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="text"
                          onChange={(e) => setScaleTitle(e.target.value)}
                          defaultValue={scaleT ? scaleT.innerHTML : ""}
                          style={{
                            width: "82px",
                            height: "12px",
                            display: "flex",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            alignItems: "center",
                          }}
                          id="scale_label_percent_sum"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Number of scales
                    </h6>
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="scales_precent_sum"
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <h6 style={{ margin: "auto 0", fontSize: "12px" }}>
                      Product count
                    </h6>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#e8e8e8",
                      padding: "3px 7px",
                      borderRadius: "7px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={percentSumInputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDownPress}
                      placeholder="No. of Products"
                      style={{
                        width: "100%",
                        height: "15px",
                        display: "flex",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        alignItems: "center",
                      }}
                      id="percent_sum_product_count"
                    />
                  </div>
                  {percentSumInputValue &&
                    Number(percentSumInputValue) >= 2 &&
                    Number(percentSumInputValue) <= 10 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "7px",
                        }}
                        id="product_count_label"
                      >
                        {percentSumLabelTexts.map(
                          (percentSumLabelText, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                gap: "7px",
                                alignItems: "center",
                              }}
                            >
                              <label>{`Product ${index + 1} Name`}</label>
                              <div
                                style={{
                                  width: "150px",
                                  height: "20px",
                                  backgroundColor: "#e8e8e8",
                                  borderRadius: "5px",
                                  display: "flex",
                                  alignItems: "center",
                                  paddingLeft: "5px",
                                }}
                              >
                                <input
                                  type="text"
                                  value={percentSumLabelText}
                                  onChange={(event) =>
                                    handlePercentSumLabelTextChange(
                                      index,
                                      event
                                    )
                                  }
                                  placeholder={`Product ${index + 1}`}
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    outline: "none",
                                  }}
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h6 style={{ fontSize: "12px" }}>Time(sec)</h6>
                    <div class="form-check form-switch">
                      <input
                        style={{ cursor: "pointer" }}
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        onChange={onTimeChangePercentSum}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="timeId_percent_sum"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="time_percent_sum"
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "none",
                      flexDirection: "column",
                      gap: "2px",
                      marginTop: "-10px",
                    }}
                    id="scoreInput"
                  >
                    <div
                      style={{
                        backgroundColor: "#e8e8e8",
                        padding: "3px 7px",
                        borderRadius: "7px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="1"
                        style={{
                          width: "100%",
                          height: "15px",
                          display: "flex",
                          backgroundColor: "transparent",
                          border: "none",
                          outline: "none",
                          alignItems: "center",
                        }}
                        id="score"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    id="button_id"
                    type="button"
                    width="50%"
                    marginTop="60px"
                    disabled={isSubmitDisabled}
                    onClick={handleUpdates}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div style={{ display: "none" }} id="border">
            <Row className="pt-4">
              <div style={{ display: "flex", alignItems: "center" }}>
                <h6 style={{ marginRight: "10rem" }}>Border</h6>
                <label className="switch">
                  <input
                    type="checkbox"
                    onClick={() => setShowSlider(!showSlider)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              {showSlider && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#abab",
                    gap: "10px",
                    height: "40px",
                    width: "90%",
                  }}
                >
                  <input
                    type="color"
                    value={borderColor}
                    onChange={handleBorderColorChange}
                    id="color"
                    style={{ border: "none", width: "10%", height: "15px" }}
                  />
                  <input
                    type="range"
                    min="-10"
                    max="20"
                    value={borderSize}
                    onChange={handleBorderSizeChange}
                    onBlur={handleRangeBlur}
                    id="range"
                    className="range-color"
                  />
                </div>
              )}
            </Row>
            <hr />
          </div>
          <div id="settingRight" style={{ display: "none" }}>
            <h3>Configurations</h3>
            <div id="settingSelect">
              <select
                onChange={handleSelect}
                id="select1"
                // onChange={handleDateMethod}
                className="select border-0 bg-white rounded w-100 h-75 p-2"
                //multiple
                style={{ marginBottom: "40px" }}
              >
                <option value="select">Select Element</option>
                {options}
              </select>
            </div>

            {/* iframe */}
            <div>
              {/* <Form.Control
            type="text"
            placeholder={`${decoded.details._id}_scl1`}
            disabled
            className="mb-4"
          // id="iframe_src"
          // onChange={handleChange}
          /> */}
            </div>
            <div id="invisible">
              <div
                id="singleScale"
                style={{ padding: "10px", gap: "10px" }}
                className="select border-0 bg-white rounded w-100 h-75 p-2"
              ></div>

              {/* <div id="multiScale">
            // <select
            //   onChange={handleSelect}
            //   id="select"
            //   // onChange={handleDateMethod}
            //   className="select border-0 bg-white rounded w-100 h-75 p-2"
            //   //multiple
            //   style={{ marginBottom: "30px" }}
            // >
            //   {filteredArray?.map((element, index) => (
            //     <option key={index} value={element.type} id={element.id}>
            //       {`${element.type} ${element.id}`}
            //     </option>
            //   ))}
            // </select>
          </div> */}
            </div>
            <div className=" text-center pt-3">
              <Button
                variant="primary"
                className="px-5"
                onClick={refreshIframe}
              >
                refresh
              </Button>
            </div>
            <div
              className="text-center pt-3"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="primary"
                className="px-5"
                onClick={scaleSubmit}
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>

              <Button
                variant="secondary"
                // className="remove_button"
                className="remove_button"
                onClick={removeScale}
                //onClick={() => setConfirmRemove(!confirmRemove)}
              >
                Remove Scale
              </Button>
            </div>
            {/* iframe */}
          </div>
        </>
      )}
    </>
  );
};

export default ScaleRightSide;
// https://100035.pythonanywhere.com/api/nps_settings_create

//not working