import React from "react";
import { BsMenuButtonWideFill } from "react-icons/bs";
import { useDraggableContext } from "../../../contexts/DraggableContext";

const DropdownButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext();
  const dragStartDropdown = (e) => {
    e.dataTransfer.setData("text/plain", "DROPDOWN_INPUT");
    setDraggedItemType("DROPDOWN_INPUT");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  return (
    <div className="btn_wrapper">
      <button
        type="button"
        title="Dropdown"
        draggable="true"
        onDragStart={dragStartDropdown}
        onClick={customFunc}
      >
        <BsMenuButtonWideFill />
      </button>

      <p className="btn_tag">Dropdown</p>
    </div>
  );
};

export default DropdownButton;
