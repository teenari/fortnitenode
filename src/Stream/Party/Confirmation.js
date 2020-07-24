class Confirmation {
    constructor(streamData, fortnite) {
        this.member = {
            id: streamData.account_id,
            dn: streamData.account_dn,
            revision: streamData.revision,
            meta: streamData.member_state_updated,
            connection: streamData.connection
        }

        this.confirmation_at = streamData.joined_at;
        this.confirmation_updated_at = streamData.updated_at;
        this.fortnite = fortnite;
        this.launcher = this.fortnite.launcher;
    }

    /**
     * Confirm and allow the user to join.
     */
    async confirm() {
        return await this.fortnite.party.confirm(this.member.id);
    }

    /**
     * Reject the user.
     */
    async reject() {
        return await this.fortnite.party.reject(this.member.id);
    }

}

module.exports = Confirmation;