$("body").ready(function() {
    //code for ace.js
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/eclipse");
    editor.setShowPrintMargin(false);
    editor.session.setMode("ace/mode/javascript");

    $("#bt-runcode").click(runCode);
    $("#bt-stopcode").click(function () {

        se.mlevel.getCurrentScene().isActive = false;
        window.requestAnimFrame = null;
        console.log( se.mlevel.getObjectsCurrentScene());

    });
});

//run the code of editor input
runCode = function () {

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    //get code of editor
    code = editor.getValue();
    code = "window.setTurtle = function(){ "+code+"}";
    try {
        //execute code as javascript
        eval(code);
        window.se = new StarterEngine();
        se.startTurtle();

        $("#console-error").html("Compiled with Sucess!!!");
    } catch (e) {
        lc = getLineAndColumErro(e);
        console.log(lc)
        lineErro = lc[0];
        colErro = lc[1];
        $("#console-error").html(e.name + ' in line '+ lineErro +' and collum ' +colErro +' - '+ e.message);
    }


}

getLineAndColumErro = function (e) {
    //break string with \n
    arrayStack = e.stack.split("\n");
    //get segunde line
    firstErro = arrayStack[1];
    //breack string with :
    firstErro =  firstErro.split(":");
    //get two last numbers
    arrayErro = [];
    //line
    arrayErro[0] = firstErro [firstErro.length-2]
    //col
    arrayErro[1] = firstErro [firstErro.length-1].split(")")[0]; //removing )

    return arrayErro;
}


