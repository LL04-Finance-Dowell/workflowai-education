import React from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setContentOfDocument } from "../../features/document/documentSlice";
import { resetSetWorkflows } from "../../features/processes/processesSlice";
import "./tabs.css";

const Tabs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentURL = window.location.href;
  const parts = currentURL.split("/");
  const whichApproval = parts[parts.length - 1];
  // // ("the approval is ", whichApproval);
  const { t } = useTranslation();

  return (
    <div className="tabsWrapper">
      <div
        className={
          whichApproval === "new-set-workflow-document"
            ? "tabBtnWrapper"
            : "tabBtnWrapperNo"
        }
      >
        <button
          className="tabBtn"
          disabled={whichApproval === "new-set-workflow-document"}
          onClick={() => {
            navigate("/workflows/new-set-workflow-document");
            dispatch(resetSetWorkflows());
            dispatch(setContentOfDocument(null));
          }}
        >
          {t("Document Approval")}
        </button>
      </div>
      <div
        className={
          whichApproval === "new-set-workflow-template"
            ? "tabBtnWrapper"
            : "tabBtnWrapperNo"
        }
      >
        <button
          className="tabBtn"
          disabled={whichApproval === "new-set-workflow-template"}
          onClick={() => {
            navigate("/workflows/new-set-workflow-template");
            dispatch(resetSetWorkflows());
            dispatch(setContentOfDocument(null));
          }}
        >
          {t("Template Approval")}
        </button>
      </div>
    </div>
  );
};

export default Tabs;
