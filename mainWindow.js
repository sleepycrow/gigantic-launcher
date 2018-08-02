const { BrowserWindow } = require('electron');

module.exports = {
    window: null,
    create: function(){
        var self = this;

        self.window = new BrowserWindow({
            width: 600,
            height: 480,
            resizable: false,
            maximizable: false,
            fullscreenable: false,
            autoHideMenuBar: true,
            //devTools: true,

            title: "Gigantic Launcher",
            icon: __dirname + "/icon.ico"
        });

        self.window.loadFile("./pages/index.html");

        self.window.on("closed", function(){
            self.window = null;
        });

        return self.window.mainWindow;
    }
};