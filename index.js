const { app, ipcMain } = require('electron');
const ConfigManager = require('./configManager.js');
const MainWindow = require('./mainWindow.js');
const ClientLauncher = require('./clientLauncher.js');

var configManager = new ConfigManager("config.json");

// Main Window
app.on("ready", MainWindow.create);

app.on("window-all-closed", () => {
    app.quit();
});

// Config
ipcMain.on("config-request", (event, data) => {
    console.log("Config request recieved.");

    configManager.load()
    .then((config) => {
        console.log(config);
        console.log("Config loaded, sending to requester...");
        event.sender.send("config", config);
    });
});

ipcMain.on("change-config", (event, data) => {
    console.log("Config change request recieved.");
    console.log(data);

    configManager.config = Object.assign(configManager.config, data);
    configManager.save();
    
    event.sender.send("config", configManager.config);
});

// Client Launching
ipcMain.on("launch-request", (event, data) => {
    console.log("Launch request recieved.");
    console.log(data);

    // Save the nickname
    if(typeof data.nickname != "undefined"){
        configManager.config.nickname = data.nickname;
    }

    // ...and the port
    if(typeof data.port != "undefined"){
        var port = Number.parseInt(data.port);
        if(port > 0) configManager.config.port = port;
    }

    configManager.save();

    // Launch the client
    var launcher = new ClientLauncher(configManager.config.binaryPath);
    launcher.launchClient(data)
    .then((command) => {
        console.log("Launching client with the following command:");
        console.log(command);

        event.sender.send("show-loading-overlay", {
            message: "loading-client",
            timeout: 60 * 1000
        });
    })
    .catch((error) => {
        console.log("An error occured while launching the game:", error);
        event.sender.send("show-error", error);
    });
});