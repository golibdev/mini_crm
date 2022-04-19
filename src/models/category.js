const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const categorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true
   },
   subcategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory'
   }],
   newsCounts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsCount'
   }]
}, schemaOptions)

module.exports = mongoose.model('Category', categorySchema)