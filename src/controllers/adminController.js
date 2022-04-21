const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const { Admin, NewsCount, Employee, Category, Subcategory, Position } = require('../models');

exports.login = async (req, res) => {
   try {
      const {
         username,
         password
      } = req.body;

      const admin = await Admin.findOne({ username }) 

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
         admin
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
         // today news count
         const today = new Date()
         const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
         const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

         const todayNewsCount = await NewsCount.find({
            createdAt: {
               $gte: todayStart,
               $lt: todayEnd
            }
         }).populate('category').populate('subcategory')

         const todayTotalNewsCount = todayNewsCount.reduce((acc, curr) => {
            return acc + curr.newsCount
         }, 0)

         return res.status(200).json({
            todayNewsCount,
            todayTotalNewsCount
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