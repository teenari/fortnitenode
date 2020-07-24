const Endpoints = require("fortnitenode/resources/Endpoints");
const Member = require("fortnitenode/src/Party/Member");
const Hub = require("fortnitenode/src/Party/Hub");
const PrivacySettings = require('fortnitenode/enums/PrivacySettings');

class Party {
    constructor(Fortnite, config) {
        this.fortnite = Fortnite;
        this.launcher = this.fortnite.launcher;
        this.Request = Fortnite.Request;

        this.setConfig(config);
        this.revision = config.revision || 0;

        this.hub = new Hub(this.fortnite);
    }

    /**
     * Makes you a party meta.
     */
    makePartyMeta() {
        return {
            AllowJoinInProgress_b: "false",
            AthenaSquadFill_b: "true",
            CustomMatchKey_s: "",
            GameSessionKey_s: "",
            LFGTime_s: "0001-01-01T00:00:00.000Z",
            LobbyConnectionStarted_b: "false",
            MatchmakingResult_s: "NoResults",
            MatchmakingState_s: "NotMatchmaking",
            PartyIsJoinedInProgress_b: "false",
            PartyMatchmakingInfo_j: JSON.stringify({
                PartyMatchmakingInfo: {
                    buildId: -1,
                    hotfixVersion: -1,
                    regionId: "",
                    playlistName: "Playlist_DefaultSolo",
                    tournamentId: "",
                    eventWindowId: "",
                    linkCode: ""
                },
            }),
            PartyState_s: "BattleRoyaleView",
            PlatformSessions_j: JSON.stringify({
                PlatformSessions: []
            }),
            PlaylistData_j: JSON.stringify({
                PlaylistData:{
                    playlistName: "Playlist_DefaultSolo",
                    tournamentId: "",
                    eventWindowId: "",
                    regionId: "CA",
                },
            }),
            PrimaryGameSessionId_s: "",
            PrivacySettings_j: JSON.stringify({
                PrivacySettings: {
                    partyType: this.launcher.data.settings.config.partyType,
                    partyInviteRestriction: this.launcher.data.settings.config.inviteRestriction,
                    bOnlyLeaderFriendsCanJoin: this.launcher.data.settings.config.onlyLeaderFriendsCanJoin,
                }
            }),
            RawSquadAssignments_j: JSON.stringify({
                RawSquadAssignments: [],
            }),
            SessionIsCriticalMission_b: "false",
            TheaterId_s: "",
            TileStates_j: JSON.stringify({
                TileStates: []
            }),
            ZoneInstanceId_s: "",
            ZoneTileIndex_U: "-1"
        }
    }

    /**
     * Remove a object/string/anything from the meta.
     * @param {String} metaRemoved Thing to remove.
     */
    remove(metaRemoved) {
        this.check();
        var value;
        const meta = {};
        for (var index = 0; index < Object.keys(this.meta).length; index++) {
          const name = Object.keys(this.meta)[index];
          if(name === metaRemoved) value = this.meta[name];
        }
        if(!value) return false;
        for (const key in this.meta) {
          if(key !== metaRemoved) {
            meta[key] = this.meta[key];
          }
        }
        this.meta = meta; 
        return true;
    }

    /**
     * Set something in the meta.
     * @param {Object} metaChange Data of what you want to change.
     */
    set(data) {
        this.meta = {
            ...this.meta,
            ...data
        };
        return true;
    }

    /**
     * Check if something is missing in meta.
     */
    check() {
        if(!this.meta) this.meta = this.makePartyMeta();
        if(!this.meta.PlaylistData_j) this.meta = this.makePartyMeta();
        if(this.captain.id !== this.launcher.account.id) this.launcher.debugger.error('Party', 'Your not party leader.');
    }

    async setPlaylistData(PlaylistData) {
        this.check();
        return await this.patch({
            PlaylistData_j: JSON.stringify({
                PlaylistData: PlaylistData
            })
        });
    }

