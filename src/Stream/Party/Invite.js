const Endpoints = require("fortnitenode/resources/Endpoints");

class Invite {
    constructor(fortnite, data) {
        this.fortnite = fortnite;
        this.launcher = fortnite.launcher;

        this.pinger_id = data.pinger_id;
        this.party = data.party;
    }

    /**
     * Accept the invite.
     */
    async accept() {
        return await this.fortnite.party.join(this.party.id);
    }

    /**
     * Decline the invite.
     */
    async decline() {
        await this.fortnite.Request.sendRequest(
            `${Endpoints.PARTY}/v1/Fortnite/parties/${this.party.id}/invites/${this.pinger_id}/decline`,
            "POST",
            this.fortnite.Authorization.fullToken,
            null,
            null,
            null,
            true,
        );
        await this.fortnite.party.deleteInvite(this.party.id, this.pinger_id);
        return true;
    }

}

module.exports = Invite;