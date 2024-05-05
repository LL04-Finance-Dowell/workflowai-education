import copyInput from '../CopyInput';

// Regular JavaScript function to create a text input field
function createIframeElement( holderDIV, table_dropdown_focuseddClassMaintain, handleClicked, setSidebar,copy_data=false) {
    let iframeField = document.createElement("div");
        iframeField.className = "iframeInput";
        iframeField.style.width = "100%";
        iframeField.style.height = "100%";
        iframeField.style.backgroundColor = "#dedede";
        iframeField.style.borderRadius = "0px";
        iframeField.style.outline = "0px";
        iframeField.style.overflow = "overlay";
        iframeField.style.position = "absolute";
        
        if(copy_data){
          iframeField.innerHTML = copy_data;  
        }else{
          iframeField.innerText = "iFrame here";
        }

        const iframes = document.getElementsByClassName("iframeInput");
        if (iframes.length) {
          const i = iframes.length;
          iframeField.id = `ifr${i + 1}`;
        } else {
          iframeField.id = "ifr1";
        }

        iframeField.onclick = (e) => {
          // focuseddClassMaintain(e);
          e.stopPropagation();
          if (e.ctrlKey) {
            copyInput("iframe2");
          }
          table_dropdown_focuseddClassMaintain(e);
          // tableField.classList.add("focussed");
          handleClicked("iframe2", "container2");
          setSidebar(true);
        };

        holderDIV.append(iframeField);
        return holderDIV;
}
export default createIframeElement;