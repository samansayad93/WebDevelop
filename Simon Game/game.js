var buttonColours = ["blue","red","green","yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;

$(document).keypress(function (e) { 
    if(!started){
        $("#level-title").text("Level: "+level);
        nextSequence();
        started = true;
    }
    else{
        var keypress;
        switch(e.key){
            case "g":
            case "G":
                keypress = "green";
                break;
            case "r":
            case "R":
                keypress = "red";
                break;
            case "y":
            case "Y":
                keypress = "yellow";
                break;
            case "b":
            case "B":
                keypress = "blue";
                break;
            default:
                console.log(e.key);
                return;
        }
        userClickedPattern.push(keypress);

        playSound(keypress);
        animatePress(keypress);

        checkAnswer(userClickedPattern.length-1);
    }
});

$(".btn").click(function (){
    var userChosenButton = $(this).attr("id");
    userClickedPattern.push(userChosenButton);

    playSound(userChosenButton);
    animatePress(userChosenButton);

    checkAnswer(userClickedPattern.length-1);
})

function checkAnswer(currentLevel){
    if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        console.log("success");

        if(userClickedPattern.length === gamePattern.length){
            setTimeout(function (){
                nextSequence();
            }, 1000);
        }9
    }
    else{
        console.log("wrong");
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function (){
            $("body").removeClass("game-over");
        },300);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        gamePattern = [];
        level = 0;
        started = false;
    }
}

function nextSequence(){
    userClickedPattern = [];
    level++;

    $("#level-title").text("level: "+level);

    var randomNumber = Math.floor(Math.random()*4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
}

function playSound(name){
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColour){
    $("#"+currentColour).addClass("pressed");
    setTimeout(function (){
        $("#"+currentColour).removeClass("pressed");
    }, 300);
}
