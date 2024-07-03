import DatacubeServices from "../services/datacube.js";
import config from "../config/index.js";
import { logInfo, logError } from "../utils/helper.js";  

const initDatacube = () => {
    const datacube = new DatacubeServices(config.API_KEY);
    const database = config.DATABASE;
    const collection = config.COLLECTION;
    logInfo('Datacube initialized successfully.');
    return { datacube, database, collection };
};

const saveDataToDatacube = async(data) => {
    try {
        const { datacube, database, collection } = initDatacube();
        const response = await datacube.dataInsertion(database, collection, data);
        logInfo('Data saved successfully');
        if (!response.success) {
            logError('Error saving data:', response);
            throw response;
        }
        return response;
    } catch (error) {
        logError('Error saving data:', error);
        throw error;
    }
};

export { saveDataToDatacube };
