import React, { useEffect, useState } from 'react';
import { Row, Button, Form } from 'react-bootstrap';
import { useStateContext } from '../../contexts/contextProvider';
import { Link, useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios, * as others from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ThankYouPage from '../../utils/redirectPages/ThankYouPage';
import PaymentPopup from '../../utils/redirectPages/PaymentPopup';
import { stripeCurrencyCodes, paypalCurrencyCodes } from '../../data/data';

const PaymentRightSide = () => {
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
    setIsLoading,
    isLoading,
    paymentKey,
    setPaymentKey,
    data,
    pageNum,
    paypalId,
    setPaypalId,
    savedSripeKey,
    setSavedSripeKey,
    savedPaypalKey,
    setSavedPaypalKey,
    genSelOpt,
    setGenSelOpt,
  } = useStateContext();
  const [selectedType, setSelectedType] = useState('');
  const [addedAns, setAddedAns] = useState([]);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [selectPayment, setSelectPayment] = useState();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState();
  const [currencyCode, setCurrencyCode] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [stripePaymentData, setStripePaymentData] = useState({});
  const [paypalPaymentData, setPaypalPaymentData] = useState({});
  const [validated, setValidated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [popupUrl, setPopupUrl] = useState(null);
  const [showSlider, setShowSlider] = useState(false);
  const [qrCode, setQrCode] = useState();
  const [paypalQrCode, setPaypalQrCode] = useState();

  // const [stripeKey, setStripeKey] = useState("");
  const [paypalClientId, setPaypalClientId] = useState('');
  const [loader, setLoader] = useState(false);
  const [qrLoader, setQrLoader] = useState(false);
  var decoded = jwt_decode(token);

  const button = document.querySelector('.focussed');
  const holderDIV = document.querySelector('.focussedd');

  const finalizeButton = document.getElementById('finalize-button');
  const select = document.getElementById('selectt');
  const rejectButton = document.getElementById('reject-button');

  const purpose = holderDIV?.children[2]?.innerHTML;
  const link = holderDIV?.children[1]?.innerHTML;

  // useEffect(() => {
  //     localStorage.removeItem("stripeKey");
  //     localStorage.removeItem("stripePaymentId");
  // }, [])

  const MainURL = window.location.href;
  localStorage.setItem('MainURL', MainURL);
  const handleUpdate = () => {
    const link = document.getElementById('link').value;
    const purpose = document.getElementById('link2').value;
    if (link.value != '') {
      setPaymentKey(link);
      setSavedSripeKey((prev) => {
        return {
          ...prev,
          ['key']: link,
        };
      });

      const finalizeButton = document.getElementById("finalize-button");
      const select = document.getElementById("selectt");
      const rejectButton = document.getElementById("reject-button");

      const purpose = holderDIV?.children[2]?.innerHTML;
      const link = holderDIV?.children[1]?.innerHTML;



      // useEffect(() => {
      //     localStorage.removeItem("stripeKey");
      //     localStorage.removeItem("stripePaymentId");
      // }, [])

      const MainURL = window.location.href;
      localStorage.setItem("MainURL", MainURL);
      const handleUpdate = () => {

        const link = document.getElementById("link")?.value;
        const purpose = document.getElementById("link2")?.value;
        if (link?.value != "") {
          setPaymentKey(link);
          setSavedSripeKey(prev => {
            return {
              ...prev,
              ['key']: link
            }
          });

          holderDIV.children[1].innerHTML = link;
        }
        if (purpose?.value != "") {
          setPaypalId(purpose);

          setSavedPaypalKey(prev => {
            return {
              ...prev,
              ['key']: purpose,
            }
          });
          holderDIV.children[2].innerHTML = purpose;
        }


      };
      // if(decoded.details.action === "document"){
      // handleUpdate();
      // const Stripelink = document.querySelector(".stripe_key").innerHTML;
      // const Paypalpurpose = document.querySelector(".paypal_id").innerHTML;
      // if (Stripelink != "") {
      //     // setPaymentKey(link);
      //     setSavedSripeKey(prev => {
      //         console.log("Stripe link......")
      //         return {
      //             ...prev,
      //             ['key']: Stripelink
      //         }
      //     });

      //     // holderDIV.children[1].innerHTML = Stripelink;
      // }
      // if (Paypalpurpose!= "") {
      //     // setPaypalId(purpose);

      //     setSavedPaypalKey(prev => {
      //         return {
      //             ...prev,
      //             ['key']: Paypalpurpose
      //         }
      //     });
      //     // holderDIV.children[2].innerHTML = Paypalpurpose;
      // }

      // }





      const handleSelect = (event) => {
        let selectField = document.getElementById("selectt");
        const linkDiv = document.getElementById("website_link");
        const holderDIV = document.querySelector(".focussedd");

        let selectedOption = selectField.options[selectField.selectedIndex];

        setButtonPurpose(selectedOption?.value);
        holderDIV.children[2].innerHTML = selectedOption?.value;

        if (selectedOption?.value == "custom") {
          linkDiv.style.display = "block";
        } else if (selectedOption?.value !== "custom") {
          setButtonLink("");
        } else {
          console.log("No option selected");
        }
      };

      const removeButton = () => {
        document.querySelector(".focussedd").remove();
      };

      const handleBorderSizeChange = (e) => {
        setButtonBorderSize(e.target?.value);

        const box = document.getElementsByClassName("focussedd")[0];
        box.style.borderWidth = `${e.target?.value}px`;

      };

      const handleBorderColorChange = (e) => {
        setButtonBorderColor(e.target?.value);
        const box = document.getElementsByClassName("focussedd")[0];
        box.style.borderColor = `${e.target?.value}`;
      };
      const handleRangeBlur = (e) => {
        e.target.focus();
      };

      const handleSelectPayment = (e) => {
        setSelectPayment(e.target?.value);
      }
      if (purpose.value != '') {
        setPaypalId(purpose);

        setSavedPaypalKey((prev) => {
          return {
            ...prev,
            ['key']: purpose,
          };
        });
        holderDIV.children[2].innerHTML = purpose;
      }
    };
    // if(decoded.details.action === "document"){
    // handleUpdate();
    // const Stripelink = document.querySelector(".stripe_key").innerHTML;
    // const Paypalpurpose = document.querySelector(".paypal_id").innerHTML;
    // if (Stripelink != "") {
    //     // setPaymentKey(link);
    //     setSavedSripeKey(prev => {
    //         console.log("Stripe link......")
    //         return {
    //             ...prev,
    //             ['key']: Stripelink
    //         }
    //     });

    //     // holderDIV.children[1].innerHTML = Stripelink;
    // }
    // if (Paypalpurpose!= "") {
    //     // setPaypalId(purpose);

    //     setSavedPaypalKey(prev => {
    //         return {
    //             ...prev,
    //             ['key']: Paypalpurpose
    //         }
    //     });
    //     // holderDIV.children[2].innerHTML = Paypalpurpose;
    // }

    // }

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
        console.log('No option selected');
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

    const handleSelectPayment = (e) => {
      setSelectPayment(e.target.value);
    };

    const openPopup = (url) => {
      setPopupUrl(url);
    };

    const closePopup = () => {
      setPopupUrl(null);
    };

    const Base_URL = window.location.origin + '/' + '100058-DowellEditor-V2';

    const handleStripePayment = async (e) => {
      localStorage.removeItem('stripeKey');
      localStorage.removeItem('stripePaymentId');
      // e.preventDefault();
      const stripeData = {
        // stripe_key: "sk_test_51LiKUnEJkGNthfbzNbTn7Up7EnVwyeqRWLcRX1UWyq7ABL7wn1VMmHsS4Aox3U9b2nh3HkHd32vsQRR7nItC8ybv00WChhFen4",
        stripe_key: link,
        template_id: decoded.details._id,
        price: +price,
        product: productName,
        currency_code: currencyCode,
        callback_url: Base_URL + '/status',
      };
      // console.log("stripe data", stripeData);
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        setLoader(false);
      }
      setValidated(true);
      // setLoader(true)
      if (form.checkValidity() === true) {
        e.preventDefault();
        setLoader(true);
        try {
          const res = await axios.post(
            'https://100088.pythonanywhere.com/api/workflow/stripe/initialize',
            stripeData
          );
          setStripePaymentData(res.data);
          setSavedSripeKey((prev) => {
            return {
              ...prev,
              ['payment_id']: res.data.payment_id,
            };
          });
          // console.log("payment response", res.data);
          // setQrCode(resQR.data);
          // console.log("QR code response", resQR.data);
          setLoader(false);
          toast.success('Successfully Submitted!');
          // openPopup(resQR.data.qr_image_url)
          const timeout = setTimeout(() => {
            window.open(res.data.approval_url, '_blank');
            // openPopup(res.data.approval_url);
          }, 2000); // Wait for 2 seconds

          localStorage.setItem('stripePaymentId', res.data.payment_id);
          localStorage.setItem('stripeKey', link);
          const Stripelink = document.querySelector('.stripe_key').innerHTML;
          const Paypalpurpose = document.querySelector('.paypal_id').innerHTML;
          if (Stripelink != '') {
            // setPaymentKey(link);
            setSavedSripeKey((prev) => {
              console.log('Stripe link......');
              return {
                ...prev,
                ['key']: Stripelink,
              };
            });

            // holderDIV.children[1].innerHTML = Stripelink;
          }
          if (Paypalpurpose != '') {
            // setPaypalId(purpose);

            setSavedPaypalKey((prev) => {
              return {
                ...prev,
                ['key']: Paypalpurpose,
              };
            });
          }

          return () => clearTimeout(timeout);
        } catch (error) {
          console.log(error);
          setLoader(false);
          toast.error(error.response.data.message);
        }
      }
    };

    const handleStripeQRPayment = async (e) => {
      e.preventDefault();
      const stripeData = {
        // stripe_key: "sk_test_51LiKUnEJkGNthfbzNbTn7Up7EnVwyeqRWLcRX1UWyq7ABL7wn1VMmHsS4Aox3U9b2nh3HkHd32vsQRR7nItC8ybv00WChhFen4",
        stripe_key: link,
        template_id: decoded.details._id,
        price: +price,
        product: productName,
        currency_code: currencyCode,
        callback_url: Base_URL + '/status',
      };
      console.log('stripe data', stripeData);
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        setQrLoader(false);
      }
      setValidated(true);
      if (form.checkValidity() === true) {
        e.preventDefault();
        setQrLoader(true);
        try {
          const resQR = await axios.post(
            'https://100088.pythonanywhere.com/api/workflow/stripe/initialize/qrcode',
            stripeData
          );
          setQrCode(resQR.data);
          console.log('QR code response', resQR.data);
          setQrLoader(false);
          toast.success('Successfully Submitted!');
          openPopup(resQR.data.qr_image_url);
          // const timeout = setTimeout(() => {
          //     window.open(res.data.approval_url, '_blank');
          // }, 2000); // Wait for 2 seconds
          // return () => clearTimeout(timeout);

          console.log('QR code Response', resQR);

          localStorage.setItem('stripePaymentId', resQR.data.payment_id);
          localStorage.setItem('stripeKey', link);
          const Stripelink = document.querySelector('.stripe_key').innerHTML;
          const Paypalpurpose = document.querySelector('.paypal_id').innerHTML;
          if (Stripelink != '') {
            setSavedSripeKey((prev) => {
              console.log('Stripe link......');
              return {
                ...prev,
                ['key']: Stripelink,
              };
            });
          }
          if (Paypalpurpose != '') {
            setSavedPaypalKey((prev) => {
              return {
                ...prev,
                ['key']: Paypalpurpose,
              };
            });
          }
        } catch (error) {
          console.log(error);
          setQrLoader(false);
          toast.error(error.response.data.message);
        }
      }
    };

    //paypal payment

    const handlePaypalPayment = async (e) => {
      e.preventDefault();
      const paypalData = {
        // paypal_client_id: "AVJXJddOEG7WGrLkTzg4_9ODsDNhIHrqT4ZL6gwXRz1ftQELliYtticZH-kLjoYaTZfNn_8y5onH_YP3",
        paypal_client_id: purpose,
        paypal_secret_key:
          'ELsNyOGLDJVZCsfuuu5AhsFRmQbgBwxEVZteB-2XLZm8RLa8cPeS_cfNi35w7bJwkOKDHOnNxyHsJKu6',
        template_id: decoded.details._id,
        price: +price,
        product: productName,
        currency_code: currencyCode,
        callback_url: Base_URL + '/status',
      };
      console.log('paypal data', paypalData);
      setLoader(true);

      try {
        const res = await axios.post(
          'https://100088.pythonanywhere.com/api/workflow/paypal/initialize',
          paypalData
        );
        setLoader(true);
        setPaypalPaymentData(res.data);
        setLoader(false);
        console.log('paypal data', res.data);
        setPaypalId((prev) => {
          return {
            ...prev,
            ['payment_id']: res.data.payment_id,
          };
        });

        const timeout = setTimeout(() => {
          window.open(res.data.approval_url, '_blank');
          // openPopup(res.data.approval_url);
        }, 2000); // Wait for 2 seconds
        toast.success('Successfully Submitted!');

        localStorage.setItem('paypalPaymentId', res.data.payment_id);
        localStorage.setItem('paypalClientId', purpose);
        localStorage.setItem('paypalClientSecret', paypalData.paypal_secret_key);

        const Stripelink = document.querySelector('.stripe_key').innerHTML;
        const Paypalpurpose = document.querySelector('.paypal_id').innerHTML;
        if (Stripelink != '') {
          // setPaymentKey(link);
          setSavedSripeKey((prev) => {
            console.log('Stripe link......');
            return {
              ...prev,
              ['key']: Stripelink,
            };
          });

          // holderDIV.children[1].innerHTML = Stripelink;
        }
        if (Paypalpurpose != '') {
          // setPaypalId(purpose);

          setSavedPaypalKey((prev) => {
            return {
              ...prev,
              ['key']: Paypalpurpose,
              // ['secret_key']: "ELsNyOGLDJVZCsfuuu5AhsFRmQbgBwxEVZteB-2XLZm8RLa8cPeS_cfNi35w7bJwkOKDHOnNxyHsJKu6"
            };
          });
          // holderDIV.children[2].innerHTML = Paypalpurpose;
        }

        return () => clearTimeout(timeout);
      } catch (error) {
        console.log(error);
        setLoader(false);
        // toast.error(error.data.error);
      }
    };

    const handlePaypalQRPayment = async (e) => {
      localStorage.removeItem('paypalPaymentId');
      localStorage.removeItem('paypalClientId');
      localStorage.removeItem('paypalClientSecret');
      e.preventDefault();
      const paypalData = {
        // paypal_client_id: "AVJXJddOEG7WGrLkTzg4_9ODsDNhIHrqT4ZL6gwXRz1ftQELliYtticZH-kLjoYaTZfNn_8y5onH_YP3",
        paypal_client_id: purpose,
        paypal_secret_key:
          'ELsNyOGLDJVZCsfuuu5AhsFRmQbgBwxEVZteB-2XLZm8RLa8cPeS_cfNi35w7bJwkOKDHOnNxyHsJKu6',
        template_id: decoded.details._id,
        price: +price,
        product: productName,
        currency_code: currencyCode,
        callback_url: Base_URL + '/status',
      };
      console.log('paypal data', paypalData);
      setQrLoader(true);

      try {
        const res = await axios.post("https://100088.pythonanywhere.com/api/workflow/paypal/initialize/qrcode", paypalData)
        setQrLoader(true)
        setPaypalQrCode(res.data);
        setQrLoader(false)
        console.log("paypal data", res.data)
        toast.success("Successfully Submitted!");
        openPopup(res.data.qr_image_url);

        localStorage.setItem("paypalPaymentId", res.data.payment_id);
        localStorage.setItem("paypalClientId", purpose);
        localStorage.setItem("paypalClientSecret", paypalData.paypal_secret_key);


        const Stripelink = document.querySelector(".stripe_key").innerHTML;
        const Paypalpurpose = document.querySelector(".paypal_id").innerHTML;
        if (Stripelink != "") {
          // setPaymentKey(link);
          setSavedSripeKey(prev => {
            return {
              ...prev,
              ['key']: Stripelink
            }
          });

          // holderDIV.children[1].innerHTML = Stripelink;
        }
        if (Paypalpurpose != "") {
          // setPaypalId(purpose);

          setSavedPaypalKey(prev => {
            return {
              ...prev,
              ['key']: Paypalpurpose
            }
          });
          // holderDIV.children[2].innerHTML = Paypalpurpose;
        }

      } catch (error) {
        console.log(error)
        setQrLoader(false)
        // toast.error(error.data.error);
      }
    }

    useEffect(() => {
      const stripeKey = holderDIV.querySelector('.stripe_key').textContent
      const paypalId = holderDIV.querySelector('.paypal_id').textContent
      const idWrapper = document.getElementById('link2')
      const stripeWrapper = document.getElementById('link');

      if (idWrapper !== null) {
        idWrapper.value = paypalId

      }
      if (stripeWrapper !== null) {
        stripeWrapper.value = stripeKey

      }
    }, [])

    return (
      <>
        <div className='mt-2 mb-3 w-100'>
          <div className='sel_btn_wrapper'>
            <label htmlFor='btn_type' className='sel_label'>
              Select Button Type
            </label>
            <select
              className='gen_btn_sel'
              defaultValue='pay'
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

          <h3>Payment Settings</h3>
          <br />

          {decoded.details.action === 'template' ? (
            <div>
              <Form.Label>Paypal Client Id</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Paypal Client Id'
                // id="button_name"
                id='link2'
                // value={stripeKey}
                onChange={() => { }}
              />
              <br />
              <Form.Label>Stripe Key</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Stripe Key'
                // id="button_name"
                id='link'
                // value={stripeKey}
                onChange={() => { }}
              />
            </div>
          ) : (
            <div>
              <select
                onChange={handleSelectPayment}
                id='selectt'
                className='select border-0 bg-white rounded w-100 h-75 p-2'
              >
                <option value='stripe'>Stripe</option>
                <option value='paypal'>Paypal</option>
              </select>

              {selectPayment == 'paypal' ? (
                <div>
                  <Form noValidate validated={validated}>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      required
                      type='text'
                      placeholder='Product name'
                      id='button_name'
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />

                    <br />

                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      required
                      type='number'
                      placeholder='Product Price'
                      // id="button_name"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <br />
                    <select
                      required
                      onChange={(e) => setCurrencyCode(e.target.value)}
                      id='selectt'
                      // onChange={handleDateMethod}
                      className='select border-0 bg-white rounded w-100 h-75 p-2'
                    >
                      <option value=''>Select Currency</option>
                      {paypalCurrencyCodes.map((code) => (
                        <option value={code.code}>{code.currency}</option>
                      ))}
                    </select>
                    <br />

                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={handlePaypalPayment}
                    >
                      {loader ? 'Wait....' : 'Submit Info'}
                    </button>

                    <button
                      type='button'
                      className='btn btn-primary m-3'
                      onClick={handlePaypalQRPayment}
                    >
                      {qrLoader ? 'Wait....' : 'QR code'}
                    </button>
                  </Form>
                </div>
              ) : (
                <div>
                  <Form noValidate validated={validated}>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      required
                      type='text'
                      placeholder='Product name'
                      id='button_name'
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />

                    <br />

                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      required
                      type='number'
                      placeholder='Product Price'
                      // id="button_name"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <br />
                    <select
                      required
                      onChange={(e) => setCurrencyCode(e.target.value)}
                      id='selectt'
                      // onChange={handleDateMethod}
                      className='select border-0 bg-white rounded w-100 h-75 p-2'
                    >
                      <option value=''>Select Currency</option>
                      {stripeCurrencyCodes.map((code) => (
                        <option value={code.code}>{code.currency}</option>
                      ))}
                    </select>
                    {/* <Form.Label>Callback URL</Form.Label>
                                        <Form.Control
                                            required
                                            type="url"
                                            placeholder="Callback URL"
                                            // id="button_name"
                                            value={callbackUrl}
                                            onChange={(e) => setCallbackUrl(e.target?.value)}
                                        /> */}
                    <br />
                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={handleStripePayment}
                    >
                      {loader ? 'Wait....' : 'Submit Info'}
                    </button>
                    <button
                      type='button'
                      className='btn btn-primary m-3'
                      onClick={handleStripeQRPayment}
                    >
                      {qrLoader ? 'Wait....' : 'QR code'}
                    </button>
                  </Form>
                </div>
              )}
            </div>
          )}
        </div>

        {popupUrl && <PaymentPopup url={popupUrl} onClose={closePopup} />}

        {/* <img src={qrCode?.qr_image_url} alt="Qr code"/> */}

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

        <hr />
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
            Remove Payment Button
          </Button>
        </div>
        <ToastContainer size={5} />
      </>
    );
  }
}
  export default PaymentRightSide;
