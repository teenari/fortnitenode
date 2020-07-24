class ItemParser {
    constructor(item) {
        this.item = item;
    }

    makeIdUpperCased(string, isID) {
        if(!string.includes("_")) return string;
        if(isID) {
            return string.split("_")[0].toUpperCase() + "_" + string.split(string.split("_")[0] + "_")[1].toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_');
        }
        return string.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_');
    }

    sortItemGrants(array) {
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if(item.templateId.includes("Mtx")) return array.filter(s => s.templateId == item.templateId);
            item.item = this.makeIdUpperCased(item.templateId.split(":")[1], true);
            delete item.templateId;
            delete item.quantity;
        }
        return array;
    }

    parse() {
        if(this.item.devName.includes("[VIRTUAL]")) {
            if(this.item.devName.split(`[VIRTUAL]1 x `)[1].split(",").length === 1) {
                this.item.itemName = this.item.devName.split(`[VIRTUAL]1 x `)[1].split(" for")[0];
            }
            else {
                this.item.itemName = this.item.devName.split(`[VIRTUAL]1 x `)[1].split(",")[0];
            }
        }
        if(this.item.currencyType !== "RealMoney") {
            if(this.item.offerType !== "DynamicBundle") {
                this.item.cost = this.item.prices[0].finalPrice;
                this.item.costType = this.item.prices[0].currencyType;
                this.item.expires = this.item.prices[0].saleExpiration;
            }
        }
        else {
            if(this.item.offerType !== "DynamicBundle") {
                this.item.costType = this.item.prices[0].currencyType;
            }
        }
        if(this.item.displayAssetPath && this.item.displayAssetPath !== "None") {
            this.item.itemId = this.item.displayAssetPath.split("DA_Featured_")[2];
        }
        else {
            this.item.itemId = this.item.requirements[0].requiredId.split(":")[1];
        }
        if(this.item.itemGrants[0]) {
            this.item.grants = this.sortItemGrants(this.item.itemGrants);
        }
        this.item.id = this.item.offerId;
        this.item.idType = this.item.offerType;
        if(this.item.meta) if(this.item.meta[0]) this.item.message = this.item.meta[0].BannerOverride;
        this.item.asset = this.item.displayAssetPath;
        if(this.item.category) this.item.category = Number(this.item.categories[0].split(" ")[1]);
        if(this.item.title) this.item.name = this.item.title;

        delete this.item.prices;
        delete this.item.devName;
        delete this.item.offerId;
        delete this.item.offerType;
        delete this.item.meta;
        if(this.item.metaInfo) if(!this.item.metaInfo[0]) delete this.item.metaInfo;
        delete this.item.itemGrants;
        delete this.item.displayAssetPath;
        delete this.item.requirements;
        delete this.item.categories;
        delete this.item.title;
        if(this.item.fulfillmentIds) if(!this.item.fulfillmentIds[0]) delete this.item.fulfillmentIds;
        if(this.item.additionalGrants) if(!this.item.additionalGrants[0]) delete this.item.additionalGrants;
        if(this.item.appStoreId) if(!this.item.appStoreId[0]) delete this.item.appStoreId;
        if(this.item.weeklyLimit) if(this.item.weeklyLimit < 1) delete this.item.weeklyLimit;
        if(this.item.sortPriority) if(this.item.sortPriority < 1) delete this.item.sortPriority;
        if(this.item.monthlyLimit) if(this.item.monthlyLimit < 1) delete this.item.monthlyLimit;
        if(this.item.filterWeight) if(this.item.filterWeight < 1) delete this.item.filterWeight;
        if(this.item.dailyLimit) if(this.item.dailyLimit < 1) delete this.item.dailyLimit;
        if(this.item.catalogGroupPriority) if(this.item.catalogGroupPriority < 1) delete this.item.catalogGroupPriority;
        if(this.item.matchFilter) if(this.item.matchFilter == "") delete this.item.matchFilter;
    }
}

module.exports = ItemParser;