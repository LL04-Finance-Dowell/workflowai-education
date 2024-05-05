import React from "react";
import { BsCalendar2Date } from "react-icons/bs";
import { useDraggableContext } from "../../../contexts/DraggableContext";

const CalendarButton = ({ customFunc }) => {
  const { setDraggedItemType } = useDraggableContext();

  const dragStartCalendar = (e) => {
    e.dataTransfer.setData("text/plain", "DATE_INPUT");
    setDraggedItemType("DATE_INPUT");
    if (document.querySelector(".drop_zone")) {
      document.querySelector(".drop_zone").classList.remove("drop_zone");
    }
  };

  return (
    <div className="btn_wrapper">
      <button
        type="button"
        title="Calendar"
        draggable="true"
        onDragStart={dragStartCalendar}
        onClick={customFunc}
      >
        <BsCalendar2Date />
      </button>

      <p className="btn_tag">Calendar</p>
    </div>
  );
};

export default CalendarButton;
