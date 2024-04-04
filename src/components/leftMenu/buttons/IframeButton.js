import React from "react";
import { BsCodeSquare } from "react-icons/bs";
import { useDraggableContext } from "../../../contexts/DraggableContext";

const IframeButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext();
  const dragStartIframe = (e) => {
    e.dataTransfer.setData("text/plain", "IFRAME_INPUT");
    setDraggedItemType("IFRAME_INPUT");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  return (
    <div className="btn_wrapper">
      <button
        type="button"
        title="Iframe"
        draggable="true"
        onDragStart={dragStartIframe}
        onClick={customFunc}
      >
        <BsCodeSquare />
      </button>

      <p className="btn_tag">Iframe</p>
    </div>
  );
};

export default IframeButton;
