import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userschema = new Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
      index: true,
      tolowercase: true,
      unique: true,
    },
    fullname: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      index: true,
      tolowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // If password is not modified, move to the next process

  this.password = await bcrypt.hash(this.password, 10); // If password is modified, hash it
  next(); // Proceed to the next middleware or save the document
});


userschema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userschema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userschema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userschema);
