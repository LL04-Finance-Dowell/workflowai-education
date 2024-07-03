const healthCheckService = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Backend service is running fine",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export { 
    healthCheckService
};
