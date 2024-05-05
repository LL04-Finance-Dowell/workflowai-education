import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Header.css';
import { FaCopy, FaPen, FaSave } from 'react-icons/fa';
import { BiImport, BiExport, BiCut, BiCopyAlt } from 'react-icons/bi';
import { ImRedo, ImUndo, ImPaste, ImShare } from 'react-icons/im';
import CryptoJS from 'crypto-js';
import { useStateContext } from '../../contexts/contextProvider';
import Axios from 'axios';
import { CgMenuLeft, CgPlayListRemove } from 'react-icons/cg';
import {
  MdOutlineEditCalendar,
  MdOutlinePostAdd,
  MdPreview,
} from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillPrinter } from 'react-icons/ai';
import { downloadPDF } from '../../utils/genratePDF.js';

import handleSocialMediaAPI from "../../utils/handleSocialMediaAPI";
// import generateImage from '../../utils/generateImage.js';
// import RejectionModal from '../modals/RejectionModal.jsx';

import ProgressLoader from '../../utils/progressLoader/ProgressLoader';
import MidResizer from './MidResizer.jsx';
import { current } from '@reduxjs/toolkit';
import ShareDocModal from '../modals/ShareDocModal.jsx';
import { shareToEmail } from '../midSection/sendEmail.js';

