/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-loop-func */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */

//pexels api key = Hl1vc1m448ZiRV4JJGGkPqxgMtZtQ99ttmzZq7XHyKiTBDvF20dYZZsY
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './MidSection.css';
import { useStateContext } from '../../contexts/contextProvider';
import Spinner from '../../utils/spinner/Spinner.jsx';
import Axios from 'axios';
import jwt_decode from 'jwt-decode';
import { table_dropdown_focuseddClassMaintain } from '../../utils/focusClassMaintain/focusClass';
import { Print } from 'react-easy-print';
import RightContextMenu from '../contextMenu/RightContextMenu';
import { dragElementOverPage } from './DragElementOverPage';
import { getHolderMenu } from './GetHolderMenu';
import copyInput from './CopyInput';
import createTextInputField from './midSectionElements/TextInputElement.jsx';
import createImageInputField from './midSectionElements/ImageInputElement.jsx';
import createDateInputField from './midSectionElements/DateInputElement.jsx';
import createSignInputField from './midSectionElements/SignInputElement.jsx';
import createIframeInputField from './midSectionElements/IframeInputElement.jsx';
import createButtonInputField from './midSectionElements/ButtonInputElement.jsx';
import createFormInputField from './midSectionElements/FormInputElement.jsx';
import createScaleInputField from './midSectionElements/ScaleInputElement.jsx';
import createCameraInputField from './midSectionElements/CameraInputElement.jsx';
import createDropDownInputField from './midSectionElements/DropDownInputElement.jsx';
import createNewScaleInputField from './midSectionElements/NewScaleInputElement.jsx';
import createContainerInputField from './midSectionElements/NewContainerInput.js';
import createTextElement from './createElements/CreateTextElement.jsx';
import createImageElement from './createElements/CreateImageElement.jsx';
import createTextFillElement from './createElements/CreateTextFillElement.jsx';
import createIframeElement from './createElements/CreateIframeElement.jsx';
import createScaleInputElement from './midSectionElements/ScaleInputElement.jsx';
import createNewScaleInputElement from './createElements/CreateNewScaleElement.jsx';
import createCameraInputElement from './createElements/CreateCameraElement.jsx';
import createSignInputElement from './createElements/CreateSignElement.jsx';
import createDateInputElement from './createElements/CreateDateElement.jsx';
import createDropDownInputElement from './createElements/CreateDropDownElement.jsx';
import createButtonInputElement from './createElements/CreateButtonElement.jsx';
import RemoveElementModal from '../RemoveElementModal';
import createFormInputElement from './createElements/CreateFormElement.jsx';
import createContainerInputElement from './createElements/CreateNewContainer.jsx';
import { finding_percent } from './../../utils/util_functions/finding_percent';

import handleSocialMediaAPI from "../../utils/handleSocialMediaAPI";
import SocialMedia from '../modals/SocialMedia.js';
import { CreateTableComponent } from './midSectionElements/TableInputElement.jsx';
import CreatePyamentElement from './createElements/CreatePyamentElement.jsx';
import createPaymentInputField from './midSectionElements/PaymentInputElement.jsx';
import { useCutMenuContext } from './cutMenuHook';
import axios from 'axios';
import { toast } from 'react-toastify';
import createGenBtnEl from './createElements/CreateGenBtnEl';
import { saveDocument } from '../header/Header';
import { BsNodeMinusFill } from 'react-icons/bs';
import { handleResize } from '../../utils/responsived-design/responsive';
import UserFinalizeReminderModal from '../modals/UserFinalizeReminderModal.jsx';
// tHIS IS FOR A TEST COMMIT

const dummyData = {
  normal: {
    is_error: false,
    data: [
      [
        {
          _id: '61e50b063623fc65b472e6eb',
          title: 'Livinglab did not create wonderful applications.',
          paragraph:
            'When you\u2019re programming in Python, , your data will be structured as a float.\r\n\r\nThis is important we will focus on two of these data types: strings and numbers.',
          source:
            'https://careerkarma.com/blog/python-string-to-int/#:~:text=To%20convert%20a%20string%20to,as%20an%20int%20%2C%20or%20integer.',
          subject: 'Livinglab',
          dowelltime: '32941222',
          edited: 0,
          eventId: 'FB1010000000016424005125815918',
        },
      ],
    ],
    sampling_status: false,
    sampling_status_text: 'Not expected',
  },
};
export const renderPreview = (mainSection = null) => {
  document.querySelectorAll('.main-section-container-preview')?.forEach(elem => elem?.remove());
  const editSec = document.querySelector('.editSec_midSec');
  const previewContainer = document.createElement('div');
  previewContainer.id = 'main-section-container';
  previewContainer.className = 'main-section-container-preview';
  editSec.append(previewContainer);
  const midSecAll = document.querySelectorAll('.midSection_container');
  midSecAll.forEach((mid) => {
    const previewCanvas = mid.cloneNode(true);

    let availableWidth = screen.availWidth - 850;
    if (availableWidth >= 793.69) availableWidth = 793.69;
    previewCanvas.style.width = `${availableWidth}px`
    const scale = availableWidth / 794;
    previewCanvas.querySelectorAll('.holderDIV')?.forEach((div) => {
      const divWidth = +div.style.width.split('px')[0];
      const currentLeft = +div.style.left.split('px')[0] || 0;
      div.style.left = (currentLeft * scale - 1.5) + 'px';
      div.style.width = (divWidth * scale - 1.5) + 'px';
      div.style.border = 'none';
      div.style.pointerEvents = 'none';
      div.style.fontSize = (16 * scale) + 'px';
    });
    previewCanvas.className = 'midSection_container print_container preview-canvas';
    document.querySelector('#main-section-container').append(previewCanvas);
  });
}

