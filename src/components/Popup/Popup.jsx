import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setPopupIsOpen } from "../../features/app/appSlice";
import styles from "./Popup.module.css";

const Popup = ({ isOpen, message }) => {
  const dispatch = useDispatch();
  const { currentMessage } = useSelector((state) => state.app);

  return currentMessage ? (
    <div className={styles.outer_div}>
      <div className={styles.inner_div}>
        <div
          className={styles.close_btn}
          onClick={() => {
            dispatch(setPopupIsOpen(false));
          }}
        >
          <AiOutlineClose />
        </div>

        <h5 style={{ textAlign: "center" }}>{currentMessage}</h5>
      </div>
    </div>
  ) : (
    <div className={styles.outer_div}>
      <div className={styles.inner_div}>
        <div
          className={styles.close_btn}
          onClick={() => {
            dispatch(setPopupIsOpen(false));
          }}
        >
          <AiOutlineClose />
        </div>

        <h5 className={styles.error_msg}>
          {"An Error Occured while creating a Process"}
        </h5>
        <div className={styles.btn_div}>
          {/* <div
                        className={styles.danger_btn}
                        onClick={() => {
                            dispatch(setPopupIsOpen(false));

                        }}
                    >
                        Cancel
                    </div> */}
          <div
            className={styles.primry_btn}
            onClick={() => {
              dispatch(setPopupIsOpen(false));
            }}
          >
            Retry
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
