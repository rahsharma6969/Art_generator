import { isValidElement } from "react";
import { User } from "../models/user.models.js";
import Post  from "../models/post.models.js";


const generateAccessAndRefereshTokens = async (userid) => {
  const user = await User.findById(userid);

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};



const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    
    console.log(req.body);
    
    // Check for missing fields
    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        message: "Every field is required",
      });
    }

    // Check if user already exists by username or email
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    // Create new user
    const newUser = await User.create({ fullname, username, email, password });

    // Retrieve created user without password and refreshToken
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if (!createdUser) {
      return res.status(500).json({
        message: "Something went wrong from the server",
      });
    }

    // Send success response
    return res
      .status(201)
      .json({message : "user created successfully"});
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


 
const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body; // Ensure this matches the frontend

    console.log('Request Body:', req.body); // Log the request body

    // Check if username or email is provided
    if (!usernameOrEmail) {
      return res.status(400).json({
        message: "Username or Email is required"
      });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    // Find the user in the database using either username or email
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });

    if (!user) {
      console.log('User not found:', usernameOrEmail);
      return res.status(404).json({
        message: "User does not exist"
      });
    }

    // Check if the password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log('Password valid:', isPasswordValid); // Log the password check result

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    // Fetch the user details excluding the password and refreshToken
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      sameSite: 'Strict' // Adjust according to your needs
    };

    // Return the response with cookies and the user details
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: loggedInUser,
        accessToken,
        message: "User logged in successfully"
      });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Login error:', error); // Log the error for debugging
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



const logoutUser = async(req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset: {
              refreshToken: 1 // this removes the field from document
          }
      },
      {
          new: true
      }
  )

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json((200, {}, "logged Out Successfully"))
}

const ChangePassword = async (req, res) => {
  const {oldPassword, newPassword}  = req.body;

 const user = await User.findById(req.user?._id)

 const isPasswordCorrect = user.isPasswordCorrect(oldPassword)


  if(!isPasswordCorrect){
    throw new res.status(400).json({
      message:"Invalide old password"
    })
  }
  user.password = newPassword
  await  user.save({validateBeforeSave: false})

 return res.status(200).json({
  message: "password change successfully"
 })

}

const getProfileDetails = async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching profile details for userId:", userId);

  try {
    const user = await User.findById(userId).select("-password");
    const posts = await Post.find({ userId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user, posts });
  } catch (err) {
    console.error("Error fetching profile details:", err.message);
    res.status(500).json({ success: false, message: 'Error fetching user profile', error: err.message });
  }
};



export { registerUser, loginUser, logoutUser, getProfileDetails}