var randomint1 = Math.floor(Math.random()*6)+1;

var imagesrc = "images/dice"+randomint1+".png";

document.querySelector(".img1").setAttribute("src",imagesrc);

var randomint2 = Math.floor(Math.random()*6)+1;

imagesrc = "images/dice"+randomint2+".png";

document.querySelector(".img2").setAttribute("src",imagesrc);

if(randomint1 > randomint2){
    document.querySelector("h1").innerHTML = "🚩 Player 1 Wins!";
}
else if(randomint1 < randomint2){
    document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩";
}
else{
    document.querySelector("h1").innerHTML = "Draw!";
}