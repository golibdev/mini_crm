const { Task, Employee } = require('../models')

exports.getAll = async (req, res) => {
   try {
      const tasks = await Task.find().populate('employee')

      if (!tasks) {
         return res.status(404).json({
            message: 'No tasks found'
         })
      }

      res.status(200).json({
         message: 'Get tasks successful',
         tasks
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.getOne = async (req, res) => {
   try {
      const id = req.params.id

      const task = await Task.findById(id).populate('employee')

      if (!task) {
         return res.status(404).json({
            message: 'No task found'
         })
      }
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.create = async (req, res) => {
   try {
      const { task, employee } = req.body

      const employeeExists = await Employee.findById(employee)

      if (!employeeExists) {
         return res.status(404).json({
            message: 'No employee found'
         })
      }

      const newTask = await Task.create({
         task,
         employee
      })

      await Employee.findByIdAndUpdate(employee, {
         $push: {
            tasks: newTask._id
         }
      })

      res.status(200).json({
         message: 'Create task successful'
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id

      const task = await Task.findById(id)

      if (!task) {
         return res.status(404).json({
            message: 'No task found'
         })
      }

      await Employee.findByIdAndUpdate(task.employee, {
         $pull: {
            tasks: task._id
         }
      }, { new: true })

      await Task.findByIdAndDelete(id)

      res.status(200).json({
         message: 'Delete task successful'
      })

   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

exports.changeStatus = async (req, res) => {
   try {
      const id = req.params.id

      const task = await Task.findById(id)

      if (!task) {
         return res.status(404).json({
            message: 'No task found'
         })
      }

      await Task.findByIdAndUpdate(id, {
         status: !task.status
      })

      res.status(200).json({
         message: 'Change status successful'
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}