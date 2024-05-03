const Job = require('../models/Job')
const {BadRequestError, NotFoundError} = require('../errors')
const {StatusCodes} = require('http-status-codes')


const getAllJobs= async(req, res)=>{
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const createJob = async(req, res)=>{
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const getJob = async(req, res)=>{
    const {user:{userId}, params:{id:jobId}} = req
    const job = await Job.findOne({ _id:jobId, createdBy:userId})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const updateJob= async(req, res)=>{
    const {user:{userId},params:{id:jobId},body:{company, position}} = req
    if(company === "" || position === ""){
        throw new BadRequestError("Please provide conpany and position")
    }
    const job = await Job.findOneAndUpdate({_id:jobId,createdBy:userId}, req.body, {new:true, runValidators:true})
    console.log(job);
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const delteJob= async(req, res)=>{
    const {user:{userId}, params:{id:jobId}} = req
    const job =await Job.findOneAndRemove({_id:jobId, createdBy:userId})
    if(!job){
        throw new NotFoundError(`There is no job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    createJob,
    getJob,
    updateJob,
    delteJob
}