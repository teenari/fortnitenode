# LoginMethods

Make sure you read [Usage](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/Usage.md?srn=gh/teenari/fortnitenode/docs/Usage.md&group=master)

To start off these login methods add this to your code.

```js
(async () => {
})();
```

## Email And Password

[First you need to know if you have captcha, click here, if it says allow, then you have none](https://www.epicgames.com/id/api/reputation)

If you do install this package.
```
npm install elauncher
```
Inside your constructor in credentials add the property **captcha**, like this.
```js
"captcha": async function() {
  const elauncher = require('elauncher');
  return await elauncher.Captcha();
}
```
That will open a browser for you to solve a captcha.

After done you'll login.

## Exchange Code

First you need to find out how to get a exchange code, [click here to learn more](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/How%20To%20Get/Exchange%20Code.md?srn=gh/teenari/fortnitenode/docs/How%20To/Exchange%20Code.md&group=master).

### Where you used the [**Fortnite** class](https://stoplight.io/p/docs/gh/teenari/fortnitenode/docs/How%20To/Getting%20exchange%20Code.md?srn=gh/teenari/fortnitenode/docs/How%20To/Getting%20exchange%20Code.md&group=master) property **exchangeCode** and the value is your exchange code.

Now this will login with the exchange code, you'll have to get a new exchange code everytime using this method.

## Device Auth

# After doing any of those methods add this inside your async
```js
await fortnite.init();
```