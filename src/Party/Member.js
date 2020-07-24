const Endpoints = require("fortnitenode/resources/Endpoints");
const Platforms = require('fortnitenode/enums/Platforms');

class Member {
  constructor(fortnite, data) {
        this.fortnite = fortnite;
        this.launcher = this.fortnite.launcher;

        this.setConfig(data);
  }

  /**
   * Get something from the meta.
   * @param {String} name Name of thing you want to get.
   * @param {Boolean} isGameItem If the thing your trying to get is a item.
   */
  get(name, isGameItem) {
    return this.fortnite.party.get(name, isGameItem, this.meta);
  }

  /**
   * Makes a member meta for you.
   * @returns {Object} Member meta.
   */
  makeMemberMeta() {
    const Character = this.fortnite.mcp.locker.Character ? this.fortnite.mcp.locker.Character.items[0].split(":")[1] : 'CID_568_Athena_Commando_M_RebirthSoldier';
    const Backpack = this.fortnite.mcp.locker.Backpack ? this.fortnite.mcp.locker.Backpack.items[0].split(":")[1] : 'bid_435_constellation';
    const Pickaxe = this.fortnite.mcp.locker.Pickaxe ? this.fortnite.mcp.locker.Pickaxe.items[0].split(":")[1] : 'Dev_Test_Pickaxe';
    const Contrail = this.fortnite.mcp.locker.SkyDiveContrail ? this.fortnite.mcp.locker.SkyDiveContrail.items[0].split(":")[1] : 'Trails_ID_084_Briefcase';

    const Locker = this.fortnite.mcp.items.CosmeticLocker.find(Locker => Locker.attributes.locker_name === "" && Locker.attributes.banner_icon_template !== "");

    const bannerIconId = Locker ? Locker.attributes.banner_icon_template : "";
    const bannerColorId = Locker ? Locker.attributes.banner_color_template : "";

    const Platform = this.launcher.data.settings.platform;

    return {
        AssistedChallengeInfo_j: JSON.stringify({
            AssistedChallengeInfo: {
              questItemDef: "None",
              objectivesCompleted: 0,
            }
          }),
          AthenaBannerInfo_j: JSON.stringify({
            AthenaBannerInfo: {
              bannerIconId,
              bannerColorId,
              seasonLevel: this.fortnite.mcp.level,
            }
          }),
          AthenaCosmeticLoadout_j: JSON.stringify({
            AthenaCosmeticLoadout: {
              characterDef: `/Game/Athena/Items/Cosmetics/Characters/${Character}.${Character}`,
              characterEKey: "",
              backpackDef: `/Game/Athena/Items/Cosmetics/Backpacks/${Backpack}.${Backpack}`,
              backpackEKey: "",
              pickaxeDef: `/Game/Athena/Items/Cosmetics/Pickaxes/${Pickaxe}.${Pickaxe}`,
              pickaxeEKey: "",
              contrailDef: `/Game/Athena/Items/Cosmetics/Contrails/${Contrail}.${Contrail}`,
              contrailEKey: "",
              scratchpad: [],
              variants: [],
            }
          }),
          BattlePassInfo_j: JSON.stringify({
            BattlePassInfo: {
              bHasPurchasedPass: this.fortnite.mcp.battlepassPurchased,
              passLevel: this.fortnite.mcp.level,
              selfBoostXp: this.fortnite.mcp.SelfBoostXp,
              friendBoostXp: this.fortnite.mcp.FriendBoostXp
            },
          }),
          CampaignHero_j: JSON.stringify({
            CampaignHero: {
              heroItemInstanceId: "",
              heroType: `/Game/Athena/Heroes/${Character}.${Character}`,
            }
          }),
          CrossplayPreference_s: "OptedIn",
          CurrentInputType_s: Platform.type,
          FeatDefinition_s: "None",
          FrontendEmote_j: JSON.stringify({
            FrontendEmote: {
              emoteItemDef: "None",
              emoteEKey: "",
              emoteSection: 2,
            }
          }),
          GameReadiness_s: "NotReady",
          HasPreloadedAthena_b: "false",
          HiddenMatchmakingDelayMax_U: "0",
          HomeBaseVersion_U: "1",
          Location_s: "PreLobby",
          MatchmakingLevel_U: "0",
          MemberSquadAssignmentRequest_j: JSON.stringify({
            MemberSquadAssignmentRequest: {
              startingAbsoluteIdx: -1,
              targetAbsoluteIdx: 1,
              swapTargetMemberId: "INVALID",
              version: 0
            }
          }),
          NumAthenaPlayersLeft_U: "0",
          Platform_j: JSON.stringify({
            Platform: {
              platformStr: Platform.plat,
            }
          }),
          PlatformSessionId_s: "",
          PlatformUniqueId_s: "INVALID",
          ReadyInputType_s: "Count",
          SpectateAPartyMemberAvailable_b: "false",
          'urn:epic:member:dn_s': this.launcher.account.displayName,
          'urn:epic:member:voicechatmuted_b': "false",
          'urn:epic:member:joinrequestusers_j': JSON.stringify({
            users: [{
              id: this.launcher.account.id,
              dn: this.launcher.account.displayName,
              plat: Platform.plat,
              data: JSON.stringify({
                CrossplayPreference_i: 1,
                SubGame_u: 1
              })
            }]
          }),
          UtcTimeStartedMatchAthena_s: "0001-01-01T00:00:00.000Z",
          VoiceChatStatus_s: "Disabled",
          ZoneInstanceId_s: "",
    }
  }

