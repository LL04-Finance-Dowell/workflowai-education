import React, { useRef, useState } from 'react';
import './LeftMenu.css';
import { useStateContext } from '../../contexts/contextProvider';
import { useSearchParams } from 'react-router-dom';
import TextButton from './buttons/TextButton';
import ImageButton from './buttons/ImageButton';
import ContainerButton from './buttons/ContainerButton';
import SignsButton from './buttons/SignsButton';
import CalendarButton from './buttons/CalendarButton';
import DropdownButton from './buttons/DropdownButton';
import IframeButton from './buttons/IframeButton';
import TableButton from './buttons/TableButton';
import ScaleButton from './buttons/ScaleButton';
import ButtonButton from './buttons/ButtonButton';
import EmailButton from './buttons/EmailButton';
import NewScaleButton from './buttons/NewScaleButton';
import CameraButton from './buttons/CameraButton';
import { useDraggableContext } from '../../contexts/DraggableContext';
import PaymentButton from './buttons/PaymentButton';

const CustomButton = ({ children, style }) => (
  <button className={style} type='button'>
    {children}
  </button>
);

const LeftMenu = ({ showSidebar }) => {
  const leftMenuRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const { handleDrop, isFlipClicked, mode } = useStateContext();
  const { draggedItemType } = useDraggableContext();

  return (
    <>
      <div className={`${mode === 'preview' ? 'left_menu_preview_holder' : ''}`} >
        {isFlipClicked ? (
          isMobileView ? (
            <span>X</span>
          ) : (
              <div ref={leftMenuRef} className={`leftMenu fixed2 ${mode === 'preview' ? 'left_menu_preview_wrapper' : ''}`}>
              <div className={`leftMenu-title  ${mode === 'preview' ? 'vis_hid' : ''}`}><p>Components</p></div> 
              <TextButton customFunc={() => handleDrop('align')} />
              <ImageButton customFunc={() => handleDrop('image')} />
              <TableButton customFunc={() => handleDrop('table')} />
              <ContainerButton customFunc={() => handleDrop('container')} />
              <SignsButton customFunc={() => handleDrop('signs')} />
              <CalendarButton customFunc={() => handleDrop('calendar')} />
              <DropdownButton customFunc={() => handleDrop('dropdown')} />
              <IframeButton customFunc={() => handleDrop('iframe')} />
              {/* <ScaleButton customFunc={() => handleDrop("scale")} /> */}
              <ButtonButton customFunc={() => handleDrop('button')} />
              {/* <EmailButton customFunc={() => handleDrop("email")} /> */}
              <NewScaleButton customFunc={() => handleDrop('newScale')} />
              <CameraButton customFunc={() => handleDrop('camera')} />
              {/* <PaymentButton customFunc={() => handleDrop("payment")} /> */}
            </div>
          )
        ) : (
          <>
            <CustomButton style={'custom_reject_button'}>Reject</CustomButton>
            <CustomButton style={'custom_finalize_button'}>
              Finalize
            </CustomButton>
          </>
        )}
      </div>
    </>
  );
};

export default LeftMenu;
