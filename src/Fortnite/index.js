const Party = require("fortnitenode/src/Party");
const Stream = require("fortnitenode/src/Stream");
const Request = require("fortnitenode/src/Request");
const Launcher = require("fortnitenode/src/Launcher");
const MCP = require("fortnitenode/src/Fortnite/MCP");
const StoreParser = require("fortnitenode/src/Fortnite/Parsers/StoreParser");
const StatsParser = require("fortnitenode/src/Fortnite/Parsers/StatsParser");
const Endpoints = require("fortnitenode/resources/Endpoints");
const { v4: uuid } = require('uuid');
const Platforms = require('fortnitenode/enums/Platforms');
const Privacy = require('fortnitenode/enums/PrivacySettings');

class Fortnite {
    constructor(data) {
        this.launcher = new Launcher(data);
        if(typeof this.launcher.config.settings.platform === 'string') this.launcher.config.settings.platform = Platforms[this.launcher.config.settings.platform] || Platforms.WINDOWS;
        if(typeof this.launcher.config.settings.config === 'string') this.launcher.config.settings.config = Privacy[this.launcher.config.settings.platform] || Privacy.Public;
        this.party = Party;
        this.Authorization = null;
        this.stream = null;
        this.Request = new Request(this.launcher, this);
        this.clients = {};
        this.mcp = null;
    }

    /**
     * Checks if fortnite is bought.
     */
    async checkHasFortnite() {            
        if(!this.launcher.account.entitlements.find(entitlement => entitlement.namespace == 'fn')) {
            this.launcher.debugger.error('Launcher', 'Purchase fortnite to use fortnitenode.');
        }

        const data = await this.launcher.informEULA('fn'); 
        if(data) {
            if(!await this.launcher.receiveEULA(data)) this.launcher.debugger.error('Launcher', `Cannot post fortnite's eula.`);
        }
        return true;
    }

    /**
     * Inits, logins in and logins into fortnite, setups stream, and creates a party.
     * @returns {boolean} true.
     */
    async init() {
        this.launcher.debugger.debug('Fortnite', 'Login progress started.');

        await this.launcher.login();
        const exchangeCode = await this.launcher.getExchangeOauth();
        this.launcher.debugger.debug('Fortnite', '`exchangeCode` has been gotten.');
        const auth = await this.launcher.oauth({ exchange_code: exchangeCode, grant_type: 'exchange_code' }, "ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ=", true);
        this.launcher.debugger.debug('Fortnite', 'Authorization has been gotten.');

        this.Authorization = {
            fullToken: `${auth.token_type} ${auth.access_token}`,
            ...auth,
        };

        await this.checkHasFortnite();

        this.stream = new Stream(this, {
            type: "Fortnite",
            resource: `V2:Fortnite:${this.launcher.config.settings.platform.plat}::${uuid().replace(/-/g, "").toUpperCase()}`,
            prod: 'prod.ol.epicgames.com',
            service: 'xmpp-service-prod.ol.epicgames.com',
            credentials: {
                username: this.launcher.account.id,
                password: this.Authorization.access_token
            },
        });
        await this.stream.stream();
        this.mcp = await new MCP(this).gather();

        this.party = new this.party(this, {
            meta: {
                "urn:epic:cfg:accepting-members_b": this.launcher.config.settings.config.acceptingMembers,
                "urn:epic:cfg:build-id_s": "1:1:",
                "urn:epic:cfg:chat-enabled_b": this.launcher.config.settings.chatEnabled,
                "urn:epic:cfg:invite-perm_s": this.launcher.config.settings.config.invitePermission,
                "urn:epic:cfg:join-request-action_s": this.launcher.config.settings.joinConfirmation === false ? "AutoApprove" : "Manual",
                "urn:epic:cfg:party-type-id_s": this.launcher.config.settings.type,
                "urn:epic:cfg:presence-perm_s": this.launcher.config.settings.config.presencePermission,
                "urn:epic:conn:platform_s": this.launcher.config.settings.platform.plat,
                "urn:epic:conn:type_s": "game",
            },
            members: [],
            config: {
                discoverability: "ALL",
                invite_ttl: this.launcher.config.settings.inviteTTL,
                join_confirmation: this.launcher.config.settings.joinConfirmation,
                joinability: this.launcher.config.settings.joinability,
                max_size: this.launcher.config.settings.maxSize,
                sub_type: this.launcher.config.settings.subType,
                type: this.launcher.config.settings.type,
                chatEnabled: this.launcher.config.settings.chatEnabled,
            },
        });
        await this.party.create(this.party);
        return true;
    }

    /**
     * Featured islands.
     * @returns {Object} Featured islands.
     */
    async getFeaturedIslands() {
        const timeline = await this.getTimeline();
        return timeline.channels["featured-islands"].states[0].state;
    }

    /**
     * Get featured island codes.
     */
    async getFeaturedIslandCodes() {
        const featured = await this.getFeaturedIslands();
        return featured.islandCodes;
    }

