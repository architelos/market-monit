const {getAccessToken, getCurrentListings, welcomeMessage, clearLastLine, formatString} = require('./helpers')
const consoleColors = require('chalk')
const fs = require('node:fs')

const [currentAccessToken, lastSaleId] = [new Array(), new Array()]
const itemDatabase = JSON.parse(fs.readFileSync('./items.json'))
let accessToken

process.on('unhandledRejection', (reason, promise) => {
    console.log(`${consoleColors.red('Unhandled promise rejection:')} ${reason}`)
    process.exit(1)
})

process.on('uncaughtException', (error, location) => {
    console.log(`${consoleColors.red('Uncaught exception:')} ${error}`)
    process.exit(1)
})

welcomeMessage()
let itemId = require('readline-sync').question('Item name/id: ').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
if (!itemDatabase.hasOwnProperty(itemId)) {
    console.log(consoleColors.red('Item does not exist/is not sellable.'))
    process.exit(1)
}
itemId = itemDatabase[itemId]
clearLastLine()

async function setAccessToken() {
    console.log('Logging in...')

    const accessToken = await getAccessToken()
    if (!accessToken.match(/.{8}-.{4}-/)) {
        clearLastLine()
        console.log(`${consoleColors.red('Login failed:')} ${accessToken}`)
        process.exit(1)
    }

    clearLastLine()
    console.log(`${consoleColors.green('Login succeeded!')}`)
    currentAccessToken.push(accessToken)
}

setInterval(setAccessToken, 288 * 100000)
setAccessToken()

async function marketMonit() {
    if (!accessToken) accessToken = currentAccessToken.pop()
    console.log('Scanning market...')
    
    const currentListings = await getCurrentListings(accessToken, itemId)
    if (typeof currentListings != 'object') {
        clearLastLine()
        console.log(`${consoleColors.red('Retrieving current listings failed:')} ${currentListings}`)
        process.exit(1)
    }
    clearLastLine()

    const lastListing = currentListings.at(-1)._attributes
    const saleId = lastListing.SaleId
    const currency = formatString(lastListing.ActivityArgument, 'currency')
    const message = formatString(lastListing.Message, 'market')

    if (!lastSaleId.length) lastSaleId.push(saleId)
    if (lastSaleId[0] != saleId) {
        lastSaleId.pop()

        console.log(`${lastListing.UserName} is selling${message} (${currency})`)
        lastSaleId.push(saleId)
    }
}

if (require.main == module) setInterval(marketMonit, 3000)