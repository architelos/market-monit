const {getAccessToken, getCurrentListings, welcomeMessage, clearLastLine} = require('./helpers')
const consoleColors = require('chalk')
const currentAccessToken = new Array()

process.on('unhandledRejection', (reason, promise) => {
    console.log(`${consoleColors.red('Unhandled promise rejection:')} ${reason}`)
    process.exit(1)
})

process.on('uncaughtException', (error, location) => {
    console.log(`${consoleColors.red('Uncaught exception:')} ${error}`)
    process.exit(1)
})

welcomeMessage()

async function setAccessToken() {
    console.log('Logging in...')

    const accessToken = 'c27f2dbb-f2c3-4090-9a18-c24ef3d05ce0'
    if (!accessToken.match(/.{8}-.{4}-/)) {
        clearLastLine()
        console.log(`${consoleColors.red('Login failed:')} ${accessToken}`)
        process.exit(1)
    }

    clearLastLine()
    console.log(`${consoleColors.green('Login succeeded:')} ${accessToken}`)
    currentAccessToken.push(accessToken)
}

setInterval(setAccessToken, 288 * 100000)
setAccessToken()

const accessToken = currentAccessToken.pop()

async function marketMonit() {
    console.log('Scanning market...')

    const currentListings = await getCurrentListings(accessToken, 81)
    clearLastLine()

    console.log(currentListings.at(-1))
}

if (require.main == module) setInterval(marketMonit, 3000)