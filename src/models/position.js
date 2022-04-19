const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const positionSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true,
   },
   employees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
   }]
}, schemaOptions)

module.exports = mongoose.model('Position', positionSchema)