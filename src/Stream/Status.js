class Status {
    constructor(status) {
        this.bHasVoiceSupport = status.bHasVoiceSupport || null;
        this.bIsJoinable = status.bIsJoinable || null;
        this.bIsPlaying = status.bIsPlaying || null;
        this.ProductName = status.ProductName || null;
        this.Properties = status.Properties;
        this.SessionId = status.SessionId || null;
        this.Status = status.Status || null;

        if(this.Status && this.Status !== "") {
            this.isInMatch = this.Status.includes('Playing');
        }

        if(this.Properties.GamePlaylistName_s) {
            this.gamemode = this.Properties.GamePlaylistName_s;
        }
    }
}

module.exports = Status;