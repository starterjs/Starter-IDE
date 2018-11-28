/**
 * Representa um objeto do Sprite (printável na tela)
 * @param animations
 * @param {array} - array of animations
 * @constructor
 */
function Sprite(animations,x,y, h, w) {

    GameObject.call(this, animations, x, y, "sprite", h, w);

    this.effects = "none";
    this.text = "";
    this.stackAction = [];
    this.timewait = false;
    this.mirred = false;

}

Sprite.prototype = Object.create(GameObject.prototype);

Sprite.prototype.update = function () {
}


Sprite.prototype.print = function () {

    ctx.save();

    if(this.mirred){
      ctx.translate(canvas.width/2,0);
      ctx.scale(-1, 1);
        ctx.translate(-canvas.width/2,0);
    }


    GameObject.prototype.print.call(this);
    ctx.restore();

    if(this.timewait)
        return;

    if(this.effects != "none"){

        ctx.save();

        var oldx = canvas.width - this.x;

        //have a erro here
        if(this.mirred)
            ctx.translate(oldx , this.y - this.h*0.7);
        else
            ctx.translate(this.x+this.w , this.y - this.h*0.7);

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#aaa";
        ctx.fillStyle = "#fff";

        //calculating height by text size
        var height = ((this.text.length / 12 )* 20) + 20;

        if(height == 0)
            height = 20;

        if(this.effects == "say")
            this.printTalkForm(0, 0, 150, height);
        else  if(this.effects == "think")
            this.printThinkForm(0, 0, 150, height);

        //text setting
        ctx.fillStyle = "#000";
        ctx.textAlign = "start";
        ctx.font = "20 px";

        if(this.text.length > 12) {
            for (var i = 0; i < this.text.length / 12; i++) {
                var str_temp = this.text.substring(i * 12, (i + 1) * 12);

                if(str_temp[0] == " ")
                    str_temp = str_temp.substring(1, str_temp.length);

                ctx.fillText(str_temp, 10, 20 * (i + 1));
            }
        }else{
            ctx.fillText(this.text, 10,20);
        }

        ctx.restore();

    }else if(this.stackAction.length > 0){

        action_temp = this.stackAction.shift();

        if(action_temp[2] == "say")
            this.startSayForSeconds(action_temp);

        else if(action_temp[2] == "think")
            this.startThinkForSeconds(action_temp);

        else if(action_temp[2] == "wait"){
           this.startWait(action_temp[1]);

        }else if(action_temp[2] == "slide"){
            //add funcao para chamar a funcao de slide
        }
    }



}

/**
 * Executa a fala do Sprite
 * @param text {String} - texto da fala
 */
Sprite.prototype.say = function (text) {
    this.effects = "say";
    this.text= text;
}

/**
 * Limpa
 * @param text
 * @param secunds
 */
Sprite.prototype.cleanEffects = function (text, secunds) {
   this.effects = "none"
}

/**
 * Cadastra uma fala com tempo na pilha de falas
 * @param text - texto da fala
 * @param secunds - tempo da fala
 */
Sprite.prototype.sayForSeconds = function (text, secunds) {
        this.stackAction.push([text, secunds, "say"]);

}


/**
 * Executa uma fala com tempo
 * @param text {Array} - array com texto e tempo da fala
 */
Sprite.prototype.startSayForSeconds = function (text) {
     this.say(text[0]);
     var _this = this;
     window.setTimeout(function () {
         _this.effects = "none";
     }, text[1]*1000);
}

/**
 * Executa a fala do Sprite
 * @param text {String} - texto do pensamento
 */
Sprite.prototype.think = function (text) {
    this.text= text;
    this.effects = "think";
}

/**
 * Cadastra  um pensamento com tempo
 * @param text - texto da do pensamento
 * @param secunds - tempo do pensamento
 */
Sprite.prototype.thinkForSeconds = function (text, secunds) {
    this.stackAction.push([text, secunds, "think"]);

}

/**
 * Executa um pensamento com tempo
 * @param text {Array} - array com texto e tempo da fala
 */
Sprite.prototype.startThinkForSeconds = function (text) {

        this.think(text[0]);

        var _this = this;

        window.setTimeout(function () {
            _this.effects = "none";
        }, text[1]*1000);
}


/**
 * Muda o tamanho do sprite com base na porcentagem
 * @param {float} percent - numero decimal
 */
Sprite.prototype.changeSizeFor = function (percent) {
    if(typeof percent == "string"){
        percent = percent.substring(0, percent.length-1);
        if( !isNaN(percent) ) {

            percent = parseFloat(percent) / 100;

        } else
            percent = 0;
    }

    this.h *= percent;
    this.w *= percent;



}

/**
 * Muda o tamanho do sprite por uma tamanho específico
 * @param size
 */
