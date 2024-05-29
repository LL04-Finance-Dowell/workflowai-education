import {
  httpApiDbV2,
  httpApiUrl,
  httpApiUrlV2,
} from "../httpCommon/httpCommon";

export class AppServices {
  getItemsCounts = (data) => {
    return httpApiUrlV2.post("object_count/", data);
  };
}

export class DatabaseServices {
  getDatabaseServices = (workspace_id) => {
    return httpApiDbV2.get("/", {
      headers: { Authorization: "Bearer 1b834e07-c68b-4bf6-96dd-ab7cdc62f07f" },
      params: { workspace_id },
    });
  };
}