    /**
     * Get all the templates island ids.
     */
    async getIslandTemplates() {
        const featured = await this.getFeaturedIslands();
        return featured.islandTemplates;
    }

    /**
     * Get all favorite islands.
     * @param {Date} olderThan ISO 8601 Date
     */
    async getFavoriteIslands(olderThan) {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/game/v2/creative/favorites/${this.launcher.account.id}${olderThan ? `?olderThan=${olderThan}` : ''}`,
                "GET",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return data.results;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Add a favorite island.
     * @param {IslandCode} islandId 
     */
    async favoriteIsland(islandId) {
        try {
            const { response } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/game/v2/creative/favorites/${this.launcher.account.id}/${islandId}`,
                "PUT",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return response.statusCode === 204;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Unfavorite a island.
     * @param {IslandCode} islandId 
     */
    async unfavoriteIsland(islandId) {
        try {
            const { response } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/game/v2/creative/favorites/${this.launcher.account.id}/${islandId}`,
                "DELETE",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return response.statusCode === 204;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Get creative history.
     * @param {Date} olderThan ISO 8601 Date
     */
    async getCreativeHistory(olderThan) {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/game/v2/creative/history/${this.launcher.account.id}${olderThan ? `?olderThan=${olderThan}` : ''}`,
                "GET",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return data.results[0];
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Appear as your in a game.
     */
    async inMatch(numberOfPlayers, secondsUntilChange) {
        var body = {
            Location_s: "InGame",
            NumAthenaPlayersLeft_U: numberOfPlayers.toString() || 100,
            HasPreloadedAthena_b: "true",
            GameReadiness_s: "NotReady"
        }
        this.me.set(body);
        if(secondsUntilChange) {
            this.me.set({
                ...body,
                UtcTimeStartedMatchAthena_s: new Date().toISOString(),
            });
            var Interval = setInterval(async () => {
                if(numberOfPlayers < 2) {
                    return setTimeout(async () => {
                        clearInterval(Interval);
                        return await this.outMatch();
                    }, 2000);
                }
                else {
                    const players = numberOfPlayers - 1;
                    numberOfPlayers = players;
                    await this.inMatch(players, false);
                }
            }, secondsUntilChange * 1000);
        }
        return await this.me.patch(this.me.meta);
    }

    /**
     * Get out of a match state.
     */
    async outMatch() {
        this.me.set({
            Location_s: "PreLobby",
            NumAthenaPlayersLeft_U: "0",
            SpectateAPartyMemberAvailable_b: "false",
            HasPreloadedAthena_b: "false",
            VoiceChatStatus_s: "PartyVoice",
            GameReadiness_s: "NotReady",
        });
        return await this.me.patch(this.me.meta);
    }

    /**
     * Leaderboard settings.
     * @returns Leaderboard settings.
     */
    async getLeaderBoardSettings() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/game/v2/privacy/account/${this.launcher.account.id}`,
                "GET",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            )
            return data;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Logouts of launcher and fortnite.
     */
    async logout() {
        await this.launcher.logout(this.Authorization.access_token);
        this.stream.disconnect();
        return await this.launcher.logout();
    }

    /**
     * Stats V2.
     * @param {*} account Account id or displayName.
     * @returns {Object} Parsed stats.
     */
    async getStatsV2(account) {
        try {
            account = await this.launcher.getAccount(account);
            const { data } = await this.Request.sendRequest(
                `${Endpoints.STATSPROXY}/statsv2/account/${account.id}?startTime=0 `,
                "GET",
                this.Authorization.fullToken,
                null,
                false, 
                null,
                true,
            )
            return new StatsParser(data.stats).parse();
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Grant access. (Client already has access.)
     * @returns {Error} Error.
     */
    async grantAccess() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/game/v2/grant_access/${this.launcher.account.id}`,
                "POST",
                this.Authorization.fullToken,
                null,
                false,
                {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                true,
            )
            return data;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Keychain.
     * @returns {Object} Keychain.
     */
    async getKeyChain() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/storefront/v2/keychain`,
                "GET",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            )
            return data;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Storefront.
     * @returns {Object} Storefront.
     */
    async getStoreFront() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/storefront/v2/catalog`,
                "GET",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            )
            return new StoreParser(data).parse();
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Enabled features.
     * @returns {Array} Array of enabled features.
     */
    async getEnabledFeatures() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/game/v2/enabled_features`,
                "GET",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            )
            return data;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Timeline.
     * @returns {Object} Timeline.
     */
    async getTimeline() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/calendar/v1/timeline`,
                "GET",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            )
            return data;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Fortnite pages.
     * @returns {Object} Pages.
     */
    async getPages() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITECONTENT}/pages/fortnite-game`,
                "GET",
                this.Authorization.fullToken,
                null,
                false,
                null,
                true,
            )
            return data;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Optout of leaderboard.
     * @param {*} optout If you want to optout of leaderboards.
     * @returns {Object} Updated settings.
     */
    async changeLeaderBoardSettings(optout) {
        if(typeof optout !== "boolean") return false;
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FORTNITE}/game/v2/privacy/account/${this.launcher.account.id}`,
                "POST",
                this.Authorization.fullToken,
                {
                    "accountId": this.launcher.account.id,
                    "optOutOfPublicLeaderboards": optout,
                },
                false,
                {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                true,
            )
            return data;
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Makes a new client, and places it into clients object.
     * @param {*} data Config for the client.
     * @returns {new this} New client.
     */
    async makeClient(data) {
        try {
            data.custom_message = data.custom_message || "Client2";
            const fortnite = new Fortnite(data);
            await fortnite.init();
            this.clients[data.custom_message] = fortnite;
            return this.clients[data.custom_message];
        } catch(error) {
            this.launcher.debugger.error('Launcher', error);
        }
    }

