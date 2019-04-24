const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).send('Request must include x-auth-token.');

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded._id;
        next();
    }
    catch (ex) {
        res.status(400).send('Bad token.');
    }
}