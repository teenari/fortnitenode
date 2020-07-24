# Usage

`To do` Make sure you have npm installed.

### If your new to fortnitenode you probably need to know how to start it!
So the most important thing to do is installing fortnitenode, open up command promp in your directory, and run this.

```
npm install fortnitenode
```

### Once done you'll have a new folder called **node_modules**!
Well done you have completed the most important task of all.
Now you want to create a **package.json**, well npm already has a command for that!
Run this, it'll ask you questions about what your making, just answer them.

```
npm init
```

### After, you want to create a file named **index.js**, this a file to start the client with.
We aren't done yet.
Inside that file add this code.

```js
const { Fortnite } = require('fortnitenode');
```

### First, let me explain what this is doing, it's requiring the library (that you installed), and grabbing the Fortnite class to use.

Lets use that **Fortnite** class shall we.

```js
/* Other code from above */
const fortnite = new Fortnite({
 /* Data here wil be explained */
});
```

##### Now we need some properties, add the settings property as **"Default"**, this sets a default settings, for you, for example if you want to change your platform to **Playstation**, you can!
Just replace the settings string with..

```json
{
  "platform": "platform"
}
```
Replace platform with your platform!
### Moving onto the other properties.

The property **credentials** is optional for **Broswer Login**.
Heres some of the values you can set.

```json
{
  "exchangeCode": "",
  "deviceAuth": {
    "device_id": "",
    "account_id": "",
    "secret": ""
  },
  "email": "",
  "password": ""
}
```

Now use one of the methods in [Login Methods](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/LoginMethods.md?srn=gh/teenari/fortnitenode/docs/LoginMethods.md&group=master).
