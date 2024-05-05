import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createButtonInputElement(
  holderDIV,
  focuseddClassMaintain,
  handleClicked,
  setSidebar
) {
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

  const buttonIn = document.getElementsByClassName('buttonInput');
  if (buttonIn.length) {
    const d = buttonIn.length;
    buttonField.id = `btn${d + 1}`;
  } else {
    buttonField.id = 'btn1';
  }

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

  holderDIV.append(buttonField);
  holderDIV.append(linkHolder);
  holderDIV.append(purposeHolder);

  // * This loop is to trigger rightside bar to update to the recently selected btn type
  let x = true;
  while (x) {
    buttonField.click();
    x = false;
  }
  return holderDIV;
}
export default createButtonInputElement;
