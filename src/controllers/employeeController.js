const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const { Employee, Position, NewsCount, Category, Subcategory, Task } = require('../models');

exports.register = async (req, res) => {
   try {
      const {
         fullName,
         username,
         password,
         positionId
      } = req.body;

      const employee = await Employee.findOne({ username })

      if (employee) {
         return res.status(404).json({
            message: 'Username already exists'
         })
      }

      const position = await Position.findById(positionId)

      if (!position) {
         return res.status(404).json({
            message: 'Position does not exist'
         })
      }

      const encryptedPassword = CryptoJS.AES.encrypt(
         password,
         process.env.PASSWORD_SECRET_KEY
      ).toString();

      const newEmployee = await Employee.create({
         fullName,
         username,
         password: encryptedPassword,
         positionId
      })

      await Position.findByIdAndUpdate(positionId, {
         $push: {
            employees: newEmployee._id
         }
      })

      return res.status(201).json({
         message: 'Register successful',
         employee: newEmployee
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getAll = async (req, res) => {
   try {
      const employees = await Employee.find().populate('positionId').populate('newsCounts');

      if(!employees) {
         return res.status(404).json({
            message: 'No employees found'
         })
      }

      let totalEmployesNewsCount = 0;

      const employeesData = []

      for(let i=0; i < employees.length; i++) {
         const employee = employees[i]
         const newsCounts = employee.newsCounts
         const summa = newsCounts.reduce((acc, cur) => {
            return acc + cur.newsCount
         }, 0)
         totalEmployesNewsCount += summa

         employeesData.push({
            employee,
            summa,
            totalEmployesNewsCount
         })
      }

      res.status(200).json({
         message: 'Get employees successful',
         employeesData,
         employees
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getOne = async (req, res) => {
   try {
      const id = req.params.id;

      const employee = await Employee.findById(id).populate('positionId').populate('newsCounts');

      if(!employee) {
         return res.status(404).json({
            message: 'Employee not found'
         })
      }

      // category data for news counts
      const data = []
      const category = await Category.find()
      const subcategory = await Subcategory.find()
      const newsCounts = employee.newsCounts

      const summa = newsCounts.reduce((acc, cur) => {
         return acc + cur.newsCount
      }, 0)

      for(let i=0; i < newsCounts.length; i++) {
         const categoryData = category.find(item => item._id.toString() == newsCounts[i].category)
         const subcategoryData = subcategory.find(item => item._id.toString() == newsCounts[i].subcategory)
         data.push({
            category: categoryData,
            subcategory: subcategoryData,
            newsCount: newsCounts[i].newsCount,
            links: newsCounts[i].links,
            createdAt: newsCounts[i].createdAt,
            _id: newsCounts[i]._id
         })
      }

      res.status(200).json({
         message: 'Get employee successful',
         employee,
         data,
         summa
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.fromDateAndToDate = async (req, res) => {
   try {
      const id = req.params.id;

      const employee = await Employee.findById(id).populate('positionId').populate('newsCounts');

      if(!employee) {
         return res.status(404).json({
            message: 'Employee not found'
         })
      }

      const {start, end} = req.query

      const newsCount = await NewsCount.find({
         createdAt: {
            $gte: start,
            $lte: end || new Date()
         }
      }).populate('category').populate('subcategory')


      if(!newsCount) {
         return res.status(404).json({
            message: 'No news found'
         })
      }

      const data = []
      const category = await Category.find()
      const subcategory = await Subcategory.find()

      for(let i=0; i < newsCount.length; i++) {
         const categoryData = category.find(item => item._id.toString() == newsCount[i].category._id)
         const subcategoryData = subcategory.find(item => item._id.toString() == newsCount[i].subcategory._id)
         data.push({
            category: categoryData,
            subcategory: subcategoryData,
            newsCount: newsCount[i].newsCount,
            links: newsCount[i].links,
            createdAt: newsCount[i].createdAt,
            _id: newsCount[i]._id
         })
      }

      res.status(200).json({
         message: 'Get news successful',
         data,
         summa: data.reduce((acc, cur) => {
            return acc + cur.newsCount
         }, 0)
      })
   } catch (err) {
      return res.status(500).json({ message: err.message })   
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id;

      const employee = await Employee.findById(id);
      const {
         fullName,
         username,
         positionId,
         password
      } = req.body;

      if(!employee) {
         return res.status(404).json({
            message: 'Employee not found'
         })
      }

      if(req.body.password !== "") {
         const encryptedPassword = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET_KEY
         ).toString();

         await Employee.findByIdAndUpdate(id, {
            password: encryptedPassword
         })

         return res.status(200).json({
            message: 'Update employee successful'
         })
      } else if(req.body.positionId) {
         await Position.findByIdAndUpdate(employee.positionId, {
            $pull: {
               employees: employee._id
            }
         })

         await Position.findByIdAndUpdate(req.body.positionId, {
            $push: {
               employees: employee._id
            }
         })

         if(req.body.password !== "") {
            await Employee.findByIdAndUpdate(id, req.body)
         } else {
            await Employee.findByIdAndUpdate(id, {
               username,
               fullName,
               positionId
            })
         }

         return res.status(200).json({
            message: 'Update employee successful'
         })
      } 

      if(req.body.password !== "") {
         await Employee.findByIdAndUpdate(id, req.body)
      } else {
         await Employee.findByIdAndUpdate(id, {
            username,
            fullName,
            positionId
         })
      }

      res.status(200).json({
         message: "Update employee successful"
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id;

      const employee = await Employee.findById(id);

      if(!employee) {
         return res.status(404).json({
            message: 'Employee not found'
         })
      }

      await Position.findByIdAndUpdate(employee.positionId, {
         $pull: {
            employees: employee._id
         }
      })

      // delete news counts under employee
      await NewsCount.deleteMany({
         employeeId: employee._id
      })

      await Employee.findByIdAndDelete(id);

      res.status(200).json({
         message: 'Delete employee successful'
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getTasks = async (req, res) => {
   try {
      const id = req.params.id;

      const employee = await Employee.findById(id).populate('tasks');

      if(!employee) {
         return res.status(404).json({
            message: 'Employee not found'
         })
      }

      res.status(200).json({
         message: 'Get tasks successful',
         tasks: employee.tasks
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}