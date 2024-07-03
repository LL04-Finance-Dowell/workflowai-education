const logInfo = (message) => {
    console.info(`[INFO]: ${message}`);
};

const logError = (message, error) => {
    console.error(`[ERROR]: ${message}`, error);
};

export {
    logInfo,
    logError
}