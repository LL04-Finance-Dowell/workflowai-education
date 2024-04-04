import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import "./UserFinalizeReminderModal.css";

const UserFinalizeReminderModal = ({ showReminderModal, handleClose }) => {


  return (
    <>
{
  showReminderModal &&
  <div className="reminder-modal-overlay" onClick={handleClose}>
  <div className="reminder-modal-content" onClick={(e) => e.stopPropagation()}>
    <h2>Remember!</h2>
    <p>You need to add/edit document before finalizing.</p>
    <button className="reminder-close-btn" onClick={handleClose}>Okay</button>
  </div>
</div>
}
     
    </>
  );
}

export default UserFinalizeReminderModal;
