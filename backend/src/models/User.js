
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // select:false => the hash is never loaded unless a query asks for it explicitly
    // (only login does). toJSON below strips it again as a second safety net.
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 250,
    },

    profilePic: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "",
      enum: [
        "",
        "Student",
        "Software Developer",
        "Designer",
        "Freelancer",
        "Entrepreneur",
        "Other",
      ],
    },

    interests: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      default: "",
    },

    isOnboarded: {
      type: Boolean,
      default: false,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Whatever a controller returns, the password hash and internal version key never leave the server.
const stripPrivateFields = (_doc, ret) => {
  delete ret.password;
  delete ret.__v;
  return ret;
};
userSchema.set("toJSON", { transform: stripPrivateFields });
userSchema.set("toObject", { transform: stripPrivateFields });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(
    enteredPassword,
    this.password
  );

  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

export default User;