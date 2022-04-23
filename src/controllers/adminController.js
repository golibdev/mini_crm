const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const { Admin, NewsCount, Employee, Category, Subcategory, Position } = require('../models');

exports.login = async (req, res) => {
   try {
      const {
         username,
         password
      } = req.body;

      const admin = await Admin.findOne({ username }) || await Employee.findOne({ username })

      if (!admin) {
         return res.status(401).json({
            message: 'Invalid username or password'
         })
      }

      const decryptedPassword = CryptoJS.AES.decrypt(
         admin.password,
         process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);

      if (password !== decryptedPassword) {
         return res.status(401).json({
            message: 'Invalid username or password'
         })
      }

      const token = jwt.sign({
         id: admin._id,
      }, process.env.JWT_SECRET_KEY)

      admin.password = undefined;

      return res.status(200).json({
         message: 'Login successful',
         token,
         admin,
         role: admin?.positionId && 'employee'
      })
   } catch (err) {
      console.log(err)
      res.status(500).json({ err: err.message })
   }
}

exports.summary = async (req, res) => {
   try {
      const newsCounts = await NewsCount.find({}).populate('category').populate('subcategory')
      const totalNewsCount = newsCounts.reduce((acc, curr) => {
         return acc + curr.newsCount
      }, 0)

      const countEmployees = await Employee.countDocuments()
      const countCategories = await Category.countDocuments()
      const countSubCategories = await Subcategory.countDocuments()
      const countPositions = await Position.countDocuments()
      
      // statistics by category
      if(req.query.daily) {
         // daily data statistics news count by category name
         const dailyDataByCategory = newsCounts.reduce((acc, curr) => {
            const date = new Date(curr.createdAt).toLocaleDateString()
            if(!acc[date]) {
               acc[date] = {}
            }
            if(!acc[date][curr.category.name]) {
               acc[date][curr.category.name] = 0
            }
            acc[date][curr.category.name] += curr.newsCount
            return acc
         }, {})

         // daily data statistics news count by subcategory name
         const dailyDataBySubcategory = newsCounts.reduce((acc, curr) => {
            const date = new Date(curr.createdAt).toLocaleDateString()
            if(!acc[date]) {
               acc[date] = {}
            }
            if(!acc[date][curr.subcategory.name]) {
               acc[date][curr.subcategory.name] = 0
            }
            acc[date][curr.subcategory.name] += curr.newsCount
            return acc
         }, {})

         const totalDailyNewsCount = newsCounts.reduce((acc, curr) => {
            const date = new Date(curr.createdAt).toLocaleDateString()
            if(!acc[date]) {
               acc[date] = 0
            }
            acc[date] += curr.newsCount
            return acc
         }, {})

         return res.status(200).json({
            dailyDataByCategory,
            dailyDataBySubcategory,
            totalDailyNewsCount,
         })

      } else if(req.query.rating) {
         const employees = await Employee.find({})
         const ratingEmployees = employees.sort((a, b) => {
            return b.newsCount - a.newsCount
         })

         return res.status(200).json({
            message: 'Rating Summary',
            ratingEmployees
         })
      }

      return res.status(200).json({
         message: 'Summary',
         newsCounts,
         totalNewsCount,
         countEmployees,
         countCategories,
         countSubCategories,
         countPositions
      })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}