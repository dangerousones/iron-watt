# Plugin API

### Note: This is a draft, and this may be unimplemented at the moment.
In the modules subdirectory of the server directory (the directory that you execute `start.sh`) you can create
nodejs modules that IronWatt will automatically `require()`. The module can be in a directory, (it will use `require()` on the directory),
or a `.js` file. Your module must extend [module class] 

## Basic Usage
The [module class] adds a variable called `IronWatt` to `this` which contains usefull functions for
creating modules.

This Object contains other objects orgainized inte multiple catagories:
- `this.IronWatt`
  - `.server`
    - `.stop(force)`: If `force==true`, send kill signal, otherwise send stop, and kill in 30 seconds if still running 
    - `.start()`
    - `.restart()`
    - `.write()`: Send text to minecraft stdin
  - `.player`
    - `.getPlayers()`: Returns an array with all player Object
    - `.Player`: Class with player functions
      - `.exec()` forces the player to send an chat to the main server
      - `.kick()`
      - `.kill()`
      - `.tp(dest)` dest can be anything that the `/tp` minecraft command accepts
      - `.gamemode(mode)`
      - `.name()`
  - `.command`
    - `.register(Command)` register command. command is of class `Command`
    - `.Command` Class of command


[module class]: https://github.com/IronWatt/iron-watt/blob/src/module/module.js
