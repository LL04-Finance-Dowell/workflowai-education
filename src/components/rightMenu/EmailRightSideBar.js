/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Row, Button } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { useStateContext } from '../../contexts/contextProvider';
import useSelectedAnswer from '../../customHooks/useSelectedAnswers';

const EmailRightSideBar = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  var decoded = jwt_decode(token);
  const actionName = decoded?.details?.action;

  const mailBtn = document.querySelector('.focussed');

  const {
    formBorderSize,
    setFormBorderSize,
    formBorderColor,
    setFormBorderColor,
    setConfirmRemove,
    confirmRemove,
    genSelOpt,
    setGenSelOpt,
  } = useStateContext();
  const [selectedType, setSelectedType] = useState('');
  // const [addedAns, setAddedAns] = useState([])
  const { addedAns, setAddedAns } = useSelectedAnswer();

  const [showSlider, setShowSlider] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    toEmail: '',
    toName: '',
    fromName: '',
    fromEmail: '',
    subject: '',
  });

  const handleBorderSizeChange = (e) => {
    setFormBorderSize(e.target.value);

    const box = document.getElementsByClassName('focussedd')[0];
    box.style.borderWidth = `${e.target.value}px`;
  };

  const handleBorderColorChange = (e) => {
    setFormBorderColor(e.target.value);
    const box = document.getElementsByClassName('focussedd')[0];
    box.style.borderColor = `${e.target.value}`;
  };
  const handleRangeBlur = (e) => {
    e.target.focus();
  };
  const handleSaveRecipientData = () => {
    if (!isChecked) {
      const targetEmailDiv = document.querySelector('.focussedd');
      const emailField = targetEmailDiv.querySelector('.emailButton');
      if (formData.toEmail == '' || formData.toName == '') {
        toast.error('Please provide required data');
        setIsChecked(false);
        emailField.innerText = 'Configure Mail';
      } else {
        const emailDataDiv = targetEmailDiv.querySelector(
          '.emailDataHolder_holder'
        );
        const receiverDataDiv = emailDataDiv.querySelector(
          '.emailRecipientDataHolder_holder'
        );
        const data = JSON.stringify(formData);
        receiverDataDiv.innerText = data;
        emailField.innerText = 'Send mail';
      }
    }
  };
  const handleSaveSenderData = (e) => {
    e.preventDefault();
    const targetEmailDiv = document.querySelector('.focussedd');
    if (targetEmailDiv) {
      const emailDataDiv = targetEmailDiv.querySelector(
        '.emailDataHolder_holder'
      );
      const senderDataDiv = emailDataDiv.querySelector(
        '.emailSenderDataHolder_holder'
      );
      const data = JSON.stringify(formData);
      senderDataDiv.innerText = data;
      toast.success('Email configured successfully');
    }
  };

  return (
    <>
      {actionName === 'template' && (
        <div className='sel_btn_wrapper'>
          <label htmlFor='btn_type' className='sel_label'>
            Select Button Type
          </label>
          <select
            className='gen_btn_sel'
            defaultValue='email'
            onChange={(e) => setGenSelOpt(e.target.value)}
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
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '500px',
          padding: '5%',
          border: '1px solid #000',
          margin: '20px',
        }}
      >
        <form id='myForm' onSubmit={handleSaveSenderData}>
          {actionName === 'document' && (
            <div
              style={{
                display: 'flex',
                flexFlow: 'column nowrap',
                gap: '1rem',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <label
                style={{
                  fontWeight: '600',
                }}
                htmlFor='toName'
              >
                To name
              </label>
              <input
                type='text'
                name='toName'
                placeholder='Enter Name'
                value={formData.toName}
                style={{ width: '100%', padding: '5px' }}
                onChange={(e) => {
                  setFormData((prev) => {
                    const { name, value } = e.target;
                    return {
                      ...prev,
                      [name]: value,
                    };
                  });
                }}
                required
              />
              <label
                style={{
                  fontWeight: '600',
                }}
                htmlFor='toName'
              >
                To email
              </label>
              <input
                type='email'
                name='toEmail'
                placeholder='Enter email'
                value={formData.toEmail}
                style={{ width: '100%', padding: '5px' }}
                onChange={(e) => {
                  setFormData((prev) => {
                    const { name, value } = e.target;
                    return {
                      ...prev,
                      [name]: value,
                    };
                  });
                }}
                required
              />

              <div
                className='sender-checkbox'
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  width: '100%',
                  gap: '1em',
                }}
              >
                <p
                  style={{
                    height: '0.8rem',
                  }}
                >
                  Finalize
                </p>
                <input
                  type='checkbox'
                  checked={isChecked}
                  onChange={handleSaveRecipientData}
                  onClick={() => {
                    setIsChecked(!isChecked);
                  }}
                />
              </div>
            </div>
          )}
          {actionName === 'template' && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <input
                  type='text'
                  name='fromName'
                  placeholder='From Name'
                  value={formData.fromName}
                  style={{ width: '48%', padding: '5px' }}
                  onChange={(e) => {
                    setFormData((prev) => {
                      const { name, value } = e.target;
                      return {
                        ...prev,
                        [name]: value,
                      };
                    });
                  }}
                  required
                />
                <input
                  type='email'
                  name='fromEmail'
                  placeholder='From Email'
                  value={formData.fromEmail}
                  style={{ width: '48%', padding: '5px' }}
                  onChange={(e) => {
                    setFormData((prev) => {
                      const { name, value } = e.target;
                      return {
                        ...prev,
                        [name]: value,
                      };
                    });
                  }}
                  // onChange={handleChange}
                  required
                />
              </div>
              <input
                type='text'
                name='subject'
                placeholder='Subject'
                value={formData.subject}
                style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                onChange={(e) => {
                  setFormData((prev) => {
                    const { name, value } = e.target;
                    return {
                      ...prev,
                      [name]: value,
                    };
                  });
                }}
                required
              />
              

              <button
                type='submit'
                style={{
                  marginBottom: '10px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  width: '100%',
                }}
                onClick={handleSaveSenderData}
              >
                Save Details
              </button>
            </>
          )}
        </form>
        <ToastContainer size={5} />
      </div>
      {actionName === 'template' && (
        <>
          <hr />
          <Row className='pt-4'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h6 style={{ marginRight: '10rem' }}>Border</h6>
              <label className='switch'>
                <input
                  type='checkbox'
                  onClick={() => setShowSlider(!showSlider)}
                />
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
                  value={formBorderColor}
                  onChange={handleBorderColorChange}
                  id='color'
                  style={{ border: 'none', width: '10%', height: '15px' }}
                />
                <input
                  type='range'
                  min='0'
                  max='20'
                  value={formBorderSize}
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
          /> */}
          <hr />
          <div className='d-flex justify-content-center'>
            <Button
              variant='primary'
              // onClick={removeContainer}
              onClick={() => setConfirmRemove(!confirmRemove)}
              className='remove_container text-center mt-5'
            >
              Remove Container
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default EmailRightSideBar;
