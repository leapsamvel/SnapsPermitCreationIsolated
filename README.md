### Snaps Permit Creation Isolated
  
  
#### The actual issue

- Using "window.ethereum.request" with the "signAmino" method produces a different signature value than every other wallet (like leap or keplr), using the same exact parameters.

For context, we use signAmino to create user permits that should have the same `signature` value regardless of what wallet software or device the user is using (with same seed). This is NOT true with SNAPS.
  
  
#### This repo
  
This repo is an isolation of wallet methods to allow testing and changes of our functions to conduct further tests.

`App.tsx` contains logic for these tests
 
  
To build, from commandline...  
```
yarn && yarn start
```

Navigate to `localhost:3000` in a browser with Metamask and Leap wallet installed
  
This webpage has 4 buttons that connect and generate signed permits, the signature is sent to `console.log`

1. Connect + create Permit in Keplr
2. Connect + create Permit in Leap
3. Connect + create Permit in Metamask with Matamask Cosmos Snap
4. Connect + create Permit in Metamask with Cosmos Snap Provider
