const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

const tokenDecode = (req) => {
   const bearerHeader = req.headers['authorization'];

   if(bearerHeader) {
      const bearer = bearerHeader.split(' ')[1];
      try {
         const tokenDecoded = jwt.verify(
            bearer, 
         process.env.JWT_SECRET_KEY);
         return tokenDecoded;
      } catch (err) {
         return false;
      }
   } else {
      return false;
   }
}

exports.verifyEmployeeToken = async (req, res, next) => {
   try {
      const tokenDecoded = tokenDecode(req);
      if(tokenDecoded) {
         const employee = await Employee.findById(tokenDecoded.id);
         if(!employee) return res.status(401).json({ message: 'No allowed' });
         req.employee = employee;
         next();
      } else {
         return res.status(401).json({ message: 'Unauthorized' });
      }
   } catch (err) {
      console.log(err)
      res.status(500).json({ err: err })
   }
}