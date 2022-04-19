const { Position, Employee, NewsCount } = require('../models');

exports.getAll = async (req, res) => {
   try {
      const positions = await Position.find().populate('employees');

      if(!positions) {
         return res.status(404).json({
            message: 'No positions found'
         })
      }

      return res.status(200).json({ positions })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.getOne = async (req, res) => {
   try {
      const id = req.params.id;

      const position = await Position.findById(id).populate('employees');

      if(!position) {
         return res.status(404).json({
            message: 'Position not found'
         })
      }

      return res.status(200).json({ position })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.create = async (req, res) => {
   try {
      const name = req.body.name;
      const position = await Position.findOne({ name });

      if(position) {
         return res.status(201).json({
            message: 'Position already exists',
            position
         })
      }

      const newPosition = await Position.create(req.body);

      return res.status(201).json({
         message: 'Position created',
         position: newPosition
      })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id;
      const position = await Position.findById(id);
      if(!position) {
         return res.status(404).json({
            message: 'Position not found'
         })
      }
      const updatedPosition = await Position.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json({ position: updatedPosition, message: 'Position updated' })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id;
      const position = await Position.findById(id);
      if(!position) {
         return res.status(404).json({
            message: 'Position not found'
         })
      }

      // delete all employees under this position
      const employees = await Employee.find({ position: id });
      employees.forEach(async (employee) => {
         await Employee.findByIdAndDelete(employee._id);
         // delete all news counts under this employee
         const newsCounts = await NewsCount.find({ employee: employee._id });
         newsCounts.forEach(async (newsCount) => {
            await NewsCount.findByIdAndDelete(newsCount._id);
         })
      })

      await Position.findByIdAndDelete(id);

      return res.status(200).json({ message: 'Position deleted' })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}