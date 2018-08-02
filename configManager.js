const fs = require('fs');

class ConfigManager{
    
    constructor(filePath){
        this.filePath = filePath;
        this.defaultConfig = {
            port: 7777,
            maps: {
                "lv_canyon": "Ghost Reef",
                "lv_mistforge": "Sanctum Falls",
                "lv_valley": "Siren's Strand",
                "lv_wizardwoods": "Ember Grove",
                "lv_skycity": "Sky City",
                "lv_magma": "Magma",
                "lv_grassland": "Practice Range"
            }
        };
        this.config = Object.assign({}, this.defaultConfig);
    }

    load(){
        var self = this;

        return new Promise(function(resolve, reject){
            fs.readFile(self.filePath, (err, data) => {
                var config = self.defaultConfig;

                if(err){
                    if(err.code == "ENOENT"){
                        resolve(config);
                        self.save(config);
                    }else{
                        console.log(err);
                        resolve(config);
                    }
                    return false;
                }

                try{
                    config = JSON.parse(data);
                    self.config = config;
                }catch(err){
                    console.log(err);
                    console.log("Returning default config and resetting config file...");
                    resolve(config);
                    self.save(config);
                }

                resolve(config);
            });
        });
    }

    save(){
        var self = this;

        return new Promise(function(resolve, reject){
            let configJSON = JSON.stringify(self.config);

            fs.writeFile(self.filePath, configJSON, (err) => {
                if(err) reject(err);
                resolve();
            });
        });
    }
}

module.exports = ConfigManager;