const Endpoints = require('fortnitenode/resources/Endpoints');
const ntc = require('name-that-color/lib/ntc');

class Hub {
    constructor(fortnite) {
        this.fortnite = fortnite;
        this.launcher = this.fortnite.launcher;
    }

    /**
     * Set avatar.
     * @param {String} avatar Avatar id.
     */
    async setAvatar(avatar) {
        try {
            const { response } = await this.fortnite.Request.sendRequest(
                `${Endpoints.CHANNEL}/v1/user/${this.launcher.account.id}/setting/avatar`,
                'PUT',
                this.fortnite.Authorization.fullToken,
                `{"value": "${avatar}"}`,
                false,
                {
                    'Content-Type': "application/json"
                },
                false,
            )
            await this.fortnite.party.sendPartyPresence();
            return response.statusCode === 204;
        } catch(error) {
            this.launcher.debugger.error(error);
        }
    }

    getHexName(hex) {
        return ntc.name(hex);
    }

    /**
     * All colors you can use.
     */
    async getColors() {
        const hexColors = await this.launcher.getAvailableValue('avatarBackground');
        var colors = [];
        for (const hex of hexColors) {
            const colorPush = {
                colors: []
            };
            for (const mainHex of hex.split("\"").filter(hex => hex.includes("#"))) {
                colorPush.colors.push({mainHex, name: this.getHexName(mainHex)[1]});
            }

            colors.push({
                firstHex: colorPush.colors[0].mainHex,
                firstName: colorPush.colors[0].name,
                colors: colorPush.colors,
                fullHex: hex,
            });
        }
        return colors;
    }

    /**
     * Set background color.
     * @param {String} value Color name. 
     */
    async setBackground(value) {
        const colors = await this.getColors();
        const name = value;
        for (const c of colors) {
            for (const s of c.colors) {
                if(s.name.includes(value)) value = c.fullHex;
            }
        }
        if(value === name) value = colors[0].fullHex;
        try {
            const { response } = await this.fortnite.Request.sendRequest(
                `${Endpoints.CHANNEL}/v1/user/${this.launcher.account.id}/setting/avatarBackground`,
                'PUT',
                this.fortnite.Authorization.fullToken,
                JSON.stringify({value}),
                false,
                {
                    'Content-Type': "application/json"
                },
                false,
            )
            await this.fortnite.party.sendPartyPresence();
            return response.statusCode === 204;
        } catch(error) {
            this.launcher.debugger.error(error);
        }
    }
}

module.exports = Hub;