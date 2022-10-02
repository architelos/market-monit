const axios = require('axios').default
const parser = require('xml-js')
const fs = require('node:fs')
const itemObj = {}

async function main() {
    const itemData = await axios.get(`https://api.pixelstarships.com/ItemService/ListItemDesigns2?languageKey=en`)
    const itemArray = parser.xml2js(itemData.data, {compact: true, spaces: 4}).ItemService.ListItemDesigns.ItemDesigns.ItemDesign

    for (const i in itemArray) {
        const currentData = itemArray[i]
        if (currentData._attributes.FairPrice != 0) {
            const itemDesignId = currentData._attributes.ItemDesignId
            const itemDesignName = currentData._attributes.ItemDesignName

            itemObj[itemDesignName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] = itemDesignId
            itemObj[itemDesignId] = itemDesignName
        }
    }
    fs.writeFileSync('./items.json', JSON.stringify(itemObj, null, 4))
}

main()
