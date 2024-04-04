import React from 'react'
import { Container } from 'react-bootstrap'
import { FaTimes } from 'react-icons/fa'
import './rejectionModal.css'

const RejectionModal = ({ openModal, handleReject, setMsg, msg }) => {
 return (
  <section className="reject_modal_sect">
   <div className="main_wrapper">
    <h3 className="reject_heading">Why are you rejecting?
     <button className="close_btn" onClick={() => openModal(false)}><FaTimes /></button>
    </h3>
    <textarea placeholder='Enter reasons here' className='msg_box' value={msg} onChange={e => setMsg(e.target.value)}></textarea>
    <button className="done_btn" onClick={handleReject}>Done</button>
   </div>
  </section>
 )
}

export default RejectionModal