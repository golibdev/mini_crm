const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const taskSchema = new mongoose.Schema({
   task: {
      type: String,
      required: true
   },
   status: {
      type: Boolean,
      required: true,
      enum: [true, false],
      default: false
   },
   employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
   }
}, schemaOptions)

module.exports = mongoose.model('Task', taskSchema)