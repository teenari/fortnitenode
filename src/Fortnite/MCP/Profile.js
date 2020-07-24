class Profile {
    constructor(mcp, profile) {
        this.profileChanges = profile.profileChanges;
        this.profileChangesBaseRevision = profile.profileChangesBaseRevision;
        this.profileCommandRevision = profile.profileCommandRevision;
        this.profileId = profile.profileId;
        this.profileRevision = profile.profileRevision;
        this.responseVersion = profile.responseVersion;

        this.serverTime = profile.serverTime;

        this.mcp = mcp;
    }

    findItem(id) {
        var item;
        if(id.length == 36) return { ...this.profileChanges[0].items[id], id, }
        for (var i = 0; i < Object.keys(this.profileChanges[0].profile.items).length; i++) {
            const object = this.profileChanges[0].profile.items[Object.keys(this.profileChanges[0].profile.items)[i]];
            if(object.templateId.includes(id)) item = { ...object, id: Object.keys(this.profileChanges[0].profile.items)[i] };
        }
        return item;
    }

    async setItem(type, templateId, spot=0, variants=[]) {
        if(this.profileId !== 'athena') return;
        const item = this.findItem(templateId);
        const Locker = this.mcp.items.CosmeticLocker.find(Locker => Locker.attributes.locker_name === "" && Locker.attributes.banner_icon_template !== "") || this.findItem('cosmeticlocker_athena');
        return await this.SetCosmeticLockerSlot(Locker.id, type, item.templateId, spot, variants);
    }

    async GetMcpTimeForLogin() {
        if(this.profileId !== 'theater0') return;
        await this.refresh();
        return await this.postMCP("GetMcpTimeForLogin", this.profileRevision);
    }

    async QueryProfile() {
        return await this.postMCP('QueryProfile', -1);
    }

    async setCosmeticLockerBanner(bannerIconTemplateName, bannerColorTemplateName) {
        if(this.profileId !== 'athena') return;
        const lockerItem = this.findItem('cosmeticlocker_athena');
        await this.refresh();
        return await this.postMCP("setCosmeticLockerBanner", this.profileRevision, {
            lockerItem: lockerItem.id,
            bannerColorTemplateName,
            bannerIconTemplateName
        });
    }
    
    async SetCosmeticLockerSlot(lockerItem, category, itemToSlot, slotIndex, variantUpdates) {
        if(this.profileId !== 'athena') return;
        await this.refresh();
        return await this.postMCP('SetCosmeticLockerSlot', this.profileRevision, {
            lockerItem,
            category,
            itemToSlot,
            slotIndex,
            variantUpdates
        });
    }

    async SetHomebaseBanner(homebaseBannerColorId, homebaseBannerIconId) {
        if(this.profileId !== 'common_public') return;
        await this.refresh();
        return await this.postMCP('SetHomebaseBanner', this.profileRevision, {
            homebaseBannerColorId,
            homebaseBannerIconId
        });
    }

    async SetHomebaseName(homebaseName) {
        if(this.profileId !== 'common_public') return;
        await this.refresh();
        return await this.postMCP('SetHomebaseName', this.profileRevision, {
            homebaseName
        });
    }

    async SetIntroGamePlayed() {
        if(this.profileId !== 'common_core') return;
        await this.refresh();
        return await this.postMCP("SetIntroGamePlayed", this.profileRevision);
    }

    async SetReceiveGiftsEnabled(bReceiveGifts) {
        if(this.profileId !== 'common_core') return;
        await this.refresh();
        return await this.postMCP('SetReceiveGiftsEnabled', this.profileRevision, {
            bReceiveGifts
        });
    }

    async UnlockRewardNode(nodeId, rewardGraphId, rewardCfg) {
        if(this.profileId !== 'athena') return;
        await this.refresh();
        return await this.postMCP("UnlockRewardNode", this.profileRevision, {
            nodeId,
            rewardGraphId,
            rewardCfg
        });
    }

    async postMCP(command, rvn, body) {
        return await this.mcp.postMCP(command, this.profileId, rvn, body);
    }

    /**
     * Refresh all objects.
     */
    async refresh() {
        const profile = await this.QueryProfile();
        this.profileChanges = profile.profileChanges;
        this.profileChangesBaseRevision = profile.profileChangesBaseRevision;
        this.profileCommandRevision = profile.profileCommandRevision;
        this.profileId = profile.profileId;
        this.profileRevision = profile.profileRevision;
        this.responseVersion = profile.responseVersion;

        this.serverTime = profile.serverTime;
        return this;
    }

}
module.exports = Profile;