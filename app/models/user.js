'use strict';

var mongoose = require('mongoose');
var passwordHelper = require('../helpers/password');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var _ = require('lodash');
var shortId = require('shortid');


var UserSchema = new Schema({
    email:  {
        type: String,
        //required: true,
        unique: true
    },
    name: {
        type: String
    },
    username:  {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    password: {
        type: String,
        //required: true,
        select: false
    },
    passwordSalt: {
        type: String,
        //required: true,
        select: false
    },
    profile_id: {
        type: String
    },
    image_url: {
        type: String
    },

    provider: {
        type: String
    },
    phoneNumber: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

//UserSchema.pre('save', function(next) {
//    var self = this;
//    this.username = this.username || shortId.generate();
//    if (!(this.isNew)) {
//        return next();
//    }
//});

/**
 * Create a new user with the specified properties
 *
 * @param {Object} opts - user data
 * @param {Function} callback
 */
UserSchema.statics.register = function(opts, callback) {
    var self = this;
    var data = _.cloneDeep(opts);

    if (!opts.password) {
        return callback(new Error('missing password'));
    }

    //hash the password
    passwordHelper.hash(opts.password, function(err, hashedPassword, salt) {
        if (err) {
            return callback(err);
        }

        data.password = hashedPassword;
        data.passwordSalt = salt;

        //create the user
        self.model('User').create(data, function(err, user) {
            if (err) {
                return callback(err, null);
            }

            // remove password and salt from the result
            user.password = undefined;
            user.passwordSalt = undefined;
            // return user if everything is ok
            callback(err, user);
        });
    });
};


/**
 * Find a user by it's email and checks the password againts the stored hash
 *
 * @param {String} email
 * @param {String password
 * @param {Function} callback
 */
UserSchema.statics.authenticate = function(email, password, callback) {
    this.findOne({ email: email }).select('+password +passwordSalt').exec(function(err, user) {
        if (err) {
            return callback(err, null);
        }

        // no user found just return the empty user
        if (!user) {
            return callback(err, user);
        }

        // verify the password with the existing hash from the user
        passwordHelper.verify(password, user.password, user.passwordSalt, function(err, result) {
            if (err) {
                return callback(err, null);
            }

            // if password does not match don't return user
            if (result === false) {
                return callback(err, null);
            }

            // remove password and salt from the result
            user.password = undefined;
            user.passwordSalt = undefined;
            // return user if everything is ok
            callback(err, user);
        });
    });
};

module.exports = mongoose.model('User', UserSchema);