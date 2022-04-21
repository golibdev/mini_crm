const { Category, Subcategory, NewsCount } = require('../models');

exports.getAll = async (req, res) => {
   try {
      const categories = await Category.find().populate('subcategories').populate('newsCounts');

      if(!categories) {
         return res.status(404).json({
            message: 'No categories found'
         })
      }

      res.status(200).json({ categories })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.getOne = async (req, res) => {
   try {
      const id = req.params.id;

      const category = await Category.findById(id).populate('subcategories').populate('newsCounts');

      if(!category) {
         return res.status(404).json({
            message: 'Category not found'
         })
      }

      res.status(200).json({ category })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.create = async (req, res) => {
   try {
      const name = req.body.name;
      const category = await Category.findOne({ name });

      if(category) {
         return res.status(201).json({
            message: 'Category already exists',
            category
         })
      }

      const newCategory = await Category.create(req.body);

      res.status(201).json({ 
         message: 'Category created',
         category: newCategory
      })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.update = async (req, res) => {
   try {
      const id = req.params.id;

      const category = await Category.findById(id);

      if(!category) {
         return res.status(404).json({
            message: 'Category not found'
         })
      }

      const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

      res.status(200).json({
         message: 'Category updated',
         category: updatedCategory
      })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}

exports.delete = async (req, res) => {
   try {
      const id = req.params.id;

      const category = await Category.findById(id);

      if(!category) {
         return res.status(404).json({
            message: 'Category not found'
         })
      }

      // Delete all subcategories under this category
      const subcategories = await Subcategory.find({ category: id });
      for(let i = 0; i < subcategories.length; i++) {
         await Subcategory.findByIdAndDelete(subcategories[i]._id);
      }

      // Delete all newsCounts under this category
      const newsCounts = await NewsCount.find({ category: id });
      for(let i = 0; i < newsCounts.length; i++) {
         await NewsCount.findByIdAndDelete(newsCounts[i]._id);
      }

      await Category.findByIdAndDelete(id);

      res.status(200).json({
         message: 'Category deleted'
      })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}