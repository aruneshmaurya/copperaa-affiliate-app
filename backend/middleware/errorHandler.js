const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode);

    // Don't leak stack traces in production
    const response = {
        message: err.message,
    };

    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    console.error(`Error: ${err.message}`);

    res.json(response);
};

module.exports = { errorHandler };
