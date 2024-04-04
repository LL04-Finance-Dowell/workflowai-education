import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import LeftMenu from '../leftMenu/LeftMenu';
import MidSection from '../midSection/MidSection.js';
import RightMenu from '../rightMenu/RightMenu';
import Footer from '../footer/Footer';

import './EditSection.css';
import { useStateContext } from '../../contexts/contextProvider';
export const editSec_midSec_ref = document.querySelector('.editSec_midSec');

const EditSection = () => {
  const {
    isClicked,
    sidebar,
    newToken,
    setNewToken,
    isFinializeDisabled,
    isLoading,
    setIsLoading,
    data,
    setIsMenuVisible,
    questionAndAnswerGroupedData,
    allowHighlight,
    mode,
    setSidebar,
  } = useStateContext();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  var decoded = jwt_decode(token);
  const { authorized, process_id } = decoded?.details;

  const newPageButton = document.querySelector('.new-page-btn');
  const actionName = decoded?.details?.action;
  const docMap = decoded?.details?.document_map;
  const documentFlag = decoded?.details?.document_flag;

  const [prevSelectedElement, setPrevSelectedElement] = useState(null);
  const [prevSelElmAns, setPrevSelElmAns] = useState([]);

  const selectedElement = document.querySelector('.focussedd div')?.id;

  useEffect(() => {
    const borderStyles = '2px solid red';

    if (!selectedElement || !allowHighlight) return;

    const questions = new Set();
    const answers = new Set();

    const updateAnsElmBorder = (items, border) => {
      items.forEach((item) => {
        if (!item) return;
        // if (!answers.has(item)) return;
        const element = document.getElementById(item);
        element.style.border = border;
      });
    };

    const data = [...questionAndAnswerGroupedData].map((elm) => {
      questions.add(elm.question);
      elm?.answers?.forEach((ans) => answers.add(ans));
      return elm;
    });

    const element = document.getElementById(selectedElement);
    if (!element) return;
    element.style.border = borderStyles;

    if (prevSelectedElement && prevSelectedElement !== selectedElement) {
      const prevElement = document.getElementById(prevSelectedElement);
      if (!prevElement) return;
      prevElement.style.border = 'none';
      updateAnsElmBorder(prevSelElmAns, 'none');
    }

    setPrevSelectedElement(selectedElement);
    const result = data.find((item) => item?.question === selectedElement);
    setPrevSelElmAns(result?.answers || []);

    if (questions.has(selectedElement)) {
      updateAnsElmBorder(result?.answers, borderStyles);
    }
  }, [questionAndAnswerGroupedData, selectedElement]);
  // }, [prevSelElmAns, prevSelectedElement, questionAndAnswerGroupedData, selectedElement]);

  useEffect(() => {
    if (!selectedElement) return;
    const elements = [
      ...document.querySelectorAll('.textInput'),
      ...document.querySelectorAll('.imageInput'),
      ...document.querySelectorAll(`.dateInput`),
      ...document.querySelectorAll(`.signInput`),
      ...document.querySelectorAll(`.tableInput`),
      ...document.querySelectorAll(`.containerInput`),
      ...document.querySelectorAll(`.iframeInput`),
      ...document.querySelectorAll(`.scaleInput`),
      ...document.querySelectorAll(`.newScaleInput`),
      ...document.querySelectorAll(`.cameraInput`),
      ...document.querySelectorAll(`.buttonInput`),
      ...document.querySelectorAll(`.dropdownInput`),
      ...document.querySelectorAll(`.emailButton`),
    ];

    elements.forEach((element) => {
      if (
        prevSelElmAns.indexOf(element.id) === -1 &&
        element.id !== selectedElement &&
        !allowHighlight
      ) {
        element.style.border = 'none';
        if (selectedElement) {
          document.getElementById(selectedElement).style.border =
            '1ps solid red';
        }
      } else {
        if (selectedElement) {
          document.getElementById(selectedElement).style.border =
            '1ps solid red';
        }
        return;
      }
    });
  }, [prevSelElmAns, selectedElement]);
  const left_menu_size = document
    .getElementsByClassName('left_menu_wrapper')[0]
    ?.getBoundingClientRect();

  useEffect(() => {
    const previewCanvas = document.querySelector('.preview-canvas');
    if (!previewCanvas) return;
    const allHolderDivs = [...previewCanvas.querySelectorAll('.holderDIV')];
    switch (mode) {
      case 'preview':
        setSidebar(false);
        allHolderDivs.forEach((div) => {
          div.style.border = 'none';
          div.style.pointerEvents = 'none';
        });
        break;

      default:
        allHolderDivs.forEach((div) => {
          div.style.border = '3px dotted gray';
          div.style.pointerEvents = 'auto';
        });
        return;
    }
  }, [mode]);

  return (
    <div className='editSec'>
      <Container fluid>
        <Row
          id='edit-container'
        >
          <Col
            lg={1}
            className={`${actionName == 'document' && 'document_left_col'}`}
          >
            {actionName == 'template' && (
              <div
                style={
                  mode === 'preview'
                    ? { background: '#e3eeff', overflow: 'hidden' }
                    : actionName == 'document'
                      ? { background: '#e3eeff' }
                      : { background: '#1c2b48' }
                }
                className={`left_menu_wrapper scrollbar ${mode === 'preview' ? "left_menu_preview":''}`}
              >
                <LeftMenu />
              </div>
            )}
          </Col>
          <Col
            // style={{marginTop:window.innerWidth< && left_menu_size?.height}}
            lg={sidebar ? 8 : 11}
            as='div'
            className={`editSec_midSec ${mode == "preview" ? "preview" : ""}`}
            id='editSec_midSec'
          >
            <div className='canvas-holder '>

              <MidSection />
            </div>
          </Col>

          {/* <div style={{overflowY:"scroll"}}>s */}
          <Col
            style={
              sidebar
                ? {
                  display: 'block',
                  // height:`${window.innerHeight}px`
                }
                : { display: 'none' }
            }
            lg={sidebar ? 3 : 0}
            as='div'
            className={`${mode === 'preview' ? 'vis_hid' : ''} editSec_rightMenu`}
          >
            <div className={`${mode === 'preview' ? 'vis_hid' : ''}`}

            >
              <RightMenu />
            </div>
          </Col>
          {/* </div> */}
        </Row>
      </Container>
      <div className='footer'>
        <Footer />
      </div>

    </div>
  );
};
export default EditSection;
