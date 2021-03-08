const authentication = require('./authentication.js');
const users = require('./users.js');
const asyncHandler = require('../helpers/asyncHandler');
const { models } = require('../database');
const Task = models.Task;
const User = models.User;
const { v4: uuidv4 } = require('uuid');

const routing = {
    initialize: ({app, express}) => {

        app.use(express.json()); // for parsing application/json
        app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        app.use('/auth', authentication);
        app.use('/api/v1/users/', users); // use the user.js file for all routes that start with '/api/users/'

        app.get('/', asyncHandler(async (req, res) => {
            if (!req.user) {
                res.send(`<h1>Example TODO list</h1><p>Hello! <a href="/auth/github">Login with GitHub</a> for your to do list</p>`);
                return;
            }
            const user = await User.findOne({where: { uuid: req.user.uuid }});
            const tasks = await Task.findAll({where: { userId: user.id }});
            res.send(
                `
                <h1>Example TODO list</h1>
                <p>Hello ${req.user.username}!</p>
                <p>Hello ${req.user.uuid}!</p>
                <p><a href="/logout">Logout</a></p>
                <form action="/api/v1/users/${req.user.uuid}/tasks/" method="post">
                    <input name="content" value="buy groceries" />
                    <input name="uuid" type="text" value="${uuidv4()}" style="pointer-events: none; width:300px;" />
                    <button name="submit" type="submit" value="post">Submit</button>
                </form>
                <ul>
                ${tasks.reduce((html, task) => html + `
                    <li>
                        <form action="/api/v1/users/${req.user.uuid}/tasks/${task.dataValues.uuid}" method="post">
                            <input type="text" name="content" value="${task.dataValues.content}" />
                            <input type="checkbox" name="isComplete" ${task.dataValues.isComplete ? 'checked=true' : ''} />
                            <button type="submit" name="submit" value="put">Submit</button>
                        </form>
                        <form action="/api/v1/users/${req.user.uuid}/tasks/${task.dataValues.uuid}" method="post">
                            <button type="submit" name="submit" value="delete">🗑️</button>
                        </form>
                    </li>`, '')}
                </ul>
                `
            );

        }));

        app.get('/login', function(req, res) {
            if (!req.user) {
                res.send(`<a href="/auth/github">Login with GitHub</a>`);
                return;
            }
            res.send(`You are already logged in.`);
        });

        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });

        // Handle 404 - Keep this as a last route for unhandled bad client requests
        app.use(function(_req, res) {
            res.status(404);
            res.send(`<h1>This page does not exist.</h1>`);
        });

        // error handler middleware
        app.use((error, req, res, next) => {
            // Client errors
            // Handle Redirect to 403 - Unauthorized user

            if (error.status === 403) {
                res.status(403);
                res.send(`<h1>You're not allowed here!</h1>`);
                return;
            }
            console.error(error);
            res.status(error.status || 500).json({
                success: false,
                error: {
                    status: error.status || 500,
                    message: error.message || 'Internal Server Error',
                },
            });
            next();
        });
    }

};

module.exports = routing;