    /**
     * Last presences from friends.
     * @returns {Array&Object} Objects in arrays of friend's presences.
     */
    async lastPresences() {
        if(!this.Authorization) return;
        const { data } = await this.Request.sendRequest(
            `${Endpoints.PRESENCEPUBLIC}/v1/_/${this.launcher.account.id}/last-online`,
            "GET",
            this.Authorization.fullToken,
            {},
            false,
            {},
            true,
        );
        var array = [];
        for (var i = 0; i < Object.keys(data).length; i++) {
            const member = Object.keys(data)[i];
            array.push({
                ...data[member][0],
                id: member,
            });
        }
        for (var index = 0; index < array.length; index++) {
            array[index] = {
                ...array[index],
                ...await this.launcher.getAccount(array[index].id),
            }
        }
        return array;
    }

    /**
     * World info.
     * @returns {Object} World info.
     */
    async getWorldInfo() {
        if(!this.Authorization) return;
        const { data } = await this.Request.sendRequest(
            `${Endpoints.FORTNITE}/game/v2/world/info`,
            "GET",
            this.Authorization.fullToken,
            null,
            null,
            null,
            true,
        )
        return data;
    }

    /**
     * Summary of friends.
     * @returns {Object} Summary.
     */
    async Summary() {
        if(!this.Authorization) return;
        const { data } = await this.Request.sendRequest(
            `${Endpoints.FRIENDS}/v1/${this.launcher.account.id}/summary`,
            "GET",
            this.Authorization.fullToken,
            {},
            false,
            {},
            true,
        );
        var array = [];
        for (var index = 0; index < data.friends.length; index++) {
            const newFriend = await this.launcher.getAccount(data.friends[index].accountId);
            array.push({
                ...data.friends[index],
                ...newFriend
            });
        } 
        return array;
    }
    
    /**
     * Sets a alias for a friend.
     * @param {*} account A friend.
     * @param {*} alias Any alias that is up to 16 letters and 3 letters.
     * @returns {boolean} If false, request went badly, true it went good.
     */
    async setAlias(account, alias) {
        const friend = await this.launcher.getAccount(account);
        const { response } = await this.Request.sendRequest(
          `${Endpoints.FRIENDS}/v1/${this.launcher.account.id}/friends/${friend.id}/alias`,
          `PUT`,
          this.Authorization.fullToken,
          alias,
          false,
          {
            'Content-Type': "text/plain",
          },
          false,
        );
        return response.statusCode == 204;
    }

    /**
     * Sets a note for a friend.
     * @param {*} account A friend.
     * @param {*} note A note you want to set.
     * @returns {boolean} If false, request went badly, true it went good.
     */
    async setNote(account, note) {
        const friend = await this.launcher.getAccount(account);
        const { response } = await this.Request.sendRequest(
          `${Endpoints.FRIENDS}/v1/${this.launcher.account.id}/friends/${friend.id}/note`,
          `PUT`,
          this.Authorization.fullToken,
          note,
          false,
          {
            'Content-Type': "text/plain",
          },
          false,
        );
        return response.statusCode == 204;
    }

    /**
     * Removes the note from a friend.
     * @param {*} account A friend.
     * @returns {boolean} If false, request went badly, true it went good.
     */
    async removeNote(account) {
        const friend = await this.launcher.getAccount(account);
        const { response } = await this.Request.sendRequest(
          `${Endpoints.FRIENDS}/v1/${this.launcher.account.id}/friends/${friend.id}/note`,
          `DELETE`,
          this.Authorization.fullToken,
        );
        return response.statusCode == 204;
    }

    /**
     * Removes a alias from a friend.
     * @param {*} account A friend.
     * @returns {boolean} If false, request went badly, true it went good.
     */
    async removeAlias(account) {
        const friend = await this.launcher.getAccount(account);
        const { response } = await this.Request.sendRequest(
          `${Endpoints.FRIENDS}/v1/${this.launcher.account.id}/friends/${friend.id}/alias`,
          `DELETE`,
          this.Authorization.fullToken,
        );
        return response.statusCode == 204;
    }

    get me() {
        return this.party.self;
    }

}

module.exports = Fortnite;