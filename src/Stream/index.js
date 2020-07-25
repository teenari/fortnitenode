const { createClient: stanza, JID } = require('stanza');
const EventEmitter = require('events');
const Friend = require("fortnitenode/src/Launcher/Friend");
const MUC = require("fortnitenode/src/Stream/Party/MUC");
const Member = require("fortnitenode/src/Party/Member");
const State = require("fortnitenode/src/Stream/State");
const Invite = require("fortnitenode/src/Stream/Party/Invite");
const Confirmation = require("fortnitenode/src/Stream/Party/Confirmation");
const Status = require("fortnitenode/src/Stream/Status");
const Message = require("fortnitenode/src/Stream/Message");
const fs = require("fs");

class Stream extends EventEmitter {
    constructor(fortnite, config) {
        super();
        this.config = config;
        this.fortnite;
        if(fortnite.launcher) {
            this.config.type = "Fortnite";
            this.launcher = fortnite.launcher;
            this.fortnite = fortnite;
        } else {
            this.launcher = fortnite;
        }
        this.options = {   
            sendReceipts: true,
            useStreamManagement: false,
            timeout: 5000,
            chatMarkers: true,
            server: this.config.prod,
            host: this.config.prod,
            jid: this.config.prod,
            resource: this.config.resource,
            credentials: this.config.credentials,
            transports: {
                websocket: `wss://${this.config.service}`,
                bosh: false
            },
        }

        this.muc;
        this.stanza;
        this.usingHandler;
        this.dontReconnect;
        this.currentStatus;
    }

    /**
     * Check if a file exists.
     * @param {String} filePath A file  path.
     */
    async fileExist(filePath) {
        return fs.existsSync(filePath) ? true : false;
    } 

    /**
     * Use a event handler.
     * @param {String} folder Folder.
     */
    async useEventHandler(folder) {
        this.usingHandler = true;
        this.on("eventHandler", async (data) => {
            if(await this.fileExist(`${folder}/${data.type}.js`) == true) {
                const file = require(`${folder}/${data.type}`);
                await file(this.fortnite, {
                    ...data,
                    __proto__: data.__proto__,
                });
            }
        });
    }

    /**
     * Manual event handler, will ask you what to do with a event in console.
     */
    async manualEventHandler() {
        if(this.usingHandler) return false;
        this.on("eventHandler", async (data) => {
            if(data.__proto__.accept) {
                var message;
                if(data.__proto__.decline) message = `Would you like to accept or decline event \`${data.type}\`?`
                else `Would you like to accept event \`${data.type}\`?`
                if(data.pinger) message = `Would you like to accept or decline event \`${data.type}\` from ${data.pinger.pinger_dn}`
                await this.launcher.debugger.question(`[Event Handler] ${message} Y/N: `, async (answer) => {
                    if(answer == "Y") {
                        await data.accept();
                        this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Accepted.');
                    }
                    else if(answer == "N") {
                        if(data.__proto__.decline) {
                            await data.decline();
                            this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Declined.');
                        }
                        else this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Nothing has been done.');
                    }
                    else this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Nothing has been done.');
                });
            }
            else if(data.__proto__.reply) {
                await this.launcher.debugger.question(`[Stream#${this.config.type}#Event Handler#${data.type}] Would you like to reply for \`${data.type}\`? Any/N: `, async (answer) => {
                    if(answer == "N") {
                        return this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Nothing has been done.');
                    }
                    else {
                        await data.reply(answer);
                        this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Replyed');
                    }
                });
            }
            else if(data.__proto__.confirm) {
                var message;
                if(data.__proto__.reject) message = `Would you like to accept or reject event \`${data.type}\`?`
                else `Would you like to confirm event \`${data.type}\`?`
                if(data.pinger) message = `Would you like to confirm or reject event \`${data.type}\` from ${data.pinger.pinger_dn}`
                await this.launcher.debugger.question(`[Event Handler] ${message} Y/N: `, async (answer) => {
                    if(answer == "Y") {
                        await data.confirm();
                        this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Confirmed.');
                    }
                    else if(answer == "N") {
                        if(data.__proto__.reject) {
                            await data.reject();
                            this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Rejected.');
                        }
                        else this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Nothing has been done.');
                    }
                    else this.launcher.debugger.debug(`Stream#${this.config.type}#Event Handler#${data.type}`, 'Nothing has been done.');
                });
            }
        });
    }

