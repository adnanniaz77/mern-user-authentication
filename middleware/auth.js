const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res
                .status(401)
                .json({ msg: "Unauthorized access, access denied" });
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!verified)
            return res.status(401).json({
                msg: "Token verification failed, authorization denied",
            });
    } catch (err) {
        res.status(500).json(err.message);
    }
};

module.exports = auth;
