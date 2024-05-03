const { required } = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please provide name"],
        minlength:[3, "Name must be at least 3 characters"],
        maxlengt:[50, "Name must not be more thn 50 characters"]
    },
    email:{
        type: String,
        required:[true, "Please provide email"],
        unique: [true, "There is an acoount with this email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    },
    password:{
        type: String,
        required: [true, "Please provide password"],
        minlength:[6, "Password must be atleast 6 characters"],
        maxlengt:[12, "Password must not be more than 12 characters"]
    }
})


User.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
})

User.methods.createJWT = function(){
    const token = jwt.sign({UserId : this._id, name: this.name}, process.env.JWT_SECRETE, {expiresIn:process.env.LIFE_TIME})
    return token
}

User.methods.comparePassword = async function(userPassword){
    const isMatch =await bcrypt.compare(userPassword, this.password)
    return isMatch
}

module.exports = mongoose.model("UserSchema", User)