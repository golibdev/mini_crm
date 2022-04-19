const { Category, Subcategory, NewsCount } = require('../models');

exports.getAll = async (req, res) => {
   try {
      const subcategories = await Subcategory.find().populate('newsCounts').populate('category');

      if(!subcategories) {
         return res.status(404).json({
            message: 'No subcategories found'
         })
      }

      return res.status(200).json({ subcategories })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.getOne = async (req, res) => {
   try {
      const id = req.params.id;

      const subcategory = await Subcategory.findById(id).populate('newsCounts').populate('category');

      if(!subcategory) {
         return res.status(404).json({
            message: 'Subcategory not found'
         })
      }

      return res.status(200).json({ subcategory })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.create = async (req, res) => {
   try {
      const {
         name,
         category
      } = req.body;

      const categoryExists = await Category.findById(category);

      if(!categoryExists) {
         return res.status(404).json({
            message: 'Category not found'
         })
      }

      const subcategory = await Subcategory.create({
         name,
         category
      });

      await Category.findByIdAndUpdate(category, {
         $push: {
            subcategories: subcategory._id
         }
      });

      return res.status(201).json({ subcategory, message: 'Subcategory created' })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id;

      const subcategory = await Subcategory.findById(id);

      if(!subcategory) {
         return res.status(404).json({
            message: 'Subcategory not found'
         })
      }

      if(req.body.category) {
         const categoryExists = await Category.findById(req.body.category);

         if(!categoryExists) {
            return res.status(404).json({
               message: 'Category not found'
            })
         }

         await Category.findByIdAndUpdate(subcategory.category, {
            $pull: {
               subcategories: subcategory._id
            }
         });

         await Category.findByIdAndUpdate(req.body.category, {
            $push: {
               subcategories: subcategory._id
            }
         });

         await Subcategory.findByIdAndUpdate(id, req.body, { new: true });

         return res.status(200).json({ subcategory, message: 'Subcategory updated' })
      }

      await Subcategory.findByIdAndUpdate(id, req.body, { new: true });

      return res.status(200).json({ subcategory, message: 'Subcategory updated' })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id;

      const subcategory = await Subcategory.findById(id);

      if(!subcategory) {
         return res.status(404).json({
            message: 'Subcategory not found'
         })
      }

      await Category.findByIdAndUpdate(subcategory.category, {
         $pull: {
            subcategories: subcategory._id
         }
      });

      await NewsCount.deleteMany({ subcategory: subcategory._id });

      await Subcategory.findByIdAndDelete(id);

      return res.status(200).json({ message: 'Subcategory deleted' })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}