const MidSection = React.forwardRef((props, ref) => {
  const {
    setDropdownName,
    isClicked,
    setIsClicked,
    setSidebar,
    handleClicked,
    item,
    setItem,
    isLoading,
    setIsLoading,
    fetchedData,
    setFetchedData,
    setRightSideDateMenu,
    setStartDate,
    setRightSideDropDown,
    setMethod,
    data,
    setData,
    isDataRetrieved,
    setIsDataRetrieved,
    setScaleData,
    title,
    setIsMenuVisible,
    handleDropp,
    focuseddClassMaintain,
    confirmRemove,
    scaleMidSec,
    currMidSecWidth,
    setDimRatios,
    dimRatios,
    updateDimRatios,
    buttonLink,
    setButtonPurpose,
    progress,
    setProgress,
    selOpt,
    fixedMidSecDim,
    setEnablePreview,
    mode,
    modHeightEls,
    setModHeightEls,
    setIsCompsScaler,
    isCompsScaler,
    resizeChecker,
    setDefSelOpt,
    defSelOpt,
    socialMediaImg,
    setSocialMediaImg
  } = useStateContext();

  const { contextMenu, setContextMenu, setFromContextMenu } =
    useCutMenuContext();

  const defOptRef = useRef(defSelOpt);
  const [focusedElement, setFocusedElement] = useState(null);
  const [allPages, setAllPages] = useState([]);

  const [showReminderModal, setShowReminderModal] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  var decoded = jwt_decode(token);
  const actionName = decoded?.details?.action;
  const flag_editing = decoded?.details?.flag;
  const documnentsMap = decoded?.details?.document_map;
  const divList = documnentsMap?.map?.((item) => item.page);
  var documnetMap = documnentsMap?.map?.((item) => item.content);
  const document_map_required = documnentsMap?.filter((item) => item.required);

  const documentsMap = documnentsMap;
  if (documnentsMap?.length > 0) {
    const documentsMap = documnentsMap;
  }

  const editorRef = useRef(null);
  const cutItemRef = useRef(null);
  const [selectedText, setSelectedText] = useState('');
  const handleCutInputRef = useRef(null);
  const copyItemRef = useRef(null);
  const [socialModalIsOpen, setSocialModalIsOpen] = useState(false);

  const openSocialModal = () => {
    setSocialModalIsOpen(true);
  };

  const closeSociaModal = () => {
    setSocialModalIsOpen(false);
  }

  console.log("finalize decoded token", decoded.details.document_right);

  const boldCommand = () => {
    if (!editorRef.current) return;

    const strongElement = document.createElement('strong');
    strongElement.innerText = selectedText;

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(strongElement);
    setSelectedText(selection.toString());
  };

  const midSectionRef = useRef([]);

  const [postData, setPostData] = useState({});

  let resizing = false;
  let contentFile = [];

  const defaultWidth = '100px';
  const defaultHeight = '100px';
  const defaultTop = '0px';
  const defaultLeft = '0px';

  const [cutItem_value, setCutItem_value] = useState(null);
  const handleContextMenu = (e) => {
    e.preventDefault();
    let x = e.clientX;
    let y = e.clientY;
    const foundElement = document.elementFromPoint(x, y)?.parentElement;
    console.info('\n\n FOUND ELEMENT',foundElement,'\n\n');

    const midSec = document.getElementById('midSection_container');
    if (foundElement.classList.contains('midSection_container')) return;
    const midsectionRect = midSec.getBoundingClientRect();
    let clientX = e.clientX - midsectionRect.left;
    let clientY = e.clientY - midsectionRect.top;

    if (!foundElement.classList.contains('midSection')) {
      const parent = foundElement.parentElement;
      const tableElements = ['td', 'tr', 'table'];
      if (tableElements.includes(parent.tagName.toLowerCase())) {
        switch (parent.tagName.toLowerCase()) {
          case 'td':
            const tdHolderDiv =
              parent.parentElement.parentElement.parentElement.parentElement;
            setContextMenu({
              show: true,
              x: clientX,
              y: clientY,
              targetEl: tdHolderDiv,
            });
            break;

          case 'tr':
            const trHolderDiv =
              parent.parentElement.parentElement.parentElement;
            setContextMenu({
              show: true,
              x: clientX,
              y: clientY,
              targetEl: trHolderDiv,
            });

            break;
          case 'table':
            const tableHolderDiv = parent.parentElement.parentElement;
            setContextMenu({
              show: true,
              x: clientX,
              y: clientY,
              targetEl: tableHolderDiv,
            });
            break;

          default:
            break;
        }
      } else if (
        parent.classList.contains('containerInput') ||
        parent.parentElement?.parentElement?.classList.contains(
          'containerInput'
        )
      ) {
        let container = parent.parentElement;

        if (
          parent.parentElement?.parentElement?.classList.contains(
            'containerInput'
          )
        ) {
          container = parent.parentElement.parentElement;
        }
        setContextMenu({
          show: true,
          x: clientX,
          y: clientY,
          targetEl: container,
        });
      } else if (foundElement.classList.contains('dropdownInput')) {
        let container = foundElement.parentElement;
        if (
          foundElement.parentElement?.parentElement?.classList.contains(
            'containerInput'
          )
        ) {
          container = foundElement.parentElement?.parentElement?.parentElement;
        }
        setContextMenu({
          show: true,
          x: clientX,
          y: clientY,
          targetEl: container,
        });
      } else {
        setContextMenu({
          show: true,
          x: clientX,
          y: clientY,
          targetEl: foundElement,
        });
      }
    } else {
      if (contextMenu.targetEl !== null) {
        setContextMenu((prev) => {
          return {
            ...prev,
            ['show']: true,
            ['x']: clientX,
            ['y']: clientY,
          };
        });
      }
    }

    let midSec2 = null;

    if (!midSec2) {
      let targetParent = midSec;
      while (1) {
        if (
          targetParent.classList.contains('containerInput') ||
          targetParent.classList.contains('midSection_container')
        ) {
          targetParent = targetParent;
          break;
        } else {
          targetParent = targetParent.parentElement;
          midSec2 = targetParent;
        }
      }
    }
    setCutItem_value(e.target);
    cutItemRef.current = e.target;
  };

  function getResizer(attr1, attr2) {
    const resizer = document.createElement('span');
    resizer.style.width = '5px';
    resizer.style.height = '5px';
    resizer.style.display = 'block';
    resizer.className = 'resizeBtn';
    resizer.style.position = 'absolute';
    resizer.style.backgroundColor = '#00aaff';

    if (attr1 === 'top') {
      resizer.style.top = '-5px';
    } else {
      resizer.style.bottom = '-5px';
    }

    if (attr2 === 'left') {
      resizer.style.left = '-5px';
    } else {
      resizer.style.right = '-5px';
    }

    if (
      (attr1 == 'top' && attr2 === 'right') ||
      (attr1 == 'bottom' && attr2 === 'left')
    ) {
      resizer.onmouseover = (event) => {
        event.target.style.cursor = 'nesw-resize';
      };
    } else {
      resizer.onmouseover = (event) => {
        event.target.style.cursor = 'nwse-resize';
      };
    }

    resizer.onmousedown = (event) => {
      let initX = event.screenX;
      let initY = event.screenY;
      resizing = true;
      event.preventDefault();

      const holder = event.target.parentNode;

      const holderSize = (function () {
        const holderSize = {
          width: holder.offsetWidth,
          height: holder.offsetHeight,
          top: holder.offsetTop,
          left: holder.offsetLeft,
          // width: parseInt(holder.style.width.slice(0, -2)),
          // height: parseInt(holder.style?.height.slice(0, -2)),
          // top: parseInt(holder.style.top.slice(0, -2)),
          // left: parseInt(holder.style.left.slice(0, -2))//elemLeft : 0
        };

        return Object.seal(holderSize);
      })();

      window.addEventListener('mousemove', resizeElement);
      function resizeElement(ev) {
        const wWidth = window.innerWidth;
        const el = document.getElementById("midSection_container");
        const midsectionRect = el.getBoundingClientRect();
        if (
          ev.screenX > midsectionRect.left &&
          ev.screenY > midsectionRect.top &&
          ev.screenX < midsectionRect.right
        ) {
          if (attr1 == 'bottom' && attr2 == 'right') {
            holder.style.width = ev.screenX - initX + holderSize.width + 'px';
            holder.style.height = ev.screenY - initY + holderSize.height + 'px';
          } else if (attr1 == 'bottom' && attr2 == 'left') {
            holder.style.left = holderSize.left + (ev.screenX - initX) + 'px';
            holder.style.width = holderSize.width - (ev.screenX - initX) + 'px';
            holder.style.height = ev.screenY - initY + holderSize.height + 'px';
          } else if (attr1 == 'top' && attr2 == 'left') {
            holder.style.top = holderSize.top + (ev.screenY - initY) + 'px';
            holder.style.left = holderSize.left + (ev.screenX - initX) + 'px';
            holder.style.width = holderSize.width - (ev.screenX - initX) + 'px';
            holder.style.height = holderSize.height - (ev.screenY - initY) + 'px';
          } else if (attr1 == 'top' && attr2 == 'right') {
            holder.style.top = holderSize.top + (ev.screenY - initY) + 'px';
            holder.style.width = holderSize.width + (ev.screenX - initX) + 'px';
            holder.style.height = holderSize.height - (ev.screenY - initY) + 'px';
          }
        }
        
        const previewCanvas = document.querySelector('.preview-canvas');
        if (previewCanvas) {
          const mainSection = document.querySelector('.editSec_midSec');
          renderPreview(mainSection);

        }
      }

      window.addEventListener('mouseup', stopResizing);
      function stopResizing(ev) {
        window.removeEventListener('mousemove', resizeElement);
        window.removeEventListener('mouseup', stopResizing);
        resizing = false;
      }
    };

    return resizer;
  }

  // * This gets the page a holderDIV is in
  const getPage = (holderDiv) =>
    Number(
      [...holderDiv.classList].find((cl) => cl.includes('page')).split('_')[1]
    );

  const handleFntSizes = (el) => {
    const midSecWidth = document
      .querySelector('.midSection_container')
      .getBoundingClientRect().width;

    const origFntSizes = sessionStorage.getItem('orig_fnt')
      ? JSON.parse(sessionStorage.getItem('orig_fnt'))
      : [];

    if (midSecWidth <= 500) {
      if (el.classList.contains('textInput')) {
        if (!origFntSizes.find((org) => org.id === el.id)) {
          const fntSize = parseFloat(window.getComputedStyle(el).fontSize);
          sessionStorage.setItem(
            'orig_fnt',
            JSON.stringify([...origFntSizes, { id: el.id, fntSize }])
          );
          el.style.fontSize = fntSize / 1.23 + 'px';
        }
      }
    } else {
      if (el.classList.contains('textInput')) {
        const fntSize =
          origFntSizes.find((org) => org.id === el.id)?.fntSize ?? null;
        if (fntSize) {
          el.style.fontSize = fntSize + 'px';
          sessionStorage.setItem(
            'orig_fnt',
            JSON.stringify(origFntSizes.filter((org) => org.id !== el.id))
          );
        }
      }
    }
  };

  const handleElOverflow = (el, holderDiv) => {
    const midSecs = [...document.querySelectorAll('.midSection_container')];
    if (!el) return;
    if (el.classList.contains('textInput')) {
      if (el.scrollHeight > el.getBoundingClientRect().height) {
        const iniHeight = holderDiv.getBoundingClientRect().height;
        const iniBottom = holderDiv.getBoundingClientRect().bottom;
        const elId = el.id;
        const overflowY = el.scrollHeight - iniHeight;
        const page = getPage(holderDiv);
        const parHeightRatio =
          fixedMidSecDim.parentHeight / fixedMidSecDim.height;
        const midSec = midSecs[page - 1];

        // *Adjusts parent height by multiplying midSec height with parent height ratio
        holderDiv.style.height = el.scrollHeight + 'px';
        midSec.style.height =
          midSec.getBoundingClientRect().height + overflowY + 'px';
        midSec.parentElement.style.height =
          midSec.getBoundingClientRect().height * parHeightRatio + 'px';

        // *Adjusts top of elements below
        const midSecChildren = [...midSec.children].filter(
          (child, index) => index !== 0
        );

        midSecChildren.forEach((holder) => {
          const holderRect = holder.getBoundingClientRect();

          if (holderRect.top >= iniBottom) {
            holder.style.top =
              parseFloat(window.getComputedStyle(holder).top) +
              overflowY +
              'px';
          }
        });

        setModHeightEls((prev) => [
          ...prev,
          { elId, iniHeight, iniBottom, overflowY },
        ]);
      }
    }
  };

  //colse context menu

  const contextMenuClose = () =>
    setContextMenu((prev) => {
      return {
        ...prev,
        ['show']: false,
      };
    });

  const handleCopyPaste = (targetElement, x, y) => {
    const element = targetElement;
    const curr_user = document.getElementById('current-user');
    const midSection = document.getElementById('midSection_container');
    const measure = {
      width: element?.width,
      height: element?.height,
      left: x + 'px',
      top: y + 'px',
    };
    const holderDIV = getHolderDIV(measure);
    if (element.type === 'DATE_INPUT') {
      const dateElement = createDateInputElement(
        holderDIV,
        focuseddClassMaintain,
        handleClicked,
        setSidebar,
        setRightSideDateMenu,
        setPostData,
        setStartDate,
        setMethod,
        element.data
      );
      midSection.append(dateElement);
    } else if (element.type === 'TEXT_INPUT') {
      const textElement = createTextElement(
        holderDIV,
        focuseddClassMaintain,
        handleClicked,
        setSidebar,
        getOffset,
        element.data
      );
      midSection.append(textElement);
    } else if (element.type === 'IMAGE_INPUT') {
      const imageInput = createImageElement(
        holderDIV,
        focuseddClassMaintain,
        handleClicked,
        setSidebar,
        element.data
      );
      midSection.append(imageInput);
    } else if (element.type === 'IFRAME_INPUT') {
      const iframeElement = createIframeElement(
        holderDIV,
        table_dropdown_focuseddClassMaintain,
        handleClicked,
        setSidebar,
        element.data
      );
      midSection.append(iframeElement);
    } else if (element.type === 'SCALE_INPUT') {
      const scaleInput = createScaleInputElement(
        holderDIV,
        focuseddClassMaintain,
        handleClicked,
        setSidebar,
        table_dropdown_focuseddClassMaintain,
        decoded
      );
      midSection.append(scaleInput);
    } else if (element.type === 'NEW_SCALE_INPUT') {
      const newScale = createNewScaleInputElement(
        holderDIV,
        focuseddClassMaintain,
        handleClicked,
        setSidebar,
        table_dropdown_focuseddClassMaintain,
        decoded,
        setIsLoading
      );
      midSection.append(newScale);
    } else if (element.type === 'SIGN_INPUT') {
      const signElement = createSignInputElement(
        holderDIV,
        focuseddClassMaintain,
        handleClicked,
        setSidebar,
        setPostData,
        getOffset,
        element.data
      );
      midSection.append(signElement);
    } else if (element.type === 'DROPDOWN_INPUT') {
      const dropDown = createDropDownInputElement(
        holderDIV,
        handleClicked,
        setSidebar,
        table_dropdown_focuseddClassMaintain,
        setRightSideDropDown,
        getOffset,
        element.data
      );
      midSection.append(dropDown);
    } else if (element.type === 'CONTAINER_INPUT') {
      const containerInput = createContainerInputField(
        element.id,
        element,
        false,
        holderDIV,
        focuseddClassMaintain,
        handleClicked,
        setSidebar,
        table_dropdown_focuseddClassMaintain,
        decoded,
        setPostData,
        postData,
        getHolderDIV,
        getOffset,
        setStartDate,
        setMethod,
        setRightSideDateMenu,
        title,
        curr_user,
        element.data.data
      );

      midSection.append(containerInput);
    } else if (element.type === 'BUTTON_INPUT') {
      const buttonElement = createButtonInputElement(
        holderDIV,
        focuseddClassMaintain,
        handleClicked,
        setSidebar
      );
      midSection.append(buttonElement);
    } else if (element.type === 'TABLE_INPUT') {
      const tableElement = CreateTableComponent(
        holderDIV,
        targetElement.id,
        element,
        handleDropp,
        false,
        table_dropdown_focuseddClassMaintain,
        focuseddClassMaintain,
        handleClicked,
        setSidebar,
        setStartDate,
        setMethod,
        setRightSideDateMenu,
        element.data.data
      );
      midSection.append(tableElement);
    }

    function getHolderDIV(measure, i, idMatch,disableDrag=false) {
      const holderDIV = document.createElement('div');

      holderDIV.style.position = 'absolute';
      holderDIV.style.overflow = 'visible';
      holderDIV.style.display = 'flex';
      holderDIV.style.cursor = 'move';
      holderDIV.style.zIndex = 1;
      holderDIV.className = 'holderDIV';
      holderDIV.setAttribute('id', 'holderId');
      holderDIV.setAttribute('draggable', true);
      holderDIV.setAttribute('data-idD', 'INPUT_HOLDER');
      // holderDIV.setAttribute("data-map_id", idMatch);
      holderDIV.style.display = 'flex';
      holderDIV.style.flexDirection = 'column';
      // holderDIV.style.border = "2px dotted red";
      holderDIV.tabIndex = '1';
      holderDIV.style.width = measure?.width;
      holderDIV.style.height = measure?.height;
      holderDIV.style.left = measure.left;
      holderDIV.style.top = measure.top;
      holderDIV.style.border = measure.border;

      holderDIV.classList.add(`page_${i}`);

      if (idMatch?.length > 0) {
        holderDIV.classList.add(`enable_pointer_event`);
        holderDIV.style.border = '1px solid green !important';
      } else if (idMatch?.length < 1 && actionName == 'document') {
        holderDIV.classList.add(`dotted_border`);
        holderDIV.classList.add(`disable_pointer_event`);
      } else {
        holderDIV.classList.add(`dotted_border`);
      }

      holderDIV.addEventListener('input', (event) => {
        console.log(event)
      });
      holderDIV.ondragstart = (e) => { };

      const resizerTL = getResizer('top', 'left');
      const resizerTR = getResizer('top', 'right');
      const resizerBL = getResizer('bottom', 'left');
      const resizerBR = getResizer('bottom', 'right');

      const holderMenu = getHolderMenu(measure.auth_user);

      // const holderMenu = getHolderMenu(measure.auth_user);

      holderDIV.onmousedown = holderDIV.addEventListener(
        'mousedown',
        (event) => {
          if (
            event.target.className != 'td-resizer' &&
            event.target.className != 'row-resizer' && !disableDrag
          ) {
            dragElementOverPage(event, resizing, mode);
            const mainSection = document.querySelector('.editSec_midSec');
            if (mainSection) renderPreview(mainSection);
          }
        },
        false
      );

      // * This updates all ratios
      holderDIV.onmouseup = (e) => {
        updateDimRatios(e.currentTarget);
      };

      holderDIV.onresize = (evntt) => { };

      holderDIV.addEventListener('focus', (e) => {
        holderDIV.classList.add('zIndex-two');
        holderDIV.style.border = '2px solid orange';

        holderDIV.append(resizerTL, resizerTR, resizerBL, resizerBR);
      });

      holderDIV.addEventListener('focusout', (e) => {
        holderDIV.classList.remove('zIndex-two');
        console.log(e.target)
        holderDIV.style.border = '3px dotted gray';

        holderMenu.remove();
        resizerTL.remove();
        resizerTR.remove();
        resizerBL.remove();
        resizerBR.remove();
      });

      return holderDIV;
    }
  };

  const handlePaste = () => {
    const midSec = document.getElementById('midSection_container');
    if (contextMenu.targetEl) {
      const pasteElement = contextMenu.targetEl;
      if (contextMenu.copy) {
        handleCopyPaste(pasteElement, contextMenu.x, contextMenu.y);
      } else {
        pasteElement.style.top = contextMenu.y + 'px';
        pasteElement.style.left = contextMenu.x + 'px';
        midSec.append(pasteElement);
      }
      setContextMenu((prev) => {
        return {
          ...prev,
          ['targetEl']: null,
        };
      });
    }
  };

  const handleCutInput = (targetElement) => {
    setContextMenu((prev) => {
      return {
        ...prev,
        ['copy']: false,
      };
    });
    targetElement.remove();
  };

  const handleCopyInput = () => {
    if (contextMenu.targetEl) {
      const targetElement = contextMenu.targetEl;
      const find_class_name = true;
      let type = '';
      elem = {
        width: targetElement.style?.width,
        height: targetElement.style?.height,
        topp: contextMenu.y + 'px',
        left: contextMenu.x + 'px',
        type: type,
        data: targetElement.firstChild.innerHTML,
        id: targetElement.id,
      };
      switch (find_class_name) {
        case targetElement.querySelector('.tableInput') && true:
          type = 'TABLE_INPUT';
          elem.type = type;
          function getChildData(tempElem) {
            const allTableCCells = [];
            const tableChildren =
              tempElem.firstElementChild.firstElementChild.children;
            for (let i = 0; i < tableChildren.length; i++) {
              const tableTR = { tr: null };
              const newTableTR = [];
              for (let j = 0; j < tableChildren[i].children.length; j++) {
                // const element = tableChildren[i];

                const childNodes = tableChildren[i].children[j]?.childNodes;
                const tdElement = [];
                childNodes.forEach((child) => {
                  if (
                    !child.classList.contains('row-resizer') &&
                    !child.classList.contains('td-resizer')
                  ) {
                    tdElement.push(child);
                  }
                });
                const TdDivClassName = tdElement[0]?.className.split(' ')[0];
                let tdId = tdElement[0]?.id.split('');
                let newId;
                if (tdId) {
                  tdId[1] = +tdId[1] + 1;
                  newId = tdId.join('');
                }
                const trChild = {
                  td: {
                    type:
                      (TdDivClassName == 'dateInput' && 'DATE_INPUT') ||
                      (TdDivClassName == 'textInput' && 'TEXT_INPUT') ||
                      (TdDivClassName == 'imageInput' && 'IMAGE_INPUT') ||
                      (TdDivClassName == 'signInput' && 'SIGN_INPUT'),
                    // if(){
                    data:
                      TdDivClassName == 'imageInput'
                        ? tableChildren[i].children[j]?.firstElementChild.style
                          .backgroundImage
                        : tdElement[0]?.innerHTML,
                    id:
                      TdDivClassName == 'imageInput'
                        ? tableChildren[i].children[j]?.id
                        : newId,
                  },
                };
                newTableTR.push(trChild);
              }
              tableTR.tr = newTableTR;
              allTableCCells.push(tableTR);
            }
            return allTableCCells;
          }
          elem.data = {
            type: 'TABLE_INPUT',
            data: getChildData(targetElement),
            border: targetElement.style.border,
            tableBorder:
              targetElement.firstChild.firstElementChild.style.border,
          };
          elem.id =
            'T' + (parseInt(targetElement.querySelector('table').id[1]) + 1);
          break;
        case targetElement.querySelector('.containerInput') && true:
          elem.type = 'CONTAINER_INPUT';
          function getContainerChildData() {
            const allContainerChildren = [];
            const containerChildren =
              targetElement.querySelector('.containerInput').children;
            for (let i = 0; i < containerChildren.length; i++) {
              const element = containerChildren[i];
              const containerChildClassName =
                containerChildren[i].firstElementChild?.className.split(' ')[0];
              const childData = {};
              childData.width = +element.style?.width?.split('px')[0];
              childData.height = +element.style?.height?.split('px')[0];
              childData.top = element.style?.top;
              childData.topp = element.style?.top;
              childData.left = element.style?.left;

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
              const previousId = element.firstElementChild.id;
              childData.id =
                'c' +
                (parseInt(previousId[1]) + 1) +
                previousId.substring(2, previousId.length - 1) +
                (parseInt(previousId[previousId.length - 1]) + 1);
              allContainerChildren.push(childData);
            }

            return allContainerChildren;
          }
          elem.data = {
            border:
              targetElement.querySelector('.containerInput')?.style.border,
            containerBorder: targetElement?.style.border,
            data: getContainerChildData(),
          };

          elem.id = targetElement.firstElementChild.id;

          break;
        case targetElement.querySelector('.dateInput') && true:
          type = 'DATE_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.innerHTML;
          break;
        case targetElement.querySelector('.signInput') && true:
          type = 'SIGN_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.innerText;
          break;
        case targetElement.querySelector('.textInput') && true:
          type = 'TEXT_INPUT';
          elem.type = type;
          break;
        case targetElement.querySelector('.imageInput') && true:
          type = 'IMAGE_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.style.backgroundImage;
          break;
        case targetElement.querySelector('.iframeInput') && true:
          type = 'IFRAME_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.innerHTML;
          break;
        case targetElement.querySelector('.scaleInput') && true:
          type = 'SCALE_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.innerHTML;
          break;
        case targetElement.querySelector('.newScaleInput') && true:
          type = 'NEW_SCALE_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.innerHTML;
          break;
        case targetElement.querySelector('.buttonInput') && true:
          type = 'BUTTON_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.innerHTML;
          break;
        case targetElement.querySelector('.dropdownInput') && true:
          type = 'DROPDOWN_INPUT';
          elem.type = type;
          elem.data = targetElement.querySelector('.dropdownInput').innerHTML;

          break;
        case targetElement.querySelector('.containerInput') && true:
          type = 'CONTAINER_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.innerHTML;
          break;
        case targetElement.querySelector('.newScaleInput') && true:
          type = 'NEW_SCALE_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.innerHTML;
          break;
        case targetElement.querySelector('.cameraInput') && true:
          type = 'CAMERA_INPUT';
          elem.type = type;
          elem.data = targetElement.firstChild.innerHTML;
          break;
        default:
          type = '';
      }
      setContextMenu((prev) => {
        return {
          ...prev,
          ['targetEl']: elem,
          ['copy']: true,
        };
      });
    }
  };

  // Remove Input
  const handleRemoveInput = (targetElement) => {
    targetElement?.remove();
    setContextMenu((prev) => {
      return {
        ...prev,
        ['copy']: false,
        ['targetEl']: null,
      };
    });
  };

  function getHolderDIV(measure, i=1, idMatch=null,disableDrag=false) {
    const holderDIV = document.createElement('div');

    holderDIV.style.position = 'absolute';
    holderDIV.style.overflow = 'visible';
    holderDIV.style.display = 'flex';
    holderDIV.style.cursor = 'move';
    holderDIV.style.zIndex = 0;
    holderDIV.className = 'holderDIV';
    holderDIV.setAttribute('id', 'holderId');
    holderDIV.setAttribute('draggable', true);
    holderDIV.setAttribute('data-idD', 'INPUT_HOLDER');
    // holderDIV.setAttribute("data-map_id", idMatch);
    holderDIV.style.display = 'flex';
    holderDIV.style.flexDirection = 'column';
    // holderDIV.style.border = "2px dotted red";
    holderDIV.tabIndex = '1';
    holderDIV.style.width = measure?.width;
    holderDIV.style.height = measure?.height;
    holderDIV.style.left = measure.left;
    holderDIV.style.top = measure.top;
    holderDIV.style.border = measure.border;

    holderDIV.classList.add(`page_${i}`);

    if (idMatch?.length > 0) {
      holderDIV.classList.add(`enable_pointer_event`);
      holderDIV.style.border = '1px solid green !important';
    } else if (idMatch?.length < 1 && actionName == 'document') {
      holderDIV.classList.add(`dotted_border`);
      holderDIV.classList.add(`disable_pointer_event`);
    } else {
      holderDIV.classList.add(`dotted_border`);
    }

    holderDIV.addEventListener('dragstart', (event) => { });
    holderDIV.ondragstart = (e) => { };

    const resizerTL = getResizer('top', 'left');
    const resizerTR = getResizer('top', 'right');
    const resizerBL = getResizer('bottom', 'left');
    const resizerBR = getResizer('bottom', 'right');

    const holderMenu = getHolderMenu(measure.auth_user);

    // const holderMenu = getHolderMenu(measure.auth_user);

    holderDIV.onmousedown = holderDIV.addEventListener(
      'mousedown',
      (event) => {
        if (
          event.target.className != 'td-resizer' &&
          event.target.className != 'row-resizer' && !disableDrag
        ) {
          dragElementOverPage(event, resizing, mode);
        }
      },
      false
    );

    holderDIV.onmouseup = (e) => {
      updateDimRatios(e.currentTarget);
    };

    holderDIV.onresize = (evntt) => { };

    holderDIV.addEventListener('focus', (e) => {
      holderDIV.classList.add('zIndex-two');
      holderDIV.style.border = '2px solid #25c7a3';

      holderDIV.append(resizerTL, resizerTR, resizerBL, resizerBR);
    });

    holderDIV.addEventListener('focusout', (e) => {
      holderDIV.classList.remove('zIndex-two');
      holderDIV.style.border = '3px dotted gray';
      console.log(e.target)
      document.querySelectorAll('.textInput,.imageInput')?.forEach((text) => {
        text.parentElement.style.border = 'none'
      })

      holderMenu.remove();
      resizerTL.remove();
      resizerTR.remove();
      resizerBL.remove();
      resizerBR.remove();
    });

    return holderDIV;
  }

  let dragged = null;

  const source = document.querySelector('.focussedd');

  if (source) {
    source.addEventListener('dragstart', (event) => {
      dragged = event.target;
    });
  }

  const onPost = () => {
    const curr_user = document.getElementById('curr_user');
    const midSec = document.querySelector('.midSection_container');
    const midSecWidth = midSec.getBoundingClientRect()?.width;
    let iniDimRatio = [];

    // scaleMidSec(true);

    for (let p = 1; p <= item?.length; p++) {
      fetchedData[p]?.forEach((element) => {

        if (element.type === "TEXT_INPUT") {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;
          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.borderWidths,
            auth_user: curr_user,
          };

          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);

          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = `${element.id}`;

          createTextInputField(
            id,
            element,
            document_map_required,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
        if (element.type === 'IMAGE_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.imgBorder,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt === element?.id);
          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = `${element.id}`;

          createImageInputField(
            id,
            element,
            document_map_required,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
        if (element.type === 'DATE_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.calBorder,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = `${element.id}`;

          createDateInputField(
            id,
            element,
            document_map_required,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            setRightSideDateMenu,
            setMethod,
            setStartDate
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
        if (element.type === 'SIGN_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.signBorder,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);

          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = `${element.id}`;

          createSignInputField(
            id,
            element,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            document_map_required
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
        if (element.type === 'TABLE_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = element.id.includes('tab')
            ? document.getElementById(element.id)?.parentElement
            : document.getElementById(`tab${element.id.slice(1)}`)
              ?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.tableBorder,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = element.id;

          CreateTableComponent(
            holderDIV,
            id,
            element,
            handleDropp,
            p,
            table_dropdown_focuseddClassMaintain,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            setStartDate,
            setMethod,
            setRightSideDateMenu
          );

          // const tableInputs = document.querySelectorAll('.tableInput');
          // tableInputs[tableInputs.length - 1].id = `tab${tableInputs.length}`;

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id.includes('tab')
              ? element.id
              : `tab${element.id.slice(1)}`,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
        if (element.type === 'IFRAME_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.iframeBorder,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = `${element.id}`;

          createIframeInputField(
            id,
            element,
            p,
            holderDIV,
            table_dropdown_focuseddClassMaintain,
            handleClicked,
            setSidebar
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }

        if (element.type === 'BUTTON_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.buttonBorder,
            auth_user: curr_user,
          };

          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p);
          const id = `${element.id}`;
          const finalizeButton = document.getElementById('finalize-button');
          const rejectButton = document.getElementById('reject-button');

          createButtonInputField(
            id,
            element,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            finalizeButton,
            rejectButton,
            decoded,
            document_map_required
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
        if (element.type === 'PAYMENT_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.buttonBorder,
            auth_user: curr_user,
          };

          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p);
          const id = `${element.id}`;
          const finalizeButton = document.getElementById('finalize-button');
          const rejectButton = document.getElementById('reject-button');

          createPaymentInputField(
            id,
            element,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            finalizeButton,
            rejectButton,
            decoded,
            document_map_required
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
        if (element.type === 'FORM') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            borderWidth: element.borderWidth + 'px',
            auth_user: curr_user,
          };

          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p);
          const id = `${element.id}`;

          createFormInputField(
            id,
            element,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            decoded
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }

        if (element.type === 'SCALE_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.scaleBorder,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = `${element.id}`;

          createScaleInputField(
            id,
            element,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            table_dropdown_focuseddClassMaintain,
            decoded
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }

        if (element.type === 'CAMERA_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = `${element.id}`;
          const videoLinkHolder = `${element?.raw_data?.videoLinkHolder}`;
          const imageLinkHolder = `${element?.raw_data?.imageLinkHolder}`;
          // const holderDIV = getHolderDIV(measure, p);

          createCameraInputField(
            id,
            p,
            holderDIV,
            handleClicked,
            setSidebar,
            table_dropdown_focuseddClassMaintain,
            videoLinkHolder,
            imageLinkHolder,
            decoded
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
        if (element.type === 'NEW_SCALE_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p, idMatch);
          // const id = `${
          //   element?.raw_data?.scaleID.includes('scale Id')
          //     ? element.id
          //     : element?.raw_data?.scaleID
          // }`;
          const id = element.id;

          createNewScaleInputField(
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
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
        // Limon
        if (element.type === 'DROPDOWN_INPUT') {
          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.dropdownBorder,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = `${element.id}`;

          createDropDownInputField(
            id,
            element,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            table_dropdown_focuseddClassMaintain,
            decoded,
            setRightSideDropDown,
            setDropdownName
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }

        // conteiner retrive data
        if (element.type === 'CONTAINER_INPUT') {
          console.log("\nELEMENT\n\n", element, "\n\n\n")

          // ! This two lines of codes is for removing the occasionally added duplicate elements
          const elPar = document.getElementById(element.id)?.parentElement;
          elPar && elPar.remove();

          const width = finding_percent(element, 'width');

          const height =
            window.innerWidth > 993
              ? element.height + 'px'
              : `${(element.height / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const top =
            window.innerWidth > 993
              ? parseFloat(element.topp) + 'px'
              : `${(parseFloat(element.topp) / element.width) *
              ((parseFloat(width) * midSecWidth) / 100)
              }px`;

          const measure = {
            width,
            height,
            left: finding_percent(element, 'left', midSecWidth),
            top,
            border: element.containerBorder,
            auth_user: curr_user,
          };
          const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
          const holderDIV = getHolderDIV(measure, p, idMatch);
          const id = `${element.id}`;

          createContainerInputField(
            id,
            element,
            p,
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            table_dropdown_focuseddClassMaintain,
            decoded,
            setPostData,
            postData,
            getHolderDIV,
            getOffset,
            setStartDate,
            setMethod,
            setRightSideDateMenu,
            title,
            curr_user,
            setRightSideDropDown
          );

          // * This is to get the ratios of the dimensions of the element, to be used for resposiveness purposes
          iniDimRatio.push({
            type: element.type,
            id: element.id,
            top: parseFloat(measure.top) / midSecWidth,
            left: parseFloat(measure.left) / midSecWidth,
            width:
              parseFloat(measure?.width) /
              (window.innerWidth < 993 ? 100 : midSecWidth),
            height: parseFloat(measure.height) / midSecWidth,
            page: p,
          });
        }
      });
    }

    const holderDivs = [...document.querySelectorAll('.holderDIV')];

    holderDivs.forEach((holderDiv) => {
      const el = holderDiv.children[1]?.classList.contains('dropdownInput')
        ? holderDiv.children[1]
        : holderDiv.children[0];

      const origFntSizes = sessionStorage.getItem('orig_fnt')
        ? JSON.parse(sessionStorage.getItem('orig_fnt'))
        : [];

      if (midSecWidth <= 500) {
        if (el.classList.contains('textInput')) {
          const fntSize = parseFloat(window.getComputedStyle(el).fontSize);
          sessionStorage.setItem(
            'orig_fnt',
            JSON.stringify([...origFntSizes, { id: el.id, fntSize }])
          );
          el.style.fontSize = fntSize / 1.23 + 'px';
        }
      }

      handleElOverflow(el, holderDiv);
    });

    sessionStorage.setItem('dimRatios', JSON.stringify(iniDimRatio));
    // setDimRatios(iniDimRatio);
  };







  // useEffect(() => {
  //   if(decoded.details.document_right === "add_edit"){
  //     UserFinalizeReminderModal()
  //   }
  // }, [])

  const onParagraphPost = async () => {

    const res = await axios.post(
      'https://uxlivinglab.pythonanywhere.com/',
      {
        // document_id: decoded.details.document_id,
        // action: decoded.details.action,
        // database: decoded.details.database,
        // collection: decoded.details.collection,
        // team_member_ID: decoded.details.team_member_ID,
        // function_ID: decoded.details.function_ID,
        // cluster: decoded.details.cluster,
        // document: decoded.details.document,
        // update_field: updateField,
        document_id: decoded.details._id,
        action: decoded.details.action,
        database: decoded.details.database,
        collection: decoded.details.collection,
        team_member_ID: decoded.details.team_member_ID,
        function_ID: decoded.details.function_ID,
        cluster: decoded.details.cluster,
        field: { _id: '64e367eb3bc140afab90b3ec' },
        command: 'fetch',
        document: decoded.details.document,
        update_field: decoded.details.update_field,
        platform: 'bangalore',
      }
    );

    // if (!response.data) {
    //   toast.error("Something went wrong while fetching data!")
    //   return;
    // }

    const response = await handleSocialMediaAPI(decoded);
    // const resp = await axios.get("https://api.pexels.com/v1/curated", {
    //   headers: {
    //     Authorization: "Hl1vc1m448ZiRV4JJGGkPqxgMtZtQ99ttmzZq7XHyKiTBDvF20dYZZsY"
    //   }
    // });


    // // const [getImg, setImg] = useState();
    // // // const getImages = async () => {
    // //   const resp =  axios.get("https://api.pexels.com/v1/curated") 
    // //   console.log(resp)
    // // // }





    // console.log("\n>>action: \n>>", resp.data.photos[0].src.original);
    if (!response.data) {
      toast.error('Something went wrong while fetching data!');
      return;
    }






    // const { title, image, paragraph } = JSON.parse(response.data)?.data[0] //title field
    const { title, paragraph } = JSON.parse(response.data)?.data[0] //title field
    const image_data = decoded?.details?.image;


    // const socialData = {
    //   cluster: "socialmedia",
    //   database: "socialmedia",
    //   collection: "step4_data",
    //   document: "step4_data",
    //   team_member_ID: "1163",
    //   function_ID: "ABCDE",
    //   command: "insert",
    //   eventId: eventId,
    //   field: {
    //     user_id: user_id,
    //     session_id: session_id,
    //     eventId: eventId,
    //     client_admin_id: client_admin_id,
    //     title: title,
    //     paragraph: paragraph,
    //     source: source,
    //     qualitative_categorization: qualitative_categorization,
    //     targeted_for: targeted_for,
    //     designed_for: designed_for,
    //     targeted_category: targeted_category,
    //     image: image,
    //     date: new Date(),
    //     time: " ",
    //     status: " "

    //   },
    //   update_field: {
    //     order_nos: order_nos
    //   },
    //   "platform": "bangalore"
    // }




    // const saveResponse = await axios.post("http://uxlivinglab.pythonanywhere.com/", socialData);
    // console.log("save response data", saveResponse);


    // setSocialResponse(saveResponse);



    const curr_user = document.getElementById("curr_user");


    const measure = {
      width: '300px',
      height: '100px',
      top: '100px',
      auth_user: curr_user,
    };

    const holderDIV1 = getHolderDIV(measure);

    let titleLevel = document.createElement("div");
    titleLevel.className = "textInput sm-title";
    titleLevel.innerText = "Title: \n";
    // titleLevel.style.border = "none";
    titleLevel.style.fontWeight = '900';
    titleLevel.style.width = '100%';
    titleLevel.style.height = '100%';
    titleLevel.style.resize = 'none';
    titleLevel.style.zIndex = 3;
    titleLevel.style.backgroundColor = '#0000';
    titleLevel.style.borderRadius = '0px';
    titleLevel.style.outline = '0px';
    titleLevel.style.overflow = 'overlay';
    titleLevel.style.position = 'relative';
    titleLevel.style.cursor = 'text';
    titleLevel.onclick = () => {
      handleClicked('align2');
      setSidebar(true);
      // titleLevel.parentElement.focus();
    };

    let titleField = document.createElement('div');

    titleField.contentEditable = true;
    titleField.className = "textInput "
    titleField.id = 'trueTitle';
    titleField.innerText = title;
    titleField.style.border = 'none';
    titleField.style.outline = 'none';
    titleField.style.fontWeight = 400;

    titleLevel.append(titleField);
    holderDIV1.append(titleLevel);

    const measure2 = {
      width: '94%',
      height: '150px',
      top: '220px',
      auth_user: curr_user,
    };

    const holderDIV2 = getHolderDIV(measure2);

    let descriptionLevel = document.createElement("div")
    descriptionLevel.className = "textInput sm-paragraph";
    descriptionLevel.style.width = "100%";
    descriptionLevel.innerText = "Paragraph: ";
    descriptionLevel.style.fontWeight = 900;
    descriptionLevel.style.height = '100%';
    descriptionLevel.style.resize = 'none';
    descriptionLevel.style.zIndex = 3;
    descriptionLevel.style.backgroundColor = '#0000';
    descriptionLevel.style.borderRadius = '0px';
    descriptionLevel.style.outline = '0px';
    descriptionLevel.style.overflow = 'overlay';
    descriptionLevel.style.position = 'relative';
    descriptionLevel.style.cursor = 'text';
    descriptionLevel.onclick = () => {
      handleClicked('align2');
      setSidebar(true);
      // descriptionLevel.parentElement.focus();
    };

    let descriptionField = document.createElement('div');
    descriptionField.contentEditable = true;
    descriptionField.className = "textInput";
    descriptionField.id = "trueParagraph";
    descriptionField.innerText = paragraph;
    descriptionField.style.border = 'none';
    descriptionField.style.outline = 'none';
    descriptionField.style.fontWeight = 400;

    descriptionLevel.append(descriptionField);
    holderDIV2.append(descriptionLevel);

    document
      .getElementById('midSection_container')
      // .item(0)
      .append(holderDIV1);

    document
      .getElementById('midSection_container')
      // .item(0)
      .append(holderDIV2);



    // const response = await handleSocialMediaAPI(decoded);
    // const resp = await axios.get("https://api.pexels.com/v1/curated", {
    //   headers: {
    //     Authorization: "Hl1vc1m448ZiRV4JJGGkPqxgMtZtQ99ttmzZq7XHyKiTBDvF20dYZZsY"
    //   }
    // });


    // const [getImg, setImg] = useState();
    // // const getImages = async () => {
    //   const resp =  axios.get("https://api.pexels.com/v1/curated") 
    //   console.log(resp)
    // // }



    // const measure4 = {
    //   width: '400px',
    //   height: '400px',
    //   top: '100px',
    //   border: "2px dotted gray",
    //   auth_user: curr_user,
    // };

    // const holderDIV4 = getHolderDIV(measure4);


    // console.log("\n>>action: \n>>", resp.data.photos[0].src.original);

    // let iframeField = document.createElement("iframe");
    // iframeField.className ="iframInput";
    // iframeField.style.width = "800px";
    // iframeField.style.height = "800px";
    // iframeField.style.border = "2px dotted gray"
    // let iframeField = document.createElement("iframe");
    // resp.data.photos.map((img) => {
    // iframeField.className ="iframInput";
    // iframeField.style.width = "800px";
    // iframeField.style.height = "800px";
    // iframeField.style.border = "2px dotted gray"
    // iframeField.src = `${img.src.original}`
    // }
    // )
    // const iframeContent = resp.data.photos.map(img => `<img src="${img.src.original}" alt="${img.photographer}">`).join("");
    // iframeField.src = resp.data.photos.map(img => `${img.src.original}`)
    // resp.data.photos.map((img) => 
    // // <iframe width="300" height="300"  src={img.src.original} title="W3Schools Free Online Web Tutorials"></iframe>
    // // {

    // iframeField.src = `${img.src.original}`


    // // }

    //   // {
    //     // console.log("\n>>>", img.src.original)
    //   // }
    //   )
    // holderDIV4.append(iframeField);


    // let iframeField = document.createElement("iframe");
    // iframeField.className ="iframInput";
    // iframeField.style.width = "300px";
    // iframeField.style.height = "300px";
    // iframeField.src = {img.src.original}
    // document
    // .getElementById('midSection_container')
    // // .item(0)
    // .append(holderDIV4);
    <br />
    let imageField = document.createElement("div");
    imageField.className = "imageInput sm-image";
    imageField.id = "inputImgg";
    imageField.style.width = "100%";
    imageField.style.height = "100%";
    imageField.style.borderRadius = "0px";
    imageField.style.outline = "none";
    imageField.style.overflow = "overlay";
    imageField.innerText = "Choose Image";
    imageField.style.position = "relative";

    if (socialMediaImg) {
      imageField.style.backgroundImage = `url(${socialMediaImg})`;
      imageField.innerText = " ";
    } else if (image_data != null) {
      imageField.style.backgroundImage = `url(${image_data})`;
      imageField.innerText = " ";
    }
    // console.log( imageField.style.backgroundImage = `url(${socialImg})`)


    const measure3 = {
      width: "400px",
      height: '300px',
      top: '370px',
      auth_user: curr_user,
    };

    const holderDIV3 = getHolderDIV(measure3);

    const img = document.getElementsByClassName('imageInput');
    if (img.length) {
      const h = img.length;
      imageField.id = `i${h + 1}`;
    } else {
      imageField.id = 'i1';
    }

    imageField.addEventListener('onclick', () => { });


    imageField.onclick = (e) => {
      e.stopPropagation();
      focuseddClassMaintain(e);
      if (e.ctrlKey) {
        copyInput('image2');
      }
      handleClicked('image2', 'container2');
      // setSidebar(true);
      openSocialModal();
    };

    // const imageButton = document.createElement('div');
    // imageButton.className = 'addImageButton';
    // imageButton.innerText = 'Choose File';
    // imageButton.style.display = 'none';

    // const imgBtn = document.createElement('input');
    // imgBtn.className = 'addImageButtonInput';
    // imgBtn.type = 'file';
    // imgBtn.style.objectFit = 'cover';
    // var uploadedImage = '';

    // imgBtn.addEventListener('input', () => {
    //   const reader = new FileReader();
    //   imageField.innerText = '';

    //   reader.addEventListener('load', () => {
    //     uploadedImage = reader.result;
    //     document.querySelector(
    //       '.focussed'
    //     ).style.backgroundImage = `url(${uploadedImage})`;
    //   });
    //   reader.readAsDataURL(imgBtn.files[0]);
    // });

    // imgBtn.style?.width = "100%";
    // imageButton.append(imgBtn);
    holderDIV3.append(imageField);
    // holderDIV3.append(imageButton);


    document
      .getElementById('midSection_container')
      // .item(0)
      .append(holderDIV3);
  };

  function getOffset(el) {
    const parent = document.getElementById('midSection_container');
    const parentPos = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top - parentPos.top,
      left: rect.left - parentPos.left,
      bottom: rect.bottom - parentPos.top,
      right: rect.right - parentPos.left,
    };
  }

  function getPosition(el) {
    const rect = el[0].getBoundingClientRect();

    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
    };
  }

  const chooseFileClick = () => {
    const addImageButtonInput = document.getElementsByClassName(
      'addImageButtonInput'
    );
    addImageButtonInput.item(0).click();
  };

  const dragOver = (event) => {
    const isLink = event.dataTransfer.types.includes('text/plain');
    if (isLink) {
      event.preventDefault();
      event.currentTarget.classList.add('drop_zone');
      if (document.querySelector('.focussedd')) {
        document.querySelector('.focussedd').classList.remove('focussedd');
      }
      if (document.querySelector('.focussed')) {
        document.querySelector('.focussed').classList.remove('focussed');
      }
      setSidebar(false);
      setIsClicked(false);
      setIsClicked({
        ...isClicked,
        align2: false,
        textfill2: false,
        image2: false,
        table2: false,
        signs2: false,
        calendar2: false,
        dropdown2: false,
        button2: false,
        iframe2: false,
        scale2: false,
        container2: false,
        newScale2: false,
      });
    }
  };

  const onDrop = (event) => {
    event.preventDefault();

    var dataFound = event.dataTransfer.getData('text');
    if (dataFound == 'rightMenuDragStart') {
    } else {
      const has_table_drag_class =
        event.target.classList.contains('table_drag');
      const has_container_drag_class =
        event.target.classList.contains('containerInput');
      const typeOfOperation = event.dataTransfer.getData('text/plain');
      const curr_user = document.getElementById('current-user');

      const midSec = document.querySelector('.drop_zone');
      const midsectionRect = midSec.getBoundingClientRect();
      const measure = {
        width: '200px',
        height: '80px',
        left: event.clientX - midsectionRect.left + 'px',
        top: event.clientY - midsectionRect.top + 'px',
        // border: "2px dotted gray",
        auth_user: curr_user,
      };
      const containerMeasure = {
        width: midsectionRect.widtth + 'px',
        left: midsectionRect.left + 'px',
        height: '80px',
        top: event.clientY - midsectionRect.top + 'px',
        // border: "2px dotted gray",
        auth_user: curr_user,
      };

      let pageNum = null;
      let holderDIV = null;
      if (event.target.classList.contains('midSection_container')) {
        pageNum = event.target.innerText.split('\n')[0];
        holderDIV = getHolderDIV(measure, pageNum);
      }else {
        holderDIV = getHolderDIV(measure);
      }

      if (!has_table_drag_class && !has_container_drag_class) {
        if (
          typeOfOperation === 'TEXT_INPUT' &&
          decoded.details.action === 'template'
        ) {

          createTextElement(holderDIV, focuseddClassMaintain, handleClicked, setSidebar, getOffset)
          // onParagraphPost();

        } else if (
          typeOfOperation === 'IMAGE_INPUT' &&
          decoded.details.action === 'template'
        ) {
          createImageElement(
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar
          );
        } else if (typeOfOperation === 'TEXT_FILL') {
          createTextFillElement(holderDIV, getOffset);
        } else if (
          typeOfOperation === 'IFRAME_INPUT' &&
          decoded.details.action === 'template'
        ) {
          createIframeElement(
            holderDIV,
            table_dropdown_focuseddClassMaintain,
            handleClicked,
            setSidebar
          );
        }

        //Limon
        else if (
          typeOfOperation === 'SCALE_INPUT' &&
          decoded.details.action === 'template'
        ) {
          setIsLoading(true);

          let scaleField = document.createElement('div');
          scaleField.className = 'scaleInput';
          scaleField.style.width = '100%';
          scaleField.style.height = '100%';
          scaleField.style.backgroundColor = 'transparent';
          scaleField.style.borderRadius = '0px';
          scaleField.style.outline = '0px';
          scaleField.style.overflow = 'overlay';
          // scaleField.innerHTML = 'iframe';
          scaleField.style.position = 'absolute';
          // scaleField.innerText = "scale here";

          const scales = document.getElementsByClassName('scaleInput');
          if (scales.length) {
            const s = scales.length;
            scaleField.id = `scl${s + 1}`;
          } else {
            scaleField.id = 'scl1';
          }

          let scale = document.createElement('iframe');
          scale.style.width = '100%';
          scale.style.height = '100%';
          scale.style.position = 'relative';
          scale.style.zIndex = '-1';

          const scaleIdHolder = document.createElement('div');
          scaleIdHolder.className = 'scaleId_holder';
          scaleIdHolder.style.display = 'none';

          const labelHolder = document.createElement('div');
          labelHolder.className = 'label_holder';
          labelHolder.style.display = 'none';

          scaleField.addEventListener('resize', () => {
            scale.style.width = scaleField.clientWidth + 'px';
            scale.style.height = scaleField.clientHeight + 'px';
          });

          scaleField.append(scale);
          Axios.post(
            'https://100035.pythonanywhere.com/api/nps_settings_create/',
            {
              username: 'nake',
              orientation: 'horizontal',
              scalecolor: '#8f1e1e',
              roundcolor: '#938585',
              fontcolor: '#000000',
              fomat: 'numbers',
              time: '00',
              name: `${title}_scale`,
              left: 'good',
              right: 'best',
              center: 'neutral',
            }
          )
            .then((res) => {
              setIsLoading(false);
              setScaleData(res.data);
              const success = res.data.success;
              var successObj = JSON.parse(success);
              const id = successObj.inserted_id;
              if (id.length) {
                // setScaleId(id);
                scaleIdHolder.innerHTML = id;
              }
              scale.src = res.data.scale_urls;
            })
            .catch((err) => {
              setIsLoading(false);
            });

          scaleField.onclick = (e) => {
            e.stopPropagation();
            table_dropdown_focuseddClassMaintain(e);
            if (e.ctrlKey) {
              copyInput('scale2');
            }
            handleClicked('scale2');
            setSidebar(true);
          };

          holderDIV.append(scaleField);
          holderDIV.append(scaleIdHolder);
          holderDIV.append(labelHolder);
        } else if (
          typeOfOperation === 'NEW_SCALE_INPUT' &&
          decoded.details.action === 'template'
        ) {
          createNewScaleInputElement(
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            table_dropdown_focuseddClassMaintain,
            decoded,
            setIsLoading
          );
        } else if (
          typeOfOperation === 'CAMERA_INPUT' &&
          decoded.details.action === 'template'
        ) {
          createCameraInputElement(
            holderDIV,
            handleClicked,
            setSidebar,
            table_dropdown_focuseddClassMaintain
          );
        } else if (typeOfOperation === 'TEXT_FILL') {
          createTextElement(
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            getOffset
          );
        } else if (
          typeOfOperation === 'TABLE_INPUT' &&
          decoded.details.action === 'template'
        ) {
          let tableField = document.createElement('div');
          tableField.className = 'tableInput';
          tableField.style.width = '100%';
          tableField.style.height = '100%';
          tableField.style.backgroundColor = '#dedede';
          tableField.style.borderRadius = '0px';
          tableField.style.outline = '0px';
          tableField.style.overflow = 'overlay';
          // tableField.innerHTML = 'table';
          tableField.style.position = 'absolute';

          const placeholder = document.createElement('p');
          placeholder.className = 'placeholder';
          placeholder.textContent = 'Insert Table';
          tableField.append(placeholder);

          const tableF = document.getElementsByClassName('tableInput');
          if (tableF.length) {
            const t = tableF.length;
            tableField.id = `tab${t + 1}`;
          } else {
            tableField.id = 'tab1';
          }

          tableField.onchange = (event) => {
            event.preventDefault();

            setPostData({
              ...postData,
              tableField: {
                value: event.target.value,
                xcoordinate: getOffset(holderDIV).left,
                ycoordinate: getOffset(holderDIV).top,
              },
            });
          };

          tableField.onclick = (e) => {
            e.stopPropagation();

            table_dropdown_focuseddClassMaintain(e);

            handleClicked('table2', 'container2');
            setSidebar(true);
          };

          holderDIV.append(tableField);
        } else if (
          typeOfOperation === 'SIGN_INPUT' &&
          decoded.details.action === 'template'
        ) {
          createSignInputElement(
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            setPostData,
            getOffset
          );
        } else if (
          typeOfOperation === 'DATE_INPUT' &&
          decoded.details.action === 'template'
        ) {
          createDateInputElement(
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            setRightSideDateMenu,
            setPostData,
            setStartDate,
            setMethod
          );
        } else if (
          typeOfOperation === 'DROPDOWN_INPUT' &&
          decoded.details.action === 'template'
        ) {
          createDropDownInputElement(
            holderDIV,
            handleClicked,
            setSidebar,
            table_dropdown_focuseddClassMaintain,
            setRightSideDropDown,
            getOffset
          );
        } else if (
          typeOfOperation === 'BUTTON_INPUT' &&
          decoded.details.action === 'template'
        ) {
          // createButtonInputElement(holderDIV, focuseddClassMaintain, handleClicked, setSidebar)
          createGenBtnEl(
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar
          );
        } else if (
          typeOfOperation === 'CONTAINER_INPUT' &&
          decoded.details.action === 'template'
        ) {
          createContainerInputElement(
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar,
            table_dropdown_focuseddClassMaintain,
            decoded,
            setPostData,
            postData,
            getHolderDIV,
            getOffset,
            setStartDate,
            setMethod,
            setRightSideDateMenu,
            title,
            curr_user,
            midsectionRect,
            setRightSideDropDown
          );
        } else if (
          typeOfOperation === 'FORM' &&
          decoded.details.action === 'template'
        ) {
          createFormInputElement(
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar
          );
        } else if (
          typeOfOperation === 'PAYMENT_INPUT' &&
          decoded.details.action === 'template'
        ) {
          CreatePyamentElement(
            holderDIV,
            focuseddClassMaintain,
            handleClicked,
            setSidebar
          );
        }
        if (decoded.details.action === 'template') {
          document.querySelector('.drop_zone').append(holderDIV);
        }
        if(mode == 'preview') renderPreview();
      }
    }
  };

  contentFile = [];
  let page = [];

  let elem = {};

  const compsScaler = (holder, ratio, el) => {
    const midSecWidth = document
      .querySelector('.midSection_container')
      ?.getBoundingClientRect()?.width;
    // const holderStyles = window.getComputedStyle(holder);

    const computeDim = (prop) => midSecWidth * prop + 'px';

    holder.style.width = computeDim(ratio?.width);
    holder.style.height = computeDim(ratio?.height);
    holder.style.top = computeDim(ratio?.top);
    holder.style.left = computeDim(ratio?.left);
  };

  const compsResizer = () => {
    const allHolders = [...document.querySelectorAll('.holderDIV')];

    allHolders?.forEach((holder) => {
      // * This ensures only high order holderDivs are selected
      if (holder.parentElement.id === 'midSection_container') {
        const el = holder.children[1]?.classList.contains('dropdownInput')
          ? holder.children[1]
          : holder.children[0];

        const ratio = dimRatios.find((ratio) => ratio?.id === el?.id);

        handleFntSizes(el);
        compsScaler(holder, ratio, el);
      }
    });

    allHolders.forEach((holderDiv) => {
      const el = holderDiv.children[1]?.classList.contains('dropdownInput')
        ? holderDiv.children[1]
        : holderDiv.children[0];

      handleElOverflow(el, holderDiv);
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      const holderDIV = document.getElementsByClassName('holderDIV');
      const holderr = document.getElementsByClassName('holder-menu');
      const resizerr = document.getElementsByClassName('resizeBtn');
      //remove border from text
      if (event?.target?.id === midSectionRef?.current?.id) {
        // holderDIV.classList.remove('focussedd')
        if (document.querySelector('.focussedd')) {
          document.querySelector('.focussedd').classList.remove('focussedd');
        }
        if (document.querySelector('.focussed')) {
          document.querySelector('.focussed').classList.remove('focussed');
        }

        setIsMenuVisible(false);
        setSidebar(false);
        setIsClicked(false);
        setRightSideDateMenu(false);
        setIsClicked({
          ...isClicked,
          align2: false,
          textfill2: false,
          image2: false,
          table2: false,
          signs2: false,
          calendar2: false,
          dropdown2: false,
          scale2: false,
          container2: false,
          iframe2: false,
          button2: false,
          email2: false,
          newScale2: false,
          camera2: false,
          payment2: false,
        });

        contextMenuClose();
        const divsArray = document.getElementsByClassName(
          'enable_pointer_event'
        );
      }
    });
  }, []);

  useEffect(() => {
    if (decoded?.details?.update_field.template_name == 'Untitled Template') {
      setProgress(100);
    } else if (decoded?.details?.cluster === 'socialmedia') {
      setProgress(100);
    } else {
      setProgress(progress + 50);
    }
    if (Object.keys(fetchedData).length) {
      onPost();
      //call this conditionally
      // if (decoded && decoded?.details?.cluster === 'socialmedia') {
      //   onParagraphPost();
      //   // console.log(decoded)
      // }
    }
    if (decoded && decoded?.details?.cluster === 'socialmedia') {
      // setSocialMediaImg(socialMediaImg)
      // console.log(socialMediaImg)
      onParagraphPost();
      // console.log(decoded)
    }
  }, [fetchedData]);

  useEffect(() => {
    const rightMenu = document.querySelector('.false.col-lg-1')
    const mainSection = document.querySelector('.editSec_midSec');
    document.querySelectorAll('.preview-canvas')?.forEach(prev => prev.remove())
    if (isDataRetrieved && mode === 'preview') {
      renderPreview()

    } else {
      // const previews = document.querySelectorAll('.preview-canvas');
      // previews?.forEach(preview=>preview.remove());
      if (rightMenu) {
        rightMenu.style.display = 'flex';
      }

      document.querySelectorAll('.preview-canvas')?.forEach(prev => prev?.parentElement?.remove())

    }
  }, [isDataRetrieved, selOpt, mode]);

  // useEffect(() => {
  //   if (Object.keys(fetchedData).length) {
  //     window.onresize = () => {
  //       if (resizeChecker.current !== window.innerWidth) {
  //         isCompsScaler || setIsCompsScaler(true);
  //         scaleMidSec();
  //         resizeChecker.current = window.innerWidth;
  //       }

  //       if (defOptRef.current !== 'large' && window.innerWidth > 993)
  //         setDefSelOpt('large');
  //       else if (
  //         (defOptRef.current !== 'large' || defOptRef.current !== 'mid') &&
  //         window.innerWidth <= 993 &&
  //         window.innerWidth >= 770
  //       )
  //         setDefSelOpt('mid');
  //     };
  //   }

  //   return () => (window.onresize = null);
  // }, [fetchedData, currMidSecWidth, isCompsScaler]);

  // useEffect(() => {
  //   if (
  //     Object.keys(fetchedData).length &&
  //     currMidSecWidth > 0 &&
  //     isCompsScaler
  //   ) {
  //     compsResizer();
  //   }
  // }, [currMidSecWidth, fetchedData, isCompsScaler]);

  useEffect(() => {
    if (Object.keys(fetchedData).length && currMidSecWidth > 0) {
      //DISABLE RESPONSIVE DESIGN USING OBSERVERS
      // const editSec = document.querySelector('.editSec_midSec');

      // const editSecObserver = new MutationObserver((mutationLists) => {
      //   for (const mutation of mutationLists) {
      //     if (mutation.target.classList.contains('midSection_container')) {
      //       if (
      //         mutation.addedNodes.length &&
      //         !mutation.addedNodes[0].classList.contains('modal-container') &&
      //         !mutation.addedNodes[0].classList.contains('positioning')
      //       ) {
      //         const [holder] = mutation.addedNodes;
      //         const el = holder.children[1]?.classList.contains('dropdownInput')
      //           ? holder.children[1]
      //           : holder.children[0];
      //         const elRect = el.getBoundingClientRect();
      //         const midSec = document.querySelector('.midSection_container');
      //         const midSecWidth = midSec.getBoundingClientRect().width;
      //         const page = Number(
      //           [...holder.classList]
      //             .find((cl) => cl.includes('page'))
      //             .split('_')[1]
      //         );

      //         // * This codes opens Right sidebar once user drops component on midsection
      //         !dimRatios.find((dim) => dim.id === el.id) && el.click();

      //         const modDimRatio = {
      //           type: el.className,
      //           id: el.id,
      //           top: elRect.top / midSecWidth,
      //           left: elRect.left / midSecWidth,
      //           width: elRect?.width / midSecWidth,
      //           height: elRect?.height / midSecWidth,
      //           page,
      //         };

      //         const modDimRatios = [...dimRatios, modDimRatio];
      //         sessionStorage.setItem('dimRatios', JSON.stringify(modDimRatios));
      //         setDimRatios(modDimRatios);
      //       }

      //       if (
      //         mutation.removedNodes.length &&
      //         !mutation.removedNodes[0].classList.contains('modal-container') &&
      //         !mutation.removedNodes[0].classList.contains('positioning')
      //       ) {
      //         const [holder] = mutation.removedNodes;
      //         const el = holder.children[1]?.classList.contains('dropdownInput')
      //           ? holder.children[1]
      //           : holder.children[0];

      //         const modDimRatios = dimRatios.filter(
      //           (ratio) => ratio.id !== el.id
      //         );
      //         sessionStorage.setItem('dimRatios', JSON.stringify(modDimRatios));
      //         setDimRatios(modDimRatios);
      //       }
      //     }
      //   }
      // });

      // editSecObserver.observe(editSec, { childList: true, subtree: true });

      if (dimRatios.length) setEnablePreview(true);
      else setEnablePreview(false);
    }
  }, [dimRatios, currMidSecWidth, fetchedData]);

  const getCurrentEl = (fromMidSection) => {
    return fromMidSection;
  };

  //handle model in document level
  useEffect(() => {
    setShowReminderModal(true);
  }, [])

  const handleClose = () => setShowReminderModal(false);

  useEffect(() => {
    const midsectionContainers = document.querySelectorAll('.midSection_container');
    midsectionContainers.forEach(midSection => {
      if (!midSection.hasAttribute('data-resize-observed')) {
        // Create a Resize Observer
        const resizeObserver = new ResizeObserver(handleResize);
        // Observe the midSection element
        resizeObserver.observe(midSection);
        // Mark the element as observed to avoid duplication
        midSection.setAttribute('data-resize-observed', 'true');
      }
    })

  }, [])

  return (
    <>
      {item?.map((currentItem, index) => {
        return (
          <Print>
            <div
              ref={ref}
              key={index}
              id="main-section"
              className={`midSection print_midsection_${index}`}
            >
              <Container
                as='div'
                ref={midSectionRef}
                className={
                  // !sidebar
                  //   ? "midSection_without_RightMenu_container"
                  'midSection_container print_container'
                }
                style={{
                  marginTop:
                    window.innerWidth < 993 &&
                    actionName != 'template' &&
                    0 + 'px',
                }}
                // className="midSection_container"
                id='midSection_container'
                onDragOver={dragOver}
                onDrop={onDrop}
                onContextMenu={handleContextMenu}
              >
                {confirmRemove && (
                  <RemoveElementModal
                    handleRemoveInput={() => {
                      if (contextMenu.targetEl) {
                        handleRemoveInput(contextMenu.targetEl);
                      } else {
                        if (document.querySelector('.focussedd')) {
                          document.querySelector('.focussedd')?.remove();
                        }
                      }
                    }}
                    targetEl={contextMenu.targetEl}
                  />
                )}
                {contextMenu.show && (
                  <RightContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    closeContextMenu={contextMenuClose}
                    cutInput={() => {
                      handleCutInput(contextMenu.targetEl);
                    }}
                    pasteInput={handlePaste}
                    handleCopy={() => {
                      handleCopyInput(contextMenu.targetEl);
                    }}
                  />
                )}
                <Row style={{ height: isLoading ? '79%' : '' }}>
                  <Col className='d-flex justify-content-end header_user'>
                    <span>{index + 1}</span>
                    {isLoading && <Spinner />}
                  </Col>
                </Row>
                <SocialMedia isOpen={socialModalIsOpen} onRequestClose={closeSociaModal} />
                {
                  decoded?.details?.action === "document" && decoded?.details?.document_right == "add_edit" ? <UserFinalizeReminderModal showReminderModal={showReminderModal} handleClose={handleClose} /> : null
                }

              </Container>

            </div>
          </Print>
        );
      })}
      {/* <!-- Modal --> */}
    </>
  );
});

export default MidSection;