  /**
   * Kick this user.
   */
  async kick() {
    if(this.fortnite.party.captain.id !== this.launcher.account.id) this.launcher.debugger.error(`You're not the captain!`);
    const { response } = await this.fortnite.Request.sendRequest(
      `${Endpoints.PARTY}/v1/Fortnite/parties/${this.fortnite.party.id}/members/${this.id}`,
      "DELETE",
      this.fortnite.Authorization.fullToken,
    )
    return response.statusCode === 204;
  }

  /**
   * Promote this user.
   */
  async promote() {
    if(this.fortnite.party.captain.id !== this.launcher.account.id) this.launcher.debugger.error(`You're not the captain!`);
    const { response } = await this.fortnite.Request.sendRequest(
      `${Endpoints.PARTY}/v1/Fortnite/parties/${this.fortnite.party.id}/members/${this.id}/promote`,
      "POST",
      this.fortnite.Authorization.fullToken,
    )
    return response.statusCode === 204;
  }

  /**
   * Set the whole member's class.
   * @param {Object} data A member object.
   */
  setConfig(data) {
      this.meta = data.meta;
      this.id = data.account_id;
      if(!this.meta && this.id === this.launcher.account.id) this.meta = this.makeMemberMeta();
      if(this.meta && !this.meta.AthenaCosmeticLoadout_j && this.id === this.launcher.account.id) this.meta = this.makeMemberMeta();
      this.connections = data.connections || [];
      this.revision = data.revision || 0;
      this.role = data.role || "MEMBER";
      this.updated_at = data.updated_at || new Date().toISOString();
      this.joined_at = data.joined_at || new Date().toISOString();
  }

  /**
   * Set spot of member.
   * @param {Number} assignment Assignment/Spot.
   */
  async changeSpot(assignment) {
    if(this.fortnite.party.captain.id !== this.launcher.account.id) this.launcher.debugger.error(`You're not the captain!`);
    const filtered = JSON.parse(this.fortnite.party.meta.RawSquadAssignments_j).RawSquadAssignments.filter(arr => arr.memberId !== this.id);
    const assignments = {
      RawSquadAssignments: [
        ...filtered,
      ]
    };
    assignments.RawSquadAssignments.push({
        memberId: this.id,
        absoluteMemberIdx: assignment,
    });

    this.fortnite.party.meta.RawSquadAssignments_j = JSON.stringify(assignments);
    return await this.fortnite.party.patch(this.fortnite.party.meta, null, true);
  }

  /**
   * Check if something is missing in meta.
   */
  check() {
    if(!this.meta && this.id === this.launcher.account.id) this.meta = this.makeMemberMeta();
    if(!this.meta.AthenaCosmeticLoadout_j && this.id === this.launcher.account.id) this.meta = this.makeMemberMeta();
  }

