const request = require('request-promise');

class Request {
    constructor(Launcher, isFortnite) {

        this.launcher = Launcher;
        this.isFortnite = isFortnite || null;

        this.jar = request.jar();
        this.default = {
            timeout: 10000,
            headers : {},
            jar: this.jar,
            agent: false,
            pool: {
                maxSockets: 100
            }
        }
        this.request = request;
    }

    async sendRequest(url, method, auth, payload, isForm, headers, isJson) {
        if(this.launcher && this.launcher.killedToken) throw new Error("Cannot send request token has been killed.");
        try {
            var options = {
                ...this.default,
                headers: {...this.default.headers},
                method: method || "GET",
                uri: url,
                resolveWithFullResponse: true,
            }

            options.json = isJson || true;
            if(isForm) options.form = payload
            if(payload) options.body = payload;
            if(headers) options.headers = {
                ...this.default.headers,
                ...headers,
            };

            if(this.launcher) if(auth == 'typetoken') options.headers.Authorization = this.launcher.Authorization.fullToken;
            else if(auth) options.headers.Authorization = auth;
            const request = await this.request(options);

            return {
                response: request,
                data: request.body,
            }
        }
        catch(err) {
            if(typeof err.error == "object") {
                switch(err.error.errorCode) {
                    case 'errors.com.epicgames.accountportal.csrf_token_invalid': {
                        return await this.sendRequest(url, method, auth, payload, isForm, headers, isJson);
                    }
                    case 'errors.com.epicgames.social.party.stale_revision': break;
                    default: {
                        console.log(err)
                        throw ({code: err.error.errorCode, error: err, message: err.error.message, statusCode: err.statusCode});
                    }
                }
            }
        }
    }
}

module.exports = Request;