
const { each } = require('lodash');
let environmentVariables = {};
if(process.env.NODE_ENV === 'production') {
    each(process.env, (value, key) => environmentVariables[key] = value);

} else {
    const configPath = `${__dirname}/.env.${process.env.NODE_ENV}`;
    const config = require('dotenv').config({path: configPath });

    if (!config.error) {
        environmentVariables = config.parsed;
    } else {
        console.error(`Environment error is: ${config.error}.`);
        each(process.env, (value, key) => environmentVariables[key] = value);
    }

}


module.exports = environmentVariables;
