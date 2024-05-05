import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useStateContext } from "../contexts/contextProvider";
import { useCutMenuContext } from "./midSection/cutMenuHook";


const RemoveElmentModal = ({ handleRemoveInput, targetEl}) => {
  const { setConfirmRemove, setSidebar } = useStateContext()
  let targetElement = document.querySelector(".focussedd")
  if (targetEl) targetElement = targetEl;
  let componentType;
  const find_class_name = true;
  switch (find_class_name) {
    case targetElement.querySelector('.tableInput') && true:
      componentType = 'Table Component';
      break;
    case targetElement.querySelector('.containerInput') && true:
      componentType = 'Container Component';
      break;
    case targetElement.querySelector('.dateInput') && true:
      componentType = 'Date Component';
      break;
    case targetElement.querySelector('.signInput') && true:
      componentType = 'Sign Component';
      break;
    case targetElement.querySelector('.textInput') && true:
      componentType = 'Text Component';
      break;
    case targetElement.querySelector('.imageInput') && true:
      componentType = 'Image Component';
      break;
    case targetElement.querySelector('.iframeInput') && true:
      componentType = 'Iframe Component';
      break;
    case targetElement.querySelector('.scaleInput') && true:
      componentType = 'Scale Component';
      break;
    case targetElement.querySelector('.newScaleInput') && true:
      componentType = 'New Scale Component';
      break;
    case targetElement.querySelector('.buttonInput') && true:
      componentType = 'Button Component';
      break;
    case targetElement.querySelector('.dropdownInput') && true:
      componentType = 'Dropdown Component';
      break;
  
    case targetElement.querySelector('.cameraInput') && true:
      componentType = 'Camera Component';
      break;
    default:
      componentType = '';
  }
  return (
    <div
      // className="modal show"
      className="modal-container"
    // style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog style={{ width: '100%' }}>
        <Modal.Header
        >
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to remove {componentType} ?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setConfirmRemove(false)         
          }}>No</Button>
          <Button variant="primary" className="modal-confirm-remove" onClick={() => {
            if (handleRemoveInput) {
              handleRemoveInput()
            } else {
              // document.querySelector(".focussedd")?.remove();
            }
            setConfirmRemove(false)
            setSidebar(false)
          }}>yes</Button>
        </Modal.Footer>
      </Modal.Dialog>
      {/* </Modal> */}

    </div>
  );
}

export default RemoveElmentModal;