    async setPrivacySettings(PrivacySettings) {
        this.check();
        return await this.patch({
            PrivacySettings_j: JSON.stringify({
                PrivacySettings: PrivacySettings
            })
        });
    }
    
    /**
     * Change the custom match key.
     * @param {String} key A custom key.
     */
    async setCustomKey(key) {
        this.check();
        return this.set({
            CustomMatchKey_s: key,
        });
    }

    /**
     * Set privacy in party.
     * @param {Object} privacyEnum A privacy enum.
     */
    async setPrivacy(privacyEnum) {
        this.check();
        return await this.patch({
            "urn:epic:cfg:invite-perm_s": PrivacySettings[privacyEnum].invitePermission,
            "urn:epic:cfg:accepting-members_b": PrivacySettings[privacyEnum].acceptingMembers,
            "urn:epic:cfg:presence-perm_s": PrivacySettings[privacyEnum].presencePermission,
            ...PrivacySettings[privacyEnum].partyType === "Private" ? {"urn:epic:cfg:not-accepting-members-reason_i": '7'} : null,
            PrivacySettings_j: JSON.stringify({
                PrivacySettings: {
                    partyType: PrivacySettings[privacyEnum].partyType,
                    partyInviteRestriction: PrivacySettings[privacyEnum].partyInviteRestriction,
                    bOnlyLeaderFriendsCanJoin: PrivacySettings[privacyEnum].bOnlyLeaderFriendsCanJoin
                }
            })
        }, [
            PrivacySettings[privacyEnum].partyType === "Private" ? "urn:epic:cfg:not-accepting-members-reason_i" : null,
        ]);
    }

    /**
     * Set playlist.
     * @param {String} playlistName Playlist id.
     * @param {String} regionId Region id.
     * @param {String} tournamentId Tournament id.
     * @param {String} eventWindowId Event window id.
     */
    async setPlaylist(playlistName, regionId, tournamentId, eventWindowId) {
        this.check();
        await this.patch({
            PartyMatchmakingInfo_j: JSON.stringify({
                PartyMatchmakingInfo: {
                    buildId: 12293624,
                    hotfixVersion: 0,
                    regionId: regionId,
                    playlistName: playlistName,
                    tournamentId: tournamentId,
                    eventWindowId: eventWindowId,
                    linkCode: ""
                },
            }),
        })
        return await this.setPlaylistData({
            playlistName: playlistName || "Playlist_DefaultSolo",
            tournamentId: tournamentId || "",
            eventWindowId: eventWindowId || "",
            regionId: regionId || "CA",
        });
    }
    
    /**
     * Find a member.
     * @param {String} id Member's account id.
     */
    findMember(id) {
        return this.members.find(member => member.id === id);
    }

    /**
     * Kick a member from the party.
     * @param {String} member Account id of member.
     */
    async kick(member) {
        member = await this.launcher.getAccount(member);
        member = this.findMember(member.id);
        if(!member) this.launcher.debugger.error(`Cannot kick member thats not in party.`);
        return await member.kick();
    }

    /**
     * Promote a member.
     * @param {String} member Account id of member.
     */
    async promote(member) {
        member = await this.launcher.getAccount(member);
        member = this.findMember(member.id);
        if(!member) this.launcher.debugger.error(`Cannot kick member thats not in party.`);
        return await member.promote();
    }

