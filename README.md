# Example Project - To Do List App
For CodeLou Full-stack Javascript Class 2021

### Demo:
https://eg-todo-app-code-lou-1-1-2021.herokuapp.com/
### User stories:

- As an authenticated user, I can see my personal to-do list
- As an authenticated user, I can add items to my to-do list
- As an authenticated user, I can edit items on my to-do list
- As an authenticated user, I can delete items on my to-do list

### Planning
1. Initialize Project
   - README initial set up for planning
   - Editor Linting (EsLint)
   - Test Runner (mocha)
   - Babel
   - Logger (hindsight - pending)
   - Nodemon Dev tool
   - Express server
   - .env file (Environment Variables)
   - package.json
2. Set up Routes with Unit Tests and Debugging With Postman
3. Set up Sqlite and Sequelize and Unit Test
4. Set up GitHub oAuth authentication
5. Set up route authorization
6. Deploy On Heroku
7. Set up API Documentation
8. Refactoring/Improve Code Quality

### Database Design
**user**
- id (auto-generated with sqlite)
- uuid
- username
- password (hashed with salt - MD5 or SHA1) - TODO unused with only oauth authentication
- token - TODO unused with only oauth authentication
- createdAt (auto-generated with sqlite)
- updatedAt (auto-generated with sqlite)

**task**
- id (auto-generated with sqlite)
- uuid
- userId (foreign key)
- content
- isComplete
- createdAt (auto-generated with sqlite)
- updatedAt (auto-generated with sqlite)

### Possible Next Steps (Optional)
- Build Front End
- Encrypt content for user privacy
- Allow unauthenticated users to create temporary to-do lists
- Static code analysis (Sonarqube)
- Sqlite associations for task and user
- use jwt tokens
- Sorting
- Different lists
- Integration test authentication
- Refactor: [Domain-Driven Design](https://medium.com/steve-cruz/domain-driven-design-ddd-file-structure-ade7fb26553d)
- Refactor: remove unit test setup duplication
- Refactor: fix user table with unused fields
- Refactor: use logger instead of console.log
- Add admin role that can create users
- Figure out why having a before request prevents database lock
## Server Technology, Libraries, and Tools
- ExpressJs
- Sequelize
- Sqlite
- Passport
- MochaJs
- Sinon

## Client Technology, Libraries, and Tools (Optional)
- [Pending]

## How To Run App Locally
1. Install the correct version of node listed in package.json (Use nvm to manage switching node versions e.g. `nvm use node` for latest version)
2. `$ npm ci`
3. `$ npm run serve`

## How To Test Api Using Postman
1. Follow the [Github directions](https://docs.github.com/en/developers/apps/building-github-apps) and get a clientId and clientSecret
2. Set up .env files for environments in config/constants
3. `$ npm ci`
4. `$ npm run serve`
5. Use the latest version of Postman
6. Import the Postman collection json file in the project folder into Postman
7. Run requests in order

## How to Run Unit Tests
`$ npm run test`

## Note To Self
- all api errors will return json and all url errors will return error pages
- Using oAuth for authentication is a hack. It was originally designed only for 3rd party api authorization. It worked so well for authentication, it became the norm. There is a new protocol for using oAuth called openId, but github doesn't seem to use it yet.
- sqlite database locks if bad code is introduced
- Authorization and authentication keeps getting mixed up, even in [http error codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
## References
- [Silence npm errors when running eslint](https://github.com/eslint/eslint/issues/7933)
- [Fields in a user table](https://dba.stackexchange.com/questions/3537/what-are-some-common-and-useful-fields-for-a-users-table-in-a-database)
- [Sql Naming conventions](https://www.sqlshack.com/learn-sql-naming-conventions/)
- [List of common passwords](https://en.wikipedia.org/wiki/List_of_the_most_common_passwords)
- [Reserved words in sqlite](http://www3.sqlite.org/lang_keywords.html)
- [Best Practices for api design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- [Git commit emojis](https://gist.github.com/parmentf/035de27d6ed1dce0b36a)
- [Node Logger](https://www.twilio.com/blog/guide-node-js-logging)
- [Errors in Node](https://www.joyent.com/node-js/production/design/errors)
- [Project Structure](https://softwareontheroad.com/ideal-nodejs-project-structure/)
- [Integration Tests](https://dev-tester.com/dead-simple-api-tests-with-supertest-mocha-and-chai/)
- [How To Choose an npm library](https://dev.to/adrianbdesigns/checklist-for-choosing-an-optimal-npm-package-4dpm)
- [.env for Heroku](https://stackoverflow.com/questions/42109813/node-js-environment-variables-and-heroku-deployment)
- [OAuth 2.0 and OpenID Connect in Plain English!](https://youtu.be/0VWkQMr7r_c)
- [Order of execution of Mocha hooks](https://stackoverflow.com/questions/32660241/mocha-beforeeach-vs-before-execution/32682451) Before and After must be in a describe block
