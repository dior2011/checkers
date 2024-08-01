//red and black score increase when pieces of the other color are captured
//when either score reaches 12, that color wins
let redScore = 0;
let blackScore = 0;

//blacksTurn makes HTML draggable attribute either true or false, depending on the turn
let blacksTurn = true;

//some things in the scoreboard
let turntracker = document.querySelector('#turntracker');
let blackScoreTracker = document.querySelector('#blackScoreTracker');
let redScoreTracker = document.querySelector('#redScoreTracker');
let winTracker = document.querySelector('#winTracker')
blackScoreTracker.textContent = "Black's score: " + String(blackScore);
redScoreTracker.textContent = "Red's score: " + String(redScore);

//starting positions of pieces. 1 = black piece, 2 = red piece
//setBoard function references this array to find which squares to call makePiece() on
let startingPositions = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
];

//live-updating array to track positions of pieces as they are moved. Not currently used. 
//could be used for saving game positions or a computer player
let activePositions = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
];

//this array shows the position of squares and their respective IDs
//used to find coordinates of squares and limit piece movement
let boardPositions = [
    ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'],
    ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
    ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
    ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
    ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
    ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
    ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
    ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']
];

//makePiece creates a piece of a chosen color on a specified square
function makePiece(squareID, color){
    let newPiece = document.createElement('div');
    newPiece.setAttribute('id', 'piece');
    newPiece.setAttribute('class', color);
    newPiece.setAttribute('draggable', 'true');
    newPiece.setAttribute('ondragstart', '"event.dataTransfer.setData("text/plain", null)"')
    let selectedSquare = document.getElementById(squareID);
    selectedSquare.appendChild(newPiece);
}

// setBoard sets the board up with pieces in their starting positions
function setBoard(){
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let position = boardPositions[i][j];
            if(0 < startingPositions[i][j] && startingPositions[i][j] === 1){
                makePiece(position, 'black');
            } else if(startingPositions[i][j] === 2){
                makePiece(position, 'red');
            }
        }
    }
}
setBoard();

//determines if win conditions are met, and delivers a victory message if they are
//the number 12 is used because each player begins with 12 pieces
function winCondition(){
    if(redScore === 12){
        winTracker.textContent = "Red wins!"
        turntracker.textContent = ""
    } else if(blackScore === 12){
        winTracker.textContent = "Black wins!"
        turntracker.textContent = ""
    }
}

let redPieces = document.querySelectorAll(".red");
let blackPieces = document.querySelectorAll(".black");

//function that revokes pieces ability to be interacted with if it is not their color's turn
//does so by switching the 'draggable' element between true and false each time a move is made
//draggable must be true for an element to be dragged
function changeTurn(){
    if(blacksTurn === true){
        turntracker.textContent = "Black's turn";
        for (let i = 0; i < redPieces.length; i++){
            blackPieces[i].setAttribute('draggable', 'true');
            redPieces[i].setAttribute('draggable', 'false');
        }
        blacksTurn = false;
    } else {
        for(let i = 0; i < blackPieces.length; i++){
            turntracker.textContent = "Red's turn";
            redPieces[i].setAttribute('draggable', 'true');
            blackPieces[i].setAttribute('draggable', 'false');
        }
        blacksTurn = true;
    }
}
changeTurn();

//this function changes the activePositions array to match where pieces are after each move is made
function changeActiveLayout(chosenSquare, originalSquare){
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if(blacksTurn){
                if(chosenSquare.id === boardPositions[i][j]){
                    activePositions[i][j] = 2
                }
            } else {
                if(chosenSquare.id === boardPositions[i][j]){
                    activePositions[i][j] = 1
                }
            }
            if(originalSquare.id === boardPositions[i][j]){
                activePositions[i][j] = 0;
            }
        }
    }
}

//findChosenSquareCoordinates finds the coordinates of the square the user is attempting to move a piece to
//these coordinates will be checked later on to determine if the movement will be allowed
function findChosenSquareCoordinates(chosenSquare){
    let x;
    let y;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if(chosenSquare.id === boardPositions[i][j]){
                x = j;
                y = i;
            }
        }
    }
    return [x, y]
}
//findOriginalSquareCoordinates finds the coordinates of the square a piece was originally on
//the relationship between these coordinates and the chosenSquareCoordinates determines move legality
function findOriginalSquareCoordinates(originalSquare){
    let a;
    let b;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if(originalSquare.id === boardPositions[i][j]){
                a = j;
                b = i;
            }
        }
    }
    return [a, b]
}
//kingMe adds 'king' to the classList of any piece that reaches the opposite row
//this changes the border color to gold and allows the piece to move backwards
function kingMe(chosenSquare){
    if(movedPiece.classList.contains("red") && chosenSquare.classList.contains("row1") && !movedPiece.classList.contains("king")){
        movedPiece.classList.add("king")
    } else if (movedPiece.classList.contains("black") && chosenSquare.classList.contains("row8") && !movedPiece.classList.contains("king")){
        movedPiece.classList.add("king")
    }
}
//getMiddleSquareId and middleSquareDifferentColor are used for capturing pieces
//finding the middle square ID is used to determine if there is a piece in that position, and if it is the opposing color
function getMiddleSquareId(originalCoords, newCoords){
    let middleSquareCoords = [((originalCoords[0] + newCoords[0])/2), ((originalCoords[1] + newCoords[1])/2)]
    let middleSquareId = boardPositions[middleSquareCoords[1]][middleSquareCoords[0]]
    return middleSquareId
}

