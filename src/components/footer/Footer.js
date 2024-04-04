import styles from "./Footer.module.css";
import { useState, useEffect } from "react";
import React from "react";
import { useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const Footer = () => {

    const [userDetails, setUserDetails] = useState({
        authorized: '',
        nextUser: '',
        prevUser: '',
    });
    const [display, setDisplay] = useState(false);


    const [searchParams] = useSearchParams();
    useEffect(() => {
        const token = searchParams.get('token');
        var decoded = jwt_decode(token);

        if (decoded?.details?.hasOwnProperty('document_map')) {
            setDisplay(true);
            setUserDetails({
                authorized: decoded?.details?.authorized ? decoded.details.authorized : '',
                nextUser: decoded?.details?.next_viewers ? decoded.details.next_viewers[0] : '',
                prevUser: decoded?.details?.previous_viewers ? decoded.details.previous_viewers[0] : '',
            });
        } else {
            setDisplay(false);

        }

    }, []);
    return (
        <div className={` ${display ? `${styles.footer_container}` : `${styles.hide}`} `}>
            <div>
                <h1>Previous User:</h1>
                <h2 className='details'>{userDetails.prevUser}</h2>
            </div>
            <div>
                <h1>Current User:</h1>
                <h2 className='details'>{userDetails.authorized}</h2>
            </div>
            <div>
                <h1>Next User:</h1>
                <h2 className='details'>{userDetails.nextUser}</h2>
            </div>
        </div>
    );
};

export default Footer;