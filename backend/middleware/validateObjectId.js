const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    const id = req.params.id;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid ID format');
    }
    next();
};

module.exports = { validateObjectId };
