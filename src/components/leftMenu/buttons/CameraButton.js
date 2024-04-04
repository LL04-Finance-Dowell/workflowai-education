import React from "react";
import { FaCamera } from "react-icons/fa";
import { useDraggableContext } from "../../../contexts/DraggableContext";

const CameraButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext();

  const dragStartCamera = (e) => {
    e.dataTransfer.setData("text/plain", "CAMERA_INPUT");
    setDraggedItemType("CAMERA_INPUT");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  return (
    <div className="btn_wrapper">
      <button
        type="button"
        title="Camera"
        draggable="true"
        onDragStart={dragStartCamera}
        onClick={customFunc}
      >
        <FaCamera />
      </button>

      <p className="btn_tag">Camera</p>
    </div>
  );
};

export default CameraButton;
