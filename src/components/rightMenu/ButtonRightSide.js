import React, { useState, useEffect } from 'react';
import { Row, Button, Form } from 'react-bootstrap';
import { useStateContext } from '../../contexts/contextProvider';
import { useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import useSelectedAnswer from '../../customHooks/useSelectedAnswers';

const ButtonRightSide = () => {
  const {
    buttonLink,
    setButtonLink,
    buttonPurpose,
    setButtonPurpose,
    buttonBorderSize,
    setButtonBorderSize,
    buttonBorderColor,
    setButtonBorderColor,
    setConfirmRemove,
    confirmRemove,
    setGenSelOpt,
  } = useStateContext();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  var decoded = jwt_decode(token);
  const button = document.querySelector('.focussed');
  const holderDIV = document.querySelector('.focussedd');
  const finalizeButton = document.getElementById('finalize-button');
  const select = document.getElementById('selectt');
  const rejectButton = document.getElementById('reject-button');
  const purpose = holderDIV?.children[2]?.innerHTML;
  const link = holderDIV?.children[1]?.innerHTML;
  const [showSlider, setShowSlider] = useState(false);

  const [selectedType, setSelectedType] = useState('');

  const handleUpdate = () => {
    const btnName = document.getElementById('button_name');
    const button = document.querySelector('.focussed');

    if (btnName.value != '') {
      button.textContent = btnName.value;
    }

    const link = document.getElementById('link').value;
    if (link.value != '') {
      setButtonLink(link);
      holderDIV.children[1].innerHTML = link;
    }
  };

  const handleSelect = (event) => {
    let selectField = document.getElementById('selectt');
    const linkDiv = document.getElementById('website_link');
    const holderDIV = document.querySelector('.focussedd');

    let selectedOption = selectField.options[selectField.selectedIndex];

    setButtonPurpose(selectedOption.value);
    holderDIV.children[2].innerHTML = selectedOption.value;

    if (selectedOption.value == 'custom') {
      linkDiv.style.display = 'block';
    } else if (selectedOption.value !== 'custom') {
      setButtonLink('');
    } else {
    }
  };

  const removeButton = () => {
    document.querySelector('.focussedd').remove();
  };

  const handleBorderSizeChange = (e) => {
    setButtonBorderSize(e.target.value);

    const box = document.getElementsByClassName('focussedd')[0];
    box.style.borderWidth = `${e.target.value}px`;
  };

  const handleBorderColorChange = (e) => {
    setButtonBorderColor(e.target.value);
    const box = document.getElementsByClassName('focussedd')[0];
    box.style.borderColor = `${e.target.value}`;
  };
  const handleRangeBlur = (e) => {
    e.target.focus();
  };
  const { addedAns, setAddedAns } = useSelectedAnswer();

  // useEffect(() => {
  //   const holder = document.querySelector('.focussedd');
  //   if (holder.children[0].tagName.toLowerCase() === 'button') {
  //     const id = holder.children[0].id;
  //     setIniBtnId(id)
  //   }
  // }, [])

  useEffect(() => {
    const linkWrapper = document.getElementById('link');
    const btnName = document.getElementById('button_name');
    const select = document.getElementById('selectt');

    btnName.value = button.textContent ?? '';
    linkWrapper.value = link ?? '';
    select.selectedIndex =
      purpose === 'finalize'
        ? 1
        : purpose === 'reject'
        ? 2
        : purpose === 'custom'
        ? 3
        : 0;
  }, []);

  return (
    <>
      <div className='mt-2 mb-3 w-100'>
        <div className='sel_btn_wrapper'>
          <label htmlFor='btn_type' className='sel_label'>
            Select Button Type
          </label>
          <select
            className='gen_btn_sel'
            defaultValue='cta'
            onChange={(e) => setGenSelOpt(e.target.value)}
            style={{ marginBottom: '10px' }}
            id='btn_type'
          >
            <option value='' disabled>
              Select type
            </option>
            <option value='cta'>CTA</option>
            <option value='pay'>Pay</option>
            <option value='email'>Email</option>
          </select>
        </div>

        <h3>Button Settings</h3>
        <Form.Label>Button Name</Form.Label>
        <Form.Control
          type='text'
          placeholder='Button name'
          id='button_name'
          onChange={() => {}}
        />
      </div>

      <div className='sel_wrapper'>
        <label htmlFor='selectt' className='sel_label'>
          Button Purpose
        </label>

        <select
          onChange={handleSelect}
          id='selectt'
          // onChange={handleDateMethod}
          className='select border-0 bg-white rounded w-100 h-75 p-2'
        >
          <option value=''>Select</option>
          <option value='finalize'>Finalize</option>
          <option value='reject'>Reject</option>
          <option value='custom'>Custom</option>
        </select>
      </div>

      <div
        id='website_link'
        className='mt-5 mb-5 w-100'
        style={{ display: 'none' }}
      >
        <Form.Label>Website Link</Form.Label>
        <Form.Control
          type='text'
          placeholder='Website link'
          id='link'
          onChange={() => {}}
        />
      </div>
      <hr />
      <Row className='pt-4'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h6 style={{ marginRight: '10rem' }}>Border</h6>
          <label className='switch'>
            <input type='checkbox' onClick={() => setShowSlider(!showSlider)} />
            <span className='slider round'></span>
          </label>
        </div>
        {showSlider && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#abab',
              gap: '10px',
              height: '40px',
              width: '90%',
            }}
          >
            <input
              type='color'
              value={buttonBorderColor}
              onChange={handleBorderColorChange}
              id='color'
              style={{ border: 'none', width: '10%', height: '15px' }}
            />
            <input
              type='range'
              min='0'
              max='20'
              value={buttonBorderSize}
              onChange={handleBorderSizeChange}
              onBlur={handleRangeBlur}
              id='range'
              className='range-color'
            />
          </div>
        )}
      </Row>
      <hr />
      {/* <SelectAnsAndQuestion
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        setAddedAns={setAddedAns}
        addedAns={addedAns}
      />
      <hr /> */}
      <div className='mt-2 text-center pt-5'>
        <Button variant='secondary' className='px-5' onClick={handleUpdate}>
          Update Changes
        </Button>
      </div>

      <div className='mt-2 text-center pt-5'>
        <Button
          variant='primary'
          className={
            decoded.details.action === 'template'
              ? 'px-5 remove_button'
              : 'px-5 remove_button disable_button'
          }
          // onClick={removeButton}
          onClick={() => setConfirmRemove(!confirmRemove)}
        >
          Remove Button
        </Button>
      </div>
    </>
  );
};

export default ButtonRightSide;
