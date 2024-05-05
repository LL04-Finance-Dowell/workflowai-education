import React from "react";
import { IoScale } from "react-icons/io5";
import { useDraggableContext } from "../../../contexts/DraggableContext"; 

const ScaleButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext(); 

  const dragStartScale = (e) => {
    e.dataTransfer.setData("text/plain", "SCALE_INPUT");
    setDraggedItemType("SCALE_INPUT");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  return (
    <button
      type="button"
      title="Scale"
      draggable="true"
      onDragStart={dragStartScale}
      onClick={customFunc}
    >
      <IoScale />
    </button>
  );
};

export default ScaleButton;
