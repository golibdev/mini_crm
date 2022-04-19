const CryptoJS = require('crypto-js');
const { Admin } = require('../models');

exports.createAdmin = async () => {
   const username = process.env.DEFAULT_ADMIN_USERNAME;
   const password = process.env.DEFAULT_ADMIN_PASSWORD;
   const fullName = process.env.DEFAULT_ADMIN_FULLNAME;

   try {
      const admin = await Admin.findOne({ username });
      if (admin != null) {
         return true;
      }
      
      const newAdmin = new Admin({
         fullName,
         username,
         password: CryptoJS.AES.encrypt(
            password,
            process.env.PASSWORD_SECRET_KEY
         )
      })

      await newAdmin.save();
      console.log('----------------------')
      console.log('Admin created successfully');
      console.log(`fullName => ${fullName}`);
      console.log(`username => ${username}`);
      console.log(`password => ${password}`);
      console.log('----------------------')
   } catch (err) {
      console.log(err);
      return false;
   }
}