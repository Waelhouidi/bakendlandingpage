// middleware/pagination.js
const pagination = (defaultLimit = 10) => {
    return (req, res, next) => {
        req.query.page = parseInt(req.query.page) || 1;
        req.query.limit = parseInt(req.query.limit) || defaultLimit;
        next();
    };
};

module.exports = pagination;