import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";
import AppError from "../../utils/ErrorClass.js";

// @desc    getAllUsers
// @route   GET /api/v1/auth
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const user = await userModel.find();
  res.status(201).json({ msg: "success", user });
});

// @desc    SignUp
// @route   POST /api/v1/auth/signUp
export const signUp = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  const emailExist = await userModel.findOne({ email });
  if (emailExist) return next(new AppError(400, "Email already exist"));

  const hash = await bcrypt.hash(password, 8);

  const user = await userModel.create({
    fullName,
    email,
    password: hash,
    confirmed: "true",
  });
  res.status(201).json({ msg: "success", user });
});

// @desc    SignUp Service Provider
// @route   POST /api/v1/auth/provider
export const signUp_provider = asyncHandler(async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    phone,
    serviceType,
    yearsOfExperience,
    aboutYou,
  } = req.body;

  // check if user exist
  const emailExist = await userModel.findOne({ email });
  if (emailExist) return next(new AppError(400, "Email already exist"));

  // hash password
  const hash = await bcrypt.hash(password, 8);

  // create user
  const user = await userModel.create({
    fullName,
    email,
    password: hash,
    phone,
    serviceType,
    yearsOfExperience,
    aboutYou,
    role: "serviceProvider",
  });
  res.status(201).json({ msg: "success", user });
});

// @desc    signIn
// @route   POST /api/v1/auth/signIn
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if user exist
  const userExist = await userModel.findOne({ email });
  if (!userExist) return next(new AppError(400, "User not exist"));

  // check if user confirmed
  const userConfirmed = await userModel.findOne({ email, confirmed: "true" });
  if (!userConfirmed)
    return next(new AppError(400, "Service Provider not confirmed"));

  // check password matched
  const isPassMatched = await bcrypt.compare(password, userExist.password);
  if (!isPassMatched) return next(new AppError(400, "Invalid password"));

  // create token
  const token = jwt.sign(
    { id: userExist._id, email: userExist.email.toLowerCase() },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    msg: "signIn success",
    user: { name: userExist.fullName, role: userExist.role },
    token,
  });
});

// @desc    confirm service provider
// @route   PATCH /api/v1/auth/provider/confirm_provider
export const confirm_provider = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // check if user exist
  const userExist = await userModel.findOne({ email });
  if (!userExist) return next(new AppError(400, "User not exist"));

  // confirm service provider
  const userConfirmed = await userModel.findOneAndUpdate(
    { email },
    { confirmed: "true" },
    { new: true }
  );
  res.status(200).json({ msg: "update success", user: userConfirmed });
});
