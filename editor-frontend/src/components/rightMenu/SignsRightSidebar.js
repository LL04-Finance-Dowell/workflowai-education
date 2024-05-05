import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Row, Button, Form } from "react-bootstrap";
import { useStateContext } from "../../contexts/contextProvider";
import { useSearchParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import useSelectedAnswer from '../../customHooks/useSelectedAnswers';


const SignsRightSidebar = () => {
  const [showSlider, setShowSlider] = useState(false);
  const {
    signState,
    setSignState,
    setIsFinializeDisabled,
    handleClicked,
    signBorderSize,
    setSignBorderSize,
    signBorderColor,
    setSignBorderColor,
    setConfirmRemove, confirmRemove,
    docMapRequired,
    currentSignElId
  } = useStateContext();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  var decoded = jwt_decode(token);
  const [selectedType, setSelectedType] = useState('')
  // const [addedAns, setAddedAns] = useState([])
  const { addedAns, setAddedAns } = useSelectedAnswer()

  let sigPad = useRef({});
  let data = "";

  const isRequired =
    docMapRequired?.find(
      (item) => document.querySelector(".focussed").id == item.content
    ) ? true : false;

  const clear = () => {
    const targetDiv = document.querySelector(".focussed") || document.querySelector(".focussedd");
    console.log('SIGN DIV BEFORE: ', targetDiv);
    if (targetDiv) {
      if (targetDiv.tagName.toLowerCase() === 'img') {
        targetDiv.remove();
      } else if (targetDiv?.querySelector('img')) {
        targetDiv.querySelector('img').remove();
      }
    }
    console.log('SIGN DIV AFTER: ', targetDiv);
    sigPad.current.clear();

  };

  const save = () => {
    data = sigPad.current.getTrimmedCanvas().toDataURL("image/png");

    setSignState({ trimmedDataURL: data });

    const signImage = `<img src=${data} />`;

    const sign = document.querySelector(".focussed")
    if (sign?.parentElement.classList.contains("focussedd")) {
      console.log("target: ", sign);
      if (document.querySelector(".focussed").innerHTML != signImage) {
        if (sign.parentElement.classList.contains("holderDIV")) {
          sign.parentElement.classList.add("element_updated")
        }

      }
      sign.innerHTML = signImage;
    } else {
      const newFocussedDiv = document.querySelector(".focussedd")
      if (newFocussedDiv?.innerHTML != signImage) {
        if (newFocussedDiv.classList.contains('signInput')) {
          newFocussedDiv.innerHTML = signImage
        }
      }
    }
  };

  //clicked choose file button
  const chooseFileClick = () => {
    const addImageButtonInput = document.getElementsByClassName("addSignButtonInput");
    addImageButtonInput.item(0).click();
    handleClicked("sign2", "table2");

  };


  function removeSign() {
    if (document.querySelector(".focussedd").classList.contains("dropp")) {
      if (document.querySelector(".focussedd").hasChildNodes()) {
        const childLength =
          document.querySelector(".focussedd").children.length;
        for (let i = 0; i < childLength; i++) {
          document.querySelector(".focussedd").firstElementChild.remove();
        }
      }
    } else {
      document.querySelector(".focussedd").remove();
    }
  }
  const handleUpdate = () => {
    const imageName = document.getElementById("image_name");
    const signFieldSpan = document.querySelector(".focussed .sign_text");
    if (imageName.value != "" && signFieldSpan) {
      signFieldSpan.textContent = imageName.value;
    }
  };

  const handleBorderSizeChange = (e) => {
    setSignBorderSize(e.target.value);

    const box = document.getElementsByClassName("focussedd")[0];
    box.style.borderWidth = `${e.target.value}px`;
  };

  const handleBorderColorChange = (e) => {
    setSignBorderColor(e.target.value);
    const box = document.getElementsByClassName("focussedd")[0];
    box.style.borderColor = `${e.target.value}`;
  };
  const handleRangeBlur = (e) => {
    e.target.focus();
  };

  return (
    <div>
      {decoded.details.action === "document" && (
        <>
          <h3>Add Signature</h3>
          <div>
            <div className="signature">
              <SignatureCanvas
                penColor="black"
                canvasProps={{
                  width: 200,
                  height: 200,
                  className: "sigCanvas",
                }}
                ref={sigPad}
              />
            </div>
            <div className="mt-5 text-left pt-1">
              <Button
                className="w-75"
                variant="secondary"
                onClick={(e) => chooseFileClick(e)}
              >
                Upload Sign
              </Button>
            </div>
            <div className="buttons p-4">
              <Button onClick={clear} variant="secondary">
                Clear
              </Button>{" "}
              &nbsp;
              <Button onClick={save} variant="primary">
                Done
              </Button>
            </div>
          </div>
          <hr />
        </>
      )}

      <div className="mt-2 mb-3 w-100">
        <h3>Signature Settings</h3>
        <Form.Label>Place Holder Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Signature Place Holder"
          id="image_name"
          onChange={() => { }}
        />
      </div>
      <div className="mt-2 text-center pt-5">
        <Button variant="secondary" className="px-5" onClick={handleUpdate}>
          Update Changes
        </Button>
      </div>
      <hr />
      <Row className="pt-4">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h6 style={{ marginRight: "10rem" }}>Border</h6>
          <label className="switch">
            <input type="checkbox" onClick={() => setShowSlider(!showSlider)} />
            <span className="slider round"></span>
          </label>
        </div>
        {showSlider && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#abab",
              gap: "10px",
              height: "40px",
              width: "90%",
            }}
          >
            <input
              type="color"
              value={signBorderColor}
              onChange={handleBorderColorChange}
              id="color"
              style={{ border: "none", width: "10%", height: "15px" }}
            />
            <input
              type="range"
              min="0"
              max="20"
              value={signBorderSize}
              onChange={handleBorderSizeChange}
              onBlur={handleRangeBlur}
              id="range"
              className="range-color"
            />
          </div>
        )}
      </Row>
      <hr />

      {/* <SelectAnsAndQuestion
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        setAddedAns={setAddedAns}
        addedAns={addedAns} />
      <hr /> */}

      <div className="mt-5 text-center">
        <Button
          variant="primary"
          // onClick={removeSign}
          onClick={() => setConfirmRemove(!confirmRemove)}
          className={
            decoded.details.action === "template"
              ? "remove_button"
              : "remove_button disable_button"
          }
        >
          Remove Signature
        </Button>
      </div>
    </div>
  );
};

export default SignsRightSidebar;
