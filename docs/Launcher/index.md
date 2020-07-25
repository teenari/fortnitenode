# Launcher
Page is automated, contact me if theres something wrong.
This class has 41 functions!

[To use this make sure you read the Usage md.](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/Usage.md?srn=gh/teenari/fortnitenode/docs/Usage.md&group=master)

## Properties
- config - Object
- stream
- Request - Class `Request`
- Authorization
- killedToken
- debugger - Class `Debug`
- graphql - Class `GraphQL`

## Methods

## block(friend)
Blocks a friend.

### Comments
> param {String} friend Friend.

> returns {Boolean} True

 means the user has been blocked

 false means the user hasn't been blocked.

### Arguments
- `friend` - Friend.

## changeFriendSettings(setting)
Changes friend settings.

### Comments
> param {Boolean} setting True or false. (Accept invites.)

> returns {Object} Response.

### Arguments
- `setting` - True or false. (Accept invites.)

## deleteDeviceAuth(device_id)
Deletes device auth.

### Comments
> param {Object} data Device auth object.

> returns {Boolean} True or false.

### Arguments
- `device_id`

## deleteDeviceAuths(notToken)
Deletes all device auths.

### Comments
> param {String} notToken Device id. (Doesn't delete)

> returns {Boolean} True or false.

### Arguments
- `notToken` - Device id. (Doesn't delete)

## friend(account)
Friends a user.

### Comments
> param {String} account Account.

> returns {Boolean} True or false.

### Arguments
- `account` - Account.

## geti18nMessages()
Messages for the epic games site.

## getSlug(slug)
Find a slug.

### Comments
> param {String} slug A slug/support a creator code.

### Arguments
- `slug` - A slug/support a creator code.

## getEntitlements()
> returns {Array} Array of entitlements.

## getBlockList()
> returns {Object} Array of objects of people blocked.

## getExchangeOauth(auth)
> param {String} auth Full token.

### Comments
> returns {Object} Exchange code json.

### Arguments
- `auth` - Full token.

## getExchangeCode(XSRF)
Exchange code.

### Comments
> param {String} XSRF XSRF TOKEN. 

> returns {Object} Exchange code json.

### Arguments
- `XSRF` - XSRF TOKEN. 

## getAvailableValue(value)
Available values of value.

### Comments
> param {String} value Kairos profile value. (Example: avatar

 avatarBackground

 appInstalled)

> returns {Array} Array of objects of value.

### Arguments
- `value` - Kairos profile value. (Example: avatar
 avatarBackground
 appInstalled)

## getKairoSetting(value)
Kairos settings.

### Comments
> param {String} value String of settingKey or a object of setting keys.

> returns {Object} Value of kairos settings.

### Arguments
- `value` - String of settingKey or a object of setting keys.

## generateDeviceAuth()
Generate device auth.

### Comments
> returns {Object} Object of device.

## getDeviceAuths()
> returns {Array} Array of objects of device auths.

## getDeviceAuth(device_id)
> param {String} device_id Device auth.

### Comments
> returns {Object} Device.

### Arguments
- `device_id` - Device auth.

## getFriendSettings()
> returns Friend settings.

## getFriendsRecent(namespace)
> param {String} namespace Namespace.

### Comments
> returns {Array} Recent friends of namespace.

### Arguments
- `namespace` - Namespace.

## getFriendsIncoming()
> returns {Array} Friends incoming.

## getFriends(pending)
> returns {Array} Friends.

### Arguments
- `pending`

## getFriendRequests()
All friend requests.

### Comments
> class Friend class.

## getKairos()
> returns {Object} Object with have and current.

## getAccount(data)
> param {String} data Account id or displayName.

### Comments
> returns {Object} Account.

### Arguments
- `data` - Account id or displayName.

## getIosInfo(exchangeCode)
Gets ios auth.

### Comments
> param {String} exchangeCode Exchange code.

> returns {Object} Auth.

### Arguments
- `exchangeCode` - Exchange code.

## getCompetitiveData()
> returns {Object} Competitive data.

## informEULA(namespace)
Checks a eula.

### Comments
> param {String} namespace A namespace.

> returns {Boolean} Will return boolean if eula is accepted

 and a object if it's not. Use receiveEULA(object)

 to accept the eula.

### Arguments
- `namespace` - A namespace.

## isAdded(friendAdded)
Checks if a user is added.

### Comments
> param {String} friendAdded A friend.

> returns {Boolean} true or false.

### Arguments
- `friendAdded` - A friend.

## login()
Logins in.

### Comments
> returns {Boolean} True or false.

## logout(token)
Logout of the launcher or any type.

### Comments
> param {String} token A access token to kill. (NOT NEEDED)

### Arguments
- `token` - A access token to kill. (NOT NEEDED)

## newXSRFToken()
> returns {String} XSRF TOKEN

## oauth(body, AuthToken, noExchange)
Oauths.

### Comments
> param {String} AuthToken Auth token.

> returns {Object} Auth.

### Arguments
- `body`
- `AuthToken` - Auth token.
- `noExchange`

## receiveEULA(elua)
Acceptes eula.

### Comments
> param {Object} elua Is from informEULA(namespace).

> returns {Boolean} true.

### Arguments
- `elua` - Is from informEULA(namespace).

## reputation()
> returns {Object} Reputation.

## sendLoginRequest(XSRF, credentials)
Sends login request.

### Comments
> param {String} XSRF XSRF Token

> param {Object} credentials Object of email and password.

> returns {Boolean} true or false.

### Arguments
- `XSRF` - XSRF Token
- `credentials` - Object of email and password.

## setDeviceInfo(file)
Sets device auth in file.

### Comments
> param {File} file File.

> returns {Object} Device auth.

### Arguments
- `file` - File.

## sendLocation()
Sends your location at epic so magma can track you.

### Comments
> returns {Object} Response.

## setAccount()
Sets the launcher's account object.

### Comments
> returns {Boolean} true or false.

## setAuth(Authorization)
Sets Auth.

### Comments
> param {Object} Authorization Object of auth from ouathing. 

> returns {Boolean} true.

### Arguments
- `Authorization` - Object of auth from ouathing. 

## unblock(blocked)
Unblock a user.

### Comments
> param {String} blocked Blocked user.

> returns {Boolean} True

 means the user has been unblocked

 false means the user hasn't been unblocked.

### Arguments
- `blocked` - Blocked user.

## unfriend(friend)
Unfriend a friend.

### Comments
> param {String} friend Friend.

> returns {Boolean} True or false.

### Arguments
- `friend` - Friend.

## wipeFriendList()
Wipes client's friends list.

### Comments
> returns {Boolean} True or false.