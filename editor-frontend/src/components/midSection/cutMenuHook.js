import { useState } from "react";

export const useCutMenuContext =()=>{
    const initialContextMenu = {
        show: false,
        targetEl:null,
        x: 0,
        y: 0,
        copy:false
      };
  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  return({contextMenu,setContextMenu,initialContextMenu})

}