  /**
   * Set something in the meta.
   * @param {Object} metaChange Data of what you want to change.
   */
  set(metaChange) {
    this.check();
    this.meta = {
      ...this.meta,
      ...metaChange,
    }
    return true;
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

  async setAthenaCosmeticLoadout(Loadout) {
    this.check();
    return await this.patch({
      AthenaCosmeticLoadout_j: JSON.stringify({
        AthenaCosmeticLoadout: {
          ...this.parsedMeta.AthenaCosmeticLoadout_j.AthenaCosmeticLoadout,
          ...Loadout
        }
      }),
    });
  }

  async setAthenaBannerInfo(BannerInfo) {
    this.check();
    return await this.patch({
      AthenaBannerInfo_j: JSON.stringify({
        AthenaBannerInfo: {
          ...this.parsedMeta.AthenaBannerInfo_j.AthenaBannerInfo,
          ...BannerInfo
        }
      }),
    });
  }

  async setFrontendEmote(FrontendEmote) {
    this.check();
    return await this.patch({
      FrontendEmote_j: JSON.stringify({
        FrontendEmote: {
          ...this.parsedMeta.FrontendEmote_j.FrontendEmote,
          ...FrontendEmote
        }
      }),
    });
  }

  async setAssistedChallengeInfo(AssistedChallengeInfo) {
    this.check();
    return await this.patch({
      AssistedChallengeInfo_j: JSON.stringify({
        AssistedChallengeInfo: AssistedChallengeInfo
      }),
    });
  }

  async setMemberSquadAssignmentRequest(MemberSquadAssignmentRequest) {
    this.check();
    return await this.patch({
      MemberSquadAssignmentRequest_j: JSON.stringify({
        MemberSquadAssignmentRequest: MemberSquadAssignmentRequest
      }),
    });
  }

  async setVoiceChatStatus(VoiceChatStatus) {
    this.check();
    return await this.patch({
      VoiceChatStatus_s: VoiceChatStatus
    });
  }

  async setUtcTimeStartedMatchAthena(UtcTimeStartedMatchAthena) {
    this.check();
    return await this.patch({
      UtcTimeStartedMatchAthena_s: UtcTimeStartedMatchAthena
    });
  }

  async setReadyInputType(ReadyInputType) {
    this.check();
    return await this.patch({
      ReadyInputType_s: ReadyInputType
    });
  }

  async setCurrentInputType(CurrentInputType) {
    this.check();
    return await this.patch({
      CurrentInputType_s: CurrentInputType
    });
  }

  async setCampaignHero(CampaignHero_j) {
    this.check();
    return await this.patch({
      CampaignHero_j: JSON.stringify({
        CampaignHero: {
          ...this.parsedMeta.CampaignHero_j.CampaignHero,
          ...CampaignHero_j
        }
      }),
    });
  }

  async setBattlePassInfo(BattlePassInfo_j) {
    this.check();
    return await this.patch({
      BattlePassInfo_j: JSON.stringify({
        BattlePassInfo: {
          ...this.parsedMeta.BattlePassInfo_j.BattlePassInfo,
          ...BattlePassInfo_j
        }
      }),
    });
  }

  async setPlatform_j(Platform_j, extraData) {
    this.check();
    return await this.patch({
      Platform_j: JSON.stringify({
        Platform: {
          ...this.parsedMeta.Platform_j.Platform,
          ...Platform_j
        }
      }),
      ...extraData
    });
  }

  /**
   * Set the member's readiness.
   * @param {String} GameReadiness_s Readiness.
   */
  async setReadiness(GameReadiness_s) {
    this.check();
    if(GameReadiness_s === "SittingOut" && this.fortnite.party.captain.id === this.launcher.account.id && this.fortnite.party.members.length !== 1) await this.fortnite.party.promote(this.fortnite.party.members.filter(member => member.id !== this.launcher.account.id)[0].id);
    return await this.patch({
      GameReadiness_s,
      ReadyInputType_s: GameReadiness_s === "NotReady" ? "Count" : this.meta.CurrentInputType_s
    });
  }

  /**
   * Set platform.
   * @param {String} platform Platform.
   */
  async setPlatform(platform) {
    const Platform = Platforms[platform.toUpperCase()] ? Platforms[platform.toUpperCase()] : Platforms.WINDOWS;
    return await this.setPlatform_j({
      platformStr: Platform.plat,
    }, {
      ReadyInputType_s: Platform.type,
      CurrentInputType_s: Platform.type
    });
  }

  /**
   * Set campaign hero.
   * @param {String} Hero Hero id.
   */
  async setHero(Hero) {
    return await this.setCampaignHero({
      heroType: `/Game/Athena/Heroes/${Hero}.${Hero}`,
    });
  }

  /**
   * Set banner!
   * @param {*} bannerIconId Banner icon.
   * @param {*} bannerColorId Banner color.
   * @param {*} seasonLevel Season level.
   */
  async setBanner(bannerIconId= this.parsedMeta.AthenaBannerInfo_j.AthenaBannerInfo.bannerIconId, bannerColorId= this.parsedMeta.AthenaBannerInfo_j.AthenaBannerInfo.bannerColorId, seasonLevel= this.fortnite.mcp.level) {
    return await this.setAthenaBannerInfo({
      bannerColorId,
      bannerIconId,
      seasonLevel,
    });
  }

  /**
   * Set your battlepass.
   * @param {*} bHasPurchasedPass If has battlepass purchased.
   * @param {*} passLevel Battle pass level.
   * @param {*} selfBoostXp Self xp boost.
   * @param {*} friendBoostXp Friend xp boost.
   */
  async setBattlePass(bHasPurchasedPass= this.fortnite.mcp.battlepassPurchased, passLevel= this.fortnite.mcp.level) {
    await this.setBanner(this.parsedMeta.AthenaBannerInfo_j.AthenaBannerInfo.bannerIconId, this.parsedMeta.AthenaBannerInfo_j.AthenaBannerInfo.bannerColorId, passLevel);
    return await this.setBattlePassInfo({
      bHasPurchasedPass,
      passLevel
    });
  }

  /**
   * Set character.
   * @param {String} CID Character id.
   */ 
  async setCharacter(CID) {
    if(CID.toUpperCase() === this.get('characterDef', true).toUpperCase()) return true;
    return await this.setAthenaCosmeticLoadout({
      characterDef: `/Game/Athena/Items/Cosmetics/Characters/${CID}.${CID}`,
    });
  }

  /**
   * Set backpack.
   * @param {String} BID Backpack id.
   */
  async setBackpack(BID) {
    if(BID.toUpperCase() === this.get('backpackDef', true).toUpperCase()) return true;
    return await this.setAthenaCosmeticLoadout({
      backpackDef: `/Game/Athena/Items/Cosmetics/Backpacks/${BID}.${BID}`,
    });
  }


  /**
   * Set Pet.
   * @param {String} BID Pet id.
   */
  async setPet(BID) {
    if(BID.toUpperCase() === this.get('backpackDef', true).toUpperCase()) return true;
    return await this.setAthenaCosmeticLoadout({
      backpackDef: `/Game/Athena/Items/Cosmetics/PetCarriers/${BID}.${BID}`,
    });
  }

  /**
   * Set pickaxe.
   * @param {String} PID Pickaxe id.
   */
  async setPickaxe(PID) {
    if(PID.toUpperCase() === this.get('pickaxeDef', true).toUpperCase()) return true;
    return await this.setAthenaCosmeticLoadout({
      pickaxeDef: `/Game/Athena/Items/Cosmetics/Pickaxes/${PID}.${PID}`,
    });
  }

  /**
   * Set contrail.
   * @param {String} TID Contrail id.
   */
  async setContrail(TID) {
    if(TID.toUpperCase() === this.get('contrailDef', true).toUpperCase()) return true;
    return await this.setAthenaCosmeticLoadout({
      contrailDef: `/Game/Athena/Items/Cosmetics/Contrails/${TID}.${TID}`,
    });
  }

  /**
   * Set emote.
   * @param {String} EID Emote id.
   */
  async setEmote(EID) {
    await this.setFrontendEmote({
      emoteItemDef: `None`,
    });
    return await this.setFrontendEmote({
      emoteItemDef: `/Game/Athena/Items/Cosmetics/Dances/${EID}.${EID}`,
    });
  }

  /**
   * Clears emote.
   */
  async clearEmote() {
    return await this.setFrontendEmote({
      emoteItemDef: `None`,
    });
  }

  /**
   * Set emoji.
   * @param {String} Emoji Emoji id.
   */
  async setEmoji(Emoji) {
    await this.setFrontendEmote({
      emoteItemDef: `None`,
    });
    return await this.setFrontendEmote({
      emoteItemDef: `/Game/Athena/Items/Cosmetics/Dances/Emoji/${Emoji}.${Emoji}`,
    });
  }

  /**
   * Set enlightenment.
   * @param {Number} t Season number.
   * @param {Number} v Level.
   */
  async setEnlightenment(t, v) {
    return await this.setAthenaCosmeticLoadout({
      scratchpad: [{
          t,
          v
      }]
    });
  }

  /**
   * Set variants.
   * @param {String} item 
   * @param {String} channel 
   * @param {String} variant 
   */
  async setVariant(item, channel, variant) {
    return await this.setAthenaCosmeticLoadout({
      variants: [
        ...JSON.parse(this.meta.AthenaCosmeticLoadout_j).AthenaCosmeticLoadout.variants,
        {
          channel,
          item,
          variant
        }
      ],
    });
  }

  /**
   * Patch the member's meta.
   * @param {Object} updated Updated.
   * @param {Array} deleted Deleted values.
   */
  async patch(updated, deleted) {
    try {
      var Member = await this.fortnite.party.getUser();
      var PartyId;

      if(Member.current.length == 0) {
        await this.fortnite.party.create();
        PartyId == this.fortnite.party.id;
        this.revision = 0;
      }
      else {
        PartyId = Member.current[0].id;
        this.revision = Member.current[0].members.find(member => member.account_id == this.launcher.account.id).revision;
      }

      if(!this.meta && this.id === this.launcher.account.id) this.meta = this.makeMemberMeta();

      if(!this.meta.AthenaCosmeticLoadout_j && this.id === this.launcher.account.id) this.meta = this.makeMemberMeta();

      if(updated) this.set(updated);

      await this.fortnite.Request.sendRequest(
          `${Endpoints.PARTY}/v1/Fortnite/parties/${this.fortnite.party.id}/members/${this.launcher.account.id}/meta`,
          "PATCH",
          this.fortnite.Authorization.fullToken,
          {
              delete: deleted || [],
              revision: this.revision,
              update: updated || this.meta,
            },
          false,
          null,
          true,
      )
      return true;
    } catch(error) {
      this.launcher.debugger.error(error.code);
    }
  }

  static async patch(updated, deleted, fortnite) {
    this.fortnite = fortnite;
    this.launcher = fortnite.launcher;
    try {
      var Member = await this.fortnite.party.getUser();
      var PartyId;

      if(Member.current.length == 0) {
        await this.fortnite.party.create();
        PartyId == this.fortnite.party.id;
        this.revision = 0;
      }
      else {
        PartyId = Member.current[0].id;
        this.revision = Member.current[0].members.find(member => member.account_id == this.launcher.account.id).revision;
      }

      this.meta = this.fortnite.party.makeMemberMeta();

      if(updated) this.fortnite.party.me.set(updated);

      await this.fortnite.Request.sendRequest(
          `${Endpoints.PARTY}/v1/Fortnite/parties/${this.fortnite.party.id}/members/${this.launcher.account.id}/meta`,
          "PATCH",
          this.fortnite.Authorization.fullToken,
          {
              delete: deleted || [],
              revision: this.revision,
              update: updated || this.meta,
            },
          false,
          null,
          true,
      )
      return true;
    } catch(error) {
      this.launcher.debugger.error(error.code);
    }
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

module.exports = Member;