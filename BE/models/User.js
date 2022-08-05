const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  user_name: {
    type: String,
    unique: 1,
    minlength: 1,
  },
  user_email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 6,
  },
  certificationNumber: {
    type: String,
    default: 1,
  },
  userAccessToken: {
    type: String,
  },
  userRefreshToken: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
  provider: {
    type: String,
  },
  user_projects: {
    type: Array,
    default: [],
  },
});

//useFlag 값 : 0(삭제), 1(이메일 인증 필요), 2(정상적으로 사용 가능한 상태)

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    // console.log('password changed')
    bcryptjs.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcryptjs.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcryptjs.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  // console.log('user',user)
  // console.log('userSchema', userSchema)
  var AccessToken = jwt.sign({ data: user._id.toHexString() }, "SECRET", {
    expiresIn: "1h",
  });

  var RefreshToken = jwt.sign({ data: user._id.toHexString() }, "SECRET", {
    expiresIn: "14d",
  });

  user.userAccessToken = AccessToken;
  user.userRefreshToken = RefreshToken;

  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.verifyToken = function (token, cb) {
  try {
    // console.log("tokens are good");
    return jwt.verify(token, "SECRET");
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      // console.log("토큰 기한 만료!!");
      return null;
    } else if (e.name === "JsonWebTokenError") {
      // console.log("토큰이 없습니다!");
      return null;
    } else {
      // console.log("다른 에러... 뭐가 있지22222222 : " + e.name);
      return -1;
    }
  }
};

userSchema.statics.findUserByToken = function (decode, token) {
  return new Promise((resolve, reject) => {
    User.findOne(
      { _id: decode.data, userAccessToken: token },
      function (err, user) {
        if (err) {
          return reject(err);
        }
        return resolve(user);
      }
    );
  });
};

userSchema.statics.generateAccessToken = function (refreshToken) {
  console.log("엑세스 토큰 새롭게 생성!!");

  return new Promise((resolve, reject) => {
    try {
      User.findOne({ _id: refreshToken.data }, function (err, user) {
        if (err) {
          reject(err);
        } else {
          console.log(user);
          if (user === null) {
            return resolve(null);
          }
          if (user?._id === null) {
            return resolve(null);
          }
          var AccessToken = jwt.sign(
            { data: user?._id.toHexString() },
            "SECRET",
            {
              expiresIn: "1h",
            }
          );

          user.userAccessToken = AccessToken;

          user.save(function (err, user) {
            if (err) reject(err);
            resolve(user);
          });
        }
      });
    } catch (err) {
      console.log("user find fail in generateAccessToken");
      resolve(null);
    }
  });
};

userSchema.statics.generateRefreshToken = function (accessToken) {
  console.log("리프레시 토큰 새롭게 생성!!");

  return new Promise((resolve, reject) => {
    try {
      User.findOne({ _id: accessToken.data }, function (err, user) {
        console.log("generateRefreshToken err : ", err);
        if (err) {
          reject(err);
        } else {
          var RefreshToken = jwt.sign(
            { data: user._id.toHexString() },
            "SECRET",
            {
              expiresIn: "14d",
            }
          );

          user.userRefreshToken = RefreshToken;

          user.save(function (err, user) {
            if (err) reject(err);
            resolve(user);
          });
        }
      });
    } catch (error) {
      console.log("generateRefreshToken error : ", error);
      resolve(null);
    }
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
