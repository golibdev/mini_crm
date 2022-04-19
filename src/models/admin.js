const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const adminSchema = new mongoose.Schema({
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
   }
}, schemaOptions)

module.exports = mongoose.model('Admin', adminSchema)