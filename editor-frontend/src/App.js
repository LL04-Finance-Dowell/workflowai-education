import React, { useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import "./App.css";
import jwt_decode from 'jwt-decode';
import HomePage from "./pages/HomePage";
import ThankYouPage from "./utils/redirectPages/ThankYouPage";
import failurePayment from "./assets/failure.svg"


import { useEffect } from "react";

function App() {
  const [searchParams] = useSearchParams();
  const [tokenError, setTokenError] = useState(null)

  useEffect(() => {
    const token = searchParams.get('token') ?? null;
    if (token == null) {
      setTokenError(true);
    } else {
      try {
        var decoded = jwt_decode(token);
        const titleName = decoded?.details?.name;
        document.title = titleName;
        setTokenError(false);
      } catch (error) {
        setTokenError(true);
      }
    };
  }, [tokenError])

  return <>
    <div className="app">
      {tokenError === true ?
        (
          <>
            <div className="mb-4 text-center">
              <img src={failurePayment} alt='Token Error' />
            </div>
            <div className="text-center">
              <h1>Sorry</h1>
              <p>You token is not valid or empty.</p>
            </div>
          </>
        )
        :
        (tokenError !== null && <Routes>
          <Route path="/100058-DowellEditor-V2/status" element={<ThankYouPage />} />
          <Route exact path="/100058-DowellEditor-V2/" element={<HomePage />} />
        </Routes>
        )

      }
    </div>
  </>;
}

export default App;
// social media
// eyJhbGciOiJIUzI1NiJ9.eyJwcm9kdWN0X25hbWUiOiJTb2NpYWwgTWVkaWEgQXV0b21hdGlvbiIsImRldGFpbHMiOnsiY2x1c3RlciI6InNvY2lhbG1lZGlhIiwiZGF0YWJhc2UiOiJzb2NpYWxtZWRpYSIsImNvbGxlY3Rpb24iOiJzdGVwM19kYXRhIiwiZG9jdW1lbnQiOiJzdGVwM19kYXRhIiwidGVhbV9tZW1iZXJfSUQiOiIzNDU2Nzg5Nzc5OSIsImZ1bmN0aW9uX0lEIjoiQUJDREUiLCJmaWVsZCI6InVzZXJfaWQ6IHJlcXVlc3Quc2Vzc2lvblsndXNlcl9pZCddIiwiZmxhZyI6ImVkaXRpbmciLCJuYW1lIjoiVGVzdGluZyBRIGFuZCBBIiwiY29tbWFuZCI6InVwZGF0ZSIsInVwZGF0ZV9maWVsZCI6eyJvcmRlcl9ub3MiOjIxfX19.SGC-GQmU1-UkCmiKrPowj1_0PyxTwekwUyc0zWEIvxo
// http://localhost:3000/?token=eyJhbGciOiJIUzI1NiJ9.eyJwcm9kdWN0X25hbWUiOiJTb2NpYWwgTWVkaWEgQXV0b21hdGlvbiIsImRldGFpbHMiOnsiY2x1c3RlciI6InNvY2lhbG1lZGlhIiwiZGF0YWJhc2UiOiJzb2NpYWxtZWRpYSIsImNvbGxlY3Rpb24iOiJzdGVwM19kYXRhIiwiZG9jdW1lbnQiOiJzdGVwM19kYXRhIiwidGVhbV9tZW1iZXJfSUQiOiIzNDU2Nzg5Nzc5OSIsImZ1bmN0aW9uX0lEIjoiQUJDREUiLCJmaWVsZCI6InVzZXJfaWQ6IHJlcXVlc3Quc2Vzc2lvblsndXNlcl9pZCddIiwiZmxhZyI6ImVkaXRpbmciLCJuYW1lIjoiVGVzdGluZyBRIGFuZCBBIiwiY29tbWFuZCI6InVwZGF0ZSIsInVwZGF0ZV9maWVsZCI6eyJvcmRlcl9ub3MiOjIxfX19.SGC-GQmU1-UkCmiKrPowj1_0PyxTwekwUyc0zWEIvxo

// workflowai
//ll04-finance-dowell.github.io/100058-DowellEditor-V2/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9kdWN0X25hbWUiOiJXb3JrZmxvdyBBSSIsImRldGFpbHMiOnsiY2x1c3RlciI6IkRvY3VtZW50cyIsImRhdGFiYXNlIjoiRG9jdW1lbnRhdGlvbiIsImNvbGxlY3Rpb24iOiJUZW1wbGF0ZVJlcG9ydHMiLCJkb2N1bWVudCI6InRlbXBsYXRlcmVwb3J0cyIsInRlYW1fbWVtYmVyX0lEIjoiMjI2ODkwNDQ0MzMiLCJmdW5jdGlvbl9JRCI6IkFCQ0RFIiwiX2lkIjoiNjUzOGMxMTVkM2Y4NDJjMGYyMjE2YjI3IiwiZmllbGQiOiJ0ZW1wbGF0ZV9uYW1lIiwidHlwZSI6InRlbXBsYXRlIiwibWV0YWRhdGFfaWQiOiI2NTM4YzExNTE1ZjZkM2VmYjA5ZjRhYWYiLCJhY3Rpb24iOiJ0ZW1wbGF0ZSIsImZsYWciOiJlZGl0aW5nIiwibmFtZSI6IkdvZHdpbiBUZXN0IiwiY29tbWFuZCI6InVwZGF0ZSIsInVwZGF0ZV9maWVsZCI6eyJ0ZW1wbGF0ZV9uYW1lIjoiIiwiY29udGVudCI6IiIsInBhZ2UiOiIifX19.hiAw6Bpe7Elu5N9Wj_q2lMf_SBxP5vMd7fOvn02Queg