const client = require('axios').default
const hasher = require('md5')
const parser = require('xml-js')
const crypto = require('crypto')
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
        const isError = accessTokenJs.UserLogin
        const output = (isError) ? accessTokenJs.UserLogin._attributes.errorMessage : accessTokenJs.UserService.UserLogin._attributes.accessToken

        return output
    } catch (error) {return error}
}

module.exports = {
    getAccessToken
}