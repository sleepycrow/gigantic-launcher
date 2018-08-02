const TabController = require('./tabController.js');
const LoadingController = require('./loadingController.js');
const { ipcRenderer } = require('electron');

var lc = new LoadingController(document.getElementById('loading-overlay'));
var tc = new TabController(document.getElementById('main-tabs'), document.getElementById('main-pages'));

// Config
function updateConfig(config){
    // Add the maps to the map list
    var mapList = document.getElementById("map-list");
    mapList.innerHTML = "";

    if(typeof config.maps == "object" && mapList != null){
        for(var index in config.maps){
            var mapItem = document.createElement("option");
            mapItem.setAttribute("value", index);
            mapItem.appendChild(document.createTextNode(config.maps[index]));
            mapList.appendChild(mapItem);
        }
    }

    // Set the nickname
    var nicknameInput = document.getElementById("nickname");

    if(typeof config.nickname == "string" && nicknameInput != null){
        nicknameInput.value = config.nickname;
    }

    // Add the game's binary to the config tab
    var binaryPathInput = document.getElementById("binary-location");

    if(typeof config.binaryPath == "string" && binaryPathInput != null){
        binaryPathInput.value = config.binaryPath;
    }

    lc.hideOverlay();
}

ipcRenderer.send("config-request", "can i habe config pls??");
ipcRenderer.on("config", (event, config) => {
    updateConfig(config);
});

document.getElementById("config-form").onsubmit = function(e){
    e.preventDefault();

    var config = {};

    // add all the important fields
    var fields = e.target.elements;

    for(var i = 0; i < fields.length; i++){
        if(typeof fields[i].dataset.index != "undefined"){
            config[fields[i].dataset.index] = fields[i].value;
        }
    }

    // add the username
    var nicknameInput = document.getElementById('nickname');

    if(nicknameInput != null){
        config.nickname = nicknameInput.value;
    }

    // send the new config back to the main process
    ipcRenderer.send("change-config", config);
};

// Client Launching
function handleFormSubmit(e){
    e.preventDefault();
    var launchArgs = {};

    // Add the action to the object
    launchArgs.action = e.target.dataset.action;

    // Push all the important fields to the object
    var fields = e.target.elements;

    for(var i = 0; i < fields.length; i++){
        if(typeof fields[i].dataset.index != "undefined"){
            if(fields[i].type == "checkbox"){
                launchArgs[fields[i].dataset.index] = fields[i].checked;
            }else{
                launchArgs[fields[i].dataset.index] = fields[i].value;
            }
        }
    }

    // Add the nickname to that
    var nicknameInput = document.getElementById('nickname');

    if(nicknameInput != null){
        launchArgs.nickname = nicknameInput.value;
    }

    // Send it all the main process and show the loading overlay
    ipcRenderer.send("launch-request", launchArgs);
}

document.getElementById("join-form").onsubmit = handleFormSubmit;
document.getElementById("host-form").onsubmit = handleFormSubmit;

// Other stuff
ipcRenderer.on("show-loading-overlay", (event, data) => {
    lc.showMessage(data.message);

    if(data.timeout){
        window.setTimeout(function(){ lc.hideOverlay(); }, data.timeout);
    }
});

ipcRenderer.on("show-error", (event, data) => {
    window.alert("Error: " + data);
});