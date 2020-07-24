const { JID } = require('stanza');

class MUC {
    constructor(stream, data) {
        this.launcher = stream.launcher;

        this.stream = stream;
        this.launcher = this.stream.launcher;
        this.stanza = stream.stanza;

        this.config = {
            id: data.id || null,
            nick: data.nick || `${this.launcher.account.displayName}:${this.launcher.account.id}:${this.stream.config.resource}`,  
        }
        if (data.join && data.id) {
            this.join();
        }
    }

    /**
     * Send a message to the muc room.
     * @param {String} data Something to send to the muc.
     */
    async send(data) {
        return this.sendData({
            to: this.config.id,
            type: 'groupchat',
            body: data || "NONE",
          });
    }

    async sendData(data) {
        if (!this.config.id) {
            return false;
        }
        return this.stanza.sendMessage(data);
    }

    /**
     * Leave the current or room.
     * @param {String} room A room. (NOT REQUIRED)
     */
    leave(room) {
        try {
            if (this.config.nick.value && !room) {

                const joinedRooms = this.stanza.joinedRooms.keys().value[0];
                if (joinedRooms == room) {
                    return;
                }
                if(joinedRooms.length != 0) {
                    Array.from(this.stanza.joinedRooms.keys()).forEach(room => {
                        this.stanza.leaveRoom(room, this.config.nick);
                    });
                }
                return true;
            } else {
                this.stanza.leaveRoom(room, this.config.nick);
                return true;
            }
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Trigger events.
     */
    events() {
        this.stanza.on('muc:join', async (muc) => {
            this.config = {
              id: muc.from,
              nick: muc.muc.nick.split(":")[1],
              ...this.config,
            }
            if (muc.muc.nick.split(":")[1] == this.launcher.account.id) {
      
              if(this.stanza.joinedRooms.keys().next().value == muc.from) {
                  return;
              }
              this.launcher.debugger.debug(`Stream#${this.stream.config.type}#Xmpp`, `Joined room ${muc.from.split(`/`)[0].split("@")[0]}`);
            }
          });
      
          this.stream.on('muc:leave', async (muc) => {
            if(muc.muc.nick.split(":")[1] == this.app.launcher.account.id) {
                this.config = {
                    nick: muc.muc.nick.split(":")[1],
                    ...this.config
                }
                if(this.stanza.joinedRooms.keys().value[0] == muc.from) {
                    return;
                }
                this.launcher.debugger.debug(`Stream#${this.stream.config.type}#Xmpp`, `Left room ${muc.from.split(`/`)[0].split("@")[0]}`);
            }
          });
    }

    /**
     * Join a room.
     * @param {String} room A room.
     */
    join(room) {
        this.leave();
        this.events();
        this.stanza.joinRoom(room || this.config.id, this.config.nick);
        this.config.id = room || this.config.id;
        return true;
    }

    /**
     * Ban a person from the room.
     * @param {String} nick The person's nick.
     * @param {String} reason A reason.
     */
    async ban(nick, reason) {
        if(!this.config.id) {
            return false;
        }
        try {
            await this.stanza.ban(this.config.id, JID.parse(nick), reason || '', '');
            return true;
        } catch(error) {
            throw new Error(error);
        }
    }

    /**
     * Kick a person from the room.
     * @param {String} nick The person's nick.
     * @param {String} reason A reson.
     */
    async kick(nick, reason) {
        if(!this.config.id) {
            return false;
        }
        try {
            await this.stanza.kick(this.config.id, JID.parse(nick), reason || '', '');
            return true;
        } catch(error) {
            throw new Error(error);
        }
    }

}

module.exports = MUC;