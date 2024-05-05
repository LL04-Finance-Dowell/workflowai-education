import copyInput from '../CopyInput';
import createDateInputElement from '../createElements/CreateDateElement.jsx';
import createDropDownInputElement from '../createElements/CreateDropDownElement.jsx';
import createGenBtnEl from '../createElements/CreateGenBtnEl.js';
import createIframeElement from '../createElements/CreateIframeElement.jsx';
import createImageElement from '../createElements/CreateImageElement.jsx';
import createNewScaleInputElement from '../createElements/CreateNewScaleElement.jsx';
import CreatePyamentElement from '../createElements/CreatePyamentElement.jsx';
import createSignInputElement from '../createElements/CreateSignElement.jsx';
import createTextElement from '../createElements/CreateTextElement.jsx';
import createButtonInputField from './ButtonInputElement.jsx';
import createDateInputField from './DateInputElement.jsx';
import createDropDownInputField from './DropDownInputElement.jsx';
import createIframeInputField from './IframeInputElement.jsx';
import createImageInputField from './ImageInputElement.jsx';
import createPaymentInputField from './PaymentInputElement.jsx';
import createScaleInputField from './ScaleInputElement.jsx';
import createSignInputField from './SignInputElement.jsx';
import createTextInputField from './TextInputElement.jsx';


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
            width: "100%",
            height: "100%",
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
            createDropDownInputElement(holderDIVContainer, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, setRightSideDropDown, getOffset);
        } else if (typeOfOperationContainer === "TEXT_INPUT") {
            createTextElement(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, getOffset);
        } else if (typeOfOperationContainer === "SIGN_INPUT") {
            createSignInputElement(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, setPostData, getOffset);
        } else if (typeOfOperationContainer === "IFRAME_INPUT") {
            createIframeElement(holderDIVContainer, table_dropdown_focuseddClassMaintain, handleClicked, setSidebar)
        } else if (typeOfOperationContainer === "SCALE_INPUT") {
            createNewScaleInputElement(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded, setIsLoading);
        } else if (typeOfOperationContainer == "BUTTON_INPUT") {
            createGenBtnEl(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar);
        } else if (typeOfOperationContainer == "PAYMENT_INPUT") {
            CreatePyamentElement(holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar)
        }
        if (typeOfOperationContainer !== "CONTAINER_INPUT")
            containerHolder.replaceChild(holderDIVContainer, containerField);
    };
    return containerField
};

const renderContainerItems = (
     element,
    containerHolder,
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
    setRightSideDropDown,
    copy_data = false
) => {
   const document_map_required =false;
    for (let p = 0; p < element.data.length; p++) {
        const containerElement = element.data[p];
         console.log('\n>>>>>Container Data\n',containerElement,'\n>>>>>>>>>>>ELEMENT\n',element.height);
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
        let holderDIVContainer = getHolderDIV(measureContainer);
        // holderDIVContainer.style.width = '100%';
        // holderDIVContainer.style.height = '100%';
        holderDIVContainer.style.position = 'relative';
        holderDIVContainer.style.top = '0';
        holderDIVContainer.style.left = '0';
        holderDIVContainer.classList.add('container-element');
        holderDIVContainer.addEventListener('drag', (e) => null);
        const id  = element.id
        console.log(holderDIVContainer);
        if (typeOfOperationContainer === "DATE_INPUT") {
            createDateInputField(id, containerElement, document_map_required, p, holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, setRightSideDateMenu, setMethod, setStartDate);
        } else if (typeOfOperationContainer === "IMAGE_INPUT") {
            createImageInputField(id, containerElement, document_map_required, p, holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar);
        } else if (typeOfOperationContainer === "DROPDOWN_INPUT") {
            createDropDownInputField(id, containerElement, p, holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded, setRightSideDropDown, setDropdownName);
        } else if (typeOfOperationContainer === "TEXT_INPUT") {
            createTextInputField(id, containerElement, document_map_required, p, holderDIVContainer,focuseddClassMaintain,handleClicked,setSidebar);
        } else if (typeOfOperationContainer === "SIGN_INPUT") {
            createSignInputField(id, containerElement, p, holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, document_map_required);
        } else if (typeOfOperationContainer === "IFRAME_INPUT") {
            createIframeInputField(id, containerElement, p, holderDIVContainer, table_dropdown_focuseddClassMaintain, handleClicked, setSidebar);
        } else if (typeOfOperationContainer === "SCALE_INPUT") {
            createScaleInputField(id, containerElement, p, holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded);
        } else if (typeOfOperationContainer == "BUTTON_INPUT") {
            createButtonInputField(id, containerElement, p, holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, finalizeButton, rejectButton, decoded, document_map_required);
        } else if (typeOfOperationContainer == "PAYMENT_INPUT") {
            createPaymentInputField(id, containerElement, p, holderDIVContainer, focuseddClassMaintain, handleClicked, setSidebar, finalizeButton, rejectButton, decoded, document_map_required)
        }

        if(containerElement?.data == "Container"){
            holderDIVContainer = getContainerField(focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded, setPostData, postData, getHolderDIV, getOffset, setStartDate, setMethod, setRightSideDateMenu, title, curr_user, containerHolder, setRightSideDropDown)
        }
        if (typeOfOperationContainer !== 'CONTAINER_INPUT')
        {
          containerHolder.append(holderDIVContainer);
        };
                // return containerHolder;
    }
}
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
    setRightSideDropDown,
    copy_data = false
    )
{
    // holderDIV.style.width = 'auto';
    // holderDIV.style.height = 'auto';
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
        const containerField = getContainerField(focuseddClassMaintain, handleClicked, setSidebar, table_dropdown_focuseddClassMaintain, decoded, setPostData, postData, getHolderDIV, getOffset, setStartDate, setMethod, setRightSideDateMenu, title, curr_user, containerHolder, setRightSideDropDown)
        containerHolder.append(containerField);
    });
    containerHolderHeader.append(addButton);
    containerHolder.append(containerHolderHeader);
    if (copy_data) {
        element.data = copy_data;
        containerHolder.id = `c` + (parseInt(id[1]) + 1)
    }
    console.log("\nCT ELEM\n\n", element, "\n\n\n")

   renderContainerItems(
        element,
        containerHolder,
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
   )

    holderDIV.append(containerHolder);

    if (copy_data) {
        return holderDIV;
    } else {
        document
            .getElementsByClassName('midSection_container')
        [p - 1] // ?.item(0)
            ?.append(holderDIV);
    }
    return holderDIV;
};

export default createContainerInputField;