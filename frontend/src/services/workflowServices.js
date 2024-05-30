import { httpApiUrl, httpApiUrlV2, httpWorkflow, httpWorkflowNew } from '../httpCommon/httpCommon';

export class WorkflowServices {
  createWorkflow = (data, companyId) => {
    // return httpWorkflow.post('/', data);
    return httpWorkflow.post(`/?workspace_id=${companyId}`, data,{
      headers: { Authorization: "Bearer 1b834e07-c68b-4bf6-96dd-ab7cdc62f07f" },
    });
  };

  mineWorkflows = (data) => {
    return httpWorkflow.post('/mine/', data);
  };

  detailWorkflow = (workflowId) => {
    return httpWorkflow.get(`/${workflowId}/`);
  };

  updateWorkflow = (workflowId, data) => {
    return httpWorkflow.put(`/${workflowId}/`, data);
  };

  savedWorkflows = (companyId, dataType, data) => {
    return httpWorkflow.post(`/workflows/${companyId}/organisations/?data_type=${dataType}`, data);
    // {{V2_URL}}/workflows/64ecb08a3033b00f16a496f4/organisations/?data_type=Real_Data
    // return httpWorkflow.post('/saved/', data);
  };

  allWorkflows = (companyId, dataType) => {
    return httpApiUrlV2.get(`/workflows/${companyId}/organisations/?data_type=${dataType}`);
    // https://100094.pythonanywhere.com/v2/workflows/65ad8a28c9038ff4498672c9/organisations/?data_type=real_data
    // return httpApiUrlV2.get(`/companies/${companyId}/workflows/?data_type=${dataType}`);
  };
  
  ////new update for workflow
updateWorkflowNew = (workflowId, data) => {
  return httpWorkflowNew.put(`workflows/${workflowId}/`, data);
};
}


