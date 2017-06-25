const mongoose = require('mongoose'),
      bcrypt = require('bcryptjs'),
      validator = require('validator'),
      _ = require('lodash'),
      jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
      validator: validator.isEmail,
      message: `{val} is not a valid email.`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  profile: {
    userName: {
      type: String,
      trim: true
    },
    image: {
      type: String,
    },
    messsages: [{
      sentMsg: [],
      recMsg: [],
      draftMsg: []
    }],
    location: {
      city: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      }
    },
    bio: {
      type: String
    }
  }
});

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObj = user.toObject();
  return _.pick(userObj, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded = undefined;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  }catch(e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, password){
  var User = this;
  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(res)
        }else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function(next){
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User}