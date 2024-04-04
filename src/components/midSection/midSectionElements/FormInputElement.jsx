import copyInput from '../CopyInput';
import { toast } from 'react-toastify';
import { sendEmail } from '../sendEmail';


// Regular JavaScript function to create a text input field
function createFormInputField(
  id,
  element,
  p,
  holderDIV,
  focuseddClassMaintain,
  handleClicked,
  setSidebar,
  decoded=null
) {
  let isAnyRequiredElementEdited = false;
  let buttonField = document.createElement('button');
  buttonField.className = 'emailButton';
  buttonField.id = id;
  buttonField.style.width = '100%';
  buttonField.style.height = '100%';
  buttonField.style.backgroundColor = '#0000';
  buttonField.style.borderRadius = '0px';
  buttonField.style.outline = '0px';
  buttonField.style.overflow = 'overlay';
  buttonField.style.position = 'absolute';
  buttonField.style.borderWidth = element.data;
  buttonField.textContent = element.data;

  const emailDataHolder = document.createElement('div');
  emailDataHolder.className = 'emailDataHolder_holder';
  emailDataHolder.style.display = 'none';

  const emailSenderDataHolder = document.createElement('div');
  emailSenderDataHolder.className = 'emailSenderDataHolder_holder';
  emailSenderDataHolder.style.display = 'none';
  emailSenderDataHolder.innerText = element.emailData;

  const emailRecipientDataHolder = document.createElement('div');
  emailRecipientDataHolder.className = 'emailRecipientDataHolder_holder';
  emailRecipientDataHolder.style.display = 'none';

  emailDataHolder.append(emailSenderDataHolder);
  emailDataHolder.append(emailRecipientDataHolder);
  buttonField.onclick = (e) => {
    if (buttonField.innerText === 'Send mail') {
      if (
        emailSenderDataHolder.innerText &&
        emailSenderDataHolder.innerText !== '' &&
        emailRecipientDataHolder.innerText &&
        emailRecipientDataHolder.innerText !== ''
      ) {
        const formData = JSON.parse(emailSenderDataHolder.innerText);
        const receiverData = JSON.parse(emailRecipientDataHolder.innerText);
        if (
          formData.fromName !== '' ||
          formData.fromEmail !== '' ||
          formData.subject !== '' ||
          receiverData.toEmail !== '' ||
          receiverData.toName !== ''
        ) {
          const emailData = {
            toemail: receiverData.toEmail,
            toname: receiverData.toName,
            fromname: formData.fromName,
            subject: formData.subject,
            fromemail: formData.fromEmail,
            email_content: decoded,
          };
          try {
            sendEmail(emailData, buttonField, setSidebar);
          } catch (error) {
            console.log(error);
            toast.error('Please ensure all required data is submitted');
          }
        }
      } else {
        toast.error('Please ensure all required data is submitted');
      }
    } else {
      focuseddClassMaintain(e);
      if (e.ctrlKey) {
        copyInput('email2');
      }
      handleClicked('email2');
    }

    setSidebar(true);
  };
  holderDIV.append(buttonField);
  holderDIV.append(emailDataHolder);
  document
    .getElementsByClassName('midSection_container')
  [p - 1] // ?.item(0)
    ?.append(holderDIV);
}
export default createFormInputField;