function middleSquareDifferentColor(originalCoords, newCoords){
    let middleSquare = document.getElementById(getMiddleSquareId(originalCoords, newCoords))
    if(middleSquare.children[0]){
        if((middleSquare.children[0].classList.contains('red')) && (movedPiece.classList.contains('black'))){
            return true
        } else if(middleSquare.children[0].classList.contains('black') && movedPiece.classList.contains('red')){
            return true
        }
    }
}

//limit colors applies logic used for capturing, without actually carrying out the capture functionality
//it is used to highlight all valid squares by turning them green when hovered over
//logic is explained further within the limitMoves function
function limitColors(chosenSquare, originalSquare){
    let originalCoords = findOriginalSquareCoordinates(originalSquare)
    let newCoords = findChosenSquareCoordinates(chosenSquare)

    if(movedPiece.classList.contains('king')){
        if((originalCoords[1] === newCoords[1] - 1 || originalCoords[1] === newCoords[1] + 1) 
        && 
        (originalCoords[0] === newCoords[0] - 1 || originalCoords[0] === newCoords[0] + 1 )){
            return true
        } else if((originalCoords[1] === newCoords[1] - 2 || originalCoords[1] === newCoords[1] + 2) 
            && (originalCoords[0] === newCoords[0] - 2 || originalCoords[0] === newCoords[0] + 2) &&
            middleSquareDifferentColor(originalCoords, newCoords))
        {
            return true
        }
    } else if(movedPiece.classList.contains('black')){
        if(originalCoords[1] === newCoords[1] + 1 
            && (newCoords[0] === originalCoords[0] + 1 
            || newCoords[0] === originalCoords[0] -1)){
            return true
        } else if(originalCoords[1] === newCoords[1] + 2 
            && (originalCoords[0] === newCoords[0] - 2 
            || originalCoords[0] === newCoords[0] + 2) 
            && middleSquareDifferentColor(originalCoords, newCoords)){
            return true
        }
    } else if(movedPiece.classList.contains('red')){
        if(originalCoords[1] === newCoords[1] - 1 
            && (newCoords[0] === originalCoords[0] + 1 
            || newCoords[0] === originalCoords[0] -1)){
            return true
        } else if(originalCoords[1] === newCoords[1] - 2 
            && (originalCoords[0] === newCoords[0] - 2 
            || originalCoords[0] === newCoords[0] + 2) 
            && middleSquareDifferentColor(originalCoords, newCoords)){
            return true
        }
    }
}

