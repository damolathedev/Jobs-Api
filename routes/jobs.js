const express = require('express')
const router = express.Router()
const {
    getAllJobs,
    createJob,
    getJob,
    updateJob,
    delteJob
} = require("../controllers/jobs")


router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(updateJob).delete(delteJob)

module.exports = router