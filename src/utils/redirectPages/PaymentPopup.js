import React from 'react';
import './PaymentPopup.css';

const PaymentPopup = ({ url, onClose }) => {
    return (
        <div className="popup">
            <div className='popup-style'>
                <div className="popup-content">
                    <iframe title="Popup" src={url} width="100%" height="600" frameBorder="0" />
                    {/* <img src={url} alt='QRCode'/> */}

                    <button className="close-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>

        </div>
    );
};

export default PaymentPopup;