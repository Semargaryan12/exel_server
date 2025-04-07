const successResponse = (res, message, data = null) => {
    res.status(200).json({ success: true, message, data });
};

const createdResponse = (res, message, data = null) => {
    res.status(201).json({ success: true, message, data });
};

const errorResponse = (res, message, statusCode = 500) => {
    res.status(statusCode).json({ success: false, message });
};

module.exports = { successResponse, createdResponse, errorResponse };
