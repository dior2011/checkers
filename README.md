#Checkers

Checkers built in HTML, CSS, and JavaScript.  Inspired by the way chess is played on chess.com, specifically the drag-and-drop piece movement.  Rules are traditional checkers rules.  Double-jumps are not yet present.  Reset button is not yet functional.  An HTML error appears in the console each time a piece is moved to a new square, but I have not been able to identify the source of the problem, and it does not cause any known issues with functionality.  Organization is currently lacking. Need to eventually move code that works on specific things to separate JS files, rather than crowding one file.

MVP: 
A playable PVP checkers game with correct initial piece positioning, piece move limitation, promotable pieces, and a win condition that occurs when the entirety of one players pieces have been captured.

Scope: 
Drag-and-drop piece movement

Pieces will be set up in their correct positions when a game is started

Move limitation by piece type, and altering moves by color

Piece move options are highlighted in some way, showing where the selected piece is allowed to move

Pieces will be able to capture other pieces by moving diagoally across/over them

Stretch goals: 
A button to restart the game/reset the positions of the pieces. 
Winning by the opposing player having no available moves left, a single player mode with a computer-controlled side. 
Make the board responsive/fit to viewport. Make the piece size based on a ratio, not on fixed pixel width and height. 
Also, want to work on chess eventually, taking the similarities from checkers and building upon/improving them. 