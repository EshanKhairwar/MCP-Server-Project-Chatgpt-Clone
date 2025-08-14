const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken')
async function getRegisterController(req, res) {
  res.render("register");
}

async function postRegisterController(req, res) {
  // console.log("Api Running")
  const { username, email, password } = req.body;

  let ifUserExists = await UserModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (ifUserExists) {
    return res.status(400).json({
      message: "User Already Exists with this username or email",
    });
  }
  const hashedPassword= await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    username,
    email,
    password: hashedPassword,
  });
  const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
  
  res.cookie('token',token)
  
  return res.status(201).json({
    message:"User Created Successfully!!!",
    user
  })
}

async function getLoginController(req,res){
  res.render("login");
}
async function postLoginController(req, res) {
  const { identifier, password } = req.body; // identifier can be email or username

  // Find user by email or username
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }]
  });

  if (!user) {
    return res.redirect('/auth/login?error=User Not Found');
  }

  // Compare hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.redirect('/auth/login?error=Invalid Password');
  }

  // Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  // Set cookie
  res.cookie('token', token, { httpOnly: true });

  return res.status(200).json({
    message: "User Logged In Successfully",
    user
  });
}


module.exports = { getRegisterController, postRegisterController,getLoginController, postLoginController };