Sprite.prototype.changeSizeTo = function (size) {
   this.h += size;
   this.w += size;
   this.x -= size/2;
   this.y -= size/2;
}

/**
 * Imprime a fala na tela
 * @param x {int} - posição x do balão
 * @param y {int} - posição x do balão
 * @param width {float} - largura do balão
 * @param height {float} - altura do balão
 */
Sprite.prototype.printTalkForm  = function(x, y, width, height) {

        var radius = 5;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);

        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);


        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius +10, y + height);
        ctx.lineTo(x  - 10 , y + height + 20);


        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);

        ctx.quadraticCurveTo(x, y, x + radius, y);

        ctx.closePath();

        ctx.fill();
        ctx.stroke();
}

/**
 * Imprime o pensamento na tela
 * @param x {int} - posição x do balão
 * @param y {int} - posição x do balão
 * @param width {float} - largura do balão
 * @param height {float} - altura do balão
 */
Sprite.prototype.printThinkForm  = function(x, y, width, height) {

    var radius = 5;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);

    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);


    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius , y + height);

    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);

    ctx.quadraticCurveTo(x, y, x + radius, y);

    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x+10 , y + height + 20, radius*1.4, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x , y + height + 40, radius, 0, 2 * Math.PI, false);
    ctx.closePath();


    ctx.fill();
    ctx.stroke();

}

/**
 * Cadastra um tempo de espera
 * @param secunds
 */
Sprite.prototype.wait = function (secunds) {
    this.stackAction.push(["", secunds, "wait"]);
}


/**
 * Executa um tempo de espera
 * @param secunds
 */
Sprite.prototype.startWait = function (secunds) {
    this.timewait = true;
    var _this = this;
    window.setTimeout(function () {
        _this.timewait = false;
        _this.effects = "none";
    }, secunds*1000);

}

/**
 * Espelha o sprite
 * @param mirror
 */
Sprite.prototype.setMirror = function (mirror) {
    this.mirred = mirror;
    this.x = canvas.width - this.x;
}


/**
* Avança para o próximo Sprite
* todo ir para GameObject
*/
Sprite.prototype.nextSprite = function(){
    this.setCurrentIndexSprite( this.getCurrentIndexSprite++ );
}

/**
* Volta ao sprite anterior 
* todo ir para GameObject
*/

Sprite.prototype.priorSprite = function(){
    this.animation.setCurrentIndexSprite( this.getCurrentIndexSprite++ );
}

/**
* Vai para o sprite de índice index
@param {int} index - índice para o sprite
* todo ir para GameObject
*/
Sprite.prototype.gotoSprite = function(index){
    this.animation.setCurrentIndexSprite( index );
}

/**
* Para a animação atual
* todo ir para GameObject
*/
Sprite.prototype.stopAnimation = function(){
	this.animation.stopAnimation();
}


/**
* inicia a animação do incio ou de onde foi pausado
* todo ir para GameObject
*/
Sprite.prototype.startAimation = function(){
	this.animation.setCurrentSprite(0);
	this.animation.startAnimation();
}


/**
* Vai para a próxima animação
* todo ir para GameObject
*/
Sprite.prototype.nextAnimation = function(){

    if(this.currentAnimation < this.animation.length)
        this.currentAnimation++;
    else
        this.currentAnimation = 0;


    console.log(this.currentAnimation)

}

/**
 * Move o sprite x passo, com base na sua rotação
 */
Sprite.prototype.moveStep = function(x, y){

}


/**
* Move o sprite por a posição x
*/
Sprite.prototype.moveFor = function(x, y){
   this.x = x;
   this.y = y;
}


/**
 * Move o sprite para a posição x
 */
Sprite.prototype.moveX = function(x){
   this.x += x;
}



/**
 * Move o sprite para a posição x
 */
Sprite.prototype.moveY = function(x){
    this.x += y;
}


/**
 * Deslize o sprite para a posição x]
 * todo essa funcao deve ser chamada pela stack de acoes
 * para isso é preciso dividila em adicao na stack e execução
 * como nas falas
 */
Sprite.prototype.slideTo = function(seg, x, y){

    _this = this;
    directionX = _this.x < x?"+":"-";
    directionY = _this.y < y?"+":"-";
    target = 0;

    fn = function () {
        console.log(directionX,directionY, _this.x, _this.y);
        if((directionX == "+") && (_this.x < x))
            _this.x++;
        else  if((directionX == "-") && (_this.x > x))
            _this.x--;

        if ((directionX == "+") &&  (_this.y < y))
                _this.y++;
        else  if ((directionX == "-") &&  (_this.y > y))
                _this.y--;


        if((_this.x != x) || (_this.y != y)){
            console.log("recall");
            setTimeout(fn, seg);
        }else
            console.log("finish");

    }


    setTimeout(fn, seg);

}







