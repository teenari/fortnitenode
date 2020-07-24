class Class {
    constructor(launcher, data) {
       this.id = data.accountId;
       this.created = data.created;
       this.favorite = data.favorite;
       this.direction = data.direction;
       this.launcher = launcher;
    }

    /**
     * Remove the user.
     */
    async remove() {
        return await this.launcher.unfriend(this.id);
    }

    /**
     * Send a message to friend.
     * @param {String} message Message.
     */
    async send(message) {
        return await this.launcher.stream.send(this.id, message);
    }
}

class Request {
    constructor(launcher, data) {
        this.launcher = launcher;
        this.friendId = data.from;
        this.timestamp = data.timestamp;
    }

    /**
     * Accept friend request.
     */
    async accept() {
        return await this.launcher.friend(this.friendId);
    }

    /**
     * Decline friend request.
     */
    async decline() {
        return await this.launcher.unfriend(this.friendId);
    }

}

module.exports = {
    Class,
    Request,
}