const Header = () => {
  const inputRef = useRef(null);
  const componentRef = useRef(null);
  const menuRef = useRef(null);
  const {
    item,
    setItem,
    isLoading,
    setIsLoading,
    isDataSaved,
    setIsDataSaved,
    isFlipClicked,
    setIsFlipClicked,
    fetchedData,
    setFetchedData,
    deletePages,
    setDeletepages,
    title,
    setTitle,
    data,
    setData,
    isClicked,
    isFinializeDisabled,
    setIsDataRetrieved,
    setIsFinializeDisabled,
    scaleId,
    setScaleId,
    scaleData,
    setScaleData,
    custom1,
    setCustom1,
    custom2,
    setCustom2,
    custom3,
    setCustom3,
    companyId,
    setCompanyId,
    isMenuVisible,
    setIsMenuVisible,
    buttonLink,
    buttonPurpose,
    setCustomId,
    focuseddClassMaintain,
    handleClicked,
    setSidebar,
    borderSize,
    setBorderSize,
    borderColor,
    setBorderColor,
    inputBorderSize,
    setInputBorderSize,
    inputBorderColor,
    setInputBorderColor,
    calendarBorderSize,
    setCalendarBorderSize,
    calendarBorderColor,
    setCalendarBorderColor,
    dropdownBorderSize,
    setDropdownBorderSize,
    dropdownBorderColor,
    setDropdownBorderColor,
    buttonBorderSize,
    setButtonBorderSize,
    buttonBorderColor,
    setButtonBorderColor,
    signBorderSize,
    setSignBorderSize,
    signBorderColor,
    setSignBorderColor,
    tableBorderSize,
    setTableBorderSize,
    tableBorderColor,
    setTableBorderColor,
    iframeBorderSize,
    setIframeBorderSize,
    iframeBorderColor,
    setIframeBorderColor,
    scaleBorderSize,
    setScaleBorderSize,
    scaleBorderColor,
    setScaleBorderColor,
    containerBorderSize,
    setContainerBorderSize,
    containerBorderColor,
    setContainerBorderColor,
    questionAndAnswerGroupedData,
    allowHighlight,
    setAllowHighlight,
    docMapRequired,
    setDocMapRequired,
    fixedMidSecDim,
    progress,
    setProgress,
    mode,
    setMode,
    setSelOpt,
    defSelOpt,
    enablePreview,
    setEnablePreview,
    scaleMidSec,
    pendingMail,
    setPendingMail,
  } = useStateContext();

  const [printContent, setPrintContent] = useState(false);
  const [rejectionMsg, setRejectionMsg] = useState('');
  const [isOpenRejectionModal, setIsOpenRejectionModal] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [froName, setFroName] = useState("");
  const [froEmail, setFroEmail] = useState("");
  const [subject, setSubject] = useState("");


  const handleOptions = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // document.body.addEventListener("click", function() {
  //   const menuBar = document.getElementsByClassName("bar-menu")
  //   if(isMenuVisible === true) {
  //     setIsMenuVisible(!isMenuVisible);
  //   } 
  // }, true);

  const handleUndo = () => {
    document.execCommand('undo');
  };
  const handleRedo = () => {
    document.execCommand('redo');
  };

  const handleCopy = () => {
    document.execCommand('copy');
  };

  const handleTitle = () => {
    const divElement = inputRef.current;
    divElement.focus();

    //     const range = document.createRange();
    //     range.selectNodeContents(divElement);

    //     const endOffset = divElement.innerText.length;
    //     // range.setStart(divElement.firstChild, endOffset);
    //     // range.setEnd(divElement.firstChild, endOffset);
    //  console.log(divElement,endOffset);
    //     range.setStart(divElement, endOffset);
    //     range.setEnd(divElement, endOffset);

    //     range.collapse(false);

    //     const selection = window.getSelection();
    //     selection.removeAllRanges();
    //     selection.addRange(range);
  };

  let createPageNumber;
  if (item?.length) {
    createPageNumber = item[item?.length - 1].split('_')[1];
  } else {
    createPageNumber = 0;
  }
  function createNewPage() {
    createPageNumber++;
    const current = [...item];
    current.push(`div_${createPageNumber}`);

    setItem(current);
  }

  function removePage() {
    const current = [...item];

    var pageNumber = prompt('Enter the number of page to delete');
    if (pageNumber != null) {
      const index = pageNumber - 1;
      const page = document.getElementsByClassName('midSection_container')[
        index
      ];

      if (index > 0 && index < item?.length) {
        page.parentElement.remove();
        item.pop();
      } else {
        console.warn(`Cant remove page`);
      }
    }
  }

  // Adding a new branch comment

  let page = [{}];

  for (let i = 1; i <= item?.length; i++) {
    const element = { [i]: [] };
    page[0] = { ...page[0], ...element };
  }

  const dataInsertWithPage = (tempPosn, elem) => {
    let low = 0;
    let high = 1122;
    for (let i = 1; i <= item?.length; i++) {
      if (tempPosn.top >= low && tempPosn.top < high) {
        page[0][i].push(elem);
      }
      low += 1122;
      high += 1122;
    }
  };

  function savingTableData() {
    const tables = document.getElementsByClassName('tableInput');
    let tables_tags = [];

    if (tables.length) {
      for (let t = 0; t < tables.length; t++) {
        var new_table = document.getElementsByTagName('table')[0];

        tables_tags.push(new_table);
      }
    }
  }



  async function saveSocialMedia() {
    if (decoded.product_name === "Social Media Automation") {
      try {
        await handleSocialMediaAPI(decoded, true);
        toast.success("Social Media Info Saved!");
        return;
      } catch (error) {
        toast.error("Something Went Wrong!");
        console.log(error);
        return;
      }
    }
  }

  let elem = {};
  function saveDocument() {
    // console.log("/n>>> Decoded\n", decoded,"\n>>>")

    const txt = document.getElementsByClassName("textInput");
    let elem = {};
    let contentFile = [];

    function getPosition(el, childEl = false) {
      const midSec = document.getElementById('midSection_container');
      const midSecAll = document.querySelectorAll('.midSection_container');
      const rect = el.getBoundingClientRect();

      if (!childEl) {
        const page = Number(
          [...el.classList].find((cl) => cl.includes('page')).split('_')[1]
        );
        const midsectionRect = midSecAll[page - 1].getBoundingClientRect();
        const width =
          window.innerWidth < 993
            ? (rect.width * fixedMidSecDim.width) / midsectionRect.width
            : rect.width;

        const height =
          window.innerWidth < 993
            ? (rect.height / rect.width) * width
            : rect.height;

        const top =
          window.innerWidth < 993
            ? ((rect.top - midsectionRect.top) / rect.width) * width
            : rect.top - midsectionRect.top;

        const left =
          window.innerWidth < 993
            ? ((rect.left - midsectionRect.left) / midsectionRect.width) *
            fixedMidSecDim.width
            : rect.left - midsectionRect.left;

        return {
          top,
          left,
          bottom: rect.bottom,
          right: rect.right,
          width,
          height,
        };
      }

      const midsectionRect = midSec.getBoundingClientRect();

      return {
        top:
          rect.top > 0
            ? Math.abs(midsectionRect.top)
            : rect.top - midsectionRect.top,
        left:
          window.innerWidth < 993
            ? (rect.left * 793.7007874) / midsectionRect.width -
            midsectionRect.left
            : rect.left - midsectionRect.left,
        // left:rect.left - midsectionRect.left,
        bottom: rect.bottom,
        right: rect.right,
        width:
          window.innerWidth < 993
            ? (rect.width * 793.7007874) / midsectionRect.width
            : rect.width,
        // height: rect.height,
        height:
          window.innerWidth < 993
            ? (rect.width / rect.height) * rect.height
            : rect.height,
      };
    }

    const findPaageNum = (element) => {
      let targetParent = element;
      let pageNum = null;
      while (1) {
        if (targetParent.classList.contains('midSection_container')) {
          targetParent = targetParent;
          break;
        } else {
          targetParent = targetParent.parentElement;
        }
      }
      pageNum = targetParent.innerText.split('\n')[0];
      return pageNum;
    };

    if (txt.length) {
      for (let h = 0; h < txt.length; h++) {
        if (
          txt[h]?.parentElement?.classList?.contains('holderDIV') &&
          !txt[h]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = txt[h].parentElement;
          let tempPosn = getPosition(tempElem);
          // console.log("element position in header js", tempPosn);
          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: txt[h].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'TEXT_INPUT',
            data: txt[h].innerText,
            border: `${inputBorderSize} dotted ${inputBorderColor}`,
            borderWidths: txt[h].parentElement.style.border,
            raw_data: txt[h].innerHTML,
            id: `t${h + 1}`,
          };

          const pageNum = findPaageNum(txt[h]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const img_input = document.getElementsByTagName('input');
    const img = document.getElementsByClassName('imageInput');
    if (img) {
      for (let h = 0; h < img.length; h++) {
        if (
          img[h]?.parentElement?.classList?.contains('holderDIV') &&
          !img[h]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          const reader = new FileReader();
          let tempElem = img[h].parentElement;
          let tempPosn = getPosition(tempElem);
          // console.log(
          //   "img[h].style.backgroundImage",
          //   img[h].style.backgroundImage
          // );
          const dataName = img[h].style.backgroundImage
            ? img[h].style.backgroundImage
            : img[h].innerText;
          // console.log("dataName", dataName);

          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: img[h].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'IMAGE_INPUT',
            data: dataName,
            border: `${borderSize}px dotted ${borderColor}`,
            imgBorder: img[h].parentElement.style.border,
            id: `i${h + 1}`,
          };

          const pageNum = findPaageNum(img[h]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const date = document.getElementsByClassName('dateInput');
    if (date.length) {
      for (let h = 0; h < date.length; h++) {
        if (
          date[h]?.parentElement?.classList?.contains('holderDIV') &&
          !date[h]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = date[h].parentElement;
          let tempPosn = getPosition(tempElem);
          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: date[h].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'DATE_INPUT',
            border: `${calendarBorderSize} dotted ${calendarBorderColor}`,
            calBorder: date[h].parentElement.style.border,
            data: date[h].innerHTML,
            id: `d${h + 1}`,
          };

          const pageNum = findPaageNum(date[h]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const sign = document.getElementsByClassName('signInput');
    if (sign.length) {
      for (let h = 0; h < sign.length; h++) {
        if (
          sign[h]?.parentElement?.classList?.contains('holderDIV') &&
          !sign[h]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = sign[h].parentElement;
          let tempPosn = getPosition(tempElem);

          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: sign[h].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'SIGN_INPUT',
            border: `${signBorderSize} dotted ${signBorderColor}`,
            signBorder: sign[h].parentElement.style.border,
            // data:
            //   sign[h].firstElementChild === null
            //     ? // decoded.details.action === "document"
            //     sign[h].innerHTML
            //     : sign[h].firstElementChild.src,
            data: sign[h].innerHTML,
            id: `s${h + 1}`,
          };

          const pageNum = findPaageNum(sign[h]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const tables = document.getElementsByClassName('tableInput');
    if (tables.length) {
      for (let t = 0; t < tables.length; t++) {
        if (
          tables[t]?.parentElement?.classList?.contains('holderDIV') &&
          !tables[t]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = tables[t].parentElement;
          let tempPosn = getPosition(tempElem);
          function getChildData() {
            const allTableCCells = [];
            const tableChildren = tables[t].querySelector('table')?.children;
            const tableId = tables[t].querySelector('table')?.id ?? 'T1';
            let tdId = tables[t].querySelector('table')?.querySelectorAll('.text_td').length + 1
            for (let i = 0; i < tableChildren.length; i++) {
              const tableTR = { tr: null };
              const newTableTR = [];
              for (let j = 0; j < tableChildren[i].children.length; j++) {
                const childNodes = tableChildren[i].children[j]?.childNodes;
                const currentTd = tableChildren[i].children[j]
                const tdElement = [];
                childNodes.forEach((child) => {
                  if (
                    !child.classList?.contains('row-resizer') &&
                    !child.classList?.contains('td-resizer')
                  ) {
                    if (!child.innerHTML) {
                      currentTd.id = `${tableId}td${tdId}`
                      tdElement.push(currentTd);
                      tdId++;
                      console.log("\nCURRENT TD\n", currentTd, "\n")
                    } else {
                      tdElement.push(child);
                    }
                  }

                });
                const TdDivClassName = tdElement[0]?.className?.split(' ')[0];
                const trChild = {
                  td: {
                    type:
                      (TdDivClassName == 'dateInput' && 'DATE_INPUT') ||
                      (TdDivClassName == 'textInput' && 'TEXT_INPUT') ||
                      (TdDivClassName == 'imageInput' && 'IMAGE_INPUT') ||
                      (TdDivClassName == 'signInput' && 'SIGN_INPUT') ||
                      (TdDivClassName == 'dropp' && 'text_td'),
                    data:
                      TdDivClassName == 'imageInput'
                        ? tableChildren[i].children[j]?.firstElementChild.style
                          .backgroundImage
                        : tdElement[0]?.innerHTML,
                    id:
                      TdDivClassName == 'imageInput'
                        ? tableChildren[i].children[j]?.id
                        : tdElement[0]?.id,
                  },
                };
                newTableTR.push(trChild);
              }
              tableTR.tr = newTableTR;
              allTableCCells.push(tableTR);
            }

            return allTableCCells;
          }
          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'TABLE_INPUT',
            data: getChildData(),
            border: `${tableBorderSize} dotted ${tableBorderColor}`,
            tableBorder: tables[t].parentElement.style.border,
            id: tables[t].firstElementChild.id
              ? tables[t].firstElementChild.id
              : `tab${t + 1}`,
          };
          console.log("\nCURRENT ELEM\n", elem.data, "\n")

          const pageNum = findPaageNum(tables[t]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const containerElements = document.getElementsByClassName('containerInput');

    if (containerElements.length) {
      for (let h = 0; h < containerElements.length; h++) {
        if (
          containerElements[h]?.parentElement?.classList?.contains('holderDIV')
        ) {
          let tempElem = containerElements[h].parentElement;
          let tempPosn = getPosition(tempElem);

          function getChildData() {
            const allContainerChildren = [];
            const containerChildren = containerElements[h].children;

            for (let i = 0; i < containerChildren.length; i++) {
              const element = containerChildren[i];
               if(element.className == "container-add-button-wrapper"){
                continue;
               }
              let tempPosnChild = getPosition(element, true);
              const containerChildClassName =
                containerChildren[i].firstElementChild?.className.split(' ')[0];
              const childData = {};
              childData.width = tempPosnChild.width;
              childData.height = tempPosnChild.height;
              childData.top = tempPosnChild.top;
              childData.topp = element.style.top;
              childData.left = tempPosnChild.left;

              let type = '';

              switch (containerChildClassName) {
                case 'dateInput':
                  type = 'DATE_INPUT';
                  break;
                case 'textInput':
                  type = 'TEXT_INPUT';
                  break;
                case 'imageInput':
                  type = 'IMAGE_INPUT';
                  break;
                case 'signInput':
                  type = 'SIGN_INPUT';
                  break;
                case 'iframeInput':
                  type = 'IFRAME_INPUT';
                  break;
                case 'scaleInput':
                  type = 'SCALE_INPUT';
                  break;
                case 'newScaleInput':
                  type = 'NEW_SCALE_INPUT';
                  break;
                case 'buttonInput':
                  type = 'BUTTON_INPUT';
                  break;
                case 'dropdownInput':
                  type = 'DROPDOWN_INPUT';
                  break;
                case 'cameraInput':
                  type = 'CAMERA_INPUT';
                  break;
                case 'paymentInput':
                  type = 'PAYMENT_INPUT';
                  break;
                default:
                  type = '';
              }

              childData.type = type;
              const imageData =
                'imageInput' &&
                  element?.firstElementChild?.style?.backgroundImage
                  ? element.firstElementChild.style.backgroundImage
                  : element.firstElementChild?.innerHTML;
              if (type != 'TEXT_INPUT') {
                childData.data = imageData;
              }
              if (type == 'TEXT_INPUT') {
                childData.data = element.firstElementChild?.innerText;
                childData.raw_data = element.firstElementChild?.innerHTML;
              }

              childData.id = `${containerChildClassName?.[0]}${h + 1}`;
              allContainerChildren.push(childData);
            }

            return allContainerChildren;
          }
          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: containerElements[h].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'CONTAINER_INPUT',
            border: `${containerBorderSize} dotted ${containerBorderColor}`,
            containerBorder: containerElements[h].parentElement.style.border,
            data: getChildData(),
            id: `c${h + 1}`,
          };

          const pageNum = findPaageNum(containerElements[h]);
          page[0][pageNum]?.push(elem);
        }
      }
    }
    const iframes = document.getElementsByClassName('iframeInput');
    if (iframes.length) {
      for (let i = 0; i < iframes.length; i++) {
        if (
          !iframes[i]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = iframes[i].parentElement;
          let tempPosn = getPosition(tempElem);

          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: iframes[i].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'IFRAME_INPUT',
            border: `${iframeBorderSize} dotted ${iframeBorderColor}`,
            iframeBorder: iframes[i].parentElement.style.border,
            data: iframes[i].innerText
              ? 'iFrame here'
              : iframes[i].firstElementChild.src,
            id: `ifr${i + 1}`,
          };

          const pageNum = findPaageNum(iframes[i]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const scales = document.getElementsByClassName('scaleInput');
    if (scales.length) {
      for (let s = 0; s < scales.length; s++) {
        if (
          !scales[s]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = scales[s].parentElement;
          let tempPosn = getPosition(tempElem);
          // console.log(scales[s].firstElementChild);
          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: scales[s].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'SCALE_INPUT',
            border: `${scaleBorderSize} dotted ${scaleBorderColor}`,
            scaleBorder: scales[s].parentElement.style.border,
            data: `${title}_scale_${s + 1}`,
            scale_url: scales[s].firstElementChild.src,
            scaleId: tempElem.children[1].innerHTML,
            id: `scl${s + 1}`,
            details:
              decoded.details.action === 'document'
                ? 'Document instance'
                : 'Template scale',
          };

          const pageNum = findPaageNum(scales[s]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const newScales = document.getElementsByClassName('newScaleInput');
    if (newScales.length) {
      for (let b = 0; b < newScales.length; b++) {
        if (
          !newScales[b]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = newScales[b].parentElement;
          let tempPosn = getPosition(tempElem);
          // console.log(newScales[b]);
          let circles = newScales[b].querySelector('.circle_label');
          let scaleBg = newScales[b].querySelector('.label_hold');
          let scaleField = newScales[b];
          let leftChild = newScales[b].querySelector('.left_child');
          let neutralChild = newScales[b].querySelector('.neutral_child');
          let rightChild = newScales[b].querySelector('.right_child');
          let scaleText = newScales[b].querySelector('.scale_text');
          let font = newScales[b].querySelector('.scool_input');
          let scaleType = newScales[b].querySelector('.scaleTypeHolder');
          let scaleID = newScales[b].querySelector('.scaleId');
          let orentation = newScales[b].querySelector('.nps_vertical');
          let otherComponent = newScales[b].querySelector('.otherComponent');
          let smallBox = newScales[b].querySelector('.small_box');
          let leftLableStapel = newScales[b].querySelector('.leftToolTip');
          let rightLableStapel = newScales[b].querySelector('.rightTooltip');
          let stapelEmojiObj = newScales[b].querySelector('.stapelEmojiObj');
          let stapelUpperLimit =
            newScales[b].querySelector('.upper_scale_limit');
          let spaceUnit = newScales[b].querySelector('.space_unit');
          // let stapelScaleField = newScales[b].querySelector(".newScaleInput");
          // console.log(font);

          let buttonText = newScales[b].querySelectorAll('.circle_label');
          // console.log(buttonText);

          let emojiArr = [];

          if (buttonText.length !== 0) {
            for (let i = 0; i < buttonText.length; i++) {
              emojiArr.push(buttonText[i].textContent);
              // console.log(buttonText[i].textContent);
            }
          }

          let stapelOptionHolder = '';
          let stapelScaleArray = '';
          let stapelOrientation = '';

          if (scaleType.textContent === 'snipte') {
            stapelOrientation = newScales[b].querySelector('.stapel_vertical');
            stapelOptionHolder = newScales[b].querySelector(
              '.stapelOptionHolder'
            );
            stapelScaleArray = newScales[b].querySelector('.stapelScaleArray');
            // console.log("This is the saved stapel", stapelScaleArray);
          }

          let npsLiteTextArray = '';
          let orientation = '';

          if (scaleType.textContent === 'nps_lite') {
            npsLiteTextArray = newScales[b].querySelector('.nps_lite_text');
            orientation = newScales[b].querySelector('.nps_lite_orientation');
          }

          let likertScaleArray = '';

          if (scaleType.textContent === 'likert') {
            likertScaleArray = newScales[b].querySelector(
              '.likert_Scale_Array'
            );
            orientation = newScales[b].querySelector('.orientation');
            // console.log("This is likert", likertScaleArray.textContent);
          }

          let pairedScaleArray = '';

          if (scaleType.textContent === 'comparison_paired_scale') {
            pairedScaleArray = newScales[b].querySelector(
              '.paired_Scale_Array'
            );
            orientation = newScales[b].querySelector('.orientation');
            // console.log("This is likert", pairedScaleArray.textContent);
          }

          let percentBackground = '';
          let percentLabel = '';
          let percentContainer = '';
          let percentLeft = '';
          let percentCenter = [];
          let percentRight = '';
          let prodName = [];

          if (
            scaleType.textContent === 'percent_scale' ||
            scaleType.textContent === 'percent_sum_scale'
          ) {
            percentBackground = newScales[b].querySelector('.percent-slider');
            percentLabel = newScales[b]?.querySelector('.label_hold').children;
            percentContainer = newScales[b]?.querySelectorAll('.containerDIV');
            // console.log(percentLabel);

            percentContainer.forEach((elem) => {
              prodName.push(elem.querySelector('.product_name')?.textContent);
              percentCenter.push(
                elem.querySelector('center-percent')?.textContent
                  ? elem.querySelector('center-percent')?.textContent
                  : 1
              );
              // console.log(prodName);
              // console.log(percentCenter);
            });
            percentLeft = newScales[b].querySelector('.left-percent');
            percentRight = document.querySelector('.right-percent');

            orientation = newScales[b].querySelector('.orientation');
          }
          let properties = {
            scaleBgColor: scaleBg
              ? scaleBg.style.backgroundColor
              : scaleField.style.backgroundColor,
            fontColor: font ? font.style.color : scaleField.style.color,
            fontFamily: font
              ? font.style.fontFamily
              : scaleField.style.fontFamily,
            left: leftChild
              ? leftChild.textContent
              : leftLableStapel.textContent,
            center: neutralChild ? neutralChild.textContent : '',
            right: rightChild
              ? rightChild.textContent
              : rightLableStapel.textContent,
            buttonColor: circles?.style?.backgroundColor,
            scaleID: scaleID.textContent,
            scaleText: scaleText.textContent,
            buttonText: emojiArr,
            scaleType: scaleType.textContent,
            stapelOptionHolder: stapelOptionHolder.textContent,
            stapelScaleArray: stapelScaleArray.textContent,
            npsLiteTextArray: npsLiteTextArray.textContent,
            likertScaleArray: likertScaleArray.textContent,
            pairedScaleArray: pairedScaleArray.textContent,
            percentProdName: prodName,
            percentBackground: percentBackground?.style?.background,
            percentLabel: percentLabel?.length,
            percentLeft: percentLeft?.textContent,
            percentCenter: percentCenter?.textContent,
            percentRight: percentRight?.textContent,
            percentContainer: percentContainer?.length,
            orientation: orientation?.textContent,
            orentation: orentation?.textContent,
            stapelOrientation: stapelOrientation?.textContent,
            otherComponent: otherComponent ? otherComponent.textContent : '',
            smallBoxBgColor: smallBox?.style?.backgroundColor,
            stapelEmojiObj: stapelEmojiObj?.textContent,
            stapelUpperLimit: stapelUpperLimit?.textContent,
            spaceUnit: spaceUnit?.textContent,
          };
          // console.log(properties);
          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: newScales[b].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'NEW_SCALE_INPUT',
            data: `${title}_scale_${b + 1}`,
            // raw_data: tempElem.children[1].innerHTML,
            raw_data: properties,
            // purpose: tempElem.children[2].innerHTML,
            id: `scl${b + 1}`,
            // newScaleId = scale
            // details:
            //   decoded.details.action === "document"
            //     ? "Document instance"
            //     : "Template scale",
          };

          const pageNum = findPaageNum(newScales[b]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const imageCanva = document.getElementsByClassName('cameraInput');
    if (imageCanva.length) {
      for (let b = 0; b < imageCanva.length; b++) {
        if (
          !imageCanva[b]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = imageCanva[b].parentElement;

          let tempPosn = getPosition(tempElem);
          // console.log(imageCanva[b]);
          let imageLinkHolder = imageCanva[b].querySelector('.imageLinkHolder');
          let videoLinkHolder = imageCanva[b].querySelector('.videoLinkHolder');

          let properties = {
            imageLinkHolder: imageLinkHolder.textContent,
            videoLinkHolder: videoLinkHolder.textContent,
          };
          // console.log(properties);
          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: imageCanva[b].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'CAMERA_INPUT',
            raw_data: properties,
            id: `cam1${b + 1}`,
          };
          // console.log(elem);
          const pageNum = findPaageNum(imageCanva[b]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const buttons = document.getElementsByClassName('buttonInput');
    if (buttons.length) {
      for (let b = 0; b < buttons.length; b++) {
        if (
          !buttons[b]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = buttons[b].parentElement;
          let tempPosn = getPosition(tempElem);
          const link = buttonLink;
          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: buttons[b].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'BUTTON_INPUT',
            buttonBorder: `${buttonBorderSize}px dotted ${buttonBorderColor}`,
            data: buttons[b].textContent,
            raw_data: tempElem.children[1].innerHTML,
            purpose: tempElem.children[2].innerHTML,
            id: `btn${b + 1}`,
          };

          const pageNum = findPaageNum(buttons[b]);
          page[0][pageNum]?.push(elem);
        }
      }
    }
    const payments = document.getElementsByClassName('paymentInput');
    if (payments.length) {
      for (let p = 0; p < payments.length; p++) {
        if (
          !payments[p]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = payments[p].parentElement;
          let tempPosn = getPosition(tempElem);

          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: payments[p].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'PAYMENT_INPUT',
            buttonBorder: `${buttonBorderSize}px dotted ${buttonBorderColor}`,
            data: payments[p].textContent,
            raw_data: tempElem.children[1].innerHTML,
            purpose: tempElem.children[2].innerHTML,
            id: `pay${p + 1}`,
          };

          // console.log("raw_data", elem.raw_data);
          const pageNum = findPaageNum(payments[p]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const dropDowns = document.getElementsByClassName('dropdownInput');

    if (dropDowns.length) {
      for (let d = 0; d < dropDowns.length; d++) {
        if (
          !dropDowns[d]?.parentElement?.parentElement?.classList?.contains(
            'containerInput'
          )
        ) {
          let tempElem = dropDowns[d].parentElement;
          let tempPosn = getPosition(tempElem);

          const selectElement = dropDowns[d].lastElementChild;
          const selectedOption =
            selectElement.options[selectElement.selectedIndex];
          const selectedText = selectedOption?.textContent;
          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: dropDowns[d].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'DROPDOWN_INPUT',
            border: `${dropdownBorderSize} dotted ${dropdownBorderColor}`,
            dropdownBorder: dropDowns[d].parentElement.style.border,
            data: selectedText,
            data1: dropDowns[d].firstElementChild.innerHTML,
            data2: dropDowns[d].lastElementChild.innerHTML,
            id: `dd${d + 1}`,
          };

          const pageNum = findPaageNum(dropDowns[d]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    const emails = document.getElementsByClassName('emailButton');
    if (emails.length) {
      for (let e = 0; e < emails.length; e++) {
        if (!emails[e]?.parentElement?.classList?.contains('containerInput')) {
          let tempElem = emails[e].parentElement;
          let tempPosn = getPosition(tempElem);

          const emailDataDiv = tempElem.querySelector(
            '.emailDataHolder_holder'
          );
          const emailSenderData = emailDataDiv.querySelector(
            '.emailSenderDataHolder_holder'
          )?.innerText;

          elem = {
            width: tempPosn.width,
            height: tempPosn.height,
            top: tempPosn.top,
            // topp: emails[e].parentElement.style.top,
            topp: tempPosn.top,
            left: tempPosn.left,
            type: 'FORM',
            data: emails[e].textContent,
            emailData: emailSenderData,
            id: `eml${e + 1}`,
          };

          const pageNum = findPaageNum(emails[e]);
          page[0][pageNum]?.push(elem);
        }
      }
    }

    contentFile.push(page);

    return contentFile;
  }



  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const link_idd = searchParams.get('link_id');

  var decoded = jwt_decode(token);

  const { action, authorized, process_id, user_type, document_map, _id, role } =
    decoded?.details;
  const actionName = decoded?.details?.action;
  const docMap = decoded?.details?.document_map;
  const documentFlag = decoded?.details?.document_flag;
  const titleName = decoded?.details?.name;
  const finalDocName = decoded?.details?.update_field.document_name;
  const docRight = decoded?.details?.document_right;
  const docCreatedBy = decoded?.details?.created_by;
  const docCreatedOn = decoded?.details?.created_on;
  // const docPortfolio = decoded?.details?.auth_viewers[0]?.portfolio;

  const element_updated_length =
    document.getElementsByClassName('element_updated')?.length;
  const document_map_required = docMap?.filter((item) => item.required);

  // ? This "if" condition is to prevent code from running, everytime Header.js renders
  // if (!docMapRequired?.length) setDocMapRequired(document_map_required)

  useEffect(() => {
    if (document_map_required?.length > 0) {
      if (document_map_required?.length == element_updated_length) {
        setIsFinializeDisabled(false);
      }
    } else {
      setIsFinializeDisabled(false);
    }
  }, [element_updated_length]);

  function handleFinalizeButton() {
    const username = decoded?.details?.authorized;
    // console.log(username);

    function generateLoginUser() {
      return 'user_' + Math.random().toString(36).substring(7);
      // return token;
    }

    function authorizedLogin() {
      return username === undefined ? generateLoginUser() : username;
    }

    let scaleElements = document.querySelectorAll('.newScaleInput');

    const documentResponses = [];
    // console.log(scaleElements);

    scaleElements.forEach((scale) => {
      // console.log(scale);
      const scaleId = scale?.querySelector('.scaleId')?.textContent;
      const holdElem = scale?.querySelector('.holdElem')?.textContent;

      documentResponses.push({ scale_id: scaleId, score: holdElem });
    });

    // console.log(generateLoginUser());
    // console.log(documentResponses);

    const requestBody = {
      process_id: decoded.details.process_id,
      instance_id: 1,
      brand_name: 'XYZ545',
      product_name: 'XYZ511',
      username: authorizedLogin(),
      document_responses: documentResponses,

      action: decoded.details.action,
      authorized: decoded.details.authorized,
      cluster: decoded.details.cluster,
      collection: decoded.details.collection,
      command: decoded.details.command,
      database: decoded.details.database,
      document: decoded.details.document,
      document_flag: decoded.details.document_flag,
      document_right: decoded.details.document_right,
      field: decoded.details.field,
      function_ID: decoded.details.function_ID,
      metadata_id: decoded.details.metadata_id,
      role: decoded.details.role,
      team_member_ID: decoded.details.team_member_ID,
      content: decoded.details.update_field.content,
      document_name: decoded.details.update_field.document_name,
      page: decoded.details.update_field.page,
      portfolio: decoded.details.update_field.portfolio,
      created_by: decoded.details.update_field.created_by,
      created_on: decoded.details.update_field.created_on,
      user_type: decoded.details.user_type,
      _id: decoded.details._id,
    };

    Axios.post(
      'https://100035.pythonanywhere.com/api/nps_responses_create',
      requestBody
    )
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setProgress(progress + 50);
          var responseData = response.data;
          setScaleData(responseData);
          // console.log(response);
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  function handleFinalizeButtonStapel() {
    const username = decoded?.details?.authorized;
    // console.log(username);

    function generateLoginUser() {
      return 'user_' + Math.random().toString(36).substring(7);
      // return token;
    }

    function authorizedLogin() {
      return username === undefined ? generateLoginUser() : username;
    }

    let scaleElements = document.querySelectorAll('.newScaleInput');

    const documentResponses = [];
    // console.log(scaleElements);

    scaleElements.forEach((scale) => {
      // console.log(scale);
      const scaleId = scale?.querySelector('.scaleId')?.textContent;
      const holdElem = scale?.querySelector('.holdElem')?.textContent;

      documentResponses.push({ scale_id: scaleId, score: parseInt(holdElem) });
    });

    // console.log("This is stapel_res", documentResponses);

    // console.log(generateLoginUser());
    // console.log(documentResponses);

    const requestBody = {
      process_id: decoded.details.process_id,
      instance_id: 1,
      brand_name: 'XYZ545',
      product_name: 'XYZ511',
      username: authorizedLogin(),
      document_responses: documentResponses,
      action: decoded.details.action,
      authorized: decoded.details.authorized,
      cluster: decoded.details.cluster,
      collection: decoded.details.collection,
      command: decoded.details.command,
      database: decoded.details.database,
      document: decoded.details.document,
      document_flag: decoded.details.document_flag,
      document_right: decoded.details.document_right,
      field: decoded.details.field,
      function_ID: decoded.details.function_ID,
      metadata_id: decoded.details.metadata_id,
      role: decoded.details.role,
      team_member_ID: decoded.details.team_member_ID,
      content: decoded.details.update_field.content,
      document_name: decoded.details.update_field.document_name,
      page: decoded.details.update_field.page,
      portfolio: decoded.details.update_field.portfolio,
      created_by: decoded.details.update_field.created_by,
      created_on: decoded.details.update_field.created_on,
      user_type: decoded.details.user_type,
      _id: decoded.details._id,
    };

    Axios.post(
      'https://100035.pythonanywhere.com/stapel/api/stapel_responses_create/',
      requestBody
    )
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setProgress(progress + 50);
          var responseData = response.data;
          setScaleData(responseData);
          // console.log(response);
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  function handleFinalizeButtonNpsLite() {
    const username = decoded?.details?.authorized;
    // console.log(username);

    function generateLoginUser() {
      return 'user_' + Math.random().toString(36).substring(7);
      // return token;
    }

    function authorizedLogin() {
      return username === undefined ? generateLoginUser() : username;
    }

    let scaleElements = document.querySelectorAll('.newScaleInput');

    let scaleId;
    let holdElem;
    let documentResponses = [];

    scaleElements.forEach((scale) => {
      // console.log(scale);
      scaleId = scale?.querySelector('.scaleId')?.textContent;
      holdElem = scale?.querySelector('.holdElem')?.textContent;

      documentResponses.push({
        scale_id: scaleId,
        score:
          typeof holdElem === 'number' || !isNaN(holdElem)
            ? parseInt(holdElem)
            : holdElem,
      });
    });
    // console.log("This is docresp", documentResponses);

    const requestBody = {
      process_id: decoded.details.process_id,
      instance_id: 1,
      brand_name: 'XYZ545',
      product_name: 'XYZ511',
      username: authorizedLogin(),
      document_responses: documentResponses,
      action: decoded.details.action,
      authorized: decoded.details.authorized,
      cluster: decoded.details.cluster,
      collection: decoded.details.collection,
      command: decoded.details.command,
      database: decoded.details.database,
      document: decoded.details.document,
      document_flag: decoded.details.document_flag,
      document_right: decoded.details.document_right,
      field: decoded.details.field,
      function_ID: decoded.details.function_ID,
      metadata_id: decoded.details.metadata_id,
      role: decoded.details.role,
      team_member_ID: decoded.details.team_member_ID,
      content: decoded.details.update_field.content,
      document_name: decoded.details.update_field.document_name,
      page: decoded.details.update_field.page,
      user_type: decoded.details.user_type,
      _id: decoded.details._id,
    };

    Axios.post(
      'https://100035.pythonanywhere.com/nps-lite/api/nps-lite-response',
      requestBody
    )
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setProgress(progress + 50);
          var responseData = response.data;
          setScaleData(responseData);
          // console.log(response);
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  function handleFinalizeButtonLikert() {
    localStorage.setItem('hideFinalizeButton', 'true');
    const username = decoded?.details?.authorized;
    // console.log(username);

    function generateLoginUser() {
      return 'user_' + Math.random().toString(36).substring(7);
      // return token;
    }

    function authorizedLogin() {
      return username === undefined ? generateLoginUser() : username;
    }

    let scaleElements = document.querySelectorAll('.newScaleInput');

    let scaleId;
    let holdElem;
    let documentResponses = [];
    // console.log(scaleElements);

    scaleElements.forEach((scale) => {
      // console.log(scale);
      scaleId = scale?.querySelector('.scaleId')?.textContent;
      holdElem = scale?.querySelector('.holdElem')?.textContent;

      documentResponses.push({ scale_id: scaleId, score: holdElem });
    });

    // console.log(generateLoginUser());
    // console.log(documentResponses);

    const requestBody = {
      process_id: decoded.details.process_id,
      instance_id: 1,
      brand_name: 'XYZ545',
      product_name: 'XYZ511',
      username: authorizedLogin(),
      document_responses: documentResponses,
      action: decoded.details.action,
      authorized: decoded.details.authorized,
      cluster: decoded.details.cluster,
      collection: decoded.details.collection,
      command: decoded.details.command,
      database: decoded.details.database,
      document: decoded.details.document,
      document_flag: decoded.details.document_flag,
      document_right: decoded.details.document_right,
      field: decoded.details.field,
      function_ID: decoded.details.function_ID,
      metadata_id: decoded.details.metadata_id,
      role: decoded.details.role,
      team_member_ID: decoded.details.team_member_ID,
      content: decoded.details.update_field.content,
      document_name: decoded.details.update_field.document_name,
      page: decoded.details.update_field.page,
      user_type: decoded.details.user_type,
      _id: decoded.details._id,
    };

    Axios.post(
      'https://100035.pythonanywhere.com/likert/likert-scale_response/',
      requestBody
    )
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setProgress(progress + 50);
          var responseData = response.data;
          setScaleData(responseData);
          // console.log(response);
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  function handleFinalizeButtonPercent() {
    const username = decoded?.details?.authorized;
    // console.log(username);

    function generateLoginUser() {
      return 'user_' + Math.random().toString(36).substring(7);
      // return token;
    }

    function authorizedLogin() {
      return username === undefined ? generateLoginUser() : username;
    }

    let scaleElements = document.querySelectorAll('.newScaleInput');

    const documentResponses = new Set(); // Use a Set to store unique entries

    scaleElements.forEach((scale) => {
      const scaleIdElement = scale.querySelector('.scaleId');
      const scaleId = scaleIdElement ? scaleIdElement.textContent : null;

      if (scaleId !== null && !documentResponses.has(scaleId)) {
        const centerTextElements = scale.querySelectorAll('.center-percent');
        const centerTextArray = [];

        centerTextElements.forEach((val) => {
          const originalText = val.textContent;
          const textWithoutPercent = originalText.replace('%', '');
          centerTextArray.push(Number(textWithoutPercent));
        });

        documentResponses.add({
          scale_id: scaleId,
          score: centerTextArray,
        });
      }
    });

    // Convert the Set back to an array if needed
    const documentResponsesArray = Array.from(documentResponses);
    // console.log(documentResponsesArray);

    // console.log(generateLoginUser());
    // console.log(documentResponses);

    const requestBody = {
      process_id: decoded.details.process_id,
      instance_id: 1,
      brand_name: 'XYZ545',
      product_name: 'XYZ511',
      username: authorizedLogin(),
      document_responses: documentResponsesArray,

      action: decoded.details.action,
      authorized: decoded.details.authorized,
      cluster: decoded.details.cluster,
      collection: decoded.details.collection,
      command: decoded.details.command,
      database: decoded.details.database,
      document: decoded.details.document,
      document_flag: decoded.details.document_flag,
      document_right: decoded.details.document_right,
      field: decoded.details.field,
      function_ID: decoded.details.function_ID,
      metadata_id: decoded.details.metadata_id,
      role: decoded.details.role,
      team_member_ID: decoded.details.team_member_ID,
      content: decoded.details.update_field.content,
      document_name: decoded.details.update_field.document_name,
      page: decoded.details.update_field.page,
      user_type: decoded.details.user_type,
      _id: decoded.details._id,
    };

    Axios.post(
      'https://100035.pythonanywhere.com/percent/api/percent_responses_create/',
      requestBody
    )
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setProgress(progress + 50);
          var responseData = response.data;
          setScaleData(responseData);
          // console.log(response);
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  function handleFinalizeButtonPercentSum() {
    const username = decoded?.details?.authorized;
    // console.log(username);

    function generateLoginUser() {
      return 'user_' + Math.random().toString(36).substring(7);
      // return token;
    }

    function authorizedLogin() {
      return username === undefined ? generateLoginUser() : username;
    }

    let scaleElements = document.querySelectorAll('.newScaleInput');

    const documentResponses = new Set(); // Use a Set to store unique entries

    scaleElements.forEach((scale) => {
      const scaleIdElement = scale.querySelector('.scaleId');
      const scaleId = scaleIdElement ? scaleIdElement.textContent : null;

      if (scaleId !== null && !documentResponses.has(scaleId)) {
        const centerTextElements = scale.querySelectorAll('.center-percent');
        const centerTextArray = [];

        centerTextElements.forEach((val) => {
          const originalText = val.textContent;
          const textWithoutPercent = originalText.replace('%', '');
          centerTextArray.push(Number(textWithoutPercent));
        });

        documentResponses.add({
          scale_id: scaleId,
          score: centerTextArray,
        });
      }
    });

    // Convert the Set back to an array if needed
    const documentResponsesArray = Array.from(documentResponses);
    // console.log(documentResponsesArray);

    // console.log(generateLoginUser());
    // console.log(documentResponses);

    const requestBody = {
      process_id: decoded.details.process_id,
      instance_id: 1,
      brand_name: 'XYZ545',
      product_name: 'XYZ511',
      username: authorizedLogin(),
      document_responses: documentResponsesArray,

      action: decoded.details.action,
      authorized: decoded.details.authorized,
      cluster: decoded.details.cluster,
      collection: decoded.details.collection,
      command: decoded.details.command,
      database: decoded.details.database,
      document: decoded.details.document,
      document_flag: decoded.details.document_flag,
      document_right: decoded.details.document_right,
      field: decoded.details.field,
      function_ID: decoded.details.function_ID,
      metadata_id: decoded.details.metadata_id,
      role: decoded.details.role,
      team_member_ID: decoded.details.team_member_ID,
      content: decoded.details.update_field.content,
      document_name: decoded.details.update_field.document_name,
      page: decoded.details.update_field.page,
      user_type: decoded.details.user_type,
      _id: decoded.details._id,
    };

    // console.log("This is percent_sum payloaf", requestBody);
    Axios.post(
      'https://100035.pythonanywhere.com/percent-sum/api/percent-sum-response-create/',
      requestBody
    )
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setProgress(progress + 50);
          var responseData = response.data;
          setScaleData(responseData);
          // console.log(response);
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
  }
  const getTitleName = () => {
    const titleNames = document.querySelectorAll('.title-name');

    for (let i = 0; i < titleNames.length; i++) {
      const style = window.getComputedStyle(titleNames[i]);
      if (style.display !== 'none') {
        return titleNames[i].innerText;
      }
    }

    return titleName;
  }
  function submit(e) {
    setProgress(progress + 50);
    e.preventDefault();
    // setIsLoading(true);
    setIsButtonDisabled(true);
    const dataa = saveDocument();
    saveSocialMedia();
    const finalize = document.getElementById('finalize-button');

    const titleName = getTitleName();

    const field = {
      _id: decoded.details._id,
    };
    let updateField = {};
    if (decoded.details.action === 'template') {
      updateField = {
        template_name: titleName,
        content: JSON.stringify(dataa),
        page: item,
      };
    } else if (decoded.details.action === 'document') {
      updateField = {
        document_name: titleName,
        content: JSON.stringify(dataa),
        page: item,
        edited_by: decoded.details.edited_by,
        edited_on: decoded.details.edited_on,
        portfolio: decoded.details.portfolio
      }
    }

    // console.log(updateField.content);

    console.log(">>decoded", decoded),

      <iframe src='http://localhost:5500/'></iframe>;

    function sendMessage() {
      const message =
        decoded.details.action === 'document'
          ? 'Document saved'
          : 'Template saved';
      const iframe = document.querySelector('iframe');
      iframe?.contentWindow?.postMessage(message, '*');
    }
    Axios.post(
      'https://100058.pythonanywhere.com/api/save-data-into-collection/',
      {
        cluster: decoded.details.cluster,
        collection: decoded.details.collection,
        command: decoded.details.command,
        database: decoded.details.database,
        document: decoded.details.document,
        // edited_by:decoded.details.edited_by,
        // edited_on: decoded.details.edited_on,
        // portfolio: decoded.details.portfolio,
        field: field,
        function_ID: decoded.details.function_ID,
        team_member_ID: decoded.details.team_member_ID,
        update_field: updateField,
        page: item,
        scale_url: `${scaleData}`,
        company_id: companyId,
        type: decoded.details.action,
        questionAndAns: questionAndAnswerGroupedData,
        action: decoded.details.action,
        metadata_id: decoded.details.metadata_id,
      }
    )
      .then((res) => {
        setProgress(100);
        if (res) {
          toast.success('Saved successfully');
          setIsLoading(false);
          setIsButtonDisabled(false);
          if (finalize) {
            setTimeout(() => {
              setProgress(50)
              handleFinalize();
            }, 2000);
          }
          if (decoded.details.action === 'document') {
            let scaleType = document.querySelector('.scaleTypeHolder');
            if (scaleType.textContent === 'nps') {
              handleFinalizeButton();
            } else if (scaleType.textContent === 'snipte') {
              handleFinalizeButtonStapel();
            } else if (scaleType.textContent === 'nps_lite') {
              handleFinalizeButtonNpsLite();
            } else if (scaleType.textContent === 'likert') {
              handleFinalizeButtonLikert();
            } else if (scaleType.textContent === 'percent_scale') {
              handleFinalizeButtonPercent();
            } else if (scaleType.textContent === 'percent_sum_scale') {
              handleFinalizeButtonPercentSum();
            }
          }
          setIsDataSaved(true);
        }
      })
      .catch((err) => {
        setProgress(100);
        setIsLoading(false);
        setIsButtonDisabled(false);
      });
  }

  // token creation code
  function base64url(source) {
    // Encode in classical base64
    var encodedSource = CryptoJS.enc.Base64.stringify(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
  }

  var header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
  var encodedHeader = base64url(stringifiedHeader);

  var dataa = {
    document_id: decoded.details._id,
    action: decoded.details.action,
    database: decoded.details.database,
    collection: decoded.details.collection,
    team_member_ID: decoded.details.team_member_ID,
    function_ID: decoded.details.function_ID,
    cluster: decoded.details.cluster,
    document: decoded.details.document,
    update_field: decoded.details.update_field,
  };
  // console.log("here is new data for export", dataa);

  var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(dataa));
  var encodedData = base64url(stringifiedData);

  var exportToken = encodedHeader + '.' + encodedData;

  // token creation end

  const getPostData = async () => {
    // handleSocialMediaAPI(decoded, true);
    const response = await Axios.post(
      'https://100058.pythonanywhere.com/api/get-data-from-collection/',
      {
        document_id: decoded.details._id,
        action: decoded.details.action,
        database: decoded.details.database,
        collection: decoded.details.collection,
        previous_viewers: decoded.details.previous_viewers,
        next_viewers: decoded.details.next_viewers,
        team_member_ID: decoded.details.team_member_ID,
        function_ID: decoded.details.function_ID,
        cluster: decoded.details.cluster,
        document: decoded.details.document,
        update_field: decoded.details.update_field,
      }
    )
      .then((res) => {
        // Handling title
        const loadedDataT = res.data;
        // // console.log(res.data.content, "loaded");

        if (decoded.details.action === 'template') {
          setTitle(loadedDataT.template_name);
        } else if (decoded.details.action === 'document') {
          setTitle(loadedDataT.document_name);
        }

        //Handling content
        const loadedData = JSON.parse(res.data.content);
        const pageData = res.data.page;
        setItem(pageData);

        setData(loadedData[0][0]);
        setIsDataRetrieved(true);
        setIsLoading(false);
        setFetchedData(loadedData[0][0]);

        //Handling company_id
        const company_id = res.data.company_id;
        setCompanyId(company_id);
        npsCustomData();
      })
      .catch((err) => {
        setIsLoading(false);
        // console.log(err);
      });
  };

  const npsCustomData = () => {
    // console.log(decoded.details._id);
    Axios.post('https://100035.pythonanywhere.com/api/nps_custom_data_all', {
      template_id: decoded.details._id,
    })
      .then((res) => {
        // console.log(res.data);
        const data = res.data.data;
        setCustomId(data);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  useEffect(() => {
    getPostData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // isMenuVisible(false);
        setIsMenuVisible(true);
      }
    }
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };

  }, []);

  // copy text function

  function copyText() {
    let div = document.querySelector('.token_text');
    let text = div.innerText;
    let textArea = document.createElement('textarea');
    textArea.width = '1px';
    textArea.height = '1px';
    textArea.background = 'transparents';
    textArea.value = text;
    document.body.append(textArea);
    textArea.select();
    document.execCommand('copy'); //No i18n
    document.body.removeChild(textArea);
    toast('Text coppied', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  }
  // copy text function end

  // handle sharing starts here
  async function handleShare() {
    setPendingMail(true);
    const shareInfo =
    {
      toname: toName,
      toemail: toEmail,
      fromname: froName,
      fromemail: froEmail,
      subject: subject
    }
    try {
      const data = await shareToEmail(shareInfo, token);
      setPendingMail(data);
    } catch (error) {
      console.log(error);
      toast.error('Please ensure all required data is submitted');
    } finally {
      setToEmail("");
      setToName("");
      setFroEmail("");
      setFroName("");
      setSubject("");
    }
  }

  function handleToken() {
    setData([]);
    setIsDataRetrieved(false);
    setFetchedData([]);
    setIsLoading(true);
    var tokenn = prompt('Paste your token here');
    if (tokenn == null) {
      console.log(" No token given here", tokenn);
    }
    else if (tokenn != null) {
      const decodedTok = jwt_decode(tokenn);
      console.log('tokkkkkkennn', decodedTok);
      const getPostData = async () => {
        const response = await Axios.post(
          'https://100058.pythonanywhere.com/api/get-data-from-collection/',
          {
            document_id: decodedTok.document_id,
            action: decodedTok.action,
            database: decodedTok.database,
            collection: decodedTok.collection,
            team_member_ID: decodedTok.team_member_ID,
            function_ID: decodedTok.function_ID,
            cluster: decodedTok.cluster,
            document: decodedTok.document,
          }
        )
          .then((res) => {
            // Handling title
            const loadedDataT = res.data;
            // console.log(res);

            if (decoded.details.action === 'template') {
              setTitle('Untitle-File');
            } else if (decoded.details.action === 'document') {
              setTitle('Untitle-File');
            }

            //Handling content
            const loadedData = JSON.parse(res.data.content);
            const pageData = res.data.page;
            setItem(pageData);
            // console.log(loadedData);
            // console.log("Loaded Data ", loadedData[0][0]);
            setData(loadedData[0][0]);
            setFetchedData(loadedData[0][0]);
            setIsDataRetrieved(true);
            // setSort(loadedData[0][0]);
            setIsLoading(false);
            // setFetchedData(loadedData[0][0]);
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err);
          });
      };
      getPostData();
    }
    getPostData();

  }

  // // console.log('page count check', item);
  const linkId = decoded.details.link_id;

  const halfProgressBar = document.getElementById('progress-50');
  function handleFinalize() {
    // setIsLoading(true);
    // halfProgressBar.click();
    setProgress(50);
    setIsButtonDisabled(true);
    const finalize = document.getElementById('finalize-button');
    const reject = document.getElementById('reject-button');

    const completeProgressBar = document.getElementById('progress-100');

    Axios.post(
      // `https://100094.pythonanywhere.com/v1/processes/${process_id}/finalize/`,
      `https://100094.pythonanywhere.com/v1/processes/${process_id}/finalize-or-reject/`,
      {
        user_type: user_type,
        link_id: link_idd,
        action: 'finalized',
        authorized: authorized,
        item_type: 'clone',
        item_id: _id,
        company_id: companyId,
        role: role,
      }
    )
      .then((res) => {
        // console.log("This is my response", res);
        setIsLoading(false);
        // completeProgressBar.click();
        setProgress(100);
        toast.success(res?.data);
        finalize.style.visibility = 'hidden';
        reject.style.visibility = 'hidden';
      })
      .catch((err) => {
        setIsLoading(false);
        // console.log(err);
        toast.error(err);
        // alert(err?.message);
      });
  }

  function handleReject() {
    // setIsLoading(true);
    setProgress(50);
    const completeProgressBar = document.getElementById('progress-100');

    const finalize = document.getElementById('finalize-button');
    const reject = document.getElementById('reject-button');
    Axios.post(
      // `https://100094.pythonanywhere.com/v1/processes/${process_id}/reject/`,
      `https://100094.pythonanywhere.com/v1/processes/${process_id}/finalize-or-reject/`,
      {
        action: 'rejected',
        // item_id: process_id,
        authorized: authorized,
        // document_id: _id,
        item_type: 'clone',
        item_id: _id,
        company_id: companyId,
        role: role,
        user_type: user_type,
        link_id: link_idd,
        message: rejectionMsg,
      }
    )
      .then((res) => {
        // completeProgressBar.click();
        setProgress(100);
        setIsLoading(false);
        finalize.style.visibility = 'hidden';
        reject.style.visibility = 'hidden';
        // console.log(res);
        // alert(res?.data);
        toast.error(res?.data);
      })
      .catch((err) => {
        setIsLoading(false);
        // console.log(err);
        toast.error(err);
      });
  }
  const hanldePrint = (e) => {
    window.print();
    // bodyEl.style.display = "block";
  };

  //Event handler for pdf print
  const handlePDFPrint = async () => {
    const allScales = document.querySelectorAll('.newScaleInput');
    for (let i = 0; i <= Array.from(allScales).length; i++) {
      if (Array.from(allScales)[i]) {
        let res = await generateImage(Array.from(allScales)[i]);
        Array.from(allScales)[i].setAttribute('snapshot', res);
      }
    }
    const containerAll = document.querySelectorAll('.midSection_container');
    const fileName = document.querySelector('.title-name').innerText;
    downloadPDF(Array.from(containerAll), fileName);
  };

  const handleModeChange = () => {
    if (mode === 'preview') {
      switch (defSelOpt) {
        case 'large':
          // setMidSecWdith(fixedMidSecDim.width);
          // scaleMidSec();
          break;
        case 'mid':
          // setMidSecWdith(720);
          // scaleMidSec()
          break;
        case 'small':
          // setMidSecWdith(350);
          // scaleMidSec();
          break;
        default:
          return;
      }
    }

    // setSelOpt(defSelOpt);
    setMode(mode === 'edit' ? 'preview' : mode === 'preview' ? 'edit' : '');

    document.querySelectorAll('.preview-canvas')?.forEach(elem=>elem.parentElement?.remove());

  };

  return (
    <>
      <div
        className={`header mobile_header ${actionName == 'template' ? 'header_bg_template' : 'header_bg_document'
          }`}
      >
        <Container fluid>
          <Row>
            <Col className='d-flex lhs-header'>
              <div
                className={`header_icons position-relative ${mode === 'preview' ? 'vis_hid' : ''
                  }`}
              >
                <CgMenuLeft className='head-bar' onClick={handleOptions} />
                {isMenuVisible && (
                  <div
                    ref={menuRef}
                    className={`position-absolute bg-white d-flex flex-column p-4 bar-menu menu ${isMenuVisible ? 'show' : ''
                      }`}
                  >
                    <div className='d-flex cursor_pointer' onClick={() => setShareModalOpen(true)}>
                      <ImShare />
                      <p>Share</p>
                    </div>
                    <div className='d-flex cursor_pointer' onClick={handleUndo}>
                      <ImUndo />
                      <p>Undo</p>
                    </div>
                    <div className='d-flex cursor_pointer' onClick={handleRedo}>
                      <ImRedo />
                      <p>Redo</p>
                    </div>
                    <div className='d-flex cursor_pointer' onClick={handleUndo}>
                      {/* handleCut */}
                      <BiCut />
                      <p>Cut</p>
                    </div>
                    <div className='d-flex cursor_pointer' onClick={handleCopy}>
                      <BiCopyAlt />
                      <p>Copy</p>
                    </div>
                    <div className='d-flex cursor_pointer' onClick={handleRedo}>
                      {/* handlePaste */}
                      <ImPaste />
                      <p>Paste</p>
                    </div>
                    <div
                      className='d-flex cursor_pointer'
                      onClick={() => handlePDFPrint()}
                    >
                      <AiFillPrinter />
                      <p>Print</p>
                    </div>

                    {actionName == 'template' && (
                      <button
                        className='page_btn p-0 d-flex cursor_pointer'
                        onClick={() => createNewPage()}
                      >
                        <MdOutlinePostAdd />
                        <p>Add Page</p>
                      </button>
                    )}
                    {actionName == 'template' && (
                      <button
                        className='page_btn p-0 d-flex cursor_pointer'
                        onClick={() => removePage()}
                      >
                        <CgPlayListRemove />
                        <p>Remove Page</p>
                      </button>
                    )}
                    <button
                      className='page_btn p-0 d-flex cursor_pointer'
                      onClick={handleToken}
                    >
                      <BiImport />
                      <p>Import</p>
                    </button>
                    <button
                      className='d-flex page_btn p-0 cursor_pointer'
                      id='saving-button'
                      data-bs-toggle='modal'
                      data-bs-target='#exampleModal'
                    >
                      <BiExport />
                      <p>Export</p>
                    </button>
                  </div>
                )}
              </div>

              <div
                className={`d-flex align-items-center gap-2 header_p ${mode === 'preview' ? 'vis_hid' : ''
                  }`}
              >
                <div
                  className='title-name px-3 mobile-title'
                  contentEditable={true}
                  style={{
                    fontSize: 18,
                    height: window.innerWidth < 993 ? '75px' : '50px',
                    overflowY: 'auto',
                    padding: '10px',
                  }}
                  spellCheck='false'
                  ref={inputRef}
                >
                  {docMap ? finalDocName : titleName}
                </div>
                <FaPen className='cursor-pointer' onClick={handleTitle} />
              </div>
            </Col>

            <Col>
              <div className='right_header'>
                <div className='view_mode_wrapper'>
                  <button
                    className={`view_mode`}
                    onClick={handleModeChange}
                    disabled={!enablePreview}
                  >
                    {mode === 'edit' ? (
                      <>
                        <span className='mode_icon'>
                          <MdPreview />
                        </span>{' '}
                        <span className='mode_tag'>Preview</span>
                      </>
                    ) : mode === 'preview' ? (
                      <>
                        <span className='mode_icon'>
                          <MdOutlineEditCalendar />
                        </span>
                        <span className='mode_tag'>Edit</span>
                      </>
                    ) : (
                      'Mode bug'
                    )}
                  </button>

                  {actionName === 'template' && mode === 'preview' && (
                    <MidResizer />
                  )}
                </div>

                <div
                  className={`${docMap ? 'header_btn' : 'savee'} ${mode === 'preview' ? 'vis_hid' : ''
                    }`}
                >
                  {/* <div style={{ marginRight: "20px" }}>
                  <input type="checkbox" onChange={() => setAllowHighlight(!allowHighlight)} />{"  "}
                  <label>Allow Highlight</label>
                </div> */}
                  <Button
                    size='md'
                    className='rounded remove_button'
                    id='saving-buttonn'
                    onClick={
                      decoded.product_name === "Social Media Automation" ? saveSocialMedia : submit
                    }
                    style={{
                      visibility: documentFlag && 'hidden',
                    }}
                    disabled={isButtonDisabled}
                  >
                   <FaSave color='white' />
                  </Button>
                 
                  
                </div>
                <div className={`d-flex share_button ${mode === 'preview' ? 'vis_hid' : ''
                  }`} onClick={() => setShareModalOpen(true)}>
                  <ImShare />
                </div>
                <div
                  className={`mt-1 text-center p-2 ${mode === 'preview' ? 'vis_hid' : ''
                    }`}
                >
                  <div
                    className='modal fade'
                    id='exampleModal'
                    tabindex='-1'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                  >
                    <div className='modal-dialog'>
                      <div className='modal-content'>
                        <div className='modal-header'>
                          <h5 className='modal-title' id='exampleModalLabel'>
                            Token
                          </h5>
                          <button
                            type='button'
                            className='btn-close'
                            data-bs-dismiss='modal'
                            aria-label='Close'
                          ></button>
                        </div>
                        <div className='modal-body token_text'>
                          {exportToken}
                        </div>
                        <div className='modal-footer head'>
                          <button
                            type='button'
                            className='btn btn-secondary'
                            data-bs-dismiss='modal'
                          >
                            Close
                          </button>
                          <button
                            onClick={copyText}
                            type='button'
                            data-bs-dismiss='modal'
                            className='copyBtnn btn btn-primary'
                          >
                            <FaCopy className='me-2' color='white' size={32} />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {actionName == 'document' &&
                  docMap &&
                  data != '' &&
                  docRight !== 'view' && (
                    <>
                      {/* <div className={`mt-2 text-center mb-2 px-2 ${isFinializeDisabled ? disable_pointer_event : enable_pointer_event}`}> */}
                      <div
                        className={`mt-2 text-center mb-2 px-2 ${mode === 'preview' ? 'vis_hid' : ''
                          }`}
                      >
                        <Button
                          variant='success'
                          size='md'
                          className='rounded px-4'
                          id='finalize-button'
                          disabled={isFinializeDisabled || isButtonDisabled}
                          onClick={submit}
                          style={{
                            visibility:
                              documentFlag == 'processing'
                                ? 'visible'
                                : 'hidden',
                          }}
                        >
                          Finalize
                        </Button>
                      </div>

                      <div
                        className={`mt-2 text-center mb-2 px-2 ${mode === 'preview' ? 'vis_hid' : ''
                          }`}
                      >
                        <Button
                          variant='danger'
                          size='md'
                          className='rounded px-4'
                          id='reject-button'
                          onClick={() => setIsOpenRejectionModal(true)}
                          style={{
                            visibility:
                              documentFlag == 'processing'
                                ? 'visible'
                                : 'hidden',
                          }}
                          disabled={isButtonDisabled}
                        >
                          Reject
                        </Button>
                      </div>
                    </>
                  )}
              </div>
              <ToastContainer size={5} />
            </Col>
          </Row>
        </Container>

        {isOpenRejectionModal && (
          <RejectionModal
            openModal={setIsOpenRejectionModal}
            handleReject={handleReject}
            msg={rejectionMsg}
            setMsg={setRejectionMsg}
          />
        )}
        {shareModalOpen && (
          <ShareDocModal
            openModal={setShareModalOpen}
            toName={toName}
            setToName={setToName}
            toEmail={toEmail}
            setToEmail={setToEmail}
            froName={froName}
            setFroName={setFroName}
            froEmail={froEmail}
            setFroEmail={setFroEmail}
            subject={subject}
            setSubject={setSubject}
            handleShare={handleShare}

          />
        )}

        <ProgressLoader />
      </div>
      <div
        className={`header desktop_header ${actionName == 'template' ? 'header_bg_template' : 'header_bg_document'
          } ${mode == 'preview' ? "preview_header" : ''}` }
      >
        <Container fluid>
          <Row>
            <Col className='d-flex lhs-header'>
              <div
                className={`header_icons position-relative ${mode === 'preview' ? 'vis_hid' : ''
                  }`}
              >
                <CgMenuLeft className='head-bar' onClick={handleOptions} />

              </div>


            </Col>

            <Col>
              <div className='right_header'>
                <div
                  className={`d-flex align-items-center gap-2 header_p ${mode === 'preview' ? 'vis_hid' : ''
                    }`}
                >
                  <div
                    className='title-name px-3 desktop-title'
                    contentEditable={true}
                    style={{
                      fontSize: 18,

                      height: window.innerWidth < 993 ? '75px' : '50px',
                      overflowY: 'auto',
                      padding: '10px',
                    }}
                    spellCheck='false'
                    ref={inputRef}
                  >
                    {docMap ? finalDocName : titleName}
                  </div>
                  <div className='d-flex cursor_pointer' title='Edit' onClick={handleRedo}>
                    <FaPen className='cursor-pointer' onClick={handleTitle} />
                  </div>
                  <div className='d-flex cursor_pointer' title='Undo' onClick={handleUndo}>
                    <ImUndo />
                  </div>
                  <div className='d-flex cursor_pointer' title='Redo' onClick={handleRedo}>
                    <ImRedo />
                  </div>
                </div>
                <div className={`header-buttons ${mode === 'preview' ? 'margin_auto' : ''
                  }`}>
                  <div
                    className={`${docMap ? 'header_btn' : 'savee'} ${mode === 'preview' ? 'vis_hid' : ''
                      }`}
                  >
                    {/* <div style={{ marginRight: "20px" }}>
                  <input type="checkbox" onChange={() => setAllowHighlight(!allowHighlight)} />{"  "}
                  <label>Allow Highlight</label>
                </div> */}
                    <Button
                      size='md'
                      className='rounded remove_button'
                      id='saving-buttonn'
                      onClick={
                        decoded.product_name === "Social Media Automation" ? saveSocialMedia : submit
                      }
                      style={{
                        visibility: documentFlag && 'hidden',
                      }}
                      disabled={isButtonDisabled}
                    >
                      Save <FaSave color='white' />
                    </Button>
                    {/*  )} */}
                  </div>
                  <div className='view_mode_wrapper'>
                    {actionName === 'template' && <div
                      className={`share_button`}
                      onClick={handleModeChange}
                      disabled={!enablePreview}
                    >
                      {mode === 'edit' ? (
                        <>
                          <span className='mode_icon'>
                            <MdPreview />
                          </span>{' '}
                          <span className='mode_tag'>Preview</span>
                        </>
                      ) : mode === 'preview' ? (
                        <>
                          <span className='mode_icon'>
                            <MdOutlineEditCalendar />
                          </span>
                          <span className='mode_tag'>Edit</span>
                        </>
                      ) : (
                        'Mode bug'
                      )}
                    </div>}

                    {actionName === 'template' && mode === 'preview' && (
                      <MidResizer />
                    )}
                  </div>
                  <div className={`d-flex share_button ${mode === 'preview' ? 'vis_hid' : ''
                    }`} onClick={() => setShareModalOpen(true)}>
                    <ImShare />
                    <p>Share</p>
                  </div>
                </div>


                <div
                  className={`mt-1 text-center p-2 ${mode === 'preview' ? 'vis_hid' : ''
                    }`}
                >
                  <div
                    className='modal fade'
                    id='desktopModal'
                    tabindex='-1'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                  >
                    <div className='modal-dialog'>
                      <div className='modal-content'>
                        <div className='modal-header'>
                          <h5 className='modal-title' id='exampleModalLabel'>
                            Token
                          </h5>
                          <button
                            type='button'
                            className='btn-close'
                            data-bs-dismiss='modal'
                            aria-label='Close'
                          ></button>
                        </div>
                        <div className='modal-body token_text'>
                          {exportToken}
                        </div>
                        <div className='modal-footer head'>
                          <button
                            type='button'
                            className='btn btn-secondary'
                            data-bs-dismiss='modal'
                          >
                            Close
                          </button>
                          <button
                            onClick={copyText}
                            type='button'
                            data-bs-dismiss='modal'
                            className='copyBtnn btn btn-primary'
                          >
                            <FaCopy className='me-2' color='white' size={32} />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {actionName == 'document' &&
                  docMap &&
                  data != '' &&
                  docRight !== 'view' && (
                    <>
                      {/* <div className={`mt-2 text-center mb-2 px-2 ${isFinializeDisabled ? disable_pointer_event : enable_pointer_event}`}> */}
                      <div
                        className={`mt-2 text-center mb-2 px-2 ${mode === 'preview' ? 'vis_hid' : ''
                          }`}
                      >
                        <Button
                          variant='success'
                          size='md'
                          className='rounded px-4'
                          id='finalize-button'
                          disabled={isFinializeDisabled || isButtonDisabled}
                          onClick={submit}
                          style={{
                            visibility:
                              documentFlag == 'processing'
                                ? 'visible'
                                : 'hidden',
                          }}
                        >
                          Finalize
                        </Button>
                      </div>

                      <div
                        className={`mt-2 text-center mb-2 px-2 ${mode === 'preview' ? 'vis_hid' : ''
                          }`}
                      >
                        <Button
                          variant='danger'
                          size='md'
                          className='rounded px-4'
                          id='reject-button'
                          onClick={() => setIsOpenRejectionModal(true)}
                          style={{
                            visibility:
                              documentFlag == 'processing'
                                ? 'visible'
                                : 'hidden',
                          }}
                          disabled={isButtonDisabled}
                        >
                          Reject
                        </Button>
                      </div>
                    </>
                  )}

              </div>
              <ToastContainer size={5} />
            </Col>
          </Row>
        </Container>
        <div
          ref={menuRef}
          className={`icons-holder
          ${mode === 'edit' ? "show" : 'display_none'}`}
        >

          {actionName == "template" && <>
            <div className='d-flex cursor_pointer' title='Cut' onClick={handleUndo}>
              {/* handleCut */}
              <BiCut />
            </div>
            <div className='d-flex cursor_pointer' title='Copy' onClick={handleCopy}>
              <BiCopyAlt />
            </div>
            <div className='d-flex cursor_pointer' title='Paste' onClick={handleRedo}>
              {/* handlePaste */}
              <ImPaste />
            </div>
          </>}
          <div
            className='d-flex cursor_pointer'
            title='Print'
            onClick={() => handlePDFPrint()}
          >
            <AiFillPrinter />
          </div>

          {actionName == 'template' && (
            <button
              className='page_btn p-0 d-flex cursor_pointer'
              title='Add Page'
              onClick={() => createNewPage()}
            >
              <MdOutlinePostAdd />
            </button>
          )}
          {actionName == 'template' && (
            <button
              className='page_btn p-0 d-flex cursor_pointer'
              title='Remove page'
              onClick={() => removePage()}
            >
              <CgPlayListRemove />
            </button>
          )}
          <button
            className='page_btn p-0 d-flex cursor_pointer'
            title='Import Token'
            onClick={handleToken}
          >
            <BiImport />
          </button>
          <button
            className='d-flex page_btn p-0 cursor_pointer'
            id='saving-button'
            title='Export Token'
            data-bs-toggle='modal'
            data-bs-target='#desktopModal'
          >
            <BiExport />
          </button>
        </div>
        {isOpenRejectionModal && (
          <RejectionModal
            openModal={setIsOpenRejectionModal}
            handleReject={handleReject}
            msg={rejectionMsg}
            setMsg={setRejectionMsg}
          />
        )}
        {shareModalOpen && (
          <ShareDocModal
            openModal={setShareModalOpen}
            toName={toName}
            setToName={setToName}
            toEmail={toEmail}
            setToEmail={setToEmail}
            froName={froName}
            setFroName={setFroName}
            froEmail={froEmail}
            setFroEmail={setFroEmail}
            subject={subject}
            setSubject={setSubject}
            handleShare={handleShare}

          />
        )}

        <ProgressLoader />
      </div>

      {/* <div>
        <ProgressLoader />
      </div> */}
    </>
  );
};

export default Header;
