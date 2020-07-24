class Party {
    constructor(fortnite, data) {
        this.message = data.message;
        this.jid = data.jid;
        this.from = {
            user_dn_s: this.jid.resource.split(`:`)[0],
            user_id: this.jid.resource.split(`:`)[1],
            user_plat: this.jid.resource.split(`:`)[4],
        }
        
        this.fortnite = fortnite;
        this.party = this.fortnite.party;
        this.launcher = this.fortnite.launcher;
    }

    /**
     * Reply to that message.
     * @param {String} reply A party message.
     */
    async reply(reply) {
        return await this.fortnite.stream.muc.send(reply);
    }

    /**
     * Ban user from party chat.
     * @param {String} reason Reason for ban.
     */
    async ban(reason) {
        if(this.fortnite.party.captain.id != this.launcher.account.id) return false;
        return await this.fortnite.stream.muc.ban(`${this.from.user_id}@prod.ol.epicgames.com`, reason || "Not provided.");
    }

    /**
     * Kick user from party chat.
     * @param {String} reason Reason for kick.
     */
    async kick(reason) {
        if(this.fortnite.party.captain.id != this.launcher.account.id) return false;
        return await this.fortnite.stream.muc.kick(`${this.from.user_id}@prod.ol.epicgames.com`, reason || "Not provided.");
    }
}

class Friend {
    constructor(launcher, data) {
        this.message = data.message;
        this.jid = data.jid;
        this.from = this.jid.local
        this.launcher = launcher;
    }

    /**
     * Reply to a friend's message.
     * @param {String} reply A message.
     */
    async reply(reply) { 
        return await this.launcher.stream.send(this.from, reply);
    }

}

module.exports = {
    Party,
    Friend,
};