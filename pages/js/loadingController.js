class LoadingController{
    constructor(overlay){
        this.overlay = overlay;
    }

    showMessage(messageName){
        var self = this;

        for(var i = 0; i < self.overlay.children.length; i++){
            let message = self.overlay.children[i];
            if(typeof message.dataset.message != "undefined"){
                if(message.dataset.message == messageName) message.classList.remove("hidden");
                else message.classList.add("hidden");
            }
        }

        self.overlay.classList.remove("hidden");
    }

    hideOverlay(){
        this.overlay.classList.add("hidden");
    }
}

module.exports = LoadingController;