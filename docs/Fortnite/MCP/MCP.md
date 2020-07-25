# MCP
Page is automated, contact me if theres something wrong.
This class has 4 functions!

[To use this make sure you read the Usage md.](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/Usage.md?srn=gh/teenari/fortnitenode/docs/Usage.md&group=master)

## Properties
- fortnite
- launcher
- profiles - Object
- items

## Methods

## sort()
Sorts all the items in the profile athena into the items object.

## addProfile(profileId)
Adds a profile to the profiles object.

### Comments
> param {String} profileId A profileId to add.

### Arguments
- `profileId` - A profileId to add.

## gather()
Gathers everything such as athena, common_core, common_public.

## postMCP(command, profileId, rvn, body)
Posts a mcp (Thanks to mix (https://github.com/MixV2/EpicResearch#13-mcp))

### Comments
> param {} command Command to use in request. (Example: QueryProfile)

> param {} profileId ProfileId. (Example: athena)

> param {} rvn How much times has the user changed their profile.

> param {} body A extra part for anybody that wants to post their own payload.

> returns {Object} Updated profile.

### Arguments
- `command` - Command to use in request. (Example: QueryProfile)
- `profileId` - ProfileId. (Example: athena)
- `rvn` - How much times has the user changed their profile.
- `body` - A extra part for anybody that wants to post their own payload.