    /**
     * Start the stream.
     */
    async stream() {
        return new Promise((resolve) => {
            this.stanza = stanza(this.options);
            this.stanza.enableKeepAlive({
                interval: 70,
            });
            this.stanza.on("session:started", () => {
                this.launcher.debugger.debug(`Stream#${this.config.type}`, 'Session has started!');
                this.emit('started');
                this.setPresence(null);
                setInterval(() => {
                    this.setPresence(this.currentStatus);
                }, 60 * 1000);
                resolve(true);
            });
            this.events();
            this.stanza.connect();
        });
    }

    /**
     * Disconnect.
     */
    disconnect() {
        this.dontReconnect = true;
        this.stanza.disconnect();
    }

    /**
     * Handle the events.
     */
    events() {
        if (!this.stanza) {
            return;
        }

        this.stanza.on("auth:failed", () => {
            this.launcher.debugger.error(`Stream#${this.config.type}`, 'Stream has unsuccessfully logged in.');
        });

        this.stanza.once('disconnected', () => {
            if(!this.dontReconnect) {
                this.launcher.debugger.debug(`Stream#${this.config.type}`, 'Stream disconnected, reconnecting.');
                this.stream();
            }
            else {
                this.launcher.debugger.debug(`Stream#${this.config.type}`,  'Stream disconnected manually.');
            }
        });

        this.stanza.once('connected', () => {
            this.launcher.debugger.debug(`Stream#${this.config.type}`, 'Connected.');
        });

        this.stanza.on("presence", async (presence) => {
            if(presence.status) {

                const body = JSON.parse(presence.status);
                this.emit(`status`, body);
                this.emit(`status#${presence.from.split("@")[0]}`, body);
                this.emit("eventHandler", {
                    ...body,
                    type: 'status',
                });
            }
        });

        this.stanza.on("chat", async (data) => {
            const jid = JID.parse(data.from);
            if(jid.resource.split(`:`)[1] == this.launcher.account.id) return;
            const message = new Message.Friend(this.launcher, {
                jid,
                message: data.body,
            });
            this.emit("message", message);
            this.emit(`message#${message.from}`, message);
            this.emit("eventHandler", {
                ...message,
                type: "message",
                __proto__: message.__proto__,
            });
        });

        this.stanza.on("groupchat", async (data) => {
            if(data.body == `Welcome! You created new Multi User Chat Room.`) return;
            const jid = JID.parse(data.from);
            if(jid.resource.split(`:`)[1] == this.launcher.account.id) return;
            const message = new Message.Party(this.fortnite, {
                jid,
                message: data.body,
            });
            this.emit("party#chat", message);
            this.emit("eventHandler", {
                ...message,
                type: "partychat",
                __proto__: message.__proto__,
            });
        });

        this.stanza.on("message", async (data) => {
            if(data.body) {
                var body;
                if(data.body.includes("{")) {
                    body = JSON.parse(data.body);
                }
                else {
                    body = data.body;
                }
                if(typeof body == "object") {
                    switch(body.type) {

                        case 'com.epicgames.social.party.notification.v0.PARTY_UPDATED': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;

                            this.emit("party#state", new State(body, this.fortnite));
                            this.emit("eventHandler", {
                                ...new State(body, this.fortnite),
                                type: "partyState",
                                __proto__: new State(body, this.fortnite).__proto__,
                            });
                        } break;

                        case 'com.epicgames.social.party.notification.v0.MEMBER_STATE_UPDATED': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;

                            this.emit("member#state", new State(body, this.fortnite));
                            this.emit(`member#state#${body.account_id}`, new State(body, this.fortnite));
                            this.emit("eventHandler", {
                                ...new State(body, this.fortnite),
                                type: "memberState",
                                __proto__: new State(body, this.fortnite).__proto__,
                            });
                        } break;

                        case 'com.epicgames.social.party.notification.v0.MEMBER_NEW_CAPTAIN': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party || this.fortnite.party.joining == true) break;
                            if(this.fortnite.party.members.find(member => member.id == body.account_id)) this.fortnite.party.members.find(member => member.id == body.account_id).updated_at = new Date().toISOString();
                            var member = this.fortnite.party.members.find(member => member.id === body.account_id);

                            if(this.fortnite.party.captain)
                                this.fortnite.party.captain.role = "MEMBER";
                            member.role = "CAPTAIN";

                            this.emit("member#promoted", member);
                            this.emit(`member#promoted#${body.account_id}`, member);

                            this.emit("eventHandler", {
                                ...member,
                                type: "memberPromoted",
                                __proto__: member.__proto__
                            });
                        } break;

                        case 'com.epicgames.social.party.notification.v0.MEMBER_KICKED': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;

                            var member;
                            if(this.fortnite.party.members) member = this.fortnite.party.members.find(member => member.id === body.account_id);
                            if(this.fortnite.party.members) this.fortnite.party.members = this.fortnite.party.members.filter(member => member.id !== body.account_id);
                            member = new Member(this.fortnite, member || body);
                            member.isClient = member.id == this.launcher.account.id;
                            if(member.isClient) await this.fortnite.party.create();
                            await this.fortnite.party.patch();
                            this.emit("member#kicked", member);
                            this.emit(`member#kicked#${body.account_id}`, member);

                            this.emit("eventHandler", {
                                ...member,
                                type: "memberKicked",
                                __proto__: member.__proto__
                            });
                        } break;

                        case 'com.epicgames.social.party.notification.v0.MEMBER_LEFT': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;

                            var member;
                            if(this.fortnite.party.members) member = this.fortnite.party.members.find(member => member.id === body.account_id);
                            if(this.fortnite.party.members) this.fortnite.party.members = this.fortnite.party.members.filter(member => member.id !== body.account_id);
                            member = new Member(this.fortnite, member || body);
                            member.isClient = member.id == this.launcher.account.id;
                            await this.fortnite.party.patch();

                            this.emit("member#leave", member);
                            this.emit(`member#leave#${body.account_id}`, member);
                            this.emit("eventHandler", {
                                ...member,
                                type: "memberLeave",
                                __proto__: member.__proto__
                            });
                        } break;

