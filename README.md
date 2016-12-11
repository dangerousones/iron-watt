#Iron Watt

##About
Iron Watt is Minecraft Server manager and proxy. It allows you to do many things
that the vanilla minecraft server wouldn't let you do (ie. create commands).

##Progress
<i style="background:red">INCOMPLETE:</i> This App is close to being working.

So far It can start and stop the server, but no API has been created

###TODO:

- [x] Get the project layout done
- [ ] Get a Basic Proxy going
    - [x] Start the Main server
        - [x] start function
        - [x] kill function
    - [ ] start the proxy
        - [ ] handle user connect
        - [ ] handle disconnect

## How Do I use It?
The simplist way to run this is to cd into any directory, for example the data directory
in this very repository, then execute the start.sh file from this repo. It will automatically
run a `npm install`.
```bash
cd data
../start.sh

```

Read [module-API] for details regarding how to make modules.

## Contributing
To contribute just fork, and make changes and create a pull request.
Check the Issues for stuff to do!

## License
AGPLv3, See LICENSE.md for details

[module-API]: /docs/module-API.md
