var express = require('express');
var mongoose = require('mongoose');
var nconf = require('nconf');
var request = require('request');

var tokenManager = require('../lib/tokenManager.js');

var router = express.Router();

// Required models.
var UserModel = require('../models/user.js').model;
var TokenModel = require('../models/token.js').model;

// GET - Users list.
router.get('/', function(req, res) {

    UserModel.find(function(error, users) {
        if (error) {
            res.statusCode = 500;
            res.send("Error getting users: " + error);
            return;
        }
        res.statusCode = 200;
        res.send(users);
    });
});

// GET - Obtain a specific user.
router.get('/:id', function(req, res) {

    var id = req.param('id');

    // TODO We should require a valid token here.

    UserModel.findById(id, function(error, user) {
        if (error) {
            res.statusCode = 500;
            res.send("Error getting '" + id + "' user: " + error);
            return;
        }
        res.statusCode = 200;
        res.send(user);
    });
});

// POST - Create an user.
router.post('/', function(req, res) {

    // At the moment we only support google.
    if (req.param('provider') === 'google') {

        if (req.param('code') === null) {
            res.statusCode = 400;
            res.send("Missing params, can not create user");
            return;
        }

        // Get google access token.
        request.post({
            url: 'https://accounts.google.com/o/oauth2/token',
            form: {
                code             : req.param('code'),
                client_id        : nconf.get('G_OAUTH_CLIENT_ID'),
                client_secret    : nconf.get('G_OAUTH_CLIENT_SECRET'),
                redirect_uri     : 'http://localhost',
                grant_type       : 'authorization_code'
            }
        }, function (error, resp, body) {

            if (error) {
                res.statusCode = 500;
                res.send("Can not get token from google. Error: " + error);
                return;
            }

            var gTokenData = JSON.parse(body);

            // Get google profile info.
            request.get({
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + gTokenData.access_token,
            }, function(error, resp, body) {

                if (error) {
                    res.statusCode = 500;
                    res.send("Can not get google user data. Error: " + error);
                    return;
                }

                var gUserData = JSON.parse(body);

                UserModel.findOne({email: gUserData.email}, function(error, user) {

                    if (error) {
                        res.statusCode = 500;
                        res.send("Can not get user instance. Error: " + error);
                        return;
                    }

                    // Here we process all the user info and
                    // save the new user into our database.
                    var userObj = {
                        email : gUserData.email,
                        name : gUserData.given_name + ' ' + gUserData.family_name,
                        locale : gUserData.locale,
                        googletoken : gTokenData.access_token
                    };

                    // Not sure if the picture is always there...
                    if (gUserData.picture) {
                        userObj.pictureurl = gUserData.picture;
                    }

                    // TODO regex here to filter.
                    var gcmregid = req.param('gcmregid');

                    // TODO Check all this update registered users data from
                    // just a google email is safe; look for the returned token
                    // is it the same one? Can we use it to check against?
                    if (!user) {

                        // Add the GCM registration id if present (not present in web interface).
                        if (gcmregid) {
                            userObj.gcmregids = [gcmregid];
                        }

                        // If the user already exists we update the
                        // existing user and we return it.
                        var user = new UserModel(userObj);
                    } else {
                        // Update the existing user.

                        var updatingUser = true;
                        for (index in userObj) {
                            user[index] = userObj[index];
                        }

                        var now = new Date(); 
                        user.modified = new Date(
                            now.getUTCFullYear(),
                            now.getUTCMonth(),
                            now.getUTCDate(),
                            now.getUTCHours(),
                            now.getUTCMinutes(),
                            now.getUTCSeconds()
                        );

                        // Add the GCM registration id if is new.
                        if (gcmregid) {
                            if (user.gcmregids.length > 0) {
                                for (index in user.gcmregids) {
                                    if (user.gcmregids[index] === gcmregid) {
                                        var found = 1;
                                        break;
                                    }
                                }
                                // Adding the new one to the existing one.
                                if (typeof found === 'undefined') {
                                    user.gcmregids.push(gcmregid);
                                }
                            } else {
                                // We add the new one.
                                user.gcmregids = [gcmregid];
                            }
                        }
                    }

                    user.save(function(error) {

                        if (error) {
                            res.statusCode = 500;
                            res.send("Error saving user: " + error);
                            return;
                        }

                        // We auto-login the user.
                        var tokenData = tokenManager.new(user.id);
                        var token = TokenModel(tokenData);
                        token.save(function(error) {
                            if (error) {
                                res.statusCode = 500;
                                res.send('Error creating token: ' + error);
                                return;
                            }

                            // Add the token to the user object.
                            var returnUser = {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                pictureurl: user.pictureurl,
                                token: token.token
                            };

                            if (typeof updatingUser !== 'undefined') {
                                res.statusCode = 200;
                            } else {
                                res.statusCode = 201;
                            }
                            res.send(returnUser);
                            return;
                        });
                    });
                });
            });
        });
    } else {

        res.statusCode = 400;
        res.send("Incorrect provider");
        return;
    }
});


// PUT - Update a user.
router.put('/:id', function(req, res) {
    res.send("Not supported");
});

router.post('/:id', function(req, req) {
    res.send("Not supported.");
});

router.delete('/:id', function(req, res) {
    res.send("Not supported.");
});

router.delete('/', function(req, res) {
    res.send("Not supported.");
});

router.put('/', function(req, res) {
    res.send("Not supported.");
});

module.exports = router;
