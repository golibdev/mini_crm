const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const newsCountSchema = new mongoose.Schema({
   category:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
   },
   subcategory:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true
   },
   newsCount:{
      type: Number,
      required: true
   },
   links:{
      type: String,
      required: true
   },
   employeeId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
   }
}, schemaOptions)

module.exports = mongoose.model('NewsCount', newsCountSchema)