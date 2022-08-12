const {getAccessToken} = require('./helpers')
const consoleColors = require('chalk')
const asciiArt = require('figlet')

console.log(`${asciiArt.textSync('market-monit')}`)
console.log(`Pixel Starships market monitoring tool by architelos#6702 - ${consoleColors.bold('Use at your own discretion.')}\n`)

getAccessToken().then(accessToken => {
    if (!accessToken.match(/.{8}-.{4}-/)) {
        console.log(`${consoleColors.red('Login failed:')} ${accessToken}`)
        process.exit(1)
    }

    console.log(`${consoleColors.green('Login succeeded!')}`)
})