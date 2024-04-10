import {
  httpApiUrlV2,
  httpWorkflow,
  httpWorkflowNew,
} from "../httpCommon/httpCommon";

export class WorkflowServices {
  createWorkflow = (data) => {
    return httpWorkflow.post("/", data);
  };

  mineWorkflows = (data) => {
    return httpWorkflow.post("/mine/", data);
  };

  detailWorkflow = (workflowId) => {
    return httpWorkflow.get(`/${workflowId}/`);
  };

  updateWorkflow = (workflowId, data) => {
    return httpWorkflow.put(`/${workflowId}/`, data);
  };

  savedWorkflows = (companyId, dataType, data) => {
    return httpWorkflow.post(
      `/workflows/${companyId}/organisations/?data_type=${dataType}`,
      data
    );
  };

  allWorkflows = (companyId, dataType) => {
    return httpApiUrlV2.get(
      `/workflows/${companyId}/organisations/?data_type=${dataType}`
    );
  };

  ////new update for workflow
  updateWorkflowNew = (workflowId, data) => {
    return httpWorkflowNew.put(`workflows/${workflowId}/`, data);
  };
}
