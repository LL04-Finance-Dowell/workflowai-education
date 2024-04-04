import React from "react";
import { SiLinuxcontainers } from "react-icons/si";
import { useDraggableContext } from "../../../contexts/DraggableContext";

const ContainerButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext();

  const dragStartContainer = (e) => {
    e.dataTransfer.setData("text/plain", "CONTAINER_INPUT");
    setDraggedItemType("CONTAINER_INPUT");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  return (
    <div className="btn_wrapper">
      <button
        type="button"
        title="Container"
        draggable="true"
        onDragStart={dragStartContainer}
        onClick={customFunc}
      >
        <SiLinuxcontainers />
      </button>

      <p className="btn_tag">Container</p>
    </div>
  );
};

export default ContainerButton;
