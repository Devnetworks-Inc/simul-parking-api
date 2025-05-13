const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const accountSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'admin'
    },
  },
  {
    collection: 'user',
    timestamps: false
  }
);

accountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(10, 'a');
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

accountSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const AccountEntity = mongoose.model('user', accountSchema);
module.exports = { AccountEntity };
