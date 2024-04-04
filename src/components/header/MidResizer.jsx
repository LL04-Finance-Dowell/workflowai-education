import React, { useState, useRef, useEffect } from 'react';
import { FaMobileAlt, FaTabletAlt, FaLaptop } from 'react-icons/fa';
import { BsCaretDown, BsCaretUp } from 'react-icons/bs';
import { useStateContext } from '../../contexts/contextProvider';
import './midResizer.css';
import { resizePreview } from '../../utils/responsived-design/responsive';
import { renderPreview } from '../midSection/MidSection';

const MidResizer = () => {
  const [isDrop, setIsDrop] = useState(false);
  const [selOpts] = useState(['large', 'mid']);
  const [selOpt, setSelOpt] = useState('large');

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const handleSelOpt = (opt) => {
    setSelOpt(opt);
    // if (window.scrollY === 0) {
    //   setIsDrop(false);
    //   // isCompsScaler || setIsCompsScaler(true);
    // } else {
    //   window.scrollTo(0, 0);
    //   window.onscroll = () => {
    //     if (window.scrollY === 0) {
    //       setSelOpt(opt);
    //       setIsDrop(false);
    //       // isCompsScaler || setIsCompsScaler(true);
    //       // window.onscroll = null;
    //     }
    //   };
    // }
  };

  useEffect(() => {
    const containerEl = containerRef.current;
    const contentEl = contentRef.current;
    if (containerEl && contentEl) {
      if (isDrop)
        containerEl.style.height =
          contentEl.getBoundingClientRect().height + 'px';
      else containerEl.style.height = '0px';
    }
  }, [isDrop, containerRef, contentRef]);
  useEffect(() => {
   if(selOpt === 'large') renderPreview()
   if(selOpt === 'mid')resizePreview() 

    console.log(selOpt);
  }, [selOpt]);

  return (
    <div className='mid_resizer'>
      {/* <div
        className={`sel_opt ${isDrop ? 'drop' : ''}`}
        onClick={() => setIsDrop(!isDrop)}
      >
        <span className='opt_icon'>
          {selOpt === 'large' ? (
            <FaLaptop />
          ) :
            <FaTabletAlt />
          }
        </span>
        {selOpt}{' '}
        {<span className='drop_icon'>
          {isDrop ? <BsCaretUp /> : <BsCaretDown />}
        </span>}
      </div>

      <div className='drop_container' ref={containerRef}>
        <ul className='drop_opts' ref={contentRef}>
          {selOpts.map((opt) => (
            <li
              className={`drop_opt ${opt === selOpt ? 'sel' : ''}`}
              key={opt}
              onClick={() => handleSelOpt(opt)}
            >
              <span className='opt_icon'>
                {opt === 'large' ? (
                  <FaLaptop />
                ) :
                  <FaTabletAlt />
                }
              </span>
              {opt}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default MidResizer;
