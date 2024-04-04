import React, { useState } from 'react';
import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createFormInputElement(
  holderDIV,
  focuseddClassMaintain,
  handleClicked,
  setSidebar
) {
  let buttonField = document.createElement('button');
  buttonField.className = 'emailButton';
  buttonField.style.width = '100%';
  buttonField.style.height = '100%';
  // buttonField.style.backgroundColor = "#0000";
  buttonField.style.borderRadius = '0px';
  buttonField.style.outline = '0px';
  buttonField.style.overflow = 'overlay';
  buttonField.style.position = 'absolute';
  buttonField.type = 'submit';
  buttonField.textContent = 'Configure Mail';
  buttonField.style.backgroundColor = '#007bff';
  buttonField.style.color = '#fff';
  // buttonField.style.border = "none";
  buttonField.style.padding = '10px 20px';
  buttonField.style.margin = '0 auto';
  buttonField.style.border = '1px solid #0000';

  const emailC = document.getElementsByClassName('emailButton');
  if (emailC.length) {
    const e = emailC.length;
    buttonField.id = `eml${e + 1}`;
  } else {
    buttonField.id = 'eml1';
  }

  // add form container to the document
  document.body.appendChild(buttonField);

  buttonField.onclick = (e) => {
    e.stopPropagation();
    focuseddClassMaintain(e);
    if (e.ctrlKey) {
      copyInput('email2');
    }
    handleClicked('email2', 'container2');
    setSidebar(true);
  };

  const linkHolder = document.createElement('div');
  linkHolder.className = 'link_holder';
  linkHolder.style.display = 'none';

  const purposeHolder = document.createElement('div');
  purposeHolder.className = 'purpose_holder';
  purposeHolder.style.display = 'none';

  const emailDataHolder = document.createElement('div');
  emailDataHolder.className = 'emailDataHolder_holder';
  emailDataHolder.style.display = 'none';

  const emailSenderDataHolder = document.createElement('div');
  emailSenderDataHolder.className = 'emailSenderDataHolder_holder';
  emailSenderDataHolder.style.display = 'none';

  const emailRecipientDataHolder = document.createElement('div');
  emailRecipientDataHolder.className = 'emailRecipientDataHolder_holder';
  emailRecipientDataHolder.style.display = 'none';

  emailDataHolder.append(emailSenderDataHolder);
  emailDataHolder.append(emailRecipientDataHolder);

  holderDIV.append(buttonField);
  holderDIV.append(emailDataHolder);
  holderDIV.append(linkHolder);
  holderDIV.append(purposeHolder);

  // * This loop is to trigger rightside bar to update to the recently selected btn type
  let x = true;
  while (x) {
    buttonField.click();
    x = false;
  }
}
export default createFormInputElement;
