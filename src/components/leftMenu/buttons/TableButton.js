import React from "react";
import { BsTable } from "react-icons/bs";
import { useDraggableContext } from "../../../contexts/DraggableContext";

const TableButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext();

  const dragStartTable = (e) => {
    const element = document.getElementById("draggable");
    e.dataTransfer.setData("text/plain", "TABLE_INPUT");
    setDraggedItemType("TABLE_INPUT");
    element.classList.add("dragging");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  return (
    <div className="btn_wrapper">
      <button
        type="button"
        title="Table"
        draggable="true"
        onDragStart={dragStartTable}
        onClick={customFunc}
      >
        <BsTable />
      </button>

      <p className="btn_tag">Table</p>
    </div>
  );
};

export default TableButton;
