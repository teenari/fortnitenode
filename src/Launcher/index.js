const Endpoints = require("fortnitenode/resources/Endpoints");
const Request = require("fortnitenode/src/Request");
const Stream = require("fortnitenode/src/Stream");
const GraphQL = require("fortnitenode/src/Launcher/GraphQL");
const Friend = require("fortnitenode/src/Launcher/Friend");
const Platforms = require("fortnitenode/enums/Platforms");
const Privacy = require("fortnitenode/enums/PrivacySettings");
const fs = require('fs');
const Debug = require("../Debug");
const { v4: uuid } = require('uuid');

class Launcher {
    /**
     * Constructor of **Launcher**.
     * @param {Object} config A config for the client, which can be edited.
     */
    constructor(config) {
        this.config = {
            oauth: null,
            debugger: console.log,
            ...config,
            settings: {
                config: Privacy.Public,
                joinConfirmation: false,
                joinability: "OPEN",
                maxSize: 16,
                subType: "default",
                type: "DEFAULT",
                inviteTTL: 14400,
                chatEnabled: true,
                platform: Platforms.WINDOWS,
                ...config.settings
            }
        };

        this.stream = null;

        this.Request = new Request(this);
        this.Authorization = null;
        this.killedToken = false;
        this.debugger = new Debug(this.config.custom_message, this.config.debugger);
        this.graphql = new GraphQL(this);
    }

