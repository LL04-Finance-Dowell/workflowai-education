import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import styles from './hoverCard.module.css';
import { Box } from './styledComponents';

const HoverCard = ({ Front, Back, loading, isFolder, id }) => {
  const { isNoPointerEvents } = useAppContext();
  return (
    <div key={id}>
      <div
        className={`${styles.container} ${isFolder ? styles.folder_shape : ''}`}
        style={isNoPointerEvents ? { pointerEvents: 'none' } : {}}
      >
        <Box className={`${styles.box}`}>
          <Front />
        </Box>
        <Box
          className={`${styles.box} ${styles.hover__box} 
        ${loading === true && styles.hover}`}
        >
          <Back />
        </Box>
      </div>
    </div>
  );
};

export default HoverCard;