//limitMoves is the core logic of allowing/disallowing moves
function limitMoves(chosenSquare, originalSquare){
    //original and new coordinates to do calculations on
    let originalCoords = findOriginalSquareCoordinates(originalSquare)
    let newCoords = findChosenSquareCoordinates(chosenSquare)

    //the first check is to see if a piece is a king, which is the case if it includes 'king' in its classlist
    if(movedPiece.classList.contains('king')){
        //originalCoords[1] is the x coordinate, or column that a piece is targeting, while originalCoords[0] is the y coordinate, or row, that a piece is targeting
        //while a piece is a king it can move to any square that is one square away in either direction on the x axis, and one away in either direction on y axis
        //hence pluse or minus 1 for either parameter at the same time
        if((originalCoords[1] === newCoords[1] - 1 || originalCoords[1] === newCoords[1] + 1) 
        && 
        (originalCoords[0] === newCoords[0] - 1 || originalCoords[0] === newCoords[0] + 1 )){
            return true
        } else if((originalCoords[1] === newCoords[1] - 2 || originalCoords[1] === newCoords[1] + 2) 
            && (originalCoords[0] === newCoords[0] - 2 || originalCoords[0] === newCoords[0] + 2) &&
            middleSquareDifferentColor(originalCoords, newCoords))
        {
            //this piece of logic is for the case that there is a piece of the opposing color one square away on both x and y axes
            //if this condition is reached when the piece is dropped, the capture logic "deletes" the captured piece
            //it is deleted by the parent div (The square it is in) having its textContent changed to nothing, or ""
            //then the score of the respective side is increased by one
            let middleSquare = document.getElementById(getMiddleSquareId(originalCoords, newCoords))
            middleSquare.innerHTML = ""
            if(movedPiece.classList.contains('red')){
                redScore += 1;
                redScoreTracker.textContent = "Red's score: " + String(redScore)
            } else {
                blackScore += 1;
                blackScoreTracker.textContent = "Black's score: " + String(blackScore)
            }
            return true
        }
        //the rest of this function shows similar logic for black and red pieces that are not kings, with the primary difference being
        //restriction of movement along the y axis by only allowing for either an increase or decrease in the y coordinate while moving
    } else if(movedPiece.classList.contains('black')){
        if(originalCoords[1] === newCoords[1] + 1 
            && (newCoords[0] === originalCoords[0] + 1 
            || newCoords[0] === originalCoords[0] -1)){
            return true
        } else if(originalCoords[1] === newCoords[1] + 2 
            && (originalCoords[0] === newCoords[0] - 2 
            || originalCoords[0] === newCoords[0] + 2) && middleSquareDifferentColor(originalCoords, newCoords)){
                let middleSquare = document.getElementById(getMiddleSquareId(originalCoords, newCoords))
                middleSquare.innerHTML = ""
                blackScore += 1
                blackScoreTracker.textContent = "Black's score: " + String(blackScore)
                return true
        }
    } else {
        if(originalCoords[1] === newCoords[1] - 1 
            && (newCoords[0] === originalCoords[0] + 1 
            || newCoords[0] === originalCoords[0] -1)){
            return true
        } else if(originalCoords[1] === newCoords[1] - 2 
            && (originalCoords[0] === newCoords[0] - 2 
            || originalCoords[0] === newCoords[0] + 2) && middleSquareDifferentColor(originalCoords, newCoords)){
            let middleSquare = document.getElementById(getMiddleSquareId(originalCoords, newCoords))
            middleSquare.innerHTML = ""
            redScore += 1
            redScoreTracker.textContent = "Red's score: " + String(redScore)
            return true
        }
    }
}

//this function actually places the piece in the new square once the requirements are met
function movePieceToNewDiv(chosenSquare, originalSquare){
    chosenSquare.style.backgroundColor = "";
    changeActiveLayout(chosenSquare, originalSquare);
    originalSquare.removeChild(movedPiece);
    chosenSquare.append(movedPiece);
}

//***** CITATION *****//
// Below this point is implementation of a drag and drop piece movement system

// The event listeners, of which there are 7, were coded based on the example at https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event
// I referenced that code because I had never used event listeners for any of the events used in this drag and drop interface
// It was helpful for understanding the different events that need to be/can be tracked

//movedPiece will change to whichever piece is currently selected by the drag event
//and will be used to find coordinates of squares that the piece is targeting

let movedPiece;

//creating drag event
//the next 3 listeners will affect the pieces themselves

document.addEventListener("drag", (event) => {
    event.target.style.backgroundColor = "grey";
}, false);


//at the beginning of a drag event, the target of the event is changed to the color green
document.addEventListener("dragstart", (event) => {
    movedPiece = event.target;
    event.target.style.opacity = "0.2";

}, false);

document.addEventListener("dragend", (event) => {
    event.target.style.opacity = "1";
    event.target.style.backgroundColor = '';
}, false);

//this stuff will happen to the squares the pieces are placed on/in

document.addEventListener("dragover", (event) => {
    // allows piece to be dropped onto a square
    event.preventDefault();
}, false);

//this event listener calls limitColors to check piece limitation and turn valid squares green when hovered over
document.addEventListener("dragenter", (event) => {
    // change the squares color when hovered over
    // only allows hover events if the square is empty
    let originalSquare = movedPiece.parentNode
    let chosenSquare = event.target

    if(chosenSquare.classList.contains("black-square") && chosenSquare.innerHTML === ""){
        if(limitColors(chosenSquare, originalSquare)){
            chosenSquare.style.backgroundColor = "green"
        }
    }
}, false);

//this event listener returns green squares to their base color when the piece leaves them
document.addEventListener("dragleave", (event) => {
    //change square color back to default when the selected piece leaves it
    if(event.target.classList.contains("black-square")){
            event.target.style.backgroundColor = "";
    }
}, false);

//the drop event listener checks that the square is empty, that it's a black square, and that the space is within the confines of the limitMoves function
//once a piece is moved, the drop event listener checks if the piece should become a king, changes the turn, and checks if anyone has won the game
document.addEventListener("drop", (event) => {
    event.preventDefault();
    let originalSquare = movedPiece.parentNode
    let chosenSquare = event.target

    if(chosenSquare.classList.contains("black-square") && chosenSquare.innerHTML === ""){
        if(limitMoves(chosenSquare, originalSquare)){
            movePieceToNewDiv(chosenSquare, originalSquare)
            kingMe(chosenSquare)
            changeTurn()
            winCondition()
        }
    }
}, false)