import PayloadValidationServices from "../services/validation.js";
import { logInfo, logError } from "../utils/helper.js";  
import {exampleSchema} from "../utils/payload.schema.js";
import { produceMessage } from "../utils/kafka.js"

const exampleEvent = async (socket, userData) => {
    const { name, location } = userData;

    try {
        logInfo(`User Data: ${JSON.stringify(userData)}`);

        const validatePayload = PayloadValidationServices.validateData(exampleSchema, {
            name,
            location
        });

        if (!validatePayload.isValid) {
            logError(`Invalid payload for example event: ${JSON.stringify(validatePayload.errors)}`);
            socket.emit('exampleData', {
                success: false,
                message: "Invalid payload",
                errors: validatePayload.errors,
                dateTime: new Date()
            });
            return;
        }
    
        const currentData = {
            success: true,
            message: "Example Data is available",
            response: { name, location }
        };
        const dateTime = new Date();

        if (!currentData.success) {
            logInfo('Example Data Failed');

            socket.emit('exampleData', {
                success: false,
                message: currentData.message,
                dateTime: dateTime
            });
        }

        logInfo('Example Data received');
        socket.emit('exampleData', {
            success: true,
            message: currentData.message,
            response: currentData.response,
            dateTime: dateTime
        });
        await produceMessage(currentData.response);
    } catch (error) {
        logError('Error on Example Data:', error);
        socket.emit('exampleData', {
            success: false,
            message: "Error fetching data",
            error: error.message,
            dateTime: new Date()
        });
    }
};

export { exampleEvent };
