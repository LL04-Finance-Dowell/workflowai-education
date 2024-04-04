import React, { useEffect, useState } from 'react';
import { Row, Button, Form } from "react-bootstrap";

import { useStateContext } from '../../contexts/contextProvider';

import { useSearchParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
// import SelectAnsAndQuestion from '../selectAnsAndQuestion';
import useSelectedAnswer from '../../customHooks/useSelectedAnswers';


const IframeRightSidebar = () => {
  const { setSidebar, handleClicked,docMapRequired, setIsFinializeDisabled, iframeBorderSize, setIframeBorderSize, iframeBorderColor, setIframeBorderColor, setConfirmRemove, confirmRemove } =
    useStateContext();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const isRequired =
    docMapRequired?.find(
      (item) => document.querySelector(".focussed").id == item.content
    ) ? true : false;

  var decoded = jwt_decode(token);


  const [showSlider, setShowSlider] = useState(false);
  const [selectedType, setSelectedType] = useState('')
  const [isWindowHightSmall, setIsWindowHightSmall] = useState(false);

  // const [addedAns, setAddedAns] = useState([])
  const { addedAns, setAddedAns } = useSelectedAnswer()

  const makeIframe = () => {
    var iframeDiv = document.querySelector('.focussed');
    var iframe = document.createElement('iframe');
    const height = document.getElementById('iframe_height').value;
    const width = document.getElementById('iframe_width').value;
    iframe.id = 'iframe';
    iframe.src = document.getElementById('iframe_src').value;
    iframe.height = height ? height : "100%";
    iframe.width = width ? width : "100%";

    iframeDiv.appendChild(iframe);
    //setIsFinializeDisabled(false)
    if (iframeDiv.parentElement.classList.contains('holderDIV') && isRequired) {
      iframeDiv.parentElement.classList.add('element_updated');
      // // console.log('iframe.parentElement', iframeDiv.parentElement);
    }
  };
  function handleChange() {
    document.querySelector('.focussed').innerHTML = '';
  }

  function removeIframe() {
    document.querySelector('.focussedd').remove();
  }

  const handleBorderSizeChange = (e) => {
    setIframeBorderSize(e.target.value);

    const box = document.getElementsByClassName("focussedd")[0];
    box.style.borderWidth = `${e.target.value}px`;

  };

  const handleBorderColorChange = (e) => {
    setIframeBorderColor(e.target.value);
    const box = document.getElementsByClassName("focussedd")[0];
    box.style.borderColor = `${e.target.value}`;

  };
  const handleRangeBlur = (e) => {
    e.target.focus();
  };

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const elementHight = document.querySelector(".align");
    if (elementHight) {
      if (elementHight.offsetHeight > windowHeight) {
        setIsWindowHightSmall(true);
      }
    }
  }, []);

  return (
    <>
      <div
      className="align"
        style={{
          height: isWindowHightSmall && `${window.innerHeight - 100}px`,
          overflowY: isWindowHightSmall && `auto`,
          overflowX: "hidden",
        }}
      >

        <div>
          <h3>Iframe Settings</h3>
          <Form.Label>Website Link</Form.Label>
          <Form.Control
            type="text"
            placeholder="Website link"
            id="iframe_src"
            onChange={handleChange}
          />
        </div>

        <div>
          <h6 className="pt-4">Iframe Size</h6>
          <Form.Label>Enter Height</Form.Label>
          <Form.Control
            type="number"
            // disabled
            placeholder=""
            min="1"
            id="iframe_height"
            className="shadow bg-white rounded mb-4"
          />

          <Form.Label>Enter width</Form.Label>

          <Form.Control
            type="number"
            placeholder=""
            // disabled
            min="1"
            id="iframe_width"
            className="shadow bg-white rounded mb-4"
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
            <div style={{ display: "flex", alignItems: "center", backgroundColor: "#abab", gap: "10px", height: "40px", width: "90%" }}>
              <input
                type="color"
                value={iframeBorderColor}
                onChange={handleBorderColorChange}
                id="color"
                style={{ border: "none", width: "10%", height: "15px" }}
              />
              <input
                type="range"
                min="0"
                max="20"
                value={iframeBorderSize}
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
        <div className="mt-2 text-center pt-3 d-flex gap-2 mb-5">
          <Button variant="secondary" className="px-5" onClick={makeIframe}>
            Create Iframe
          </Button>
          <Button
            variant="primary"

            className={decoded.details.action === "template" ? "px-5 remove_button" : "px-5 remove_button disable_button"}
            // onClick={removeIframe}
            onClick={() => setConfirmRemove(!confirmRemove)}
          >
            Remove Iframe
          </Button>
        </div>

        {/* <div className="mt-2 text-center pt-5">
          <Button
            variant="primary"

            className={decoded.details.action === "template" ? "px-5 remove_button" : "px-5 remove_button disable_button"}
            // onClick={removeIframe}
            onClick={() => setConfirmRemove(!confirmRemove)}
          >
            Remove Iframe
          </Button>
        </div> */}

      </div>

    </>
  );
};

export default IframeRightSidebar;
