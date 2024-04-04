import React, { useState } from 'react'
import LoadingBar from 'react-top-loading-bar'
import { useStateContext } from '../../contexts/contextProvider'
import { useSearchParams } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProgressLoader = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");


  var decoded = jwt_decode(token);

  const actionName = decoded.details.action 
 const { progress, setProgress } = useStateContext()
  return (
    <div>
      <LoadingBar
        height={4}
        color={actionName == "template" ? "#1c2b48" : "green"}
        progress={progress}
        loaderSpeed={1000}
        onLoaderFinished={() => setProgress(0)}
      />
      <br />
    </div>
  )
}

export default ProgressLoader