import React, { useState } from 'react';
import copyInput from '../CopyInput';
import Axios from 'axios';
import createDateInputElement from './CreateDateElement.jsx';
import createImageElement from './CreateImageElement.jsx';
import createDropDownInputElement from './CreateDropDownElement.jsx';
import createTextElement from './CreateTextElement.jsx';
import createSignInputElement from './CreateSignElement.jsx';
import createIframeElement from './CreateIframeElement.jsx';
import createNewScaleInputElement from './CreateNewScaleElement.jsx';
import createGenBtnEl from './CreateGenBtnEl.js';
import CreatePyamentElement from './CreatePyamentElement.jsx';

const getContainerField = (focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded, setPostData, postData, getHolderDIV, getOffset, setStartDate, setMethod, setRightSideDateMenu, title, curr_user, containerHolder, setRightSideDropDown) => {
    let containerField = document.createElement("div");
    containerField.className = "container-section";
    containerField.id = "container-section";
    containerField.style.borderRadius = "0px";
    containerField.style.outline = "0px";
    containerField.style.overflow = "overlay";

    const placeholder = document.createElement('p');
    placeholder.className = 'placeholder'
    placeholder.textContent = 'Container';
    containerField.append(placeholder);

    const mutationConfig = { childList: true };

    const mutationObserver = new MutationObserver(entries => {
        if (entries[entries.length - 1].removedNodes.length && !entries[0].target.children.length)
            containerField.append(placeholder);
    })

    mutationObserver.observe(containerField, mutationConfig)

    const container = document.getElementsByClassName("container-section");
    if (container.length) {
        const h = container.length;
        containerField.id = `c${h + 1}`;
    } else {
        containerField.id = "c1";
    }
    containerField.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);
        if (e.ctrlKey) {
            copyInput("container2");
        }
        handleClicked("container2");
        setSidebar(true);
        console.log("container field clicked");
    };
    containerField.ondragover = (e) => {
        console.log("console from container dragover", e.target);
        if (e.ctrlKey) {
            copyInput("container2");
        }
    };
    containerField.ondrop = (event) => {
        if (containerField.children[0].classList.contains('placeholder')) containerField.removeChild(containerField.children[0])
        const parentId = containerField.id
        const container = event.target;
        const containerRect = container.getBoundingClientRect();
        const typeOfOperationContainer = event.dataTransfer.getData("text/plain");
        const measureContainer = {
            width: "200px",
            height: "80px",
            left: event.clientX - containerRect.left + "px",
            top: event.clientY - containerRect.top + "px",
            auth_user: curr_user,
        };

        const holderDIVContainer = getHolderDIV(measureContainer);
        holderDIVContainer.style.width = '100%';
        holderDIVContainer.style.height = '100%';
        holderDIVContainer.style.position = 'relative';
        holderDIVContainer.style.top = '0';
        holderDIVContainer.style.left = '0';
        holderDIVContainer.classList.add('container-element');
        holderDIVContainer.addEventListener('drag', (e) => null);

        if (typeOfOperationContainer === "DATE_INPUT") {
            createDateInputElement(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, setRightSideDateMenu, setPostData, setStartDate, setMethod);
        } else if (typeOfOperationContainer === "IMAGE_INPUT") {
            createImageElement(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar);
        } else if (typeOfOperationContainer === "DROPDOWN_INPUT") {
            createDropDownInputElement(holderDIVContainer,handleClicked,setSidebar,table_dropdown_focuseddClassMaintain,setRightSideDropDown, getOffset );       
        } else if (typeOfOperationContainer === "TEXT_INPUT") {
            createTextElement(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, getOffset);
        } else if (typeOfOperationContainer === "SIGN_INPUT") {
            createSignInputElement(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, setPostData, getOffset);
        } else if (typeOfOperationContainer === "IFRAME_INPUT") {
            createIframeElement(holderDIVContainer, table_dropdown_focuseddClassMaintain, handleClicked, setSidebar)
        } else if (typeOfOperationContainer === "SCALE_INPUT") {
            createNewScaleInputElement(holderDIVContainer,focuseddClassMaintain,handleClicked,setSidebar,table_dropdown_focuseddClassMaintain,decoded,setIsLoading);
        }else if (typeOfOperationContainer == "BUTTON_INPUT") {
            createGenBtnEl(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar);
        } else if (typeOfOperationContainer == "PAYMENT_INPUT") {
            CreatePyamentElement(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar)
        }
        if (typeOfOperationContainer !== "CONTAINER_INPUT")
            containerHolder.replaceChild(holderDIVContainer, containerField);
    };
    return containerField
};

function createContainerInputElement(holderDIV, focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded, setPostData, postData, getHolderDIV, getOffset, setStartDate, setMethod, setRightSideDateMenu, title, curr_user, setRightSideDropDown) {
    holderDIV.style.width = 'auto';
    holderDIV.style.height = 'auto';
    holderDIV.style.left = '0px';
    holderDIV.style.right = '0px';
    holderDIV.style.minWidth = '270px';
    holderDIV.style.minHeight = '100px';
    const containerHolder = document.createElement("div");
    const containerHolderHeader = document.createElement("div");
    containerHolder.className = 'containerHolder'
    containerHolder.classList.add('containerInput')
    containerHolderHeader.className = 'container-add-button-wrapper'
    let addButton = document.createElement("p");
    addButton.innerHTML = `+`
    addButton.className = 'container_add-button'
    addButton.addEventListener('click', (e) => {
        const containerField = getContainerField(focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded, setPostData, postData, getHolderDIV, getOffset, setStartDate, setMethod, setRightSideDateMenu, title, curr_user, containerHolder,setRightSideDropDown)
        containerHolder.append(containerField);
    });
    containerHolderHeader.append(addButton);
    containerHolder.append(containerHolderHeader);
    const containerField = getContainerField(focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded, setPostData, postData, getHolderDIV, getOffset, setStartDate, setMethod, setRightSideDateMenu, title, curr_user, containerHolder,setRightSideDropDown)
    containerHolder.append(containerField);
    holderDIV.append(containerHolder);
    return holderDIV;
};

export default createContainerInputElement;