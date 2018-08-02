class TabController{
    constructor(tabs, pages){
        this.tabs = tabs;
        this.pages = pages;
        
        var self = this;
        
        for(var i = 0; i < tabs.children.length; i++){
            tabs.children[i].onclick = function(e){
                self.switchTabs(e.target.dataset.tab);
            };
        }
    }
    
    switchTabs(targetTab){
        var self = this;
        
        //cycle through all tabs
        for(var i = 0; i < self.tabs.children.length; i++){
            let tab = self.tabs.children[i];
            if(typeof tab.dataset.tab != "undefined"){
                if(tab.dataset.tab == targetTab) tab.classList.add("active");
                else tab.classList.remove("active");
            }
        }
        
        //cycle through all pages
        for(var i = 0; i < self.pages.children.length; i++){
            let page = self.pages.children[i];
            if(typeof page.dataset.tab != "undefined"){
                if(page.dataset.tab == targetTab) page.classList.remove("hidden");
                else page.classList.add("hidden");
            }
        }
    }
}

module.exports = TabController;