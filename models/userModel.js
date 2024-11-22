const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A User must have a name.'],
        trim: true,
        maxLength: [40, 'name cant surpass 40 characters.'],
        minLength: [6, 'name must be 6 characters and above'],
    },
    email: {
        type: String,
        required: [true, 'A User must have an email.'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'email not valid.'],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'password needs to be provided.'],
        minLength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'password must be confirmed.'],
        validate: {
            //THIS ONLY WORKS ON save AND create
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords not matching.',
        },
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
