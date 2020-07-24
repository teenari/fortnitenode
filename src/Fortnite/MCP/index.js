const Endpoints = require("fortnitenode/resources/Endpoints");
const CryptoJS = require("crypto-js");
const Profile = require("fortnitenode/src/Fortnite/MCP/Profile");

class MCP {
    constructor(fortnite) {
        this.fortnite = fortnite;
        this.launcher = fortnite.launcher;

        this.profiles = {};
        this.items = null;
    }

    /**
     * Sorts all the items in the profile athena into the items object.
     */
    sort() {
        this.items = {};
        for (var index = 0; index < Object.keys(this.profiles.athena.profileChanges[0].profile.items).length; index++) {
            const item = this.profiles.athena.profileChanges[0].profile.items[Object.keys(this.profiles.athena.profileChanges[0].profile.items)[index]];
            if(!item.templateId) return;
            const itemName = item.templateId.split(":")[0];
            if(itemName) {
                if(this.items[itemName]) this.items[itemName].push({ ...item, id: Object.keys(this.profiles.athena.profileChanges[0].profile.items)[index]});
                else this.items[itemName] = [item];
            }
        }
    }

    /**
     * Adds a profile to the profiles object.
     * @param {String} profileId A profileId to add.
     */
    async addProfile(profileId) {
        const post = async (profileId) => {
             return await this.postMCP(null, profileId); 
        }
        if(Array.isArray(profileId)) {
            for (var i = 0; i < profileId.length; i++) {
                this.profiles[profileId] = new Profile(this, await post(profileId[i]));
            }
            return true;
        }
        this.profiles[profileId] = new Profile(this, await post(profileId));
        return this.profiles[profileId];
    }

    /**
     * Gathers everything such as athena, common_core, common_public.
     */
    async gather() {
        this.profiles = {
            athena: await this.addProfile("athena"),
            common_core: await this.addProfile("common_core"),
            common_public: await this.addProfile("common_public")
        };
        if(this.launcher.data.profileIds && Array.isArray(this.launcher.data.profileIds)) {
            await this.addProfile(this.launcher.data.profileIds);
        }
        this.sort();
        return this;
    }

    /**
     * Posts a mcp (Thanks to mix (https://github.com/MixV2/EpicResearch#13-mcp))
     * @param {*} command Command to use in request. (Example: QueryProfile)
     * @param {*} profileId ProfileId. (Example: athena)
     * @param {*} rvn How much times has the user changed their profile.
     * @param {*} body A extra part for anybody that wants to post their own payload.
     * @returns {Object} Updated profile.
     */
    async postMCP(command, profileId, rvn, body) {
        try {
            const { data } = await this.fortnite.Request.sendRequest(
                `${Endpoints.MCP}/game/v2/profile/${this.launcher.account.id}/client/${command || "QueryProfile"}?rvn=${rvn || -1}&leanResponse=true&profileId=${profileId || "athena"}`,
                "POST",
                this.fortnite.Authorization.fullToken,
                body || {},
                null,
                {
                    "Content-Type": "application/json;charset=UTF-8",
                },
                true,
            )
            return data;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error.code);
        }
    }

    get currentSeasonNumber() {
        return this.profiles.athena.profileChanges[0].profile.stats.attributes.season_num;
    }

    get mfaEnabled() {
        return this.profiles.common_core.profileChanges[0].profile.stats.attributes.mfa_enabled;
    }

    get banHistory() {
        return this.profiles.common_core.profileChanges[0].profile.stats.attributes.ban_history;
    }

    get hasAffiliate() {
        if(!this.profiles.creative) return "creative object missing";
        if(this.profiles.creative.profileChanges[0].profile.stats.attributes.support_code !== "") return this.profiles.creative.profileChanges[0].profile.stats.attributes.support_code.split(" ")[0]
        return this.profiles.creative.profileChanges[0].profile.stats.attributes.support_code !== "";
    }

    get affiliate() {
        return this.profiles.common_core.profileChanges[0].profile.stats.attributes.mtx_affiliate;
    }

    get mtxPlatform() {
        return this.profiles.common_core.profileChanges[0].profile.stats.attributes.current_mtx_platform;
    }

    get giftHistory() {
        return this.profiles.common_core.profileChanges[0].profile.stats.attributes.gift_history;
    }

    get canSendGifts() {
        return this.profiles.common_core.profileChanges[0].profile.stats.attributes.allowed_to_send_gifts;
    }

    get locker() {
        const object = Object.keys(this.profiles.athena.profileChanges[0].profile.items);
        for (var i = 0; i < object.length; i++) {
            const item = this.profiles.athena.profileChanges[0].profile.items[object[i]];
            if(item.templateId == "CosmeticLocker:cosmeticlocker_athena") return item.attributes.locker_slots_data.slots;
        }
    }

    get canPublishIslands() {
        if(!this.profiles.creative) return "creative object missing";
        return this.profiles.creative.profileChanges[0].profile.stats.attributes.publish_allowed;
    }

    get level() {
        return this.profiles.athena.profileChanges[0].profile.stats.attributes.level;
    }

    get battlepassPurchased() {
        return this.profiles.athena.profileChanges[0].profile.stats.attributes.book_purchased;
    }

    get currency() {
        var mtxQantitys = {currency: 0};
        const keys = Object.keys(this.profiles.common_core.profileChanges[0].profile.items);

        for (var i = 0; i < keys.length; i++) {
            const item = this.profiles.common_core.profileChanges[0].profile.items[keys[i]];
            if(item.templateId.includes("Currency") && item.attributes.platform !== "Shared") {
                mtxQantitys.fullCurrency = mtxQantitys.currency += item.quantity;
                mtxQantitys[item.attributes.platform] = item.quantity;
            }
        }
        return mtxQantitys;
    }

}

module.exports = MCP;