                        case 'com.epicgames.social.party.notification.v0.MEMBER_JOINED': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;

                            var member = new Member(this.fortnite, {
                                account_id: body.account_id,
                                connections: body.connection,
                                meta: body.member_state_updated,
                                role: "MEMBER"
                            });

                            if(this.fortnite.party.members && !this.fortnite.party.members.find(m => m.id === member.id)) this.fortnite.party.members.push(member);
                            member.isClient = member.id == this.launcher.account.id;

                            const invite = this.fortnite.party.invites.find(invite => invite.sent_to === body.account_id);
                            if(invite) {
                                const data = {
                                    from: {
                                        dn: invite.meta["urn:epic:member:dn_s"],
                                        id: invite.sent_by,
                                    },
                                    to: body.account_id,
                                    acceptedAt: new Date().toISOString()
                                };
                                this.emit("invite#accepted", data);
                                this.emit(`invite#accepted#${body.account_id}`, data);
                                this.emit("eventHandler", {
                                    ...data,
                                    type: "inviteAccepted",
                                });
                                this.fortnite.party.invites = this.fortnite.party.invites.filter(invite => invite.sent_to === body.account_id);
                            }

                            await this.fortnite.party.patch();

                            this.emit("member#join", member);
                            this.emit(`member#join#${member.id}`, member);

