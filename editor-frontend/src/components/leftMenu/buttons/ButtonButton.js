import React from "react";
import { SiBigbluebutton } from "react-icons/si";
import { useDraggableContext } from "../../../contexts/DraggableContext";

const ButtonButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext();

  const dragStartButton = (e) => {
    e.dataTransfer.setData("text/plain", "BUTTON_INPUT");
    setDraggedItemType("BUTTON_INPUT");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  return (
    <div className="btn_wrapper">
      <button
        type="button"
        title="Button"
        draggable="true"
        onDragStart={dragStartButton}
        onClick={customFunc}
      >
        <SiBigbluebutton />
      </button>

      <p className="btn_tag">Button</p>
    </div>
  );
};

export default ButtonButton;
