import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import EditSection from '../components/editSection/EditSection';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const params = [];

    searchParams.forEach((value, key) => {
      params.push(`${key}`);
    });
    if (params.includes('status')) {
      navigate('/status');
    }
  }, [location]);

  const homeElem = document.getElementById('homeID');
  return (
    <div className="home" id="homeID">
      <div className="home_header fixed">
        <Header />
      </div>
      <div className="home_leftmenu">
        <EditSection homeElem={homeElem} />
      </div>

    </div>
  );
};

export default HomePage;