    /**
     * Invite a friend to your party.
     * @param {String} user A friend's account id.
     */
    async invite(user) {
        if(this.findMember(user)) this.launcher.debugger.error(`User is already in party!`);
        if(await this.getPing(user)) return true;
        try {
            const meta = {
                "urn:epic:cfg:build-id_s": "1:1:",
                "urn:epic:conn:platform_s": this.launcher.data.settings.platform.plat,
                "urn:epic:conn:type_s": "game",
                "urn:epic:invite:platformdata_s": "",
                "urn:epic:member:dn_s": this.launcher.account.displayName,
            }
            const { response } = await this.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/parties/${this.id}/invites/${user}?sendPing=true`,
                "POST",
                this.fortnite.Authorization.fullToken,
                meta,
                null,
                null,
                true,
            )
            this.invites.push({
                party_id: this.id,
                sent_by: this.launcher.account.id,
                meta,
                sent_to: user,
                sent_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                expires_at: new Date().toISOString(),
                status: "SENT"
            });
            return response.statusCode === 204;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    /**
     * Change somone's spot in the party.
     * @param {String} member Member's account id.
     * @param {Number} assignment Spot in the party.
     */
    async changeSpot(member, assignment) {
        member = this.members.find(mem => mem.id === member);
        if(!member) this.launcher.debugger.error(`Member wasn't found in party.`);
        return await member.changeSpot(assignment);
    }

    /**
     * Same as the member patch but this is a function for the party.
     * @param {Object} update Updated.
     * @param {Object} deleted Deleted.
     */
    async patchMember(update, deleted) {
        if(!this.self) return await Member.patch(update, deleted, this.fortnite);
        return await this.self.patch(update, deleted);
    }

    /**
     * Join a party.
     * @param {String} id A party id.
     */
    async join(id) {
        try {
            this.launcher.debugger.debug(`Party`, `Requesting to join ${id}.`);
            if(this.id) await this.leave(false);
            const { data: Request } = await this.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/parties/${id}/members/${this.launcher.account.id}/join`,
                "POST",
                this.fortnite.Authorization.fullToken,
                {
                    connection: {
                        id: this.fortnite.stream.stanza.jid,
                        meta: {
                            "urn:epic:conn:platform_s": this.launcher.data.settings.platform.plat,
                            "urn:epic:conn:type_s": "game",
                        },
                        "yield_leadership": false,
                    },
                    meta: {
                        "urn:epic:member:dn_s": this.launcher.account.displayName,
                        "urn:epic:member:joinrequestusers_j": JSON.stringify({
                            "users": [{
                                "id": this.launcher.account.id,
                                "dn": this.launcher.account.displayName,
                                "plat": this.launcher.data.settings.platform.plat,
                                "data": JSON.stringify({
                                    "CrossplayPreference": "1",
                                    "SubGame_u": "1",
                                }),
                            }]
                        })
                    },
                },
                false,
                null,
                true,
            );
            const party = await this.getParty(Request.party_id);
            this.setConfig(party);
            await this.patchMember(null, ['urn:epic:member:joinrequestusers_j']);
            await this.fortnite.stream.makeMUC(`Party-${this.fortnite.party.id}@muc.prod.ol.epicgames.com`);
            return this.fortnite.party;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    /**
     * Leave the current party.
     * @param {Boolean} createParty Create party after leaving.
     */
    async leave(createParty) {
        try {
            const MemberData = await this.getUser();
            if (MemberData.current[0])
                await this.Request.sendRequest(
                    `${Endpoints.PARTY}/v1/Fortnite/parties/${MemberData.current[0].id}/members/${this.launcher.account.id}`,
                    "DELETE",
                    this.fortnite.Authorization.fullToken,
                    {
                        connection: {
                            id: this.fortnite.stream.stanza.jid,
                            meta: {
                                "urn:epic:conn:platform_s": this.launcher.data.settings.platform.plat,
                                "urn:epic:conn:type_s": "game",
                            },
                        },
                        meta: {
                            "urn:epic:member:dn_s": this.launcher.account.displayName,
                            "urn:epic:member:type_s": "game",
                            "urn:epic:member:platform_s": this.launcher.data.settings.platform.plat,
                            "urn:epic:member:joinrequest_j": JSON.stringify({
                                "CrossplayPreference_i":"1"
                            }),
                        },
                    },
                    false,
                    null,
                    true,
                )
            else return false;
            if (createParty === true) return await this.create();
            return true;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    /**
     * -- Member confirmation --
     * Confirm a user's join.
     * @param {String} member A member's id.
     */
    async confirm(member) {
        try {
            const { response } = await this.fortnite.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/parties/${this.id}/members/${member}/confirm`,
                "POST",
                this.fortnite.Authorization.fullToken,
                null,
                null,
                null,
                false,
            )
            return response.statusCode === 204;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    /**
     * -- Member confirmation --
     * Reject a user's join.
     * @param {String} member A member's id.
     */
    async reject(member) {
        try {
            const { response } = await this.fortnite.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/parties/${this.id}/members/${member}/reject`,
                "POST",
                this.fortnite.Authorization.fullToken,
                null,
                null,
                null,
                false,
            )
            return response.statusCode === 204;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    /**
     * Set the whole party's class.
     * @param {Object} config A party object.
     */
    setConfig(config) {
        this.created_at = config.created_at || new Date().toISOString();
        this.updated_at = config.updated_at || new Date().toISOString();
        this.applicants = config.applicants || [];
        this.id = config.id || null;
        this.members = config.members || [];
        this.members.forEach(member => this.members.push(new Member(this.fortnite, member)));
        this.members = this.members.filter(object => typeof object.id == "string" && typeof object.meta == "object");
        this.config = config.config;
        this.meta = config.meta;
        this.invites = config.invites || [];
        return true;
    }

    /**
     * Set assignments in party.
     */
    setAssignments() {
        var spot = 0;
        const assignments = {
            RawSquadAssignments: []
        };
        for (var index = 0; index < this.members.length; index++) { 
            const member = this.members[index];
            if(member.role === "CAPTAIN") {
                assignments.RawSquadAssignments.push({
                    memberId: member.id,
                    absoluteMemberIdx: 0,
                });
            }
            else {
                spot = spot + 1;
                assignments.RawSquadAssignments.push({
                    memberId: member.id,
                    absoluteMemberIdx: spot,
                });
            }
        }

        this.meta.RawSquadAssignments_j = JSON.stringify(assignments);
        return true;
    }

    /**
     * Patch party's meta.
     * @param {Object} updated Updated.
     * @param {Object} deleted Deleted.
     * @param {Boolean} dnf If update assignments.
     */
    async patch(updated, deleted, dnf) {
        try {
            const member = this.members.find(member => member.id == this.launcher.account.id);

            if(!member) return;

            if (member.role !== "CAPTAIN") return;
            if(!this.meta.PrivacySettings_j) this.meta = {
             ...this.meta,
             ...this.makePartyMeta(),
            }
            if(!dnf) this.setAssignments();
            await this.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/parties/${this.id}`,
                "PATCH",
                this.fortnite.Authorization.fullToken,
                {
                  config: this.config,
                  meta: {
                    delete: deleted || [],
                    update: updated || this.meta,
                  },
                  party_state_overridden: {},
                  party_privacy_type: this.config.joinability,
                  party_type: this.config.type,
                  party_sub_type: this.config.sub_Type,
                  max_number_of_members: this.config.max_Size,
                  invite_ttl_seconds: this.config.invite_ttl,
                  revision: this.revision,
                },
                false,
                null,
                true,
            )
            this.revision = this.revision + 1;
            await this.sendPartyPresence();
            return true;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    async getPing(user) {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/user/${this.launcher.account.id}/pings/${user}/parties`,
                "GET",
                this.fortnite.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return data;
        } catch(error) {
            if(error.code === 'errors.com.epicgames.social.party.ping_not_found') {
                return false;
            }
            this.launcher.debugger.error(error.code);
        }
    }

    async deletePing(user) {
        try {
            const { response } = await this.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/user/${this.launcher.account.id}/pings/${user}`,
                "DELETE",
                this.fortnite.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return response.statusCode === 204;
        } catch(error) {
            if(error.code === 'errors.com.epicgames.social.party.ping_not_found') {
                return false;
            }
            this.launcher.debugger.error(error.code);
        }
    }

    async getParty(id) {
        try {
            const { data } = await this.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/parties/${id}`,
                "GET",
                this.fortnite.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return data;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    static async getParty(game, id) {
        try {
            const { data } = await game.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/parties/${id}`,
                "GET",
                game.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return data;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    static async getUser(game, id) {
        try {
            const account = await game.launcher.getAccount(id || game.launcher.account.id);
            const { data } = await game.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/user/${account.id}`,
                "GET",
                game.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return data;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    async getUser(id) {
        try {
            const account = await this.launcher.getAccount(id || this.launcher.account.id);
            const { data } = await this.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/user/${account.id}`,
                "GET",
                this.fortnite.Authorization.fullToken,
                null,
                false,
                null,
                true,
            );
            return data;
        }catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    /**
     * Create a party.
     * @param {Object} data Party.
     */
    async create(data) {
        try {
            this.launcher.debugger.debug(`Party`, `Creating party, data ${data ? 'provided' : 'not provided'}.`);
            const party = data || {
                meta: {
                    "urn:epic:cfg:accepting-members_b": this.launcher.data.settings.config.acceptingMembers,
                    "urn:epic:cfg:build-id_s": "1:1:",
                    "urn:epic:cfg:chat-enabled_b": this.launcher.data.settings.chatEnabled,
                    "urn:epic:cfg:invite-perm_s": this.launcher.data.settings.config.invitePermission,
                    "urn:epic:cfg:join-request-action_s": this.launcher.data.settings.joinConfirmation === false ? "AutoApprove" : "Manual",
                    "urn:epic:cfg:can-join_b": "true",
                    "urn:epic:cfg:party-type-id_s": this.launcher.data.settings.type,
                    "urn:epic:cfg:not-accepting-members-reason_i": '0',
                    "urn:epic:cfg:presence-perm_s": this.launcher.data.settings.config.presencePermission,
                },
                members: [],
                config: {
                    discoverability: "ALL",
                    invite_ttl: this.launcher.data.settings.inviteTTL,
                    join_confirmation: this.launcher.data.settings.joinConfirmation,
                    joinabilifty: this.launcher.data.settings.joinability,
                    max_size: this.launcher.data.settings.maxSize,
                    sub_type: this.launcher.data.settings.subType,
                    type: this.launcher.data.settings.type,
                    chatEnabled: this.launcher.data.settings.chatEnabled,
                },
            };
            const UserData = await this.getUser();
            if (UserData.current[0]) {
                await this.leave(false);
                this.launcher.debugger.debug(`Party`, `Left previous party.`);
            }
            const { data: Party } = await this.Request.sendRequest(
                `${Endpoints.PARTY}/v1/Fortnite/parties`,
                "POST",
                this.fortnite.Authorization.fullToken,
                {
                    config: party.config,
                    join_info: {
                        connection: {
                            id: this.fortnite.stream.stanza.jid,
                            meta: party.meta,
                        },
                    },
                    meta: party.meta,
                },
                false,
                null,
                true,
            )
            this.launcher.debugger.debug(`Party`, `Created party ${Party.id}.`);

            this.setConfig(Party);
            this.launcher.debugger.debug(`Party#MUC`, `Joining party muc.`);
            this.fortnite.stream.makeMUC(`Party-${this.id}@muc.prod.ol.epicgames.com`);
            await this.patchMember(null, ['urn:epic:member:joinrequestusers_j']);
            await this.patch(this.meta);

            return true;
        } catch(error) {
            this.launcher.debugger.error(error.code);
        }
    }

    /**
     * Send a party presence.
     * @param {String} status Custom status.
     */
    async sendPartyPresence(status) {
        const data = {};
        if (this.config.joinability == "OPEN") {
            data.sourceId = this.launcher.account.id;
            data.sourceDisplayName = this.launcher.account.displayName;
            data.sourcePlatform = this.launcher.data.settings.platform.plat;
            data.partyId = this.id;
            data.partyTypeId = 286331153;
            data.key = "k";
            data.notAcceptingReason = 0;
            data.pc = this.members.length;
            data.partyFlags = -2024557306;
            data.buildId = "1:1:";
            data.appId = "Fortnite";
        }
        else {
            data.bInPrivate = true;
        }

        const settings = await this.launcher.getKairoSetting(['avatar', 'avatarBackground', 'appInstalled']);
        const KairosProfile_s = {};
        for (const setting of settings) {
            KairosProfile_s[setting.key] = setting.value;
        }

        return this.fortnite.stream.stanza.sendPresence({
            status: JSON.stringify({
                Status: status || `Battle Royale Lobby - ${data.pc} / ${this.config.max_size}`,
                bHasVoiceSupport: true, 
                bIsJoinable: true,
                bIsPlaying: true,
                ProductName: "Fortnite",
                SessionId: "",
                Properties: {
                    KairosProfile_s: JSON.stringify(KairosProfile_s, null, 3),
                    "party.joininfodata.286331153_j": data,
                    FortBasicInfo_j: {
                        homeBaseRating: 1,
                    },
                    FortLFG_I: 0,
                    FortPartySize_i: 1,
                    FortSubGame_i: 1,
                    InUnjoinableMatch_b: false,
                    Event_PartyMaxSize_s: this.config.max_size,
                    Event_PartySize_s: this.members.length,
                    Event_PlayersAlive_s: 0,
                    GamePlaylistName_s: this.parsedMeta.PlaylistData_j.PlaylistData.playlistName,
                    FortGameplayStats_j: {
                        state: '',
                        playlist: 'None',
                        numKills: 0,
                        bFellToDeath: false,
                    },
                },
            }),
        });
    }

      /**
     * Get something from the meta.
     * @param {String} name Name of thing you want to get.
     * @param {Boolean} isGameItem If the thing your trying to get is a item.
     */
    get(defname, ifGameItem, place) {
        var def = null;
        for (var index = 0; index < Object.keys(place || this.meta).length; index++) {
          const metaname = Object.keys(place || this.meta)[index];
          const metavalue = place ? place[metaname] : this.meta[metaname];
          if(defname === metaname) def = metavalue;
          else {
            if(typeof metavalue === "string" && metavalue.includes("{")) {
              const parsedObject = JSON.parse(metavalue);
              for (var i = 0; i < Object.keys(parsedObject).length; i++) {
                const name = Object.keys(parsedObject)[i];
                const value = parsedObject[name];
                if(defname === name) def = value;
                else {
                  if(typeof value === "object") {
                    for (var s = 0; s < Object.keys(value).length; s++) {
                      const anothername = Object.keys(value)[s];
                      const anothervalue = value[anothername];
                      if(defname === anothername) def = anothervalue;
                      else {
                        if(typeof anothername === 'object') {
                          for (var a = 0; a < Object.keys(anothervalue).length; a++) {
                            const lastname = Object.keys(anothervalue)[a];
                            const lastvalue = value[lastname];
                            if(lastname === defname) def = lastvalue;
                          }
                        }
                        else if(defname === anothername) def = anothervalue;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if(!def) return false;
        if(ifGameItem && typeof def === 'string' && def.includes('/Game/')) {
          def = def.split('.')[1];
        } 
        return def;
    }

    get self() {
        return this.members.find(object => object.id == this.launcher.account.id);
    }

    get captain() {
        return this.members.find(object => object.role == "CAPTAIN");
    }

    get parsedMeta() {
        const parsed = {};
        for (var index = 0; index < Object.keys(this.meta).length; index++) {
          const key = Object.keys(this.meta)[index];
          const keyValue = this.meta[key];
          if(!keyValue.includes('{')) parsed[key] = keyValue;
          else parsed[key] = JSON.parse(keyValue);
        }
        return parsed;
    }

}

module.exports = Party;