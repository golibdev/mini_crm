const { Category, Subcategory, NewsCount } = require('../models');

exports.getAll = async (req, res) => {
   try {
      const subcategories = await Subcategory.find().populate('newsCounts').populate('category');

      if(!subcategories) {
         return res.status(404).json({
            message: 'No subcategories found'
         })
      }

      const data = []
      for(let i=0; i<subcategories.length; i++) {
         let summa = 0;
         for(let j=0; j<subcategories[i].newsCounts.length; j++) {
            summa += subcategories[i].newsCounts[j].newsCount;
         }
         data.push({
            id: subcategories[i]._id,
            name: subcategories[i].name,
            category: subcategories[i].category.name,
            count: summa,
            employees: subcategories[i].employees
         })
      }

      res.status(200).json({ subcategories, data })
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

      res.status(200).json({ subcategory })
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

      res.status(201).json({ subcategory, message: 'Subcategory created' })
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

      res.status(200).json({ subcategory, message: 'Subcategory updated' })
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

      res.status(200).json({ message: 'Subcategory deleted' })
   } catch (err) {
      res.status(500).json({ err: err.message })
   }
}