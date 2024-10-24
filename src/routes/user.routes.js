import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfileDetails
} from "../controllers/user.controllers.js";
// import { imageGenerator } from "../controllers/dalle.controllers.js"; 
import { verifyJWT } from "../middleware/auth.middleware.js";



const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);

// router.route("/generateimage").post(imageController);


router.get('/:userId/profile', getProfileDetails);
export default router;