    /**
     * Blocks a friend.
     * @param {String} friend Friend.
     * @returns {Boolean} True, means the user has been blocked, false means the user hasn't been blocked.
     */
    async block(friend) {
        try {
            const { response } = await this.Request.sendRequest(
                `${Endpoints.FRIENDS}/v1/${this.account.id}/blocklist/${friend}`,
                "POST",
                this.Authorization.fullToken,
                null,
                null,
                null,
                false,
            )
            return response.statusCode === 204;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Changes friend settings.
     * @param {Boolean} setting True or false. (Accept invites.)
     * @returns {Object} Response.
     */
    async changeFriendSettings(setting) {
        if(!this.Authorization) return;
        const { data } = await this.Request.sendRequest(
            `${Endpoints.FRIENDS}/v1/${this.account.id}/settings`,
            "PUT",
            this.Authorization.fullToken,
            {
                acceptInvites: setting,
            },
            false,
            {
                "Content-Type": "application/json;charset=UTF-8",
            },
            true,
        )
        return data;
    }

    /**
     * Deletes device auth.
     * @param {Object} data Device auth object.
     * @returns {Boolean} True or false.
     */
    async deleteDeviceAuth(device_id) {
        try {
            const iosAuth = await this.getIosInfo();
            await this.Request.sendRequest(
                `${Endpoints.ACCOUNTPUCPROD}/account/${this.account.id}/deviceAuth/${device_id}`,
                "DELETE",
                `${iosAuth.token_type} ${iosAuth.access_token}`,
                null,
                null,
                null,
                true,
            )
            return true;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Deletes all device auths.
     * @param {String} notToken Device id. (Doesn't delete)
     * @returns {Boolean} True or false.
     */
    async deleteDeviceAuths(notToken) {
        try {
            const deviceAuths = await this.getDeviceAuths();
            var index;
            for (index = 0; index < deviceAuths.length; index++) { 
                const device = deviceAuths[index];
                if(this.config.oauth.device_id) {
                    if(this.config.oauth.device_id == device.deviceId) continue;
                }
                if(notToken == device.deviceId) continue;
                await this.deleteDeviceAuth(device.deviceId);
            } 
            return true;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Friends a user.
     * @param {String} account Account.
     * @returns {Boolean} True or false.
     */
    async friend(account) {
        if(this.isAdded(account) === true) this.debugger.error('Launcher', "You cannot friend a user that your already friended with!");
        try {
            await this.Request.sendRequest(
                `${Endpoints.FRIENDSERVICE}/public/friends/${this.account.id}/${account}`,
                "POST",
                this.Authorization.fullToken,
                null,
                null,
                null,
                null,
                false,
            )
            await this.setAccount();
            return true;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Messages for the epic games site.
     */
    async geti18nMessages() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FRONT}/api/i18n?ns=messages&lang=en-US`,
                "GET"
            )
            return data;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Find a slug.
     * @param {String} slug A slug/support a creator code.
     */
    async getSlug(slug) {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.PAYMENTPCI}/affiliate/search-by-slug?slug=${slug}`,
                "GET"
            )
            return data;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * @returns {Array} Array of entitlements.
     */
    async getEntitlements() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.ENTITLEMENT}/${this.account.id}/entitlements?count=4000`,
                "GET",
                this.Authorization.fullToken,
                null,
                false,
                {
                  'Content-Type': "application/json;charset=UTF-8",  
                },
                true,
            )

            return data;
        }
        catch(error) {
            this.debugger.error('Launcher', error);
        }
    }
    
    /**
     * @returns {Object} Array of objects of people blocked.
     */
    async getBlockList() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FRIENDS}/v1/${this.account.id}/blocklist`,
                "GET",
                this.Authorization.fullToken,
                null,
                null,
                null,
                true,
            )
            return data;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * @param {String} auth Full token.
     * @returns {Object} Exchange code json.
     */
    async getExchangeOauth(auth) {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.ACCOUNTSERVICE}/oauth/exchange/`,
                "GET",
                auth || this.Authorization.fullToken,
                null,
                null,
                null,
                true,
            )
            return data.code;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Exchange code.
     * @param {String} XSRF XSRF TOKEN. 
     * @returns {Object} Exchange code json.
     */
    async getExchangeCode(XSRF) {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FRONT}/api/exchange/generate`,
                "POST",
                null,
                false,
                false,
                {
                    "X-XSRF-TOKEN": XSRF,
                },
                true
            );
            return data.code;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Available values of value.
     * @param {String} value Kairos profile value. (Example: avatar, avatarBackground, appInstalled)
     * @returns {Array} Array of objects of value.
     */
    async getAvailableValue(value) {
        try {
            const response = await this.Request.sendRequest(
                `${Endpoints.CHANNEL}/v1/user/${this.account.id}/setting/${value}/available`,
                "GET",
                this.Authorization.fullToken,
                null,
                null,
                null,
                true,
            )
            if(!response || !response.data) return null;
            return response.data;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Kairos settings.
     * @param {String} value String of settingKey or a object of setting keys.
     * @returns {Object} Value of kairos settings.
     */
    async getKairoSetting(value) {
        try {
            var string = "";
            if(Array.isArray(value)) {
                value.forEach(v => {
                    string = `${string}&settingKey=${v}`
                });
            }
            else if(typeof value == "string") {
                string = `&settingKey=${value}`;
            }
            const response = await this.Request.sendRequest(
                `${Endpoints.CHANNEL}/v1/user/setting?accountId=${this.account.id}${string}`,
                "POST",
                this.Authorization.fullToken,
                null,
                null,
                null,
                true,
            )
            if(!response || !response.data) return;
            return response.data;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }
    
    /**
     * Generate device auth.
     * @returns {Object} Object of device.
     */
    async generateDeviceAuth() {
        try {
            const iosAuth = await this.getIosInfo();
            const { data } = await this.Request.sendRequest(
                `${Endpoints.ACCOUNTPUCPROD}/account/${iosAuth.account_id}/deviceAuth`,
                "POST",
                `${iosAuth.token_type} ${iosAuth.access_token}`,
                null,
                null,
                {
                    "Content-Type": "application/json",
                },
                true,
            )
            return data;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }
    
    /**
     * @returns {Array} Array of objects of device auths.
     */
    async getDeviceAuths() {
        try {
            const iosAuth = await this.getIosInfo();
            const { data } = await this.Request.sendRequest(
                `${Endpoints.ACCOUNTPUCPROD}/account/${this.account.id}/deviceAuth`,
                "GET",
                `${iosAuth.token_type} ${iosAuth.access_token}`,
                null,
                null,
                null,
                true,
            )
            return data;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * 
     * @param {String} device_id Device auth.
     * @returns {Object} Device.
     */
    async getDeviceAuth(device_id) {
        try {
            const iosAuth = await this.getIosInfo();
            const { data } = await this.Request.sendRequest(
                `${Endpoints.ACCOUNTPUCPROD}/account/${iosAuth.account_id}/deviceAuth/${device_id}`,
                "GET",
                `${iosAuth.token_type} ${iosAuth.access_token}`,
                null,
                null,
                null,
                true,
            )
            return data;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * @returns Friend settings.
     */
    async getFriendSettings() {
        if(!this.Authorization) return;
        const { data } = await this.Request.sendRequest(
            `${Endpoints.FRIENDS}/v1/${this.account.id}/settings`,
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
     * @param {String} namespace Namespace.
     * @returns {Array} Recent friends of namespace.
     */
    async getFriendsRecent(namespace) {
        if(!this.Authorization) return;
        const { data } = await this.Request.sendRequest(
            `${Endpoints.FRIENDS}/v1/${this.account.id}/recent/${namespace || "Fortnite"}`,
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
     * @returns {Array} Friends incoming.
     */
    async getFriendsIncoming() {
        if(!this.Authorization) return;
        const { data } = await this.Request.sendRequest(
            `${Endpoints.FRIENDS}/v1/${this.account.id}/incoming`,
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
     * @returns {Array} Friends.
     */
    async getFriends(pending) {
        try {
            var { data } = await this.Request.sendRequest(
                `${Endpoints.FRIENDSERVICE}/public/friends/${this.account.id}?includePending=${pending || "false"}`,
                "GET",
                this.Authorization.fullToken,
            );
            if(!data) this.debugger.error('Launcher', `Cannot get friends!`);
            data = data;
            var array = [];
            for (var index = 0; index < data.length; index++) { 
                const friend = data[index];
                array.push(new Friend.Class(this, friend));
            }
            return array;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * All friend requests.
     * @class Friend class.
     */
    async getFriendRequests() {
        const requests = (await this.getFriends(true)).filter(data => data.direction === "PENDING");
        const friendrequests = [];
        for (const request of requests) friendrequests.push(new Friend.Request({ ...request }));
        return friendrequests;
    }

    /**
     * @returns {Object} Object with **have** and **current**.
     */
    async getKairos() {
        return {
            have: await this.getAvailableValue("avatar"),
            current: await this.getKairoSetting(["avatar", "avatarBackground", "appInstalled"]),
        };
     }

     /**
      * @param {String} data Account id or displayName.
      * @returns {Object} Account.
      */
    async getAccount(data) {
        try {
            if(!data) return;
            if (data.length >= 3 && data.length <= 16) {
                const response = await this.Request.sendRequest(
                    `${Endpoints.ACCOUNTSERVICE}/public/account/displayName/${encodeURI(data)}`,
                    "GET",
                    this.Authorization.fullToken,
                );
                return response ? response.data : false;
            }
      
            if (data.length == 32) {
                const response = await this.Request.sendRequest(
                    `${Endpoints.ACCOUNTSERVICE}/public/account?accountId=${data}`,
                    "GET",
                    this.Authorization.fullToken,
                    null,
                    null,
                    null,
                    true,
                );
                return response ? response.data[0] : false;
            }

            if(data.includes("@")) {
                const response = await this.Request.sendRequest(
                    `${Endpoints.ACCOUNTSERVICE}/public/email/${data}`,
                    "GET",
                    this.Authorization.fullToken,
                    null,
                    null,
                    null,
                    true,
                );
                return response ? response.data : false;
            }
            return false;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Gets ios auth.
     * @param {String} exchangeCode Exchange code.
     * @returns {Object} Auth.
     */
    async getIosInfo(exchangeCode) {
        try {
            const ios_token = "MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE="

            if(!exchangeCode) exchangeCode = await this.getExchangeOauth();
            const auth = await this.oauth({ grant_type: 'exchange_code', exchange_code: exchangeCode }, ios_token, true);

            return auth;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * @returns {Object} Competitive data.
     */
    async getCompetitiveData() {
        if(!this.Authorization) return;
        const { data } = await this.Request.sendRequest(
            `${Endpoints.EVENTS}/v1/players/Fortnite/${this.account.id}`,
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
     * Checks a eula.
     * @param {String} namespace A namespace.
     * @returns {Boolean} Will return boolean if eula is accepted, and a object if it's not. Use **receiveEULA(object)**, to accept the eula.
     */
    async informEULA(namespace) {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.EULA}/agreements/${namespace}/account/${this.account.id}?locale=en-EN`,
                "GET",
                this.Authorization.fullToken,
                null,
                null,
                null,
                true,
              );
              return data ? data : false;
        } catch(error) {
            console.log(error);
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Checks if a user is added.
     * @param {String} friendAdded A friend.
     * @returns {Boolean} true or false.
     */
    async isAdded(friendAdded) {
        const friends = await this.getFriends();
        friendAdded = await this.getAccount(friendAdded);
        return typeof friends.find(friend => friend.accountId == friendAdded) === "object";
    }

    /**
     * Logins in.
     * @returns {Boolean} True or false.
     */
    async login() {
        const reputation = await this.reputation();

        this.messages = await this.geti18nMessages();
        if(this.config.oauth && !this.config.oauth.grant_type) {
            const ouaths = (await this.Request.sendRequest(
                `https://api.github.com/repos/MixV2/EpicResearch/contents/docs/auth/grant_types`,
                "GET",
                null,
                null,
                null,
                {
                    'User-Agent': 'User'
                },
                true
            )).data.filter(file => !file.name.includes('password'));
            const keys = Object.keys(this.config.oauth).filter(t => t !== 'basic_token');
            for (var ouath of ouaths) {
                ouath.content = (await this.Request.sendRequest(
                    ouath.download_url,
                    "GET",
                    null,
                    null,
                    null,
                    {
                        'User-Agent': 'User'
                    },
                    true
                )).data;
                for (const key of keys) if(ouath.content.split(`\`${key}\`: `)[1]) {
                    this.config.oauth.grant_type = ouath.name.split('.md')[0];
                }
            }
        }

        const XSRF = await this.newXSRFToken();
        if(!XSRF) this.debugger.error('Launcher', 'Cannot get `XSRF`!');

        if(this.config.oauth.email && this.config.oauth.password) {
            if(reputation.verdict !== 'allow' && !this.config.oauth.captcha) this.debugger.error('Launcher', 'Please use something to complete a captcha to login.');
            if(reputation.verdict === 'allow') this.config.oauth.captcha = null;
            await this.sendLoginRequest(XSRF, this.config.oauth);
            this.debugger.debug('Launcher', '`exchangeCode` is being gotten.');
            const exchangeCode = await this.getExchangeCode(XSRF);
            const data = await this.oauth({ exchange_code: exchangeCode, grant_type: 'exchange_code' }, null, true);
            if(!data) this.debugger.error('Launcher', 'Logging in was a unsuccess.');
            this.setAuth(data);
        }
        else this.setAuth(await this.oauth(this.config.oauth));
        await this.setAccount();

        this.debugger.debug('Launcher', this.messages['authorize.success.prompt1'].split('<')[0]);
        this.stream = new Stream(this, {
            type: "Launcher",
            resource: `V2:Launcher:WIN::${uuid().replace(/-/g, "").toUpperCase()}`,
            prod: 'prod.ol.epicgames.com',
            service: 'xmpp-service-prod.ol.epicgames.com',
            credentials: {
                username: this.account.id,
                password: this.Authorization.access_token
            },
        });
        return await this.stream.stream();
    }

    /**
     * Logout of the launcher or any type.
     * @param {String} token A access token to kill. (NOT NEEDED)
     */
    async logout(token) {
        try {
            await this.Request.sendRequest(
                `${Endpoints.KILLTOKEN}/${token || this.Authorization.access_token}`,
                "DELETE",
                token ? `bearer ${token}` : this.Authorization.fullToken,
                null,
                false,
                null,
                false,
            )
            if(!token) {
                this.killedToken = true;
                this.stream.disconnect();
            }
            return true;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }
    
    /**
     * @returns {String} XSRF TOKEN
     */
    async newXSRFToken() {
        try {
            const { response } = await this.Request.sendRequest(
                `${Endpoints.FRONT}/api/csrf`,
                "GET",
            );
            return response.headers["set-cookie"][0].split("XSRF-TOKEN=")[1].split(";")[0];
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }
    
    /**
     * Oauths.
     * @param {String} AuthToken Auth token.
     * @returns {Object} Auth.
     */
    async oauth(body, AuthToken, noExchange) {
        try {
            if(body.basic_token) {
                AuthToken = body.basic_token;
                delete body.basic_token;
            }
            var { data } = await this.Request.sendRequest(
                `${Endpoints.ACCOUNTSERVICE}/oauth/token`,
                "POST",
                `basic ${AuthToken || "MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y="}`,
                body,
                true,
                {
                    "Content-Type" : "application/x-www-form-urlencoded"
                },
                true,
            );
            if(AuthToken && !noExchange && AuthToken !== 'MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=') {
                data = await this.oauth({ grant_type: 'exchange_code', exchange_code: await this.getExchangeOauth(`bearer ${data.access_token}`) }, null, true);
            }
            return data;
        } catch(error) {
            console.log(error);
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Acceptes eula.
     * @param {Object} elua Is from **informEULA(namespace)**.
     * @returns {Boolean} true.
     */
    async receiveEULA(elua) {
        try {
            await this.Request.sendRequest(
                `${Endpoints.EULA}/agreements/${elua.key}/version/${elua.version}/account/${this.account.id}/accept?locale=${elua.locale}`,
                "POST",
                this.Authorization.fullToken,
                null,
                null,
                null,
                true
            );
            return true;
        } catch(error) {
            console.log(error);
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * @returns {Object} Reputation.
     */
    async reputation() {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.FRONT}/api/reputation`,
                "GET",
            );
            return data;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Sends login request.
     * @param {String} XSRF XSRF Token
     * @param {Object} credentials Object of email and password.
     * @returns {Boolean} true or false.
     */
    async sendLoginRequest(XSRF, credentials) {
        try {
            await this.Request.sendRequest(
                `${Endpoints.FRONT}/api/login`,
                "POST",
                null,
                {
                    email: credentials.email,
                    password: credentials.password,
                    captcha: credentials.captcha ? await credentials.captcha() : '',
                    rememberMe: false
                },
                true,
                {
                    "X-XSRF-TOKEN": XSRF,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                true
            );
            return true;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Sets device auth in file.
     * @param {File} file File.
     * @returns {Object} Device auth.
     */
    async setDeviceInfo(file) {
        try {
            var data = await this.generateDeviceAuth();
            if(!file.includes(".json")) file = `${file}.json`;
            fs.writeFile(file, JSON.stringify({ device_id: data.deviceId, account_id: data.accountId, secret: data.secret, grant_type: 'device_auth', basic_token: 'MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=' }, null, 4), function(err) {
                if(err) {
                    this.debugger.error('Launcher', err);
                }
                return data;
            }); 
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Sends your location at epic so magma can track you.
     * @returns {Object} Response.
     */
    async sendLocation() {
        return await this.Request.sendRequest(
            `${Endpoints.FRONT}/api/location`,
            "POST",
            null,
            null,
            null,
            null,
            null,
        );
    }

    /**
     * Sets the launcher's account object.
     * @returns {Boolean} true or false.
     */
    async setAccount() {
        const { data } = await this.Request.sendRequest(
            `${Endpoints.ACCOUNTSERVICE}/public/account/${this.Authorization.account_id}`,
            "GET",
            this.Authorization.fullToken,
            null,
            null,
            null,
            true,
        );
        this.account = data;
        return this.account = {
            entitlements: await this.getEntitlements(),
            unlinkedPlatforms: await this.graphql.getUnlinkedPlatforms(),
            playtimetracking: await this.graphql.getPlaytimeTotal(),
            records: await this.graphql.getLibraryRecords(),
            coupons: await this.graphql.getCoupons(),
            externalauths: await this.graphql.getExternalAuths(),
            ...this.account,
        }
    }

    /**
     * Sets Auth.
     * @param {Object} Authorization Object of auth from ouathing. 
     * @returns {Boolean} true.
     */
    setAuth(Authorization) {
        this.Authorization = {
            fullToken: `${Authorization.token_type} ${Authorization.access_token}`,
            ...Authorization,
        };
        return true;
    }

    /**
     * Unblock a user.
     * @param {String} blocked Blocked user.
     * @returns {Boolean} True, means the user has been unblocked, false means the user hasn't been unblocked.
     */
    async unblock(blocked) {
        try {
            const { response } = await this.Request.sendRequest(
                `${Endpoints.FRIENDS}/v1/${this.account.id}/blocklist/${blocked}`,
                "DELETE",
                this.Authorization.fullToken,
                null,
                null,
                null,
                false,
            )
            return response.statusCode === 204;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Unfriend a friend.
     * @param {String} friend Friend.
     * @returns {Boolean} True or false.
     */
    async unfriend(friend) {
        if(await this.isAdded(friend) === false) this.debugger.error('Launcher', "Cannot unfriend a user that is not friended.");
        try {
            const { response } = await this.Request.sendRequest(
                `${Endpoints.FRIENDSERVICE}/public/friends/${this.account.id}/${account}`,
                "DELETE",
                this.Authorization.fullToken,
                null,
                null,
                null,
                null,
                false,
            );
            await this.setAccount();
            return response.statusCode == 204;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

    /**
     * Wipes client's friends list.
     * @returns {Boolean} True or false.
     */
    async wipeFriendList() {
        try {
            const { response } = await this.Request.sendRequest(
                `${Endpoints.FRIENDSERVICE}/public/friends/${this.account.id}`,
                "DELETE",
                this.Authorization.fullToken,
                null,
                null,
                null,
                false,
            )
            return response.statusCode === 204;
        } catch(error) {
            this.debugger.error('Launcher', error);
        }
    }

}
module.exports = Launcher;