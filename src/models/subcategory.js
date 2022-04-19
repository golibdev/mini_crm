const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const subCategorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
   },
   newsCounts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsCount'
   }]
}, schemaOptions)

module.exports = mongoose.model('Subcategory', subCategorySchema)