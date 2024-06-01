import {
  httpApiUrl,
  httpApiUrlV2,
  httpApiUrlFolderV2,
} from "../httpCommon/httpCommon";

export class FolderServices {
  // createFolderV2 = (data) => httpApiUrlV2.post('folders/', data);
  createFolderV2 = (data, workspace_id) =>
    httpApiUrlFolderV2.post(
      `/list/?workspace_id=${workspace_id}&database=miketestdatabase2&company_id=${workspace_id}`,
      data,
      {
        headers: {
          Authorization: "Bearer 1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
        },
      }
    );

  updateFolder = (data, id) => httpApiUrlV2.put(`folders/${id}/`, data);

  getFolder = (folderId) => httpApiUrlV2.get(`folders/${folderId}/`);

  getAllFolders = (companyId, dataType) =>
    // httpApiUrlV2.get(
    //   `folders/${companyId}/organisations/?data_type=${dataType}`
    // );
    httpApiUrlFolderV2.get(
      `list/?data_type=${dataType}&company_id=${companyId}&workspace_id=${companyId}&database=miketestdatabase2`,
      {
        headers: {
          Authorization: "Bearer 1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
        },
      }
    );

  // deleteFolder = (folderId, data, itemId) => httpApiUrlV2.delete(`folders/${folderId}/?item_id=${itemId}&item_type=document`, data);
  // {{base_url}}/folders/<str:folder_id>/?item_id="<id>"&item_type="document"
  deleteFolder = (data) => httpApiUrlV2.post(`archives/`, data);

  removeFolderItem = (data, folderId) =>
    httpApiUrlV2.put(`folders/${folderId}/`, data);

  // removeFolderItem = (data, folderId, itemId) =>
  // httpApiUrlV2.put(`folders/:${folderId}/${itemId}`, data);
}
