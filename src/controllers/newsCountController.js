const { Category, Subcategory, NewsCount, Employee } = require('../models')

exports.create = async (req, res) => {
   try {
      const {
         category,
         subcategory,
         newsCount,
         links,
         employeeId
      } = req.body

      const newsCountData = {
         category,
         subcategory,
         newsCount,
         links,
         employeeId
      }

      const newNewsCount = await NewsCount.create(newsCountData)

      await Category.findByIdAndUpdate(category, {
         $inc: {
            newsCount: newsCount
         }
      })

      await Subcategory.findByIdAndUpdate(subcategory, {
         $inc: {
            newsCount: newsCount
         }
      })

      await Employee.findByIdAndUpdate(employeeId, {
         $inc: {
            newsCount: newsCount
         }
      })

      res.status(201).json({
         message: 'News count created successfully',
         newsCount: newNewsCount
      })
   } catch (err) {
      res.status(500).send({
         err: err.message
      })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id

      const newsCount = await NewsCount.findById(id)

      await Category.findByIdAndUpdate(newsCount.category, {
         $inc: {
            newsCount: -newsCount.newsCount
         }
      })

      await Subcategory.findByIdAndUpdate(newsCount.subcategory, {
         $inc: {
            newsCount: -newsCount.newsCount
         }
      })

      await Employee.findByIdAndUpdate(newsCount.employeeId, {
         $inc: {
            newsCount: -newsCount.newsCount
         }
      })

      await NewsCount.findByIdAndDelete(id)

      res.status(200).json({
         message: 'News count deleted successfully'
      })
   } catch (err) {
      res.status(500).send({
         err: err.message
      })
   }
}