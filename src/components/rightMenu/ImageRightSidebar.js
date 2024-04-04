import React, { useRef, useState } from "react";
import { Row, Button, Form } from "react-bootstrap";
import { useStateContext } from "../../contexts/contextProvider";
import { useSearchParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import useSelectedAnswer from '../../customHooks/useSelectedAnswers';


const ImageRightSidebar = () => {
  var {
    setIsFinializeDisabled,
    handleClicked,
    setSidebar,
    borderSize,
    setBorderSize,
    borderColor,
    setBorderColor,
    setConfirmRemove, confirmRemove
  } = useStateContext();

  const [selectedType, setSelectedType] = useState('')
  // const [addedAns, setAddedAns] = useState([])

  const { addedAns, setAddedAns } = useSelectedAnswer()

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  var decoded = jwt_decode(token);

  const [file, setFile] = useState(null);

  const [showSlider, setShowSlider] = useState(false);

  const addImageButtonInput = useRef(null);

  var uploadedImage = "";

  //clicked choose file button
  const chooseFileClick = (e) => {
    e.stopPropagation();
    const imageDiv = document.querySelector(".focussedd");

    // console.log('imageDiv: ', imageDiv);

    if (imageDiv) {
      const addImageButtonInput = imageDiv.getElementsByClassName(
        "addImageButtonInput"
      );
      addImageButtonInput.item(0).click();
      // imageDiv.firstElementChild.innerText = "";

      handleClicked("image2", "table2");

      const removalbeFocussedDiv = document.getElementsByClassName("focussed");
      if (removalbeFocussedDiv) {
        for (let i = 0; i < removalbeFocussedDiv.length; i++) {
          removalbeFocussedDiv[i].classList.remove("focussed");
        }
      }

      while (imageDiv) {
        if (imageDiv.classList.contains("holderDIV")) {
          imageDiv.classList.add("focussedd");
          imageDiv.firstElementChild.classList.add("focussed");
          break;
        } else {
          imageDiv = imageDiv.parentElement;
        }
      }

      if (imageDiv && imageDiv.parentElement.classList.contains("holderDIV")) {
        imageDiv.parentElement.classList.add("element_updated");
      }
    }
  };


  const handleUpdate = () => {
    const imageName = document.getElementById("image_name");
    const imgFieldSpan = document.querySelector(".focussed .img_text");
    // console.log(imgFieldSpan);
    if (imageName.value != "" && imgFieldSpan) {
      imgFieldSpan.textContent = imageName.value;
    }
  };

  const removeImage = () => {
    const imageDiv = document.querySelector(".focussedd");
    if (imageDiv) {
      if (imageDiv.classList.contains("dropp") && imageDiv.hasChildNodes()) {
        while (imageDiv.firstChild) {
          imageDiv.removeChild(imageDiv.firstChild);
        }
      } else {
        imageDiv.remove();
      }
    }
  };

  const handleBorderSizeChange = (e) => {
    setBorderSize(e.target.value);

    const box = document.getElementsByClassName("focussedd")[0];
    box.style.borderWidth = `${e.target.value}px`;
  };

  const handleBorderColorChange = (e) => {
    setBorderColor(e.target.value);
    const box = document.getElementsByClassName("focussedd")[0];
    box.style.borderColor = `${e.target.value}`;
  };
  const handleRangeBlur = (e) => {
    e.target.focus();
  };

  return (
    <>
      <div className="mt-2 mb-3 w-100">
        <h3>Image Settings</h3>
        <Form.Label>Place Holder Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Image Place Holder"
          id="image_name"
          onChange={() => { }}
        />
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
              value={borderColor}
              onChange={handleBorderColorChange}
              id="color"
              style={{ border: "none", width: "10%", height: "15px" }}
            />
            <input
              type="range"
              min="0"
              max="20"
              value={borderSize}
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
      <div className="mt-2 text-center pt-5">
        <Button variant="secondary" className="px-5" onClick={handleUpdate}>
          Update Changes
        </Button>
      </div>
      <div className="mt-5 text-center pt-1">
        <Button
          className="w-75"
          variant="secondary"
          onClick={(e) => chooseFileClick(e)}
        >
          Choose Image
        </Button>
      </div>
      <div className="mt-5 text-center pt-1">
        <Button
          className={
            decoded.details.action === "template"
              ? "w-7 remove_button"
              : "w-7 remove_button disable_button"
          }
          variant="primary"
          // onClick={removeImage}
          onClick={() => setConfirmRemove(!confirmRemove)}
        >
          Remove Image
        </Button>
      </div>
    </>
  );
};

export default ImageRightSidebar;
