# Member
This class has 37 functions!

[To use this make sure you read the Usage md.](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/Usage.md?srn=gh/teenari/fortnitenode/docs/Usage.md&group=master)

## Properties
*Due to some bugs using my auto docs, I have to tell you to `console.log` this class or look at the file, thank you for your understanding.*

## Methods

## get(name, isGameItem)
Get something from the meta.

### Comments
> param {String} name Name of thing you want to get.

> param {Boolean} isGameItem If the thing your trying to get is a item.

### Arguments
- name - Name of thing you want to get.
- isGameItem - If the thing your trying to get is a item.

## makeMemberMeta()
Makes a member meta for you.

### Comments
> returns {Object} Member meta.

## kick()
Kick this user.

## promote()
Promote this user.

## setConfig(data)
Set the whole member's class.

### Comments
> param {Object} data A member object.

### Arguments
- data - A member object.

## changeSpot(assignment)
Set spot of member.

### Comments
> param {Number} assignment Assignment/Spot.

### Arguments
- assignment - Assignment/Spot.

## check()
Check if something is missing in meta.

## set(metaChange)
Set something in the meta.

### Comments
> param {Object} metaChange Data of what you want to change.

### Arguments
- metaChange - Data of what you want to change.

## remove(metaRemoved)
Remove a object/string/anything from the meta.

### Comments
> param {String} metaRemoved Thing to remove.

### Arguments
- metaRemoved - Thing to remove.

## setAthenaCosmeticLoadout(Loadout)
Remove a object/string/anything from the meta.

### Comments
> param {String} metaRemoved Thing to remove.

/

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

### Arguments
- Loadout

## setAthenaBannerInfo(BannerInfo)
No information about this function, contact me to update function `setAthenaBannerInfo`.

### Arguments
- BannerInfo

## setFrontendEmote(FrontendEmote)
No information about this function, contact me to update function `setFrontendEmote`.

### Arguments
- FrontendEmote

## setAssistedChallengeInfo(AssistedChallengeInfo)
No information about this function, contact me to update function `setAssistedChallengeInfo`.

### Arguments
- AssistedChallengeInfo

## setMemberSquadAssignmentRequest(MemberSquadAssignmentRequest)
No information about this function, contact me to update function `setMemberSquadAssignmentRequest`.

### Arguments
- MemberSquadAssignmentRequest

## setVoiceChatStatus(VoiceChatStatus)
No information about this function, contact me to update function `setVoiceChatStatus`.

### Arguments
- VoiceChatStatus

## setUtcTimeStartedMatchAthena(UtcTimeStartedMatchAthena)
No information about this function, contact me to update function `setUtcTimeStartedMatchAthena`.

### Arguments
- UtcTimeStartedMatchAthena

## setReadyInputType(ReadyInputType)
No information about this function, contact me to update function `setReadyInputType`.

### Arguments
- ReadyInputType

## setCurrentInputType(CurrentInputType)
No information about this function, contact me to update function `setCurrentInputType`.

### Arguments
- CurrentInputType

## setCampaignHero(CampaignHero_j)
No information about this function, contact me to update function `setCampaignHero`.

### Arguments
- CampaignHero_j

## setBattlePassInfo(BattlePassInfo_j)
No information about this function, contact me to update function `setBattlePassInfo`.

### Arguments
- BattlePassInfo_j

## setPlatform_j(Platform_j, extraData)
No information about this function, contact me to update function `setPlatform_j`.

### Arguments
- Platform_j
- extraData

## setReadiness(GameReadiness_s)
Set the member's readiness.

### Comments
> param {String} GameReadiness_s Readiness.

### Arguments
- GameReadiness_s - Readiness.

## setPlatform(platform)
Set platform.

### Comments
> param {String} platform Platform.

### Arguments
- platform - Platform.

## setHero(Hero)
Set campaign hero.

### Comments
> param {String} Hero Hero id.

### Arguments
- Hero - Hero id.

## setBanner(bannerIconId= this.parsedMeta.AthenaBannerInfo_j.AthenaBannerInfo.bannerIconId, bannerColorId= this.parsedMeta.AthenaBannerInfo_j.AthenaBannerInfo.bannerColorId, seasonLevel= this.fortnite.mcp.level)
Set banner!

### Comments
> param {} bannerIconId Banner icon.

> param {} bannerColorId Banner color.

> param {} seasonLevel Season level.

### Arguments
- bannerIconId= this.parsedMeta.AthenaBannerInfo_j.AthenaBannerInfo.bannerIconId
- bannerColorId= this.parsedMeta.AthenaBannerInfo_j.AthenaBannerInfo.bannerColorId
- seasonLevel= this.fortnite.mcp.level

## setBattlePass(bHasPurchasedPass= this.fortnite.mcp.battlepassPurchased, passLevel= this.fortnite.mcp.level)
Set your battlepass.

### Comments
> param {} bHasPurchasedPass If has battlepass purchased.

> param {} passLevel Battle pass level.

> param {} selfBoostXp Self xp boost.

> param {} friendBoostXp Friend xp boost.

### Arguments
- bHasPurchasedPass= this.fortnite.mcp.battlepassPurchased
- passLevel= this.fortnite.mcp.level

## setCharacter(CID)
Set character.

### Comments
> param {String} CID Character id.

### Arguments
- CID - Character id.

## setBackpack(BID)
Set backpack.

### Comments
> param {String} BID Backpack id.

### Arguments
- BID - Backpack id.

## setPet(BID)
Set Pet.

### Comments
> param {String} BID Pet id.

### Arguments
- BID - Pet id.

## setPickaxe(PID)
Set pickaxe.

### Comments
> param {String} PID Pickaxe id.

### Arguments
- PID - Pickaxe id.

## setContrail(TID)
Set contrail.

### Comments
> param {String} TID Contrail id.

### Arguments
- TID - Contrail id.

## setEmote(EID)
Set emote.

### Comments
> param {String} EID Emote id.

### Arguments
- EID - Emote id.

## clearEmote()
Clears emote.

## setEmoji(Emoji)
Set emoji.

### Comments
> param {String} Emoji Emoji id.

### Arguments
- Emoji - Emoji id.

## setEnlightenment(t, v)
Set enlightenment.

### Comments
> param {Number} t Season number.

> param {Number} v Level.

### Arguments
- t - Season number.
- v - Level.

## setVariant(item, channel, variant)
Set variants.

### Comments
> param {String} item 

> param {String} channel 

> param {String} variant 

### Arguments
- item - 
- channel - 
- variant

## patch(updated, deleted)
Patch the member's meta.

### Comments
> param {Object} updated Updated.

> param {Array} deleted Deleted values.

### Arguments
- updated - Updated.
- deleted - Deleted values.