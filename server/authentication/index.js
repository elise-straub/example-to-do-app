const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { User } = require('../database').models;
const env = require('../../config');
const { v4: uuidv4 } = require('uuid');
const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
const HOST = env.HOST;
const { POSTMAN } = require('../../config/constants');

const authentication = {
    initialize: ({ app, database }) => {
        passport.serializeUser(function(user, done) {
            return done(null, {uuid: user.uuid, username: user.username});
        });

        passport.deserializeUser(async function(user, done) {
            const userFound = await User.findOne({where: { uuid: user.uuid }});
            if (!userFound) {
                return done(new Error('Could not find username'), null);
            }
            return done(null, {uuid: user.uuid, username: user.username});
        });

        passport.use(new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: `${HOST}/auth/github/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
            if (!profile.username) {
                return done(new Error('Could not find username line 37'), null);
            }
            const user = await User.findOrCreate({
                where: { username: profile.username },
                defaults: {
                    uuid: uuidv4(),
                    username: profile.username,
                    password: '',
                    token: accessToken
                }
            });
            return done(null, user[0].dataValues);
        }));
        app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: false, store: new SequelizeStore({db: database.sequelize}) }));
        app.use(passport.initialize());
        app.use(passport.session());
    },
    ensureAuthenticated: (req, res, next) => {
        if (process.env.NODE_ENV === POSTMAN) {
            req.user = {id: 1};
            return next();
        }
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    },
    ensureAuthorized: (req, res, next) => {
        if (process.env.NODE_ENV === POSTMAN) return next();
        if (!req.params.userUuid) return next();
        if (req.params.userUuid === req.user.uuid) return next();

        const err = new Error(`Unauthorized user. You're not allowed here!`);
        err.status = 403;
        return next(err);
    }
};

module.exports = authentication;
