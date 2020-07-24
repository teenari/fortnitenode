class StatsParser {
    constructor(stats) {
        this.stats = stats;
    }

    parse() {
        var stats = {};
        const objectkeys = Object.keys(this.stats);

        for (var o = 0; o < objectkeys.length; o++) {
            const key = objectkeys[o];
            const mainKey = this.stats[objectkeys[o]];
            const split = key.split('_');
            const platform = key.split('_m0_')[0].split('_')[2].split('playlist')[0];

            switch (true) {

                case /^br$/gm.test(split[0]):
                    const playlist = key.split('playlist_')[1];

                    if(stats[platform]) {
                        if(stats[platform][playlist]) {
                            stats[platform][playlist] = {
                                ...stats[platform][playlist],
                                [split[1]]: mainKey,
                                ...split[1] === 'placetop1' ? {wins: mainKey} : {},
                            }
                        }
                        else {
                            stats[platform][playlist] = {
                                [split[1]]: mainKey,
                                ...split[1] === 'placetop1' ? {wins: mainKey} : {},
                            }
                        }
                    }
                    else {
                        stats[platform] = {
                            [playlist]: {
                                [split[1]]: mainKey,
                                ...split[1] === 'placetop1' ? {wins: mainKey} : {},
                            }
                        }
                    }
                    if(stats[platform][playlist].wins) {
                        const lost = stats[platform][playlist].matchesplayed - stats[platform][playlist].wins;
                        const winrate = [stats[platform][playlist].wins/(stats[platform][playlist].wins + lost)] * 100;
                        stats[platform][playlist].winrate = Math.trunc(winrate);
                        stats[platform][playlist].loses = lost;
                    } 
                    break;
            }
        }

        for (o = 0; o < Object.keys(stats).length; o++) {
            const key = Object.keys(stats)[o];
            const object = stats[key];
    
            for (var a = 0; a < Object.keys(object).length; a++) {
                const playlistName = Object.keys(object)[a];
                const playlist = object[playlistName];
                if(playlist.matchesplayed) {
                    switch (true) {

                        case /^default([a-z]{0,})$/.test(playlistName):
                            const defaultKey = playlistName.split('default')[1];
                            if(stats[defaultKey])
                                stats[defaultKey][key] = playlist;
                            else
                                stats[defaultKey] = {[key]: playlist};
                        break;

                    }
                }
            }
            
        }

        return stats;
    }
}

module.exports = StatsParser;