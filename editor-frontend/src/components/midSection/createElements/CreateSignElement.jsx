import React, { useState } from 'react';
import copyInput from '../CopyInput';
import icon from '../../../assets/icons/sign.svg'


// Regular JavaScript function to create a text input field
function createSignInputElement(holderDIV, focuseddClassMaintain, handleClicked, setSidebar, setPostData, getOffset, copy_data=false) {
    holderDIV.style.minHeight = '70px';

    let signField = document.createElement("div");
    signField.className = "signInput";
    signField.style.width = "100%";
    signField.style.height = "100%";
    signField.style.backgroundColor = "#0000";
    signField.style.borderRadius = "0px";
    signField.style.outline = "0px";
    signField.style.overflow = "overlay";

    // signField.innerText = "";
    signField.style.position = "absolute";

    const span2 = document.createElement('span');
    span2.className = 'sign_text';
    if(copy_data){
        span2.textContent = copy_data;
    }else{
        span2.textContent = "Signature here";
    }
    span2.style.color = '#737272';

    const span = document.createElement('span');
    span.className = 'icon_wrapper';
    span.innerHTML = `<img src='${icon}'/>`;

    signField.append(span2)
    signField.append(span)
    const signIn = document.getElementsByClassName("signInput");
    if (signIn.length) {
        const h = signIn.length;
        signField.id = `s${h + 1}`;
    } else {
        signField.id = "s1";
    }

    signField.onchange = (event) => {
        event.preventDefault();
        setPostData({
            ...postData,
            signField: {
                value: event.target.value,
                xcoordinate: getOffset(holderDIV).left,
                ycoordinate: getOffset(holderDIV).top,
            },
        });
    };

    signField.onclick = (e) => {
        e.stopPropagation();
        focuseddClassMaintain(e);

        if (e.ctrlKey) {
            copyInput("signs2");
        }
        handleClicked("signs2", "container2");
        setSidebar(true);
    };
    const imageSignButton = document.createElement("div");
    imageSignButton.className = "addImageSignButton";
    imageSignButton.innerText = "Choose File";
    imageSignButton.style.display = "none";

    const signBtn = document.createElement("input");
    signBtn.className = "addSignButtonInput";
    signBtn.type = "file";
    signBtn.style.objectFit = "cover";
    var uploadedImage = "";

    signBtn.addEventListener("input", () => {
        const reader = new FileReader();
        try {
            reader.addEventListener("load", () => {
                if (!reader.result) {
                    setSidebar(false);
                    return;
                }
                uploadedImage = reader.result;
                const signImage = `<img src=${uploadedImage} width="100%" height="100%"/>`;
                if (document.querySelector(".focussed")) {
                    document.querySelector(".focussed").innerHTML = signImage
                } else if (document.querySelector(".focussedd")) {
                    const target = document.querySelector(".focussedd");
                    if (target.classList.contains('signInput')) {
                        target.innerHTML = signImage
                    }
                };
                setSidebar(true);
            });
            reader.readAsDataURL(signBtn.files[0]);

        } catch (error) {
            console.log("FAILED TO UPLOAD:", error);
            setSidebar(true);

        }

    });

    imageSignButton.append(signBtn);

    holderDIV.append(signField);
    holderDIV.append(imageSignButton);
    return holderDIV;
}
export default createSignInputElement;