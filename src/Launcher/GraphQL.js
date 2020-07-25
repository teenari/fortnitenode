const Request = require('fortnitenode/src/Request');
const Endpoints = require('fortnitenode/resources/Endpoints');

class GraphQL {
    constructor(launcher) {
        this.fortnite = null;
        if(launcher.launcher) {
            this.launcher = launcher.launcher;
            this.fortnite = launcher;
        }
        else {
            this.launcher = launcher;
        }

        this.Request = new Request(this.launcher);
        this.Authorization = this.fortnite ? this.fortnite.Authorization : this.launcher.Authorization;
    }

    /**
     * Unlinked platforms.
     */
    async getUnlinkedPlatforms() {
        const { data: { data: { Account: { myAccount: { unlinkedDieselPlatforms } } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `query accountQuery($locale: String!, $countryCode: String) { Account { myAccount { unlinkedDieselPlatforms( countryCode: $countryCode, locale: $locale, newUserOnly: true ) } } }`,
                variables: {
                    locale: `${this.launcher.account.preferredLanguage}-${this.launcher.account.country}`,
                    countryCode: this.launcher.account.country
                }
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return unlinkedDieselPlatforms;
    }

    /**
     * Playtime tracking total.
     */
    async getPlaytimeTotal() {
        const { data: { data: { PlaytimeTracking: { total } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `query playtimeTrackingQuery($accountId: String!){ PlaytimeTracking { total(accountId: $accountId) { artifactId totalTime } } }`,
                variables: {
                    accountId: this.launcher.account.id
                }
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return total;
    }

    /**
     * Library records.
     */
    async getLibraryRecords() {
        const { data: { data: { Launcher: { libraryItems: { records } } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `query libraryQuery($cursor: String, $excludeNs: [String]) { Launcher { libraryItems(cursor: $cursor, params: {excludeNs: $excludeNs}) { records { catalogItemId namespace appName } responseMetadata { nextCursor} } } }`,
                variables: {
                    cursor: "",
                    excludeNs: [
                        "ue"
                    ]
                }
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return records;
    }

    /**
     * Coupons,
     */
    async getCoupons() {
        const { data: { data: { CodeRedemption: { coupons } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `query getCoupons($currencyCountry: String!, $identityId: String!) { CodeRedemption { coupons(currencyCountry: $currencyCountry, identityId: $identityId, includeSalesEventInfo: true) { code codeStatus codeType consumptionMetadata { amountDisplay {   amount   currency   placement   symbol } minSalesPriceDisplay {   amount   currency   placement   symbol } } endDate namespace salesEvent { eventSlug voucherImages {   type   url } } startDate } } }`,
                variables: {
                    currencyCountry: this.launcher.account.country,
                    identityId: this.launcher.account.id
                }
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return coupons;
    }

    /**
     * Multiple users.
     * @param {Array} accountIds Array of user ids.
     */
    async getMultipleUsers(accountIds) {
        const { data: { data: { Account: { accounts } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `query AccountQuery($accountIds: [String]!) { Account { accounts(accountIds: $accountIds) { id displayName externalAuths { type accountId externalAuthId externalDisplayName } } } }`,
                variables: {
                    accountIds,
                }
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return accounts;
    }

    /**
     * User.
     * @param {Array} displayName DisplayName.
     */
    async getUser(displayName) {
        const { data: { data: { Account: { account } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `query AccountQuery($displayName: String!) { Account { account(displayName: $displayName) { id displayName externalAuths { type accountId externalAuthId externalDisplayName } } } }`,
                variables: {
                    displayName,
                }
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return account[0];
    }

    /**
     * Summary of account.
     */
    async getSummary(displayNames=true) {
        const { data: { data: { Friends: { summary } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `query FriendsQuery($displayNames: Boolean!) { Friends { summary(displayNames: $displayNames) { friends { alias note favorite ...friendFields } incoming { ...friendFields } outgoing { ...friendFields } blocklist { ...friendFields } } } } fragment friendFields on Friend { accountId displayName account { externalAuths { type accountId externalAuthId  externalDisplayName } } }`,
                variables: {
                    displayNames
                }
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return summary;
    }

    async getFriends() {
        const summary = await this.getSummary();
        return summary.friends;
    }

    async getIncoming() {
        const summary = await this.getSummary();
        return summary.incoming;
    }

    async getBlocklist() {
        const summary = await this.getSummary();
        return summary.blocklist;
    }

    async getOutgoing() {
        const summary = await this.getSummary();
        return summary.outgoing;
    }

    /**
     * Presence V2 online summary.
     * @param {String} namespace Namespace (Ex. Fortnite)
     * @param {*} circle Circle (Ex. friends)
     */
    async getPresenceV2Online(namespace= "Fortnite", circle="friends") {
        const { data: { data: { PresenceV2: { getLastOnlineSummary: { summary } } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `query PresenceV2Query($namespace: String!, $circle: String!) { PresenceV2 { getLastOnlineSummary(namespace: $namespace, circle: $circle) { summary { friendId last_online } } } }`,
                variables: {
                    namespace,
                    circle
                }
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return summary;
    }

    /**
     * External auths for account.
     */
    async getExternalAuths() {
        const { data: { data: { Account: { myAccount: { externalAuths } } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `query AccountQuery { Account { myAccount { externalAuths { type accountId externalAuthId externalDisplayName } } } }`,
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return externalAuths;
    }

    /**
     * Set alias of friend.
     * @param friendId The friend's id.
     * @param alias The alias you want to set.
     */
    async setAlias(friendId, alias) {
        const { data: { data: { Friends: { setAlias: { success } } } } } = await this.Request.sendRequest(
            `${Endpoints.KAIROS}/graphql`,
            "POST",
            this.launcher.Authorization.fullToken,
            {
                query: `mutation FriendsMutation($friendId: String!, $alias: String!) { Friends { setAlias(friendId: $friendId, alias: $alias) { success } } }`,
                variables: {
                    friendId,
                    alias
                }
            },
            false,
            {
                "Content-Type": "application/json",
            },
            true
        );
        return success;
    }

}

module.exports = GraphQL;