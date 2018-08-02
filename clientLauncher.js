const { exec } = require('child_process');
const { existsSync } = require('fs');

class ClientLauncher{
    constructor(binaryPath){
        this.binaryPath = binaryPath;
    }

    launchClient(args){
        var self = this;

        return new Promise(function(resolve, reject){
            var commandElements = [];
            var udkArgs = [];

            // Start the command off with the binary
            if(self.binaryPath){
                if(existsSync(self.binaryPath)){
                    commandElements.push('"' + self.binaryPath + '"');
                }else{
                    reject("The game binary specified in the config does not exist.");
                }
            }else{
                reject("The location of the game binary has not been specified in the config.");
            }

            // Dedicated Server?
            if(args.dedicated) commandElements.push("server");

            // Map/IP
            if(args.map) commandElements.push(args.map);
            else if(args.ip) commandElements.push(args.ip);

            // Username
            if(args.nickname) udkArgs.push("?name=" + args.nickname);

            // If hosting server, listen for connections
            if(args.action == "host") udkArgs.push("?listen=true");

            // Generate the command
            var command = commandElements.join(" ") + " " + udkArgs.join("");
            exec(command);

            resolve(command);
        });
    }
}

module.exports = ClientLauncher;