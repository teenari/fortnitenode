const ItemParser = require("./ItemParser");

class StoreParser {
    constructor(storefront) {
        this.storefront = storefront;
    }

    parse() {
        let store = {
            featuredItems: [],
            dailyItems: [],
        };
        let starterkits = [];
        let giftAbleItems = [];

        for (var i = 0; i < this.storefront.storefronts.length; i++) {
            const object = this.storefront.storefronts[i];
            switch(object.name) {
                case "BRWeeklyStorefront": 
                    case "BRSpecialFeatured":
                        store.featuredItems = store.featuredItems.concat(object.catalogEntries);
                    break;
                case "BRDailyStorefront": 
                    case "BRSpecialDaily":
                        store.dailyItems = store.dailyItems.concat(object.catalogEntries);
                    break;
                case "BRStarterKits": {
                    for (var s = 0; s < object.catalogEntries.length; s++) {
                        const starterpack = object.catalogEntries[s];
                        starterkits.push(starterpack);    
                    }
                } break;
                case "GiftableItems" : {
                    for (var s = 0; s < object.catalogEntries.length; s++) {
                        const giftableitem = object.catalogEntries[s];
                        giftAbleItems.push(giftableitem);    
                    }
                } break;
            }
        }

        for (i = 0; i < 2; i++) {
            const object = store[Object.keys(store)[i]]
            for (var p = 0; p < object.length; p++) {
                var item = object[p];
                item = new ItemParser(item).parse();
            }
        }

        for (var a = 0; a < starterkits.length; a++) {
            var object = starterkits[a];
            object = new ItemParser(object).parse();
        }

        for (var a = 0; a < giftAbleItems.length; a++) {
            var object = giftAbleItems[a];
            object = new ItemParser(object).parse();
        }

        return {
            starterkits,
            itemShop: store,
            giftAbleItems,
        };
    }
}

module.exports = StoreParser;