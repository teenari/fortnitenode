class State {
    constructor(body, fortnite) {
        this.fortnite = fortnite;
        this.launcher = this.fortnite.launcher;
        const state = body.party_state_removed ? 'party_state' : 'member_state';
        var set = this.fortnite.party[state === 'party_state' ? 'set' : 'members'];
        var remove = this.fortnite.party[state === 'party_state' ? 'remove' : 'members'];
        if(Array.isArray(set)) set = set.find(member => member.id === body.account_id).set;
        if(Array.isArray(remove)) remove = remove.find(member => member.id === body.account_id).remove;
        this.party = this.fortnite.party;
        this.revision = body.revision;
        this.removed = body[`${state}_removed`];
        this.updated = body[`${state}_updated`];
        this.updated_at = body.updated_at;
        if(state === 'member_state') {
            this.dn = body.account_dn;
            this.id = body.account_id;
            this.joined_at = body.joined_at;
            this.member = this.fortnite.party.members.find(member => member.id === this.id);
            this.member.updated_at = this.updated_at;
        }
        else {
            this.party.config.updated_at = this.updated_at;
            this.party.config.invite_ttl = body.invite_ttl_seconds;
            this.party.config.max_size = body.max_number_of_members;
            this.party.config.sub_type = body.party_sub_type;
            this.party.config.type = body.party_type;
        }
        set.call(this.member ? this.member : this.fortnite.party, this.updated);
        for (const key of this.removed) {
            remove.call(this.member ? this.member : this.fortnite.party, key);
            for (const updateKey in this.updated) {
                if(updateKey === key) {
                  delete this.updated[updateKey];
                }
            }
        }
    }

    /**
     * Get the member's account.
     */
    async getUser() {
        if(!this.dn) this.launcher.debugger.error(`This isn't a member state!`);
        return this.launcher.getAccount(this.dn);
    }
}

module.exports = State;