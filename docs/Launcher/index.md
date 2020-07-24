# Launcher
This class has 42 functions!

[To use this make sure you read the Usage md.](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/Usage.md?srn=gh/teenari/fortnitenode/docs/Usage.md&group=master)

## Properties
*Due to some bugs using my auto docs, I have to tell you to `console.log` this class or look at the file, thank you for your understanding.*

## Methods

## login()
Logins in.

### Comments
> returns {Boolean} True or false.

## logout(token)
Logout of the launcher or any type.

### Comments
> param {String} token A access token to kill. (NOT NEEDED)

### Arguments
- token - A access token to kill. (NOT NEEDED)

## geti18nMessages()
Messages for the epic games site.

## informEULA(namespace)
Checks a eula.

### Comments
> param {String} namespace A namespace.

> returns {Boolean} Will return boolean if eula is accepted

 and a object if it's not. Use receiveEULA(object)

 to accept the eula.

### Arguments
- namespace - A namespace.

## receiveEULA(elua)
Acceptes eula.

### Comments
> param {Object} elua Is from informEULA(namespace).

> returns {Boolean} true.

### Arguments
- elua - Is from informEULA(namespace).

## getEntitlements()
> returns {Array} Array of entitlements.

## purchase(offerId, namespace)
Purchase a item.

### Comments
> param {String} offerId Offer id of game.

> param {String} namespace Namespace of game.

### Arguments
- offerId - Offer id of game.
- namespace - Namespace of game.

## setAuth(Authorization)
Sets Auth.

### Comments
> param {Object} Authorization Object of auth from ouathing. 

> returns {Boolean} true.

### Arguments
- Authorization - Object of auth from ouathing. 

## isAdded(friendAdded)
Checks if a user is added.

### Comments
> param {String} friendAdded A friend.

> returns {Boolean} true or false.

### Arguments
- friendAdded - A friend.

## getBlockList()
> returns {Object} Array of objects of people blocked.

## block(friend)
Blocks a friend.

### Comments
> param {String} friend Friend.

> returns {Boolean} True

 means the user has been blocked

 false means the user hasn't been blocked.

### Arguments
- friend - Friend.

## unblock(blocked)
Unblock a user.

### Comments
> param {String} blocked Blocked user.

> returns {Boolean} True

 means the user has been unblocked

 false means the user hasn't been unblocked.

### Arguments
- blocked - Blocked user.

## newXSRFToken()
> returns {String} XSRF TOKEN

## sendLoginRequest(XSRF, credentials)
Sends login request.

### Comments
> param {String} XSRF XSRF Token

> param {Object} credentials Object of email and password.

> returns {Boolean} true or false.

### Arguments
- XSRF - XSRF Token
- credentials - Object of email and password.

## getExchangeOauth(auth)
> param {String} auth Full token.

### Comments
> returns {Object} Exchange code json.

### Arguments
- auth - Full token.

## getExchangeCode(XSRF)
Exchange code.

### Comments
> param {String} XSRF XSRF TOKEN. 

> returns {Object} Exchange code json.

### Arguments
- XSRF - XSRF TOKEN. 

## getAvailableValue(value)
Available values of value.

### Comments
> param {String} value Kairos profile value. (Example: avatar

 avatarBackground

 appInstalled)

> returns {Array} Array of objects of value.

### Arguments
- value - Kairos profile value. (Example: avatar
 avatarBackground
 appInstalled)

## getKairoSetting(value)
Kairos settings.

### Comments
> param {String} value String of settingKey or a object of setting keys.

> returns {Object} Value of kairos settings.

### Arguments
- value - String of settingKey or a object of setting keys.

## ouath(exchangeCode, AuthToken)
Oauths.

### Comments
> param {String} exchangeCode Exchange code.

> param {String} AuthToken Auth token.

> returns {Object} Auth.

### Arguments
- exchangeCode - Exchange code.
- AuthToken - Auth token.

## generateDeviceAuth()
Generate device auth.

### Comments
> returns {Object} Object of device.

## oauthWithDevice(data)
Oauth with device.

### Comments
> param {Object} data From generateDeviceAuth.

> returns {Object} Auth.

### Arguments
- data - From generateDeviceAuth.

## reputation()
> returns {Object} Reputation.

## setDeviceInfo(file, key)
Sets device auth in file.

### Comments
> param {File} file File.

> returns {Object} Device auth.

### Arguments
- file - File.
- key

## getDeviceAuths()
> returns {Array} Array of objects of device auths.

## deleteDeviceAuth(device_id)
Deletes device auth.

### Comments
> param {Object} data Device auth object.

> returns {Boolean} True or false.

### Arguments
- device_id

## deleteDeviceAuths(notToken)
Deletes all device auths.

### Comments
> param {String} notToken Device id. (Doesn't delete)

> returns {Boolean} True or false.

### Arguments
- notToken - Device id. (Doesn't delete)

## getDeviceAuth(device_id)
> param {String} device_id Device auth.

### Comments
> returns {Object} Device.

### Arguments
- device_id - Device auth.

## sendLocation()
Sends your location at epic so magma can track you.

### Comments
> returns {Object} Response.

## getFriendSettings()
> returns Friend settings.

## changeFriendSettings(setting)
Changes friend settings.

### Comments
> param {Boolean} setting True or false. (Accept invites.)

> returns {Object} Response.

### Arguments
- setting - True or false. (Accept invites.)

## getFriendsRecent(namespace)
> param {String} namespace Namespace.

### Comments
> returns {Array} Recent friends of namespace.

### Arguments
- namespace - Namespace.

## getFriendsIncoming()
> returns {Array} Friends incoming.

## getFriends(pending)
> returns {Array} Friends.

### Arguments
- pending

## getFriendRequests()
All friend requests.

### Comments
> class Friend class.

## friend(account)
Friends a user.

### Comments
> param {String} account Account.

> returns {Boolean} True or false.

### Arguments
- account - Account.

## unfriend(friend)
Unfriend a friend.

### Comments
> param {String} friend Friend.

> returns {Boolean} True or false.

### Arguments
- friend - Friend.

## getKairos()
> returns {Object} Object with have and current.

## getAccount(data)
> param {String} data Account id or displayName.

### Comments
> returns {Object} Account.

### Arguments
- data - Account id or displayName.

## getIosInfo(exchangeCode)
Gets ios auth.

### Comments
> param {String} exchangeCode Exchange code.

> returns {Object} Auth.

### Arguments
- exchangeCode - Exchange code.

## getCompetitiveData()
> returns {Object} Competitive data.

## wipeFriendList()
Wipes client's friends list.

### Comments
> returns {Boolean} True or false.

## setAccount()
Sets the launcher's account object.

### Comments
> returns {Boolean} true or false.