import React from "react";
import { BiImage } from "react-icons/bi";
import { useDraggableContext } from "../../../contexts/DraggableContext";

const ImageButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext();

  const dragStartImage = (e) => {
    const element = document.getElementById("draggable");
    e.dataTransfer.setData("text/plain", "IMAGE_INPUT");
    setDraggedItemType("IMAGE_INPUT");
    element.classList.add("dragging");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  const dragEndFunc = () => {
    setDraggedItemType(null);
  };

  return (
    <div className="btn_wrapper">
      <button
        type="button"
        title="Image"
        draggable="true"
        onDragStart={dragStartImage}
        onDragEnd={dragEndFunc}
        onClick={customFunc}
      >
        <BiImage />
      </button>

      <p className="btn_tag">Image</p>
    </div>
  );
};

export default ImageButton;
