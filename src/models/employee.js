const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const employeeSchema = new mongoose.Schema({
   fullName: {
      type: String,
      required: true
   },
   username: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
   },
   positionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position',
      required: true
   },
   newsCounts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsCount'
   }],
   tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
   }]
}, schemaOptions)

module.exports = mongoose.model('Employee', employeeSchema)