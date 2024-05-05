import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import createButtonInputElement from '../components/midSection/createElements/CreateButtonElement.jsx';
import CreatePyamentElement from '../components/midSection/createElements/CreatePyamentElement.jsx';
import createFormInputElement from '../components/midSection/createElements/CreateFormElement.jsx';
import { FaBullseye } from 'react-icons/fa';

const StateContext = createContext();

const initialState = {
  align: true,
  textfill: true,
  image: false,
  table: false,
  signs: false,
  calendar: false,
  dropdown: false,
  container: false,
  iframe: false,
  scale: false,
  button: false,
  email: false,
  newScale: false,
  camera: false,
  payment: false,
};
const initialState2 = {
  align2: false,
  textfill2: false,
  image2: false,
  table2: false,
  signs2: false,
  calendar2: false,
  dropdown2: false,
  iframe2: false,
  scale2: false,
  container2: false,
  button2: false,
  email2: false,
  newScale2: false,
  camera2: false,
  payment2: false,
};

export const ContextProvider = ({ children }) => {
  const [fetchedData, setFetchedData] = useState({});
  const [isClicked, setIsClicked] = useState(initialState2);
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [mode, setMode] = useState('edit');
  const [isDropped, setIsDropped] = useState(initialState);
  const [isResizing, setIsResizing] = useState(false);
  const [defSelOpt, setDefSelOpt] = useState('mid');
  const [selOpt, setSelOpt] = useState(defSelOpt);
  const [enablePreview, setEnablePreview] = useState(true);
  const [idIni, setIdIni] = useState('');
  const [modHeightEls, setModHeightEls] = useState([]);

  // Fetched Data
  const [data, setData] = useState([]);
  const [title, setTitle] = useState(['Untitled-file']);
  const [isDataRetrieved, setIsDataRetrieved] = useState(false);
  const [isCompsScaler, setIsCompsScaler] = useState(false);
  // const [iniBtnId, setIniBtnId] = useState('');

  //nps scale custom data
  const [customId, setCustomId] = useState([]);
  const [scaleTypeContent, setScaleTypeContent] = useState('');

  //Right Sidebar context
  const [signState, setSignState] = React.useState({ trimmedDataURL: null }); // Signature

  const [startDate, setStartDate] = useState(new Date()); // Calendar

  const [dropdownName, setDropdownName] = useState('Dropdown Name');
  const [dropdownLabel, setDropdownLabel] = useState('Dropdown Label');
  const [dropdownItems, setDropdownItems] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState(['Enter List Items']);

  const [buttonLink, setButtonLink] = useState('');
  const [paymentKey, setPaymentKey] = useState('');
  const [buttonPurpose, setButtonPurpose] = useState('');
  const [paypalId, setPaypalId] = useState('');

  const [fontPlus, setFontPlus] = useState(false);
  const [fontMinus, setFontMinus] = useState(false);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);
  const [iframek, setIframek] = useState(0);

  const [genSelOpt, setGenSelOpt] = useState('');

  const [fixedMidSecDim] = useState({
    width: 793.69,
    height: 1122.52,
    parentHeight: 1235.89,
  });
  const [currMidSecWidth, setCurrMidSecWidth] = useState(0);
  const resizeChecker = useRef(window.innerWidth);

  const [dimRatios, setDimRatios] = useState([]);

  const handleDrop = (dropped) => {
    setIsDropped({ ...isDropped, [dropped]: true });
  };

  const handleClicked = (clicked, tableRighMenu) => {
    setIsClicked({ ...initialState2, [clicked]: true, [tableRighMenu]: false });
  };

  const [newToken, setNewToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipClicked, setIsFlipClicked] = useState(true);
  const [sidebar, setSidebarStatus] = useState(false);
  const [rightSideDatemenu, setRightSideDateMenu] = useState(false);
  const [rightSideDropDown, setRightSideDropDown] = useState(false);
  const [savedSripeKey, setSavedSripeKey] = useState({
    payment_id: null,
    key: null,
  });
  const [savedPaypalKey, setSavedPaypalKey] = useState({
    payment_id: null,
    secret_key: null,
    key: null,
  });

  const setSidebar = (bool) => {
    const previewCanvas = document.querySelector('.preview-canvas')
    if (!previewCanvas) {
      setSidebarStatus(bool);
    };

  }
  // handling date format
  const [method, setMethod] = useState('first');
  // handling page delete
  const [deletePages, setDeletepages] = useState([]);
  // const showSidebar = () => setSidebar(!sidebar);
  const [isFinializeDisabled, setIsFinializeDisabled] = useState(true);
  //handling new pages

  const [item, setItem] = useState(['div_1']);

  //Pending mail
  const [pendingMail, setPendingMail] = useState(false);

  // Scale id
  const [scaleId, setScaleId] = useState('id');
  const [scaleData, setScaleData] = useState([]);
  const [custom1, setCustom1] = useState('');
  const [custom2, setCustom2] = useState('');
  const [custom3, setCustom3] = useState('');
  //Handling the refreshing for scale
  const [iframeKey, setIframeKey] = useState(0);

  // borderColors and sizes
  const [borderSize, setBorderSize] = useState(2);
  const [borderColor, setBorderColor] = useState('gray');
  const [inputBorderSize, setInputBorderSize] = useState(2);
  const [inputBorderColor, setInputBorderColor] = useState('gray');
  const [calendarBorderSize, setCalendarBorderSize] = useState(2);
  const [calendarBorderColor, setCalendarBorderColor] = useState('gray');
  const [dropdownBorderSize, setDropdownBorderSize] = useState(2);
  const [dropdownBorderColor, setDropdownBorderColor] = useState('gray');
  const [buttonBorderSize, setButtonBorderSize] = useState(2);
  const [buttonBorderColor, setButtonBorderColor] = useState('gray');
  const [signBorderSize, setSignBorderSize] = useState(2);
  const [signBorderColor, setSignBorderColor] = useState('gray');
  const [tableBorderSize, setTableBorderSize] = useState(2);
  const [tableBorderColor, setTableBorderColor] = useState('gray');
  const [iframeBorderSize, setIframeBorderSize] = useState(2);
  const [iframeBorderColor, setIframeBorderColor] = useState('gray');
  const [scaleBorderSize, setScaleBorderSize] = useState(2);
  const [scaleBorderColor, setScaleBorderColor] = useState('gray');
  const [containerBorderSize, setContainerBorderSize] = useState(2);
  const [containerBorderColor, setContainerBorderColor] = useState('gray');
  const [formBorderSize, setFormBorderSize] = useState(2);
  const [formBorderColor, setFormBorderColor] = useState('gray');
  const [docMapRequired, setDocMapRequired] = useState([]);


  //social Media
  const [socialMediaImg, setSocialMediaImg] = useState(() => {
    const storedImg = localStorage.getItem('editor_social_img');
    // console.log(">>>>\n Image changes", storedImg)
    return storedImg;
  });

  // useEffect(() => {
  //   const handleStorageChange = (event) => {
  //     const imgDtaaa = localStorage.getItem("editor_social_img")
  //     if (event.key === imgDtaaa) {
  //       setSocialMediaImg(event.newValue || ''); // Set a default value if nothing is stored
  //     }
  //   };

  //   window.addEventListener('storage', handleStorageChange);

  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, []);

  // progress bar state
  const [progress, setProgress] = useState(0);

  //Company id
  const [companyId, setCompanyId] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  // handle drop event for table and retrieve midsection

  const [allowHighlight, setAllowHighlight] = useState(false);




  const handleDropp = (e) => {
    e.preventDefault();
    if (
      e.target.childNodes.length < 2 &&
      !e.target.classList.contains('imageInput')
    ) {
      e.target.style.border = '1px solid black';
    }
    if (e.target.classList.contains('imageInput')) {
      e.target.style.border = 'none';
    }
    const typeOfOperation = e.dataTransfer.getData('text/plain');

    if (
      e.target.childNodes.length < 2 &&
      !e.target.classList.contains('imageInput')
    ) {
      if (typeOfOperation === 'TEXT_INPUT') {
        let inputField = document.createElement('div');
        //  inputField.setAttribute('draggable', true);
        inputField.setAttribute('contenteditable', true);
        inputField.className = 'textInput';
        inputField.innerHTML = 'Enter text here';
        inputField.style.width = '100%';
        inputField.style.height = '100%';
        inputField.style.resize = 'none';
        inputField.style.backgroundColor = '#0000';
        inputField.style.borderRadius = '0px';
        inputField.style.outline = '0px';
        inputField.style.overflow = 'overlay';
        inputField.style.position = 'relative';
        inputField.style.cursor = 'text';
        inputField.onclick = (e) => {
          if (inputField) {
            //   handleClicked("align2", "table2");
            //   setSidebar(true);
            //   e.stopPropagation();
            // }
            focuseddClassMaintain(e);
            handleClicked('align2', 'table2');
            setSidebar(true);
            e.stopPropagation();
          }
        };

        e.target.append(inputField);
      } else if (typeOfOperation === 'IMAGE_INPUT') {
        let imageField = document.createElement('div');
        imageField.className = 'imageInput';
        imageField.style.minHeight = '100%';
        imageField.style.minWidth = '100%';
        imageField.style.backgroundColor = '#0000';
        imageField.style.borderRadius = '0px';
        imageField.style.outline = '0px';
        imageField.style.overflow = 'overlay';

        imageField.style.position = 'relative';

        imageField.onclick = (e) => {
          focuseddClassMaintain(e);

          e.preventDefault();
          handleClicked('image2', 'table2');

          setSidebar(true);

          e.stopPropagation();
        };

        const imageButton = document.createElement('div');
        imageButton.className = 'addImageButton';
        imageButton.innerText = 'Choose File';
        imageButton.style.display = 'none';

        const imgBtn = document.createElement('input');
        imgBtn.className = 'addImageButtonInput';
        imgBtn.type = 'file';
        imgBtn.style.objectFit = 'cover';
        var uploadedImage = '';

        imgBtn.addEventListener('input', () => {
          const reader = new FileReader();

          reader.addEventListener('load', () => {
            uploadedImage = reader.result;
            document.querySelector(
              '.focussed'
            ).style.backgroundImage = `url(${uploadedImage})`;
          });
          reader.readAsDataURL(imgBtn.files[0]);
        });

        imageButton.append(imgBtn);
        e.target.append(imageField);
        e.target.append(imageButton);
        e.target.style.width = imageField.style.width;
      } else if (typeOfOperation === 'TEXT_FILL') {
        let texttField = document.createElement('textarea');
        texttField.className = 'texttInput';
        texttField.placeholder = 'input text here';
        texttField.style.width = '100%';
        texttField.style.height = '100%';
        texttField.style.resize = 'none';
        texttField.style.backgroundColor = '#0000';
        texttField.style.borderRadius = '0px';
        texttField.style.outline = '0px';
        texttField.style.overflow = 'overlay';

        texttField.style.position = 'relative';

        e.target.append(texttField);
      } else if (typeOfOperation === 'FORM') {
        let texttField = document.createElement('div');
        texttField.className = 'texttField';
        texttField.style.width = '100%';
        texttField.style.height = '30vh';
        texttField.style.position = 'relative';
        e.target.append(texttField);
      } else if (typeOfOperation === 'SIGN_INPUT') {
        let signField = document.createElement('div');
        signField.className = 'signInput';
        signField.style.width = '100%';
        signField.style.height = '100%';
        signField.style.backgroundColor = '#0000';
        signField.style.borderRadius = '0px';
        signField.style.outline = '0px';
        signField.style.overflow = 'overlay';
        signField.innerHTML = 'signature here';
        signField.style.position = 'absolute';
        signField.style.top = 0;
        signField.style.left = 0;
        e.target.style.position = 'relative';

        signField.onclick = (e) => {
          focuseddClassMaintain(e);

          handleClicked('signs2', 'table2');
          setSidebar(true);
          e.stopPropagation();
        };
        const imageSignButton = document.createElement('div');
        imageSignButton.className = 'addImageSignButton';
        imageSignButton.innerText = 'Choose File';
        imageSignButton.style.display = 'none';

        const signBtn = document.createElement('input');
        signBtn.className = 'addSignButtonInput';
        signBtn.type = 'file';
        signBtn.style.objectFit = 'cover';
        var uploadedImage = '';

        signBtn.addEventListener('input', () => {
          const reader = new FileReader();

          reader.addEventListener('load', () => {
            uploadedImage = reader.result;
            const signImage = `<img src=${uploadedImage} width="100%" height="100%"/>`;
            document.querySelector('.focussed').innerHTML = signImage;
          });
          reader.readAsDataURL(signBtn.files[0]);
        });

        imageSignButton.append(signBtn);

        e.target.append(signField);
        e.target.append(imageSignButton);
      } else if (typeOfOperation === 'DATE_INPUT') {
        let dateField = document.createElement('div');
        dateField.className = 'dateInput';
        dateField.style.width = '100%';
        dateField.style.height = '100%';
        dateField.style.backgroundColor = '#0000';
        dateField.style.borderRadius = '0px';
        dateField.style.outline = '0px';
        dateField.style.overflow = 'overlay';
        dateField.style.position = 'relative';

        setStartDate(new Date());
        setMethod('select');

        function dateClick() {
          document.getElementById('date_picker').click();
          setRightSideDateMenu(false);
        }
        dateField.onclick = (e) => {
          focuseddClassMaintain(e);
          handleClicked('calendar2');
          setRightSideDateMenu(false);
          if (e.target.innerText != 'mm/dd/yyyy') {
            if (e.target.innerText.includes('/')) {
              const setDate = new Date(e.target.innerText);
              setMethod('first');
              setStartDate(setDate);
            } else {
              if (e.target.innerText.includes('-')) {
                setMethod('fourth');
              } else {
                setMethod('second');
              }
              const setDate = new Date(e.target.innerText);
              setStartDate(setDate);
            }
          }
          setSidebar(true);
          setTimeout(dateClick, 0);
          e.stopPropagation();
        };
        dateField.innerText = 'mm/dd/yyyy';

        e.target.append(dateField);
      }
    }
  };

  // focus class maintain for table and midsection
  function focuseddClassMaintain(e) {
    if (e.target.parentElement) {
      let allDiv = document.getElementsByClassName('focussedd');
      for (let i = 0; i < allDiv.length; i++) {
        allDiv[i].classList.remove('focussedd');
      }
      e.target.parentElement.classList.add('focussedd');
    }
    // e.target.parentElement.classList.add("test_image");

    let focussedDiv = document.getElementsByClassName('focussed');
    for (let i = 0; i < focussedDiv.length; i++) {
      focussedDiv[i].classList.remove('focussed');
    }
    e.target.classList.add('focussed');
  }

  const [questionAndAnswerGroupedData, setQuestionAndAnsGroupedData] = useState(
    []
  );

  const [confirmRemove, setConfirmRemove] = useState(false);
  const [iframeSize, setIframeSize] = useState({
    width: '',
    height: '',
  });

  const copyInput = (clickHandler) => {
    const element = document.querySelector('.focussedd');

    let counter = 1;
    const copyEle = element.cloneNode(true);
    const rect = element.getBoundingClientRect();

    const copyEleTop =
      parseInt(copyEle.style.top.slice(0, -2)) +
      parseInt(rect.height) +
      20 +
      'px';

    copyEle.classList.remove('focussedd');
    copyEle.firstChild.classList.remove('focussed');

    copyEle.onfocus = () => {
      copyEle.style.border = '1px solid rgb(255 191 0)';
    };
    copyEle.onblur = () => {
      copyEle.style.border = '3px dotted gray';
    };
    if (copyEle) {
      copyEle.style.top = copyEleTop;
      copyEle.style.border = '3px dotted gray';
      copyEle.classList.remove('resizeBtn');

      copyEle.onmousedown = copyEle.addEventListener(
        'mousedown',
        (event) => {
          dragElementOverPage(event);
        },
        false
      );

      // trying to remove resize btn

      const resizeTags = copyEle.getElementsByClassName('resizeBtn');
      while (resizeTags.length > 0) {
        resizeTags[0].remove();
      }

      const resizerTL = getResizer('top', 'left', decoded);
      const resizerTR = getResizer('top', 'right', decoded);
      const resizerBL = getResizer('bottom', 'left', decoded);
      const resizerBR = getResizer('bottom', 'right', decoded);

      copyEle.addEventListener('focus', function (e) {
        copyEle.style.border = '2px solid orange';
        copyEle.append(resizerTL, resizerTR, resizerBL, resizerBR);
      });
      copyEle.addEventListener('focusout', function (e) {
        copyEle.classList.remove('zIndex-two');
        copyEle.style.border = '3px dotted gray';

        resizerTL.remove();
        resizerTR.remove();
        resizerBL.remove();
        resizerBR.remove();
      });
      copyEle.addEventListener('click', (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (
          e.target?.parentElement?.parentElement.classList.contains(
            'containerInput'
          )
        ) {
          let type = '';
          const containerClassName = e.target.classList[0];
          switch (containerClassName) {
            case 'dateInput':
              type = 'calendar2';
              break;
            case 'textInput':
              type = 'align2';
              break;
            case 'imageInput':
              type = 'image2';
              break;
            case 'signInput':
              type = 'signs2';
              break;
            case 'iframeInput':
              type = 'iframe2';
              break;
            case 'scaleInput':
              type = 'scale2';
              break;
            case 'buttonInput':
              type = 'button2';
              break;
            case 'dropdownInput':
              type = 'dropdown2';
              break;
            case 'emailButton':
              type = 'email2';
              break;
            default:
              type = '';
          }
          handleClicked(type, 'container2');
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
          targetParent.classList.contains('containerInput') ||
          targetParent.classList.contains('midSection_container')
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

  const scaleMidSec = (isOnPost) => {
    if (!document.querySelector('.preview-canvas')) {
      const midSecAll = document.querySelectorAll('.midSection_container');
      const ratio = fixedMidSecDim?.height / fixedMidSecDim?.width;
      const parentRatio = fixedMidSecDim?.parentHeight / fixedMidSecDim?.height;
      const currWidth = Number(
        midSecAll[0].getBoundingClientRect().width.toFixed(2)
      );
      const scaledHeight = Number((ratio * currWidth).toFixed(2));
      const leftRect = document
        .getElementsByClassName('left_menu_wrapper')[0]
        ?.getBoundingClientRect();

      if (isOnPost || currWidth !== currMidSecWidth) {
        midSecAll?.forEach((mid) => {
          mid.style.height = scaledHeight + 'px';
          mid.parentElement.style.height =
            (scaledHeight * parentRatio).toFixed(2) + 'px';
        });

        midSecAll[0].parentElement.parentElement.parentElement.style.marginTop =
          window.innerWidth > 993 ? 0 : leftRect?.height + 'px';

        setCurrMidSecWidth(currWidth);
      }

    } else {
      const midSecAll = document.querySelectorAll('.preview-canvas');
      const ratio = fixedMidSecDim?.height / fixedMidSecDim?.width;
      const parentRatio = fixedMidSecDim?.parentHeight / fixedMidSecDim?.height;
      const currWidth = Number(
        midSecAll[0].getBoundingClientRect().width.toFixed(2)
      );
      const scaledHeight = Number((ratio * currWidth).toFixed(2));
      const leftRect = document
        .getElementsByClassName('left_menu_wrapper')[0]
        ?.getBoundingClientRect();

      if (isOnPost || currWidth !== currMidSecWidth) {
        midSecAll?.forEach((mid) => {
          mid.style.height = scaledHeight + 'px';
          mid.parentElement.style.height =
            (scaledHeight * parentRatio).toFixed(2) + 'px';
        });

        midSecAll[0].parentElement.parentElement.parentElement.style.marginTop =
          window.innerWidth > 993 ? 0 : leftRect?.height + 'px';

        setCurrMidSecWidth(currWidth);
      }
    }
  };

  const updateDimRatios = (holder) => {
      const midSecWidth = document
        .querySelector('.midSection_container')
        .getBoundingClientRect().width;
      const holderStyles = window.getComputedStyle(holder);
      const el = holder.children[1]?.classList.contains('dropdownInput')
        ? holder.children[1]
        : holder.children[0];

      const holderTop = parseFloat(holderStyles.top);
      const holderLeft = parseFloat(holderStyles.left);
      const holderWidth = parseFloat(holderStyles.width);
      const holderHeight = parseFloat(holderStyles.height);

      const dimRatios = sessionStorage.getItem('dimRatios')
        ? JSON.parse(sessionStorage.getItem('dimRatios'))
        : [];
      const modDimRatios = dimRatios.map((ratio) =>
        ratio.id === el.id
          ? {
            ...ratio,
            top: holderTop / midSecWidth,
            left: holderLeft / midSecWidth,
            width: holderWidth / midSecWidth,
            height: holderHeight / midSecWidth,
          }
          : ratio
      );

      sessionStorage.setItem('dimRatios', JSON.stringify(modDimRatios));
      setDimRatios(modDimRatios);
   
  };

  useEffect(() => {
    const replaceIds = (oldId) => {
      const newId = document.querySelector('.focussed').id;
      const dimRatios = JSON.parse(sessionStorage.getItem('dimRatios'));
      const modDimRatios = dimRatios.map((ratio) =>
        ratio.id === oldId ? { ...ratio, id: newId } : ratio
      );
      sessionStorage.setItem('dimRatios', JSON.stringify(modDimRatios));
      setDimRatios(modDimRatios);
    };

    if (genSelOpt) {
      const holderDiv = document.querySelector('.focussedd');
      const iniId = holderDiv.children[0].id;
      setIdIni(iniId);
      holderDiv.innerHTML = '';

      switch (genSelOpt) {
        case 'cta':
          createButtonInputElement(
            holderDiv,
            focuseddClassMaintain,
            handleClicked,
            setSidebar
          );
          replaceIds(iniId);
          break;
        case 'pay':
          CreatePyamentElement(
            holderDiv,
            focuseddClassMaintain,
            handleClicked,
            setSidebar
          );
          replaceIds(iniId);
          break;
        case 'email':
          createFormInputElement(
            holderDiv,
            focuseddClassMaintain,
            handleClicked,
            setSidebar
          );
          replaceIds(iniId);
          break;
        default:
          return;
      }
    }
  }, [genSelOpt, idIni]);

  useEffect(() => {
    sessionStorage.removeItem('orig_fnt');
  }, []);

  return (
    <StateContext.Provider
      value={{
        isDropped,
        handleDrop,
        setIsDropped,
        isResizing,
        setIsResizing,
        isClicked,
        handleClicked,
        setIsClicked,
        sidebar,
        setSidebar,
        signState,
        setSignState,
        startDate,
        setStartDate,
        fontPlus,
        setFontPlus,
        fontMinus,
        setFontMinus,
        bold,
        setBold,
        italic,
        setItalic,
        underline,
        setUnderline,
        strikethrough,
        setStrikethrough,
        dropdownName,
        setDropdownName,
        dropdownLabel,
        setDropdownLabel,
        dropdownItems,
        setDropdownItems,
        dropdownOptions,
        setDropdownOptions,
        item,
        setItem,
        isLoading,
        setIsLoading,
        isFlipClicked,
        setIsFlipClicked,
        fetchedData,
        setFetchedData,
        rightSideDatemenu,
        setRightSideDateMenu,
        rightSideDropDown,
        setRightSideDropDown,
        method,
        setMethod,
        deletePages,
        setDeletepages,
        isFinializeDisabled,
        setIsFinializeDisabled,
        newToken,
        setNewToken,
        data,
        setData,
        title,
        setTitle,
        isDataRetrieved,
        setIsDataRetrieved,
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
        handleDropp,
        focuseddClassMaintain,
        buttonLink,
        setButtonLink,
        buttonPurpose,
        setButtonPurpose,
        customId,
        setCustomId,
        iframek,
        setIframek,
        iframeKey,
        setIframeKey,
        borderSize,
        setBorderSize,
        borderColor,
        setBorderColor,
        inputBorderColor,
        setInputBorderColor,
        inputBorderSize,
        setInputBorderSize,
        calendarBorderSize,
        setCalendarBorderSize,
        calendarBorderColor,
        setCalendarBorderColor,
        buttonBorderSize,
        setButtonBorderSize,
        scaleTypeContent,
        setScaleTypeContent,
        dropdownBorderColor,
        setDropdownBorderColor,
        dropdownBorderSize,
        setDropdownBorderSize,
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
        formBorderSize,
        setFormBorderSize,
        formBorderColor,
        setFormBorderColor,
        questionAndAnswerGroupedData,
        setQuestionAndAnsGroupedData,
        confirmRemove,
        setConfirmRemove,
        allowHighlight,
        setAllowHighlight,
        copyInput,
        paymentKey,
        setPaymentKey,
        paypalId,
        setPaypalId,
        savedSripeKey,
        setSavedSripeKey,
        savedPaypalKey,
        setSavedPaypalKey,
        genSelOpt,
        setGenSelOpt,
        fixedMidSecDim,
        scaleMidSec,
        currMidSecWidth,
        dimRatios,
        setDimRatios,
        updateDimRatios,
        mode,
        setMode,
        progress,
        setProgress,
        selOpt,
        setSelOpt,
        defSelOpt,
        setDefSelOpt,
        enablePreview,
        setEnablePreview,
        modHeightEls,
        setModHeightEls,
        isCompsScaler,
        setIsCompsScaler,
        resizeChecker,
        socialMediaImg,
        setSocialMediaImg,
        pendingMail, 
        setPendingMail
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
