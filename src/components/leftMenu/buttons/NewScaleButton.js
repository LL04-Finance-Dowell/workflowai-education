import React from "react";
import { IoScale } from "react-icons/io5";
import { useDraggableContext } from "../../../contexts/DraggableContext";

const NewScaleButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext();

  const dragStartNewScale = (e) => {
    e.dataTransfer.setData("text/plain", "NEW_SCALE_INPUT");
    setDraggedItemType("NEW_SCALE_INPUT");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  return (
    <div className="btn_wrapper">
      <button
        type="button"
        title="NewScale"
        draggable="true"
        onDragStart={dragStartNewScale}
        onClick={customFunc}
      >
        <IoScale />
      </button>

      <p className="btn_tag">Scale</p>
    </div>
  );
};

export default NewScaleButton;
