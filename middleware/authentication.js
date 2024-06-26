const jwt = require('jsonwebtoken')
const User = require('../models/User')
const {UnauthenticatedError} = require('../errors')


const auth= async(req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new UnauthenticatedError("Auhtentication invalid")
    }
    const token = authHeader.split(" ")[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRETE)
        req.user = {userId: payload.UserId, name:payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication invalid")
    }
}

module.exports = auth