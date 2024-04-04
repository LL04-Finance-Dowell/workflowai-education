import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa'
import './shareDocModle.css'
import { useStateContext } from '../../contexts/contextProvider';

const ShareDocModal = ({
    openModal, toName, setToName, toEmail, setToEmail,
    froName, setFroName, froEmail, setFroEmail, subject,
    setSubject, handleShare
}) => {
    const {
        pendingMail,
        setPendingMail
    } = useStateContext()
    console.log("pending mail", pendingMail);
    return (
        <section className='modal_sect'>
            <div className="modal-content-share">
                <div className='email-close-button'>
                    <span className="close" onClick={() => openModal(false)}>&times;</span>
                </div>
                <h2 className='text-center'>Share Document</h2>
                <Container fluid>
                    <form className='justify-content-center share-form'>
                        <Row>
                            <Col>
                                <label>
                                    To Name:
                                    <input type="text" className='form-control share-input' value={toName} onChange={(e) => setToName(e.target.value)} />
                                </label>
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <label>
                                    To Email:
                                    <input type="email" className='form-control share-input' value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <label>
                                    From Name:
                                    <input type="text" className='form-control share-input ' value={froName} onChange={(e) => setFroName(e.target.value)} />
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <label>
                                    From Email:
                                    <input type="email" className='form-control share-input' value={froEmail} onChange={(e) => setFroEmail(e.target.value)} />
                                </label>
                            </Col>
                        </Row>

                        <Row>
                            <Col className='w-100'>
                                <label>
                                    Subject:
                                    <input type="text" className='share-input form-control w-full' value={subject} onChange={(e) => setSubject(e.target.value)} />
                                </label>
                            </Col>
                        </Row>
                        <div className="w-full justify-items-center">

                        <Button className='remove_button share-btn text-white mt-2' type="button" onClick={handleShare}>{pendingMail ? "Sending" : "Share"}</Button>
                        </div>


                    </form>
                </Container>

            </div>
        </section>

    )
}

export default ShareDocModal