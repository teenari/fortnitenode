# Fortnite
Page is automated, contact me if theres something wrong.
This class has 29 functions!

[To use this make sure you read the Usage md.](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/Usage.md?srn=gh/teenari/fortnitenode/docs/Usage.md&group=master)

## Properties
- launcher - Class `Launcher`
- party
- Authorization
- stream
- Request - Class `Request`
- clients - Object
- mcp

## Methods

## checkHasFortnite()
Checks if fortnite is bought.

## init()
Inits, logins in and logins into fortnite, setups stream, and creates a party.

### Comments
> returns {boolean} true.

## getFeaturedIslands()
Featured islands.

### Comments
> returns {Object} Featured islands.

## getFeaturedIslandCodes()
Get featured island codes.

## getIslandTemplates()
Get all the templates island ids.

## getFavoriteIslands(olderThan)
Get all favorite islands.

### Comments
> param {Date} olderThan ISO 8601 Date

### Arguments
- `olderThan` - ISO 8601 Date

## favoriteIsland(islandId)
Add a favorite island.

### Comments
> param {IslandCode} islandId 

### Arguments
- `islandId`

## unfavoriteIsland(islandId)
Unfavorite a island.

### Comments
> param {IslandCode} islandId 

### Arguments
- `islandId`

## getCreativeHistory(olderThan)
Get creative history.

### Comments
> param {Date} olderThan ISO 8601 Date

### Arguments
- `olderThan` - ISO 8601 Date

## inMatch(numberOfPlayers, secondsUntilChange)
Appear as your in a game.

### Arguments
- `numberOfPlayers`
- `secondsUntilChange`

## outMatch()
Get out of a match state.

## getLeaderBoardSettings()
Leaderboard settings.

### Comments
> returns Leaderboard settings.

## logout()
Logouts of launcher and fortnite.

## getStatsV2(account)
Stats V2.

### Comments
> param {} account Account id or displayName.

> returns {Object} Parsed stats.

### Arguments
- `account` - Account id or displayName.

## grantAccess()
Grant access. (Client already has access.)

### Comments
> returns {Error} Error.

## getKeyChain()
Keychain.

### Comments
> returns {Object} Keychain.

## getStoreFront()
Storefront.

### Comments
> returns {Object} Storefront.

## getEnabledFeatures()
Enabled features.

### Comments
> returns {Array} Array of enabled features.

## getTimeline()
Timeline.

### Comments
> returns {Object} Timeline.

## getPages()
Fortnite pages.

### Comments
> returns {Object} Pages.

## changeLeaderBoardSettings(optout)
Optout of leaderboard.

### Comments
> param {} optout If you want to optout of leaderboards.

> returns {Object} Updated settings.

### Arguments
- `optout` - If you want to optout of leaderboards.

## makeClient(data)
Makes a new client, and places it into clients object.

### Comments
> param {} data Config for the client.

> returns {new this} New client.

### Arguments
- `data` - Config for the client.

## lastPresences()
Last presences from friends.

### Comments
> returns {Array&Object} Objects in arrays of friend's presences.

## getWorldInfo()
World info.

### Comments
> returns {Object} World info.

## Summary()
Summary of friends.

### Comments
> returns {Object} Summary.

## setAlias(account, alias)
Sets a alias for a friend.

### Comments
> param {} account A friend.

> param {} alias Any alias that is up to 16 letters and 3 letters.

> returns {boolean} If false

 request went badly

 true it went good.

### Arguments
- `account` - A friend.
- `alias` - Any alias that is up to 16 letters and 3 letters.

## setNote(account, note)
Sets a note for a friend.

### Comments
> param {} account A friend.

> param {} note A note you want to set.

> returns {boolean} If false

 request went badly

 true it went good.

### Arguments
- `account` - A friend.
- `note` - A note you want to set.

## removeNote(account)
Removes the note from a friend.

### Comments
> param {} account A friend.

> returns {boolean} If false

 request went badly

 true it went good.

### Arguments
- `account` - A friend.

## removeAlias(account)
Removes a alias from a friend.

### Comments
> param {} account A friend.

> returns {boolean} If false

 request went badly

 true it went good.

### Arguments
- `account` - A friend.