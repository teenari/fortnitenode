const Readline = require('readline');

class Debug {
    constructor(custom_message, debug) {
        this.custom_message = custom_message;
        this.debugger = debug;

        this.Readline = Readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    debug(name, message) {
        if(!this.debugger) return;
        return this.debugger(`[${name}${this.custom_message ? `#${this.custom_message}` : ''}] ${message}`);
    }

    error(name, error) {
        if(!this.debugger) return;
        throw new Error(`[${name}${this.custom_message ? `#${this.custom_message}` : ''}] ${error}`);
    }

    async question(question, callback) {
        return new Promise(() => {
            this.Readline.question(question, callback);
        });
    }
}

module.exports = Debug;