                            this.emit("eventHandler", {
                                ...member,
                                type: "memberJoin",
                                __proto__: member.__proto__,
                            });
                        } break;

                        case 'com.epicgames.party.invitation': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;
                            await this.fortnite.party.sendPartyPresence();
                            const party = await this.fortnite.party.getPing(body.pinger_id);

                            const invite = new Invite(this.fortnite, {
                                ...body,
                                party: party[0],
                            });
                            this.emit("invite", invite);
                            this.emit(`invite#${body.pinger_id}`, invite);
                            this.emit("eventHandler", {
                                ...invite,
                                type: "invite",
                                __proto__: invite.__proto__
                            });
                        } break;

                        case 'com.epicgames.social.party.notification.v0.PING': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;
                            await this.fortnite.party.sendPartyPresence();
                            const party = await this.fortnite.party.getPing(body.pinger_id);

                            const invite = new Invite(this.fortnite, {
                                ...body,
                                party: party[0],
                            });
                            this.emit("invite", invite);
                            this.emit(`invite#${body.pinger_id}`, invite);
                            this.emit("eventHandler", {
                                ...invite,
                                type: "invite",
                                __proto__: invite.__proto__
                            });
                        } break;

                        case 'com.epicgames.social.party.notification.v0.INVITE_DECLINED': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;

                            var invite = this.fortnite.party.invites.find(invite => invite.sent_by === body.inviter_id && invite.party_id === body.party_id);

                            invite.status = "DECLINED";
                            invite.updated_at = new Date().toISOString();

                            this.emit("invite#declined", invite);
                            this.emit(`invite#declined#${body.inviter_id}`, invite);
                            this.emit(`invite#declined#${body.invitee_id}`, invite);
                            this.emit("eventHandler", {
                                ...invite,
                                type: "inviteDeclined",
                            });
                        } break;

                        case 'com.epicgames.social.party.notification.v0.INVITE_EXPIRED': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;

                            this.fortnite.party.invites = this.fortnite.party.invites.filter(invite => invite !== this.fortnite.party.invites.find(invite => invite.sent_by === body.inviter_id && invite.party_id === body.party_id));

                            const data = {
                                to: body.invitee_id,
                                from: body.inviter_id,
                                ttl: this.fortnite.party.config.invite_ttl
                            }

                            this.emit("invite#expired", data);
                            this.emit(`invite#expired#${body.inviter_id}`, data);
                            this.emit("eventHandler", {
                                ...data,
                                type: "inviteExpired",
                            });
                        } break;

                        case 'com.epicgames.social.party.notification.v0.MEMBER_REQUIRE_CONFIRMATION': {
                            if(this.config.type != "Fortnite") break;
                            if(!this.fortnite.party) break;
                            const confirmation = new Confirmation(body, this.fortnite);

                            this.emit("member#confirmation", confirmation);
                            this.emit(`member#confirmation#${body.account_id}`, confirmation);
                            this.emit("eventHandler", {
                                ...confirmation,
                                type: "memberConfirmation",
                                __proto__: confirmation.__proto__
                            });
                        } break;

                        case 'FRIENDSHIP_ENTRY_UPDATE': {
                            this.emit("entryUpdate", body);
                            this.emit(`entryUpdate#${body.friendId}`, body);

                            this.emit("eventHandler", {
                                ...body,
                                type: "entryUpdate",
                            });
                        } break;

                        case 'USER_SETTINGS_UPDATE': {
                            const data = {
                                userId: body.accountId,
                                updated: body.invitationMode,
                                updatedAt: body.timestamp,
                            }
                            this.emit("user#updated", data);
                            this.emit(`user#updated#${account.id}`, data);

                            this.emit("eventHandler", {
                                ...data,
                                type: "userUpdated",
                            });
                        } break;

                        case 'FRIENDSHIP_REMOVE': {
                            const account = await this.launcher.getAccount(body.to);
                            if(body.reason === "ABORTED") {
                                this.emit("friend#request#aborted", account);
                                this.emit(`friend#request#aborted#${account.id}`, account);
    
                                this.emit("eventHandler", {
                                    ...account,
                                    type: "friendRequestAborted",
                                });
                            }
                            else {
                                this.emit("friend#removed", account);
                                this.emit(`friend#removed#${account.id}`, account);

                                this.emit("eventHandler", {
                                    ...account,
                                    type: "friendRemoved",
                                });
                            }
                        } break;

                        case 'FRIENDSHIP_REQUEST': {
                            if(body.status == "ACCEPTED") {
                                this.emit("friend#request#accepted", new Friend.Class(this.launcher, {
                                    accountId: body.from,
                                    direction: "ACCEPTED",
                                    created: body.timestamp,
                                    favorite: false,
                                }));
                                this.emit("eventHandler", {
                                    ...new Friend.Class(this.launcher, {
                                        accountId: body.from,
                                        direction: "ACCEPTED",
                                        created: body.timestamp,
                                        favorite: false,
                                    }),
                                    type: 'friendRequestAccepted',
                                    __proto__: new Friend.Class(this.launcher, {
                                        accountId: body.from,
                                        direction: "ACCEPTED",
                                        created: body.timestamp,
                                        favorite: false,
                                    }).__proto__
                                });
                                break;
                            }
                            const friend = new Friend.Request(this.launcher, body);
                            this.emit("friend#request", friend);
                            this.emit("eventHandler", {
                                ...friend,
                                type: "friendRequest",
                                __proto__: friend.__proto__
                            });
                        } break;

                        // default:
                        // break;

                    }
                }
                /*
                else {  
                    if(body.interactions) {
                        const interaction = body.interactions[0];
                        switch(interaction.interactionType) {
                        }
                    }
                }
                */
            }
        });
    }

    /**
     * Send presence.
     * @param {Object} Presence A presence object.
     */
    setPresence(Presence) {
        if(!this.stanza) {
            return;
        }

        this.stanza.sendPresence(Presence);
        this.currentStatus = Presence;
    }

    makeMUC(room) {
        this.muc = new MUC(this, {
          id: room  
        });
        this.muc.join();
        return this.muc;
    }

    /*
     * Unused.
        async findInvite(pingerId) {
            const User = await this.fortnite.party.getUser();
            if(User.invites) {
                var invite = User.invites.find(invite => invite.status === "SENT" && invite.sent_by === pingerId);
                if(!invite) {
                    var presence = await this.waitforEvent(`status[${pingerId}]`);

                    const joinData = this.findJoinInfoData(presence);
                    return joinData;
                }
                return {
                    sourceId: pinger,
                    partyId: invite.party_id,
                    ...invite,
                }
            }
        }

        findJoinInfoData(presence) {
            return presence.Properties[Object.keys(presence.Properties).find(v => /^party\.joininfodata\.([0-9]{0,})\_[a-z]$/.test(v))];
        }
    */

    static createMUC(stanza, room) {
        return new MUC(stanza, {
            id: room,
        });
    }

    /**
     * Wait for a event.
     * @param {String} event Event.
     */
    async waitforEvent(event) {
        return new Promise((resolve) => {
            this.once(event, (data) => {
                resolve(data);
            });
        });
    }
    
    /**
     * Send a messages.
     * @param {String} user A friend to send a message to. 
     * @param {*} data A message.
     */
    send(user, data) {
        if(this.fortnite) this.fortnite.launcher.stream.stanza.sendMessage({
            to: `${user}@prod.ol.epicgames.com`,
            type: 'chat',
            body: data || "NONE",
        });
        return this.stanza.sendMessage({
            to: `${user}@prod.ol.epicgames.com`,
            type: 'chat',
            body: data || "NONE",
          });
    }

}

module.exports = Stream;