# Party
This class has 29 functions!

[To use this make sure you read the Usage md.](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/Usage.md?srn=gh/teenari/fortnitenode/docs/Usage.md&group=master)

## Properties
*Due to some bugs using my auto docs, I have to tell you to `console.log` this class or look at the file, thank you for your understanding.*

## Methods

## makePartyMeta()
Makes you a party meta.

## remove(metaRemoved)
Remove a object/string/anything from the meta.

### Comments
> param {String} metaRemoved Thing to remove.

### Arguments
- metaRemoved - Thing to remove.

## set(data)
Set something in the meta.

### Comments
> param {Object} metaChange Data of what you want to change.

### Arguments
- data

## check()
Check if something is missing in meta.

## setPlaylistData(PlaylistData)
Check if something is missing in meta.

### Comments
/

check() {

if(!this.meta) this.meta = this.makePartyMeta();

if(!this.meta.PlaylistData_j) this.meta = this.makePartyMeta();

if(this.captain.id !== this.launcher.account.id) this.launcher.debugger.error('Party'

 'Your not party leader.');

}

### Arguments
- PlaylistData

## setPrivacySettings(PrivacySettings)
No information about this function, contact me to update function `setPrivacySettings`.

### Arguments
- PrivacySettings

## setCustomKey(key)
Change the custom match key.

### Comments
> param {String} key A custom key.

### Arguments
- key - A custom key.

## setPrivacy(privacyEnum)
Set privacy in party.

### Comments
> param {Object} privacyEnum A privacy enum.

### Arguments
- privacyEnum - A privacy enum.

## setPlaylist(playlistName, regionId, tournamentId, eventWindowId)
Set playlist.

### Comments
> param {String} playlistName Playlist id.

> param {String} regionId Region id.

> param {String} tournamentId Tournament id.

> param {String} eventWindowId Event window id.

### Arguments
- playlistName - Playlist id.
- regionId - Region id.
- tournamentId - Tournament id.
- eventWindowId - Event window id.

## findMember(id)
Find a member.

### Comments
> param {String} id Member's account id.

### Arguments
- id - Member's account id.

## kick(member)
Kick a member from the party.

### Comments
> param {String} member Account id of member.

### Arguments
- member - Account id of member.

## promote(member)
Promote a member.

### Comments
> param {String} member Account id of member.

### Arguments
- member - Account id of member.

## invite(user)
Invite a friend to your party.

### Comments
> param {String} user A friend's account id.

### Arguments
- user - A friend's account id.

## changeSpot(member, assignment)
Change somone's spot in the party.

### Comments
> param {String} member Member's account id.

> param {Number} assignment Spot in the party.

### Arguments
- member - Member's account id.
- assignment - Spot in the party.

## patchMember(update, deleted)
Same as the member patch but this is a function for the party.

### Comments
> param {Object} update Updated.

> param {Object} deleted Deleted.

### Arguments
- update - Updated.
- deleted - Deleted.

## join(id)
Join a party.

### Comments
> param {String} id A party id.

### Arguments
- id - A party id.

## leave(createParty)
Leave the current party.

### Comments
> param {Boolean} createParty Create party after leaving.

### Arguments
- createParty - Create party after leaving.

## confirm(member)
-- Member confirmation --

### Comments
Confirm a user's join.

> param {String} member A member's id.

### Arguments
- member - A member's id.

## reject(member)
-- Member confirmation --

### Comments
Reject a user's join.

> param {String} member A member's id.

### Arguments
- member - A member's id.

## setConfig(config)
Set the whole party's class.

### Comments
> param {Object} config A party object.

### Arguments
- config - A party object.

## setAssignments()
Set assignments in party.

## patch(updated, deleted, dnf)
Patch party's meta.

### Comments
> param {Object} updated Updated.

> param {Object} deleted Deleted.

> param {Boolean} dnf If update assignments.

### Arguments
- updated - Updated.
- deleted - Deleted.
- dnf - If update assignments.

## getPing(user)
No information about this function, contact me to update function `getPing`.

### Arguments
- user

## deletePing(user)
No information about this function, contact me to update function `deletePing`.

### Arguments
- user

## getParty(id)
No information about this function, contact me to update function `getParty`.

### Arguments
- id

## getUser(id)
No information about this function, contact me to update function `getUser`.

### Arguments
- id

## create(data)
Create a party.

### Comments
> param {Object} data Party.

### Arguments
- data - Party.

## sendPartyPresence(status)
Send a party presence.

### Comments
> param {String} status Custom status.

### Arguments
- status - Custom status.

## get(defname, ifGameItem, place)
Get something from the meta.

### Comments
> param {String} name Name of thing you want to get.

> param {Boolean} isGameItem If the thing your trying to get is a item.

### Arguments
- defname
- ifGameItem
- place