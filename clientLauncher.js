const { exec } = require('child_process');
const { existsSync } = require('fs');

class ClientLauncher{
    constructor(config){
        this.config = config;
    }

    launchClient(args){
        var self = this;

        return new Promise(function(resolve, reject){
            var commandElements = [];
            var udkArgs = [];

            // Start the command off with the binary
            if(self.config.binaryPath){
                if(existsSync(self.config.binaryPath)){
                    commandElements.push('"' + self.config.binaryPath + '"');
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
            else commandElements.push(""); // just so there's always a space between the normal args and udk args

            // Username
            if(args.nickname) udkArgs.push("?name=" + args.nickname);

            // If hosting server, listen for connections
            if(args.action == "host") udkArgs.push("?listen=true");

            // Port
            if(self.config.port){
                var port = Number.parseInt(self.config.port);

                if(port > 0) udkArgs.push("?port=" + port);
                else reject("Invalid port number provided.");
            }

            // Generate the command
            var command = commandElements.join(" ") + udkArgs.join("");
            exec(command);

            resolve(command);
        });
    }
}

module.exports = ClientLauncher;