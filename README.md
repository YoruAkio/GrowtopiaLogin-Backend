# GrowtopiaLogin-Backend

This is a simple backend for GrowtopiaLogin. It is written in Node.js using expresjs.

## Hosting

You can host your own page by clicking this button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yoruakio/GrowtopiaLogin-Backend)

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `node index.js`

## NOTE

-   You must change the host in the `public/html/dashboard.html` file to your own host.
-   Login information:
    -   Enet packet data `ltoken|blablablatoken` is the packet data that contained login data, you can find it in some where in beetween enet packet receive.
    -   Decode it using base64 and you will get `_token=blablabla&growId=User&password=Password`
    -   `_token=blablabla` is the token and the value its just the login Data like `requestedName|`, `mac|`, `rid|`, etc.
    -   You can just pass it into the server and send auth dialog on `OnRequestWorldSelect` packet
    -   Example decoded data:
        -   Returned token from post request:
            ```txt
            X3Rva2VuPWNtVnhkV1Z6ZEdWa1RtRnRaWHhoYldsdGRXNWhhMmtLWm53eENuQnliM1J2WTI5c2ZESXdPQXBuWVcxbFgzWmxjbk5wYjI1OE5DNDJNUXBtZW53ME56RTBNamt6Tmdwc2JXOWtaWHd3Q21OaWFYUnpmREUxTXpZS2NHeGhlV1Z5WDJGblpYd3lOUXBIUkZCU2ZERUtZMkYwWldkdmNubDhVbUZ1Wkc5dFgwRmpZMjkxYm5RS2RHOTBZV3hRYkdGNWRHbHRaWHd3Q210c2RueG1ZMlU0TkdReFlXTTJNREl4WmpJd01XUTRNbUkyT1dZek9UQTFaRFUzTXpZek4yVTVZVEl6WTJReFlqQmhaalF3WVdFeVpUZGlOMlUxTVdVeE1UVmhDbWhoYzJneWZERTNOems0TURjeU5USUtiV1YwWVh4WmIzVlRhRzkxYkdSQ1pVZGhlVjg0TVRJek56VTVNVEl6TUFwbWFHRnphSHd0TnpFMk9USTRNREEwQ25KcFpId3dNakV4UVRaQ016QXpORUUyUWpnMk1EY3pNVGxET1VJd056QkVNemt6TkFwd2JHRjBabTl5YlVsRWZEQXNNU3d4Q21SbGRtbGpaVlpsY25OcGIyNThNQXBqYjNWdWRISjVmSFZ6Q21oaGMyaDhMVFV4TmpJd016WXpNd3B0WVdOOE16UTZObVk2TWpRNlptTTZOVGM2TVdRS2QydDhORVV3TnpJd1FrTTVPVVV5TjBFeU5EVTNOemhHTVRrNU56bEVNakl4T0VVS2VtWjhMVGd5TVRZNU16TTNNZz09Jmdyb3dJZD1OYWtpJnBhc3N3b3JkPUFraW8xMTI0
            ```
            string:
            ```txt
            _token=cmVxdWVzdGVkTmFtZXxhbWltdW5ha2kKZnwxCnByb3RvY29sfDIwOApnYW1lX3ZlcnNpb258NC42MQpmenw0NzE0MjkzNgpsbW9kZXwwCmNiaXRzfDE1MzYKcGxheWVyX2FnZXwyNQpHRFBSfDEKY2F0ZWdvcnl8UmFuZG9tX0FjY291bnQKdG90YWxQbGF5dGltZXwwCmtsdnxmY2U4NGQxYWM2MDIxZjIwMWQ4MmI2OWYzOTA1ZDU3MzYzN2U5YTIzY2QxYjBhZjQwYWEyZTdiN2U1MWUxMTVhCmhhc2gyfDE3Nzk4MDcyNTIKbWV0YXxZb3VTaG91bGRCZUdheV84MTIzNzU5MTIzMApmaGFzaHwtNzE2OTI4MDA0CnJpZHwwMjExQTZCMzAzNEE2Qjg2MDczMTlDOUIwNzBEMzkzNApwbGF0Zm9ybUlEfDAsMSwxCmRldmljZVZlcnNpb258MApjb3VudHJ5fHVzCmhhc2h8LTUxNjIwMzYzMwptYWN8MzQ6NmY6MjQ6ZmM6NTc6MWQKd2t8NEUwNzIwQkM5OUUyN0EyNDU3NzhGMTk5NzlEMjIxOEUKemZ8LTgyMTY5MzM3Mg==&growId=Naki&password=Akio1124
            ```
        -   Decoded data:
            -   \_token:
            ```txt
            requestedName|amimunaki
            f|1
            protocol|208
            game_version|4.61
            fz|47142936
            lmode|0
            cbits|1536
            player_age|25
            GDPR|1
            category|Random_Account
            totalPlaytime|0
            klv|fce84d1ac6021f201d82b69f3905d573637e9a23cd1b0af40aa2e7b7e51e115a
            hash2|1779807252
            meta|YouShouldBeGay_81237591230
            fhash|-716928004
            rid|0211A6B3034A6B8607319C9B070D3934
            platformID|0,1,1
            deviceVersion|0
            country|us
            hash|-516203633
            mac|34:6f:24:fc:57:1d
            wk|4E0720BC99E27A245778F19979D2218E
            zf|-821693372
            ```
    -   If you want pass it into your server login system just do send auth dialog on `OnRequestWorldSelect` packet
    -   and set `pInfo(peer)->requestedName == "MrDollFucker` in above `onsupermain(peer);` if you using gt3

## Path Information

-   `/` - The main page
-   `/player/login/dashboard` - The dashboard for the login modals
-   `/player/growid/login/validate` - The validation for the GrowID login
-   `/player/validate/close` - The validation for the close button
  
## Contact

You can contact me at teleram my username is [@yoruakio](https://t.me/yoruakio) or join my discord server [nakai community](https://discord.com/invite/ESsBxptJqr).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
