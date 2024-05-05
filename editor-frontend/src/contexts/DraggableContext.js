import React, { createContext, useContext, useState } from "react";

const DraggableContext = createContext();

export const DraggableProvider = ({ children }) => {
  const [draggedItemType, setDraggedItemType] = useState("");

  return (
    <DraggableContext.Provider value={{ draggedItemType, setDraggedItemType }}>
      {children}
    </DraggableContext.Provider>
  );
};

export const useDraggableContext = () => useContext(DraggableContext);
