const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const accountSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['client', 'freelancer'],
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    profileAvatar: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'account',
    timestamps: false
  }
);

// Pre-save hook for hashing password
accountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(10, 'a');
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

// Instance method to validate password
accountSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const AccountEntity = mongoose.model('Account', accountSchema);
module.exports = { AccountEntity };
