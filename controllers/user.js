const _ = require('lodash');
const User = require('../models/user');

exports.userById = (req, res, next) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user //adds profile object in req with user info
        next()
    });
};

exports.hasAuthorization = (req, res, next) => {
    const authorised = req.profile && req.auth && req.profile._id === req.auth._id;
    if (!authorised) {
        return res.status(403).json({
            error: "User is not authorised to perform this action"
        });
    }
};

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({ users });
    }).select("name email updated created");
}

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
    
};

exports.updateUser = (req, res, next) => {
    let user  = req.profile
    user = _.extend(user, req.body) //extend - mutate the source object
    user.update = Date.now()
    user.save((err) => {
        if(err){
            return res.status(400).json({
                error: "You are not authorised to perform this action"
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({user})
    })
}
