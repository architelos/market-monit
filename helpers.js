const client = require('axios').default
const hasher = require('md5')
const parser = require('xml-js')
const crypto = require('crypto')
const consoleColors = require('chalk')
const fs = require('node:fs')

const deviceTypes = ['DeviceTypeWindows', 'DeviceTypeAndroid', 'DeviceTypeMac', 'DeviceTypeIPhone', 'DeviceTypeGeneric']
const loginData = {
    deviceKey: crypto.randomBytes(8).toString('hex'),
    dateTime: new Date().toISOString().slice(0, -5),
    deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
    uselessParams: '&advertisingKey=&isJailBroken=False&signal=False&languageKey=en&refreshToken=&appsFlyerId=&lat=False&osVersion=&locale=en_US&deviceName=&build='
}
const deviceChecksum = hasher(`${loginData.deviceKey}${loginData.dateTime}${loginData.deviceType}5343savysoda`)
const baseUrl = 'https://api.pixelstarships.com'

async function getAccessToken() {
    try {
        const accessTokenXml = await client.post(`${baseUrl}/UserService/DeviceLogin11?deviceType=${loginData.deviceType}&deviceKey=${loginData.deviceKey}&checksum=${deviceChecksum}&clientDateTime=${loginData.dateTime}${loginData.uselessParams}`)
        const accessTokenJs = parser.xml2js(accessTokenXml.data, {compact: true, spaces: 4})
        const isTokenError = accessTokenJs.UserLogin
        const accessToken = isTokenError
                            ? accessTokenJs.UserLogin._attributes.errorMessage
                            : accessTokenJs.UserService.UserLogin._attributes.accessToken

        return accessToken
    } catch (error) {return error}
}

async function getCurrentListings(accessToken, itemId) {
    try {
        const currentListingsXml = await client.get(`${baseUrl}/MessageService/ListActiveMarketplaceMessages5?&itemDesignId=${itemId}&accessToken=${accessToken}&itemSubType=None&rarity=None&currencyType=Unknown&userId=0`)
        const currentListingsJs = parser.xml2js(currentListingsXml.data, {compact: true, spaces: 4})
        const isListingError = currentListingsJs.ListActiveMarketplaceMessages
        const currentListings = isListingError
                                ? currentListingsJs.ListActiveMarketplaceMessages._attributes.errorMessage
                                : currentListingsJs.MessageService.ListActiveMarketplaceMessages.Messages.Message

        return currentListings
    } catch (error) {return error}
}

function welcomeMessage() {
    console.log(fs.readFileSync('./title.txt').toString())
    console.log(`Pixel Starships market monitoring tool by architelos#6702 - ${consoleColors.bold('Use at your own discretion.')}\n`)
}

function clearLastLine() {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
}

function formatString(message, option) {
    if (option == 'currency') return `${message.split(':')[1]} ${message.split(':')[0]}`
    if (option == 'market') return message.substring(message.indexOf(' ' + 1))
    return
}

module.exports = {
    getAccessToken,
    getCurrentListings,
    welcomeMessage,
    clearLastLine,
    formatString
}