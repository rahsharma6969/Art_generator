// import jwt from "jsonwebtoken";
// import { User } from "../models/user.models.js"; // Adjust the import path as needed

// export const verifyJWT = (req, res, next) => {
//   // Extract the token from the Authorization header
//   const authHeader = req.headers['authorization'];

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(403).json({ message: "Token is required" });
//   }

//   // Extract the token after 'Bearer '
//   const token = authHeader.split(' ')[1];

//   // Verify the token
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: "JWT verification error", error: err.message });
//     }

//     // Attach the decoded user to the request object
//     req.user = user;
//     next(); // Proceed to the next middleware or route handler
//   });
// };


import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader); // Log the header

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: "Token is required" });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "JWT verification error", error: err.message });
    }

    req.user = user; // Attach decoded user to request
    next(); // Proceed to the next middleware or route handler
  });
};


