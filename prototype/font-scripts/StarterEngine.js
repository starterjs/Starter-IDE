/**
 * Classe principal do Starter
 * @class
 * @param {int} w - Largura da tela
 * @param {int} h - Altura da tela
 */
StarterEngine = function (w,h) {

    console.log("starter engine created");

    this.width = w;
    this.height = h;
    this.debugmode = false;
    this.starterlogo = null;

    //NA IDE o onload já foi executado!!!!
    //window.onload = function(){
    window.canvas = document.getElementById("preview-canvas");
    window.ctx = canvas.getContext("2d");
    this.mlevel = new ManagerScene();
    this.mmouse = new ManagerMouse();

    this.loader = new ManagerLoader(function(){
        this.gameReady();
        this.startGame();
    }.bind(this));

    this.teclado = new ManagerInputs();
    this.storage = new ManagerStorage();

    //iniciando o jogo
    this.setResources();
    this.beginLoad();

    //}.bind(this);

	/**@global */
    red = {r:255,b:0,g:0};
	/**@global */
    green = {r:0,b:0,g:255};
    /**@global */
	blue = {r:0,b:255,g:0};
    /**@global */
	yellow = {r:255,b:0,g:255};
    /**@global */
	cian = {r:0,b:255,g:255};
    /**@global */
	black = {r:0,b:0,g:0};
    /**@global */
	white = {r:255,b:255,g:255};
    /**@global */
	orange = {r:255,b:0,g:150};
    /**@global */
	purple = {r:255,b:255,g:0};
    /**@global */
	gray = {r:255,b:0,g:0};


};

/**
 * Inicia o caregamento dos arquivos
 * @method
 */
StarterEngine.prototype.beginLoad =function () {
    this.loader.loading();
}

/**
 * Clama a função incial do level 0 e inicia o game loop
 * @method
 */
StarterEngine.prototype.startGame =function () {
    this.mlevel.currentScene = 0;
    if((this.mlevel.scenes.length) > 0 && (this.mlevel.currentScene < this.mlevel.scenes.length)) {
        this.mlevel.scenes[this.mlevel.currentScene].startFunction();
        //if(this.loopgameOn)
        this.loopgame(ctx);
    }else{
        console.error("Você precisa adicionar ao menos um Level!")
    }
}

/**
 * Game loop :)
 * @method
 */
StarterEngine.prototype.loopgame = function (ctx) {
    //chama o print do manager level

    if(requestAnimFrame!=null)
        this.mlevel.print(ctx);

    //requestframe
    try{
        requestAnimFrame(function () {
            se.loopgame(ctx);
        });
    }catch (e){
        console.log("stoped")
    }

};

/**
 * Chamada quando o jogo está pronto - deve ser sobrescrita pelo usuário
 * @method
 */
StarterEngine.prototype.gameReady = function() {};

/**
 * Configura a lista de arquivos (imagens e sons) a serem carregados
 * @method
 */
StarterEngine.prototype.setResources =function () {
    this.loader.addStarterResource("turtle", "turtle.png", "image");
};


/**
 * Iniciar as conifguração iniciais para o uso do módulo Turtle
 */
StarterEngine.prototype.startTurtle = function () {

    console.log("starting Turtle");

    StarterEngine.prototype.setResources = function () {
        console.log("set resources");
        //Add lista resource
        this.loader.addStarterResource("turtle", "turtle.png", "image");
    };


    //Quando o loading acabar
    this.gameReady = function() {
        console.log("game ready");
        ctx.setTransform(1,0,0,1,0,0);

        var trutlelvl = new Scene();
        trutlelvl.setFunctionStart(setTurtle);
    }

}



/*Request Animate
window.requestAnimFrame =  (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();*/
