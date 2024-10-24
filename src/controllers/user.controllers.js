import { isValidElement } from "react"; // Not needed; you can remove this import if not used
import { User } from "../models/user.models.js";
import Post from "../models/post.models.js";

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userid) => {
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

// Register User
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

    // Send success response
    return res
      .status(201)
      .json({ message: "User created successfully" });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  
  try {
    const { usernameOrEmail, password } = req.body;

    console.log('Request Body:', req.body);

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
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    console.log("Access Token:", accessToken); // Log token to verify
    console.log("Refresh Token:", refreshToken); // Log token to verify

    if (!accessToken) {
      throw new Error("Access token generation failed.");
    }

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(200).json({
      message: "Login successful",
      accessToken, 
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};
//Logout User

// const login = async (req, res) => {
//   // Authenticate user (check username and password)

//   const user = await User.findOne({ username: req.body.username });
//   if (!user || !await user.comparePassword(req.body.password)) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   // Generate JWT
//   const token = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: '1d',
//   });

//   res.json({ token }); // Send the token to the client
// };


const logoutUser = async (req, res) => {
  try {
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
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "Logged out successfully"
      });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    
    // Ensure the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid old password"
      });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get Profile Details
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

export { registerUser, loginUser, logoutUser, changePassword, getProfileDetails };
