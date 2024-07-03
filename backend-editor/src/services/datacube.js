import axios from 'axios';
import { logInfo, logError } from '../utils/helper.js'; // Adjust path as per your file structure

class Datacubeservices {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://datacube.uxlivinglab.online/db_api';
    }

    async dataInsertion(databaseName, collectionName, data) {
        const url = `${this.baseUrl}/crud/`;
        const payload = {
            api_key: this.apiKey,
            db_name: databaseName,
            coll_name: collectionName,
            operation: 'insert',
            data: data,
            payment: false
        };
        try {
            const response = await axios.post(url, payload);
            logInfo('Data inserted successfully.');
            return response.data;
        } catch (error) {
            logError('Error in dataInsertion:', error);
            throw error;
        }
    }

    async dataRetrieval(databaseName, collectionName, filters, limit, offset) {
        const url = `${this.baseUrl}/get_data/`;
        const payload = {
            api_key: this.apiKey,
            db_name: databaseName,
            coll_name: collectionName,
            operation: 'fetch',
            filters: filters,
            limit: limit,
            offset: offset,
            payment: false
        };
        try {
            const response = await axios.post(url, payload);
            logInfo('Data retrieved successfully.');
            return response.data;
        } catch (error) {
            logError('Error in dataRetrieval:', error);
            throw error;
        }
    }

    async dataUpdate(databaseName, collectionName, query, updateData) {
        const url = `${this.baseUrl}/crud/`;
        const payload = {
            api_key: this.apiKey,
            db_name: databaseName,
            coll_name: collectionName,
            operation: 'update',
            query: query,
            update_data: updateData,
            payment: false
        };
        try {
            const response = await axios.put(url, payload);
            logInfo('Data updated successfully.');
            return response.data;
        } catch (error) {
            logError('Error in dataUpdate:', error);
            throw error;
        }
    }

    async createCollection(databaseName, collectionName) {
        const url = `${this.baseUrl}/add_collection/`;
        const payload = {
            api_key: this.apiKey,
            db_name: databaseName,
            coll_names: collectionName,
            num_collections: 1
        };
        try {
            const response = await axios.post(url, payload);
            logInfo('Collection created successfully.');
            return response.data;
        } catch (error) {
            logError('Error in createCollection:', error);
            throw error;
        }
    }

    async collectionRetrieval(databaseName) {
        const url = `${this.baseUrl}/collections/`;
        const payload = {
            api_key: this.apiKey,
            db_name: databaseName,
            payment: false
        };
        try {
            const response = await axios.get(url, { params: payload });
            logInfo('Collections retrieved successfully.');
            return response.data;
        } catch (error) {
            logError('Error in collectionRetrieval:', error);
            throw error;
        }
    }

    async dataDelete(databaseName, collectionName, query) {
        const url = `${this.baseUrl}/crud/`;
        const payload = {
            api_key: this.apiKey,
            db_name: databaseName,
            coll_name: collectionName,
            operation: 'delete',
            query: query
        };
        try {
            const response = await axios.delete(url, { data: payload });
            logInfo('Data deleted successfully.');
            return response.data;
        } catch (error) {
            logError('Error in dataDelete:', error);
            throw error;
        }
    }
}

export default Datacubeservices;
