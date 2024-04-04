import React, { useState } from 'react';
import copyInput from '../CopyInput';
import Axios from 'axios';

// Regular JavaScript function to create a text input field
function createContainerInputField(
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
  copy_data = false
) {
  let isAnyRequiredElementEdited = false;
  let containerField = document.createElement('div');
  containerField.className = 'containerInput';
  containerField.id = id;
  containerField.style.width = '100%';
  containerField.style.height = '100%';
  containerField.style.backgroundColor = '#0000';
  containerField.style.borderRadius = '0px';
  containerField.style.outline = '0px';
  containerField.style.overflow = 'overlay';
  containerField.style.position = 'relative';
  containerField.onclick = (e) => {
    focuseddClassMaintain(e);
    if (e.ctrlKey) {
      copyInput('container2');
    }
    handleClicked('container2');
    setSidebar(true);
  };
  // // console.log("element.data container input retrieve", element.data);
  let elementData = element;
  if (copy_data) {
    element.data = copy_data;
    containerField.id = `c` + (parseInt(id[1]) + 1);
  }
  for (let p = 0; p < element.data.length; p++) {
    const containerElement = element.data[p];
    //  console.log('\n>>>>>Container Data\n',containerElement,'\n>>>>>>>>>>>ELEMENT\n',element);

    const measureContainer = {
      width: containerElement.width + 'px',
      height: containerElement.height + 'px',
      left: containerElement.left - element.left + 'px',
      top: containerElement.topp,
      // top: containerElement.top - element.top + "px",
      auth_user: curr_user,
    };
    if (copy_data) {
      measureContainer.left = containerElement.left;
    }
    const typeOfOperationContainer = containerElement.type;
    const holderDIVContainer = getHolderDIV(measureContainer);
    if (typeOfOperationContainer === 'DATE_INPUT') {
      let dateFieldContainer = document.createElement('div');
      dateFieldContainer.className = 'dateInput';
      dateFieldContainer.id = containerElement.id;
      dateFieldContainer.style.width = '100%';
      dateFieldContainer.style.height = '100%';
      dateFieldContainer.style.backgroundColor = '#0000';
      dateFieldContainer.style.borderRadius = '0px';
      dateFieldContainer.style.outline = '0px';
      dateFieldContainer.style.overflow = 'overlay';
      dateFieldContainer.style.position = 'relative';

      dateFieldContainer.onchange = (event) => {
        event.preventDefault();
        setPostData({
          ...postData,
          calenderField: {
            value: event.target.value,
            xcoordinate: getOffset(holderDIVContainer).left,
            ycoordinate: getOffset(holderDIVContainer).top,
          },
        });
      };
      setStartDate(new Date());
      setMethod('select');
      function dateClick() {
        document.getElementById('date_picker').click();
        setRightSideDateMenu(false);
      }
      dateFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('calendar2');
        }
        handleClicked('calendar2', 'container2');
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
      };
      dateFieldContainer.innerText = containerElement.data;

      holderDIVContainer.append(dateFieldContainer);
    } else if (typeOfOperationContainer === 'IMAGE_INPUT') {
      let imageFieldContainer = document.createElement('div');
      imageFieldContainer.className = 'imageInput';
      imageFieldContainer.id = containerElement.id;
      imageFieldContainer.style.width = '100%';
      imageFieldContainer.style.height = '100%';
      imageFieldContainer.style.backgroundColor = '#0000';
      imageFieldContainer.style.borderRadius = '0px';
      imageFieldContainer.style.outline = '0px';
      imageFieldContainer.style.overflow = 'overlay';
      // imageFieldContainer.innerText = "Choose Image";
      imageFieldContainer.style.position = 'relative';

      containerElement.data.startsWith('url(')
        ? (imageFieldContainer.style.backgroundImage = `${containerElement.data}`)
        : (imageFieldContainer.innerText = `${containerElement.data}`);

      imageFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('image2');
        }
        handleClicked('image2', 'table2');
        setSidebar(true);
      };

      const imageButtonContainer = document.createElement('div');
      imageButtonContainer.className = 'addImageButton';
      imageButtonContainer.innerText = 'Choose File';
      imageButtonContainer.style.display = 'none';
      // imageButtonContainer.onclick = (e) => chooseFileClick(e);

      const imgBtnContainer = document.createElement('input');
      imgBtnContainer.className = 'addImageButtonInput';
      imgBtnContainer.type = 'file';
      imgBtnContainer.style.objectFit = 'cover';
      var uploadedImage = '';

      imgBtnContainer.addEventListener('input', () => {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          uploadedImage = reader.result;
          document.querySelector(
            '.focussed'
          ).style.backgroundImage = `url(${uploadedImage})`;
        });
        reader.readAsDataURL(imgBtnContainer.files[0]);
      });

      // imgBtnContainer.style.width = "100%";
      imageButtonContainer.append(imgBtnContainer);
      holderDIVContainer.append(imageFieldContainer);
      holderDIVContainer.append(imageButtonContainer);
    } else if (typeOfOperationContainer === 'DROPDOWN_INPUT') {
      let dropdownFieldContainer = document.createElement('div');
      dropdownFieldContainer.className = 'dropdownInput';
      dropdownFieldContainer.id = containerElement.id;
      dropdownFieldContainer.style.width = '100%';
      dropdownFieldContainer.style.height = '100%';
      dropdownFieldContainer.style.backgroundColor = '#0000';
      dropdownFieldContainer.style.borderRadius = '0px';
      dropdownFieldContainer.style.outline = '0px';
      dropdownFieldContainer.style.overflow = 'overlay';
      dropdownFieldContainer.style.position = 'absolute';

      const selectElement = document.createElement('select');
      selectElement.className = 'select-element';
      selectElement.style.width = '500';
      selectElement.style.height = 'auto';
      //   var opt = document.createElement("option");
      //   opt.value = "i";
      //   opt.innerHTML = "hello";
      //   console.log("opt", opt);
      //   selectElement.appendChild(opt);

      //   const option = new Option(element, 1, false, false);
      //   console.log("option", option);
      selectElement.onclick = () => {
        selectElement.parentElement.click();
      };

      dropdownFieldContainer.onchange = (event) => {
        event.preventDefault();
        setPostData({
          ...postData,
          dropdownFieldContainer: {
            value: event.target.value,
            xcoordinate: getOffset(holderDIVContainer).left,
            ycoordinate: getOffset(holderDIVContainer).top,
          },
        });
      };

      dropdownFieldContainer.onclick = (e) => {
        e.stopPropagation();
        if (e.ctrlKey) {
          copyInput('dropdown2');
        }
        table_dropdown_focuseddClassMaintain(e);
        handleClicked('dropdown2');
        setRightSideDropDown(false);
        setSidebar(true);
      };

      const para = document.createElement('p');
      para.innerHTML = ' Dropdown Name';
      para.className = 'dropdownName';
      para.onclick = () => {
        para.parentElement.click();
      };
      //   const createOption = document.createElement("option");
      //   createOption.value = 1;
      // //   opt.innerHTML = i;
      // //   select.appendChild(opt);
      //   createOption.innerText = "Select List Here";
      //   selectElement.append(createOption);

      dropdownFieldContainer.append(para);
      dropdownFieldContainer.append(selectElement);
      holderDIVContainer.append(dropdownFieldContainer);
    } else if (typeOfOperationContainer === 'TEXT_INPUT') {
      let inputFieldContainer = document.createElement('div');
      inputFieldContainer.setAttribute('contenteditable', true);
      //  inputFieldContainer.setAttribute('draggable', true);
      inputFieldContainer.className = 'textInput';
      inputFieldContainer.id = containerElement.id;
      inputFieldContainer.style.width = '100%';
      inputFieldContainer.style.height = '100%';
      inputFieldContainer.style.resize = 'none';
      inputFieldContainer.style.zIndex = 2;
      inputFieldContainer.style.backgroundColor = '#0000';
      inputFieldContainer.style.borderRadius = '0px';
      inputFieldContainer.style.outline = '0px';
      inputFieldContainer.style.overflow = 'overlay';
      inputFieldContainer.style.position = 'relative';
      inputFieldContainer.style.cursor = 'text';
      inputFieldContainer.oninput = (e) => {
        const required_map_document = document_map_required?.filter(
          (item) => element.id == item.content
        );
        if (
          inputFieldContainer.parentElement.classList.contains('holderDIV') &&
          required_map_document?.length > 0
        ) {
          inputFieldContainer.parentElement.classList.add('element_updated');
        }
        if (element.required) {
          isAnyRequiredElementEdited = true;
        }
      };

      inputFieldContainer.onfocus = () => {
        if (inputFieldContainer.textContent === 'Enter text here!') {
          inputFieldContainer.textContent = '';
          inputFieldContainer.classList.remove('empty')
        }
        inputFieldContainer.parentElement.style.border = '3px dotted gray'
    
      }
      inputFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('align2');
        }
        handleClicked('align2');
        setSidebar(true);
      };

      const text = `${containerElement.raw_data}`;

      inputFieldContainer.innerHTML = text;
      holderDIVContainer.append(inputFieldContainer);
    } else if (typeOfOperationContainer === 'SIGN_INPUT') {
      let signFieldContainer = document.createElement('div');
      signFieldContainer.className = 'signInput';
      signFieldContainer.id = containerElement.id;
      signFieldContainer.style.width = '100%';
      signFieldContainer.style.height = '100%';
      signFieldContainer.style.backgroundColor = '#0000';
      signFieldContainer.style.borderRadius = '0px';
      signFieldContainer.style.outline = '0px';
      signFieldContainer.style.overflow = 'overlay';
      signFieldContainer.innerText = 'Signature here';
      signFieldContainer.style.position = 'absolute';

      signFieldContainer.onchange = (event) => {
        event.preventDefault();
        setPostData({
          ...postData,
          signFieldContainer: {
            value: event.target.value,
            xcoordinate: getOffset(holderDIVContainer).left,
            ycoordinate: getOffset(holderDIVContainer).top,
          },
        });
      };

      signFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('signs2');
        }
        handleClicked('signs2');
        setSidebar(true);
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
      holderDIVContainer.append(signFieldContainer);
      holderDIVContainer.append(imageSignButton);
    } else if (typeOfOperationContainer === 'IFRAME_INPUT') {
      let iframeFieldContainer = document.createElement('div');
      iframeFieldContainer.className = 'iframeInput';
      iframeFieldContainer.id = containerElement.id;
      iframeFieldContainer.style.width = '100%';
      iframeFieldContainer.style.height = '100%';
      iframeFieldContainer.style.backgroundColor = '#dedede';
      iframeFieldContainer.style.borderRadius = '0px';
      iframeFieldContainer.style.outline = '0px';
      iframeFieldContainer.style.overflow = 'overlay';
      iframeFieldContainer.style.position = 'absolute';
      iframeFieldContainer.innerText = 'iFrame here';

      iframeFieldContainer.onclick = (e) => {
        e.stopPropagation();
        table_dropdown_focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('iframe2');
        }
        handleClicked('iframe2');
        setSidebar(true);
      };

      holderDIVContainer.append(iframeFieldContainer);
    } else if (typeOfOperationContainer === 'SCALE_INPUT') {
      setIsLoading(true);

      let scaleFieldContainer = document.createElement('div');
      scaleFieldContainer.className = 'scaleInput';
      scaleFieldContainer.id = containerElement.id;
      scaleFieldContainer.style.width = '100%';
      scaleFieldContainer.style.height = '100%';
      scaleFieldContainer.style.backgroundColor = 'transparent';
      scaleFieldContainer.style.borderRadius = '0px';
      scaleFieldContainer.style.outline = '0px';
      scaleFieldContainer.style.overflow = 'overlay';
      // scaleFieldContainer.innerHTML = 'iframe';
      scaleFieldContainer.style.position = 'absolute';
      // scaleFieldContainer.innerText = "scale here";

      let scale = document.createElement('iframe');
      scaleFieldContainer.append(scale);
      Axios.post('https://100035.pythonanywhere.com/api/nps_settings_create/', {
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
      })
        .then((res) => {
          setIsLoading(false);
          // console.log(res.data, "scaleData");
          setScaleData(res.data);
          const success = res.data.success;
          var successObj = JSON.parse(success);
          const id = successObj.inserted_id;
          // console.log(res.scale_urls, "stateScale");
          if (id.length) {
            setScaleId(id);
          }
          scale.src = res.data.scale_urls;
        })
        .catch((err) => {
          setIsLoading(false);
          // console.log(err);
        });

      scaleFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('scale2');
        }
        handleClicked('scale2');
        setSidebar(true);
      };

      holderDIVContainer.append(scaleFieldContainer);
    } else if (typeOfOperationContainer === 'TABLE_INPUT') {
      let tableFieldContainer = document.createElement('div');
      tableFieldContainer.className = 'tableInput';
      tableFieldContainer.style.width = '100%';
      tableFieldContainer.style.height = '100%';
      tableFieldContainer.style.backgroundColor = '#dedede';
      tableFieldContainer.style.borderRadius = '0px';
      tableFieldContainer.style.outline = '0px';
      tableFieldContainer.style.overflow = 'overlay';
      tableFieldContainer.style.position = 'absolute';

      tableFieldContainer.onchange = (event) => {
        event.preventDefault();

        setPostData({
          ...postData,
          tableFieldContainer: {
            value: event.target.value,
            xcoordinate: getOffset(holderDIVContainer).left,
            ycoordinate: getOffset(holderDIVContainer).top,
          },
        });
      };

      tableFieldContainer.onclick = (e) => {
        e.stopPropagation();
        table_dropdown_focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('table2');
        }
        handleClicked('table2');
        setSidebar(true);
      };
      holderDIVContainer.append(tableFieldContainer);
    } else if (typeOfOperationContainer == 'BUTTON_INPUT') {
      const measure = {
        width: element.width + 'px',
        height: element.height + 'px',
        left: element.left + 'px',
        top: element.topp,
        auth_user: curr_user,
      };

      const idMatch = documnetMap?.filter((elmnt) => elmnt == element?.id);
      // const holderDIV = getHolderDIV(measure, pageNo);
      const id = `${element.id}`;
      const finalizeButton = document.getElementById('finalize-button');
      const rejectButton = document.getElementById('reject-button');

      let buttonFieldContainer = document.createElement('button');
      buttonFieldContainer.className = 'buttonInput';
      buttonFieldContainer.id = id;
      buttonFieldContainer.style.width = '100%';
      buttonFieldContainer.style.height = '100%';
      buttonFieldContainer.style.backgroundColor = '#0000';
      buttonFieldContainer.style.borderRadius = '0px';
      buttonFieldContainer.style.outline = '0px';
      buttonFieldContainer.style.overflow = 'overlay';
      buttonFieldContainer.style.position = 'absolute';
      buttonFieldContainer.textContent = containerElement.data;

      if (
        decoded.details.action === 'template' &&
        containerElement.raw_data == '' &&
        containerElement.purpose == ''
      ) {
        buttonFieldContainer.onclick = (e) => {
          focuseddClassMaintain(e);
          if (e.ctrlKey) {
            copyInput('button2');
          }
          handleClicked('button2', 'container2');
          setSidebar(true);
        };
      }

      buttonFieldContainer.onmouseover = (e) => {
        const required_map_document = document_map_required?.filter(
          (item) => element.id == item.content
        );
        if (
          buttonFieldContainer.parentElement.classList.contains('holderDIV') &&
          required_map_document?.length > 0
        ) {
          buttonFieldContainer.parentElement.classList.add('element_updated');
        }
        if (element.required) {
          isAnyRequiredElementEdited = true;
        }
      };

      if (
        decoded.details.action === 'document' &&
        containerElement.purpose == 'custom' &&
        containerElement.raw_data !== ''
      ) {
        buttonFieldContainer.onclick = (e) => {
          window.open(containerElement.raw_data, '_blank');
        };
      }

      if (
        decoded.details.action === 'document' &&
        containerElement.purpose == 'finalize'
      ) {
        buttonFieldContainer.onclick = (e) => {
          finalizeButton?.click();
        };
      }
      if (
        decoded.details.action === 'document' &&
        containerElement.purpose == 'reject'
      ) {
        buttonFieldContainer.onclick = (e) => {
          rejectButton?.click();
        };
      }

      const linkHolder = document.createElement('div');
      linkHolder.className = 'link_holder';
      linkHolder.innerHTML = containerElement.raw_data;
      linkHolder.style.display = 'none';

      const purposeHolder = document.createElement('div');
      purposeHolder.className = 'purpose_holder';
      purposeHolder.innerHTML = containerElement.purpose;
      purposeHolder.style.display = 'none';

      holderDIVContainer.append(buttonFieldContainer);
      holderDIVContainer.append(linkHolder);
      holderDIVContainer.append(purposeHolder);
    } else if (typeOfOperationContainer == "PAYMENT_INPUT") {
      let paymentField = document.createElement("button");
      paymentField.className = "paymentInput";
      paymentField.style.width = "100%";
      paymentField.style.height = "100%";
      paymentField.style.backgroundColor = "#0000";
      paymentField.style.borderRadius = "0px";
      paymentField.style.outline = "0px";
      paymentField.style.overflow = "overlay";
      paymentField.style.position = "absolute";
      paymentField.textContent = "Pay";
  
      const paymentInput = document.getElementsByClassName("paymentInput");
      if (paymentInput.length) {
        const p = paymentInput.length;
        paymentField.id = `pay${p + 1}`;
          } else {
              paymentField.id = "pay1";
          }
  
      paymentField.onclick = (e) => {
          e.stopPropagation();
          focuseddClassMaintain(e);
          if (e.ctrlKey) {
              copyInput("payment2");
          }
          handleClicked("payment2", "container2");
          setSidebar(true);
      };
  
      const linkHolder = document.createElement("div");
      linkHolder.className = "stripe_key";
      linkHolder.style.display = "none";
  
      const purposeHolder = document.createElement("div");
      purposeHolder.className = "paypal_id";
      purposeHolder.style.display = "none";
  
      holderDIVContainer.append(paymentField);
      holderDIVContainer.append(linkHolder);
      holderDIVContainer.append(purposeHolder);
    }
    if (typeOfOperationContainer !== 'CONTAINER_INPUT')
      containerField.append(holderDIVContainer);
  }

  containerField.ondrop = (event) => {
    const container = event.target;
    const containerRect = container.getBoundingClientRect();
    const typeOfOperationContainer = event.dataTransfer.getData('text/plain');

    const measureContainer = {
      width: '200px',
      height: '80px',
      left: event.clientX - containerRect.left + 'px',
      top: event.clientY - containerRect.top + 'px',
      auth_user: curr_user,
    };

    const holderDIVContainer = getHolderDIV(measureContainer);
    if (typeOfOperationContainer === 'DATE_INPUT') {
      let dateFieldContainer = document.createElement('div');
      dateFieldContainer.className = 'dateInput';
      dateFieldContainer.style.width = '100%';
      dateFieldContainer.style.height = '100%';
      dateFieldContainer.style.backgroundColor = '#0000';
      dateFieldContainer.style.borderRadius = '0px';
      dateFieldContainer.style.outline = '0px';
      dateFieldContainer.style.overflow = 'overlay';
      dateFieldContainer.style.position = 'relative';

      dateFieldContainer.onchange = (event) => {
        event.preventDefault();
        setPostData({
          ...postData,
          calenderField: {
            value: event.target.value,
            xcoordinate: getOffset(holderDIVContainer).left,
            ycoordinate: getOffset(holderDIVContainer).top,
          },
        });
      };
      setStartDate(new Date());
      setMethod('select');
      function dateClick() {
        document.getElementById('date_picker').click();
        setRightSideDateMenu(false);
      }
      dateFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('calendar2');
        }
        handleClicked('calendar2', 'container2');
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
      };
      dateFieldContainer.innerText = 'mm/dd/yyyy';

      holderDIVContainer.append(dateFieldContainer);
    } else if (typeOfOperationContainer === 'IMAGE_INPUT') {
      let imageFieldContainer = document.createElement('div');
      imageFieldContainer.className = 'imageInput';
      imageFieldContainer.style.width = '100%';
      imageFieldContainer.style.height = '100%';
      imageFieldContainer.style.backgroundColor = '#0000';
      imageFieldContainer.style.borderRadius = '0px';
      imageFieldContainer.style.outline = '0px';
      imageFieldContainer.style.overflow = 'overlay';
      imageFieldContainer.innerText = 'Choose Image';
      imageFieldContainer.style.position = 'relative';

      imageFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('image2');
        }
        handleClicked('image2');
        setSidebar(true);
      };

      const imageButtonContainer = document.createElement('div');
      imageButtonContainer.className = 'addImageButton';
      imageButtonContainer.innerText = 'Choose File';
      imageButtonContainer.style.display = 'none';

      const imgBtnContainer = document.createElement('input');
      imgBtnContainer.className = 'addImageButtonInput';
      imgBtnContainer.type = 'file';
      imgBtnContainer.style.objectFit = 'cover';
      var uploadedImage = '';

      imgBtnContainer.addEventListener('input', () => {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
          uploadedImage = reader.result;
          document.querySelector(
            '.focussed'
          ).style.backgroundImage = `url(${uploadedImage})`;
        });
        reader.readAsDataURL(imgBtnContainer.files[0]);
      });

      imageButtonContainer.append(imgBtnContainer);
      holderDIVContainer.append(imageFieldContainer);
      holderDIVContainer.append(imageButtonContainer);
    } else if (typeOfOperationContainer === 'DROPDOWN_INPUT') {
      let dropdownFieldContainer = document.createElement('div');
      dropdownFieldContainer.className = 'dropdownInput';
      dropdownFieldContainer.style.width = '100%';
      dropdownFieldContainer.style.height = '100%';
      dropdownFieldContainer.style.backgroundColor = '#0000';
      dropdownFieldContainer.style.borderRadius = '0px';
      dropdownFieldContainer.style.outline = '0px';
      dropdownFieldContainer.style.overflow = 'overlay';
      dropdownFieldContainer.style.position = 'absolute';

      const selectElement = document.createElement('select');
      selectElement.className = 'select-element';
      selectElement.style.width = '500';
      selectElement.style.height = 'auto';
      selectElement.onclick = () => {
        selectElement.parentElement.click();
      };

      dropdownFieldContainer.onchange = (event) => {
        event.preventDefault();
        setPostData({
          ...postData,
          dropdownFieldContainer: {
            value: event.target.value,
            xcoordinate: getOffset(holderDIVContainer).left,
            ycoordinate: getOffset(holderDIVContainer).top,
          },
        });
      };

      dropdownFieldContainer.onclick = (e) => {
        e.stopPropagation();
        table_dropdown_focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('dropdown2');
        }
        handleClicked('dropdown2');
        setRightSideDropDown(false);
        setSidebar(true);
      };

      const para = document.createElement('p');
      para.innerHTML = ' Dropdown Name';
      para.className = 'dropdownName';
      para.onclick = () => {
        para.parentElement.click();
      };
      dropdownFieldContainer.append(para);
      dropdownFieldContainer.append(selectElement);
      holderDIVContainer.append(dropdownFieldContainer);
    } else if (typeOfOperationContainer === 'TEXT_INPUT') {
      let inputFieldContainer = document.createElement('div');

      inputFieldContainer.setAttribute('contenteditable', true);
      inputFieldContainer.className = 'textInput';
      inputFieldContainer.innerHTML = 'Enter text here';
      inputFieldContainer.style.width = '100%';
      inputFieldContainer.style.height = '100%';
      inputFieldContainer.style.resize = 'none';
      inputFieldContainer.style.backgroundColor = '#0000';
      inputFieldContainer.style.borderRadius = '0px';
      inputFieldContainer.style.outline = '0px';
      inputFieldContainer.style.overflow = 'overlay';
      inputFieldContainer.style.position = 'relative';
      inputFieldContainer.style.cursor = 'text';
      if (inputFieldContainer.innerHTML[0]) {
        const editTextField = {
          editTextField: {
            value: inputFieldContainer.innerHTML,
            xcoordinate: getOffset(holderDIVContainer).left,
            ycoordinate: getOffset(holderDIVContainer).top,
          },
        };
      }

      if (inputFieldContainer.value !== '') {
      }

      inputFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('align2');
        }
        handleClicked('align2');
        setSidebar(true);
      };
      holderDIVContainer.append(inputFieldContainer);
    } else if (typeOfOperationContainer === 'SIGN_INPUT') {
      let signFieldContainer = document.createElement('div');
      signFieldContainer.className = 'signInput';
      signFieldContainer.style.width = '100%';
      signFieldContainer.style.height = '100%';
      signFieldContainer.style.backgroundColor = '#0000';
      signFieldContainer.style.borderRadius = '0px';
      signFieldContainer.style.outline = '0px';
      signFieldContainer.style.overflow = 'overlay';
      signFieldContainer.innerText = 'Signature here';
      signFieldContainer.style.position = 'absolute';

      signFieldContainer.onchange = (event) => {
        event.preventDefault();
        setPostData({
          ...postData,
          signFieldContainer: {
            value: event.target.value,
            xcoordinate: getOffset(holderDIVContainer).left,
            ycoordinate: getOffset(holderDIVContainer).top,
          },
        });
      };

      signFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('signs2');
        }
        handleClicked('signs2');
        setSidebar(true);
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
      holderDIVContainer.append(signFieldContainer);
      holderDIVContainer.append(imageSignButton);
    } else if (typeOfOperationContainer === 'IFRAME_INPUT') {
      let iframeFieldContainer = document.createElement('div');
      iframeFieldContainer.className = 'iframeInput';
      iframeFieldContainer.style.width = '100%';
      iframeFieldContainer.style.height = '100%';
      iframeFieldContainer.style.backgroundColor = '#dedede';
      iframeFieldContainer.style.borderRadius = '0px';
      iframeFieldContainer.style.outline = '0px';
      iframeFieldContainer.style.overflow = 'overlay';
      iframeFieldContainer.style.position = 'absolute';
      iframeFieldContainer.innerText = 'iFrame here';

      iframeFieldContainer.onclick = (e) => {
        e.stopPropagation();
        table_dropdown_focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('iframe2');
        }
        handleClicked('iframe2');
        setSidebar(true);
      };

      holderDIVContainer.append(iframeFieldContainer);
    } else if (typeOfOperationContainer === 'SCALE_INPUT') {
      setIsLoading(true);

      let scaleFieldContainer = document.createElement('div');
      scaleFieldContainer.className = 'scaleInput';
      scaleFieldContainer.style.width = '100%';
      scaleFieldContainer.style.height = '100%';
      scaleFieldContainer.style.backgroundColor = '#dedede';
      scaleFieldContainer.style.borderRadius = '0px';
      scaleFieldContainer.style.outline = '0px';
      scaleFieldContainer.style.overflow = 'overlay';
      // scaleFieldContainer.innerHTML = 'iframe';
      scaleFieldContainer.style.position = 'absolute';
      // scaleFieldContainer.innerText = "scale here";

      let scale = document.createElement('iframe');
      scaleFieldContainer.append(scale);
      Axios.post('https://100035.pythonanywhere.com/api/nps_settings_create/', {
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
      })
        .then((res) => {
          setIsLoading(false);
          // console.log(res.data, "scaleData");
          setScaleData(res.data);
          const success = res.data.success;
          var successObj = JSON.parse(success);
          const id = successObj.inserted_id;
          // console.log(res.scale_urls, "stateScale");
          if (id.length) {
            setScaleId(id);
          }
          scale.src = res.data.scale_urls;
        })
        .catch((err) => {
          setIsLoading(false);
          // console.log(err);
        });

      scaleFieldContainer.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('scale2');
        }
        handleClicked('scale2');
        setSidebar(true);
      };

      holderDIVContainer.append(scaleFieldContainer);
    } else if (typeOfOperationContainer === 'TABLE_INPUT') {
      let tableFieldContainer = document.createElement('div');
      tableFieldContainer.className = 'tableInput';
      tableFieldContainer.style.width = '100%';
      tableFieldContainer.style.height = '100%';
      tableFieldContainer.style.backgroundColor = '#dedede';
      tableFieldContainer.style.borderRadius = '0px';
      tableFieldContainer.style.outline = '0px';
      tableFieldContainer.style.overflow = 'overlay';
      tableFieldContainer.style.position = 'absolute';

      tableFieldContainer.onchange = (event) => {
        event.preventDefault();

        setPostData({
          ...postData,
          tableFieldContainer: {
            value: event.target.value,
            xcoordinate: getOffset(holderDIVContainer).left,
            ycoordinate: getOffset(holderDIVContainer).top,
          },
        });
      };

      tableFieldContainer.onclick = (e) => {
        e.stopPropagation();
        table_dropdown_focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('table2');
        }
        handleClicked('table2');
        setSidebar(true);
      };
      holderDIVContainer.append(tableFieldContainer);
    } else if (typeOfOperationContainer == 'BUTTON_INPUT') {
      let buttonField = document.createElement('button');
      buttonField.className = 'buttonInput';
      buttonField.style.width = '100%';
      buttonField.style.height = '100%';
      buttonField.style.backgroundColor = '#0000';
      buttonField.style.borderRadius = '0px';
      buttonField.style.outline = '0px';
      buttonField.style.overflow = 'overlay';
      buttonField.style.position = 'absolute';
      buttonField.textContent = 'Button';

      buttonField.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
          copyInput('button2');
        }
        handleClicked('button2', 'container2');
        setSidebar(true);
      };

      const linkHolder = document.createElement('div');
      linkHolder.className = 'link_holder';
      linkHolder.style.display = 'none';

      const purposeHolder = document.createElement('div');
      purposeHolder.className = 'purpose_holder';
      purposeHolder.style.display = 'none';

      // holderDIVContainer.append(dateFieldContainer);
      holderDIVContainer.append(buttonField);
      holderDIVContainer.append(linkHolder);
      holderDIVContainer.append(purposeHolder);
    } else if (typeOfOperationContainer == "PAYMENT_INPUT") {
      let paymentField = document.createElement("button");
      paymentField.className = "paymentInput";
      paymentField.style.width = "100%";
      paymentField.style.height = "100%";
      paymentField.style.backgroundColor = "#0000";
      paymentField.style.borderRadius = "0px";
      paymentField.style.outline = "0px";
      paymentField.style.overflow = "overlay";
      paymentField.style.position = "absolute";
      paymentField.textContent = "Pay";
  
      const paymentInput = document.getElementsByClassName("paymentInput");
      if (paymentInput.length) {
        const p = paymentInput.length;
        paymentField.id = `pay${p + 1}`;
          } else {
              paymentField.id = "pay1";
          }
  
      paymentField.onclick = (e) => {
          e.stopPropagation();
          focuseddClassMaintain(e);
          if (e.ctrlKey) {
              copyInput("payment2");
          }
          handleClicked("payment2", "container2");
          setSidebar(true);
      };
  
      const linkHolder = document.createElement("div");
      linkHolder.className = "stripe_key";
      linkHolder.style.display = "none";
  
      const purposeHolder = document.createElement("div");
      purposeHolder.className = "paypal_id";
      purposeHolder.style.display = "none";
  
      holderDIVContainer.append(paymentField);
      holderDIVContainer.append(linkHolder);
      holderDIVContainer.append(purposeHolder);
    }
    if (typeOfOperationContainer !== 'CONTAINER_INPUT')
      containerField.append(holderDIVContainer);
  };

  holderDIV.append(containerField);
  if (copy_data) {
    return holderDIV;
  } else {
    document
      .getElementsByClassName('midSection_container')
      [p - 1] // ?.item(0)
      ?.append(holderDIV);
  }
}
export default createContainerInputField;
