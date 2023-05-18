const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Your Name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please Provide Your Email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid Email",
    },
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please Provide Your Name"],
    minlength: 6,
  },
});

userSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('password'));

  // Added this because sometime i may want to use .save() method in the controllers and I don't want to hash user's password again. Vid 36
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const passwordCheck = await bcrypt.compare(candidatePassword, this.password);
  return passwordCheck;
};

module.exports = mongoose.model("User", userSchema);
