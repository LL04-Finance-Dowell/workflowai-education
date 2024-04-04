// ImageModal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from '../../contexts/contextProvider';

import { useSearchParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const SocialMedia = ({ isOpen, onRequestClose }) => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    socialMediaImg,
    setSocialMediaImg
  } = useStateContext()

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  var decoded = jwt_decode(token);
  // console.log('Clicked image src:', socialMediaImg);

  // useEffect(() => {
  //   const handleStorageChange = (event) => {
  //     if (event.key === 'editor_social_img') {
  //       setData(event.newValue);
  //     }
  //   };

  //   // Add event listener for storage changes
  //   window.addEventListener('storage', handleStorageChange);

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, []);
  const fetchData = async () => {
    setLoading(true)
    try {
      const resp = await axios.get(`https://api.pexels.com/v1/search?query=${query}`, {
        headers: {
          Authorization: "Hl1vc1m448ZiRV4JJGGkPqxgMtZtQ99ttmzZq7XHyKiTBDvF20dYZZsY"
        }
      });

      console.log("\n>>>response", resp.data.photos)
      setImages(resp.data.photos);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally{
      setLoading(false);
      // setHaveData()

    }
  };

  useEffect(() => {
    if (decoded?.details?.cluster === 'socialmedia') {
    fetchData();
    }
  }, []);
  // useEffect(() => {
  //   localStorage.setItem("editor_social_img", socialMediaImg)
  // }, [socialMediaImg])


  // useEffect(() => {
  //   const handleStorageChange = (event) => {
      
  //     imgSrc.addEventListener("click", () => {
  //       setSocialMediaImg(imgSrc)

  //     })
  //   };

  //   window.addEventListener('storage', handleStorageChange);

  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, []);



  // useEffect(() => {
  //   const handleStorageChange = (event) => {
  //     const imgDtaaa = localStorage.getItem("editor_social_img")
  //     if (event.key === imgDtaaa) {
  //       setSocialMediaImg(socialMediaImg); // Set a default value if nothing is stored
  //     }
  //   };

  //   window.addEventListener('storage', handleStorageChange);

  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, []);




    const imgField = document.getElementById("i1");

  const handleImageClick = (event) => {
    console.log('Image clicked');

    const imgSrc = event.target.getAttribute('data-src');

    // console.log('Clicked image src:', imgSrc);
    setSocialMediaImg(imgSrc);
    localStorage.setItem('editor_social_img', imgSrc);
    console.log('Updated image source:', imgSrc);
    imgField.style.backgroundImage = `url(${imgSrc})`;
    imgField.innerText = " ";
    onRequestClose()
 
  };

  const onKeyDownHandler = (e) => {
    if(e.keyCode === 13) {
      fetchData()
    }
  }

  // useEffect(() => {
  //   console.log('Component re-rendered');
  //  setSocialMediaImg(socialMediaImg)
  // }, [socialMediaImg]);

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editor</h5>
            <button type="button" className="btn-close" onClick={onRequestClose}></button>
          </div>
          <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }} className='justify-center d-flex items-center'>
              <input 
              className="form-control mr-sm-2 mt-3" 
              style={{width: "400px"}} type="search" 
              placeholder="Search for photos" 
              aria-label="Search" 
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              onKeyDown={onKeyDownHandler}
              />
                <button className="btn btn-outline-primary mt-3" onClick={() => fetchData()}>Search</button>
          </div>
          {loading && <h2 className='text-center'>Loading.....</h2>}
          {
            query === "" ? <h2 className='text-center' style={{height: "90dvh", justifyContent: "center", display: "flex", alignItems: "center"}}>Search Image</h2> : <div className="modal-body">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.src.small}
                alt={img.photographer}
                className="img-fluid"
                style={{ cursor: 'pointer', margin: "10px" }}
                data-src={img.src.original}
                onClick={handleImageClick}
              />
            ))}
          </div>
          }
          
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
