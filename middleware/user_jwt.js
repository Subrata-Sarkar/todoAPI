const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");

    if(!token){
        return res.status(401).json({
            msg: "No token, authorization denied"
        });
    }

    try {
        await jwt.verify(token, process.env.jwtUserSecret, (err, decoded) => {
            if(err){
                res.status(401).json({
                    msg: "Token not valid"
                });
            }else{
                req.user = decoded.user;
                next();
            }
        });
    } catch (error) {
        console.log("Something went wrong with middleware"+error);
        res.status(500).json({
            msg: "Server error"
        })
    }
}