// Write a comment of around 150 words at the top of your code explaining:
// I added game sounds, platforms, and enemies as extensions. I think the most difficult part is to figure out when to use different structure to write codes. I tends to use simplest way to solve issues at first. Also, dibugging consumes lots of time. After adding new features, I have to find out if there is any unexpected error. But fixing these problems is quite interesting, and I really enjoy it. I never thought I would realize how a game is built. But doing this game projet has altered how I read the digital world. I learned to use variables, arrays, objects, methods, and other complicated structures. This strengthen my confidence in programming since I was not familiar before this class.

//position variables
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
//game character condition
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isTouched;
//background and feature
var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;
var platforms;
var enemies;
//score and finish
var game_score;
var flagpole;
var lives;
//sound
var jumpSound;
var walkSound;
var collectSound;
var failSound;
var successSound;

function preload()
{
    //preload game sounds
    soundFormats('wav');
    jumpSound = loadSound('jump.wav');
    jumpSound.setVolume(0.1);
    walkSound = loadSound('walk.wav');
    walkSound.setVolume(1.2);
    collectSound = loadSound('collect.wav');
    collectSound.setVolume(0.1);
    failSound = loadSound('fail.wav');
    failSound.setVolume(1);
    successSound = loadSound('success.wav');
    successSound.setVolume(0.1);
    dogImg = loadImage("Face front.png");
    dogjumpImg = loadImage("Jump front.png");
    dogwalkleftImg = loadImage("Walk left.png");
    dogwalkrightImg = loadImage("Walk right.png");
    dogjumpleftImg = loadImage("Jump left.png");
    dogjumprightImg = loadImage("Jump right.png");
}

function setup()
{
    lives = 3;
    startGame();
}

function draw()
{
    // fill the sky blue
	background(135, 206, 235); 
    
    // draw brown ground
	noStroke();
	fill(139,69,19);
	rect(0, floorPos_y, width, height/4);
    
    push();
    translate(scrollPos, 0); //side scrolling

	// Draw clouds.
    drawClouds();
    
	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();

	// Draw canyons.
    for(i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

	// Draw collectable items.
    for(i = 0; i < collectables.length; i++)
    {
        if(collectables[i].isFound == false)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }

    // Draw platforms
    for(i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    // Draw Flagpole
    renderFlagpole();

    // Draw enemies
    for(i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y)
        if(isContact)
        {
            if(lives > 1)
            {
                lives -= 1;
                startGame();
                break;
            }
            else
            {
                lives -= 1;
                break;
            }
        }
    }
    
    pop();

	// Draw game character.
	drawGameChar();
    
    //Draw score counter
    textSize(20);
    fill(210, 105, 30);
    text('Score: ' + game_score, 30, 45);

    //Draw touch bar fail
    //Left
    fill(200, 200, 30);
    rect(50, 700, 50, 50);
    textSize(20);
    fill(100, 100, 130);
    text('L', 70, 730);
    //Right
    fill(200, 200, 30);
    rect(330, 700, 50, 50);
    textSize(20);
    fill(100, 100, 130);
    text('R', 350, 730);
    //Space
    fill(200, 200, 30);
    rect(170, 700, 90, 50);
    textSize(20);
    fill(100, 100, 130);
    text('Space', 190, 730);
    
    //check if the player is dead
    checkPlayerDie();
    
    //draw life tokens onto the screen
    for(let i = 0; i < lives; i++)
    {
        fill(255, 0, 0);
        beginShape();
        vertex(120 + i*25, 30);
        vertex(130 + i*25, 45);
        vertex(140 + i*25, 30);
        vertex(130 + i*25, 35);
        endShape();
    }
    
    //"Game over. Press space to continue." when `lives` is less than 1.
    if(lives < 1)
    {
        textSize(20);
        fill(220, 20 ,60);
        text('Game over. Press space to continue.', 50, height/2);
        return;
    }
    
    //"Level complete. Press space to continue." when `flagpole.isReached` is true
    if(flagpole.isReached == true)
    {
        textSize(20);
        fill(220, 20 ,60);
        text('Level complete. Press space to continue.', 50, height/2);
        return;
    }
    
    //`checkFlagpole` is only called when `flagpole.isReached` is `false`
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }


	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		
        if(gameChar_x > width * 0.4)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
        if(gameChar_x < width * 0.6)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        for(i = 0; i < platforms.length; i++)//check if stand on platform
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
            {
                isTouched = true;
                isFalling = false;
                break;
            }
            else
            {
                isTouched = false;
            }
        }
        if(isTouched == false)
        {
            gameChar_y += 1;
            isFalling = true;    
        }
    }
    else
    {
        isFalling = false;
    }
    
    if(isPlummeting == true)
    {
        gameChar_y += 5;
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    //left arrow - go left and play walk sound
    if((keyCode == 37&& (flagpole.isReached == false && lives > 0)))
    {
        isLeft = true;
        walkSound.play();
    }
    
    //right arrow - go right and play walk sound
    if(keyCode == 39 && (flagpole.isReached == false && lives > 0))
    {
        isRight = true;
        walkSound.play();
    }
    
    //spacebar - only jump when it is touching the ground or on the platform
    if(keyCode == 32 && (gameChar_y == floorPos_y || isTouched == true)
        //  && (flagpole.isReached == false && lives > 0)
        )
    {
        gameChar_y -= 150;
        jumpSound.play();
    }
}

function keyReleased()
{
	if(keyCode == 37)
    {
        isLeft = false;
    }
    
    if(keyCode == 39)
    {
        isRight = false;
    }
}

//detect the screen have been touch for direction
function touchStarted()
{
    if((touches.x < 100 && touches.x > 50) && (touches.y < 750 && touches.y > 700) && (flagpole.isReached == false && lives > 0))
    {
        isLeft = true;
        walkSound.play();
    }

    if((touches.x < 380 && touches.x > 330) && (touches.y < 750 && touches.y > 700) && (flagpole.isReached == false && lives > 0))
    {
        isRight = true;
        walkSound.play();
    }
    
    if((touches.x < 260 && touches.x > 170) && (touches.y < 750 && touches.y > 700) && (gameChar_y == floorPos_y || isTouched == true))
    {
        gameChar_y -= 150;
        jumpSound.play();
    }
}

function touchEnded()
{
    // if((touches.x < 100 && touches.x > 50) && (touches.y < 750 && touches.y > 700))
    // {
        isLeft = false;
    // }
    
    // if((touches.x < 380 && touches.x > 330) && (touches.y < 750 && touches.y > 700))
    // {
        isRight = false;
    
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        // fill(220, 100, 30);
        // ellipse(gameChar_x + 10, gameChar_y - 63, 20, 27);
        // fill(100, 100, 200);
        // rect(gameChar_x, gameChar_y - 51, 20, 30);
        // fill(0);
        // ellipse(gameChar_x + 3, gameChar_y - 66, 4, 4);
        // rect(gameChar_x - 13, gameChar_y - 23, 8, 12);
        // rect(gameChar_x - 8, gameChar_y - 23, 12, 6);
        // rect(gameChar_x + 13, gameChar_y - 23, 10, 14);
        image(dogjumpleftImg, gameChar_x - 45, gameChar_y - 75, 94, 80);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        // fill(220, 100, 30);
        // ellipse(gameChar_x - 10, gameChar_y - 63, 20, 27);
        // fill(100, 100, 200);
        // rect(gameChar_x - 20, gameChar_y - 51, 20, 30);
        // fill(0);
        // ellipse(gameChar_x - 3, gameChar_y - 66, 4, 4);
        // rect(gameChar_x - 23, gameChar_y - 23, 10, 14);
        // rect(gameChar_x - 5, gameChar_y - 23, 12, 6);
        // rect(gameChar_x + 2, gameChar_y - 23, 8, 12);
        image(dogjumprightImg, gameChar_x - 45, gameChar_y - 75, 94, 80);

	}
	else if(isLeft)
	{
		// add your walking left code
        // fill(220, 100, 30);
        // ellipse(gameChar_x + 10, gameChar_y - 55, 20, 27);
        // fill(100, 100, 200);
        // rect(gameChar_x, gameChar_y - 43, 20, 30);
        // fill(0);
        // ellipse(gameChar_x + 3, gameChar_y - 58, 4, 4);
        // rect(gameChar_x - 13, gameChar_y - 15, 10, 15);
        // rect(gameChar_x - 8, gameChar_y - 15, 12, 8);
        // rect(gameChar_x + 13, gameChar_y - 15, 10, 18);
        image(dogwalkleftImg, gameChar_x - 45, gameChar_y - 72, 94, 80);

	}
	else if(isRight)
	{
		// add your walking right code
        // fill(220, 100, 30);
        // ellipse(gameChar_x - 10, gameChar_y - 55, 20, 27);
        // fill(100, 100, 200);
        // rect(gameChar_x - 20, gameChar_y - 43, 20, 30);
        // fill(0);
        // ellipse(gameChar_x - 3, gameChar_y - 58, 4, 4);
        // rect(gameChar_x - 23, gameChar_y - 15, 10, 18);
        // rect(gameChar_x - 5, gameChar_y - 15, 12, 8);
        // rect(gameChar_x + 2, gameChar_y - 15, 10, 15);
        image(dogwalkrightImg, gameChar_x - 45, gameChar_y - 72, 94, 80);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        // fill(220, 100, 30);
        // ellipse(gameChar_x, gameChar_y - 63, 27, 27);
        // fill(100, 100, 200);
        // rect(gameChar_x - 15, gameChar_y - 51, 30, 30);
        // fill(0);
        // ellipse(gameChar_x - 5, gameChar_y - 66, 4, 4);
        // ellipse(gameChar_x + 5, gameChar_y - 66, 4, 4);
        // rect(gameChar_x - 13, gameChar_y - 23, 10, 14);
        // rect(gameChar_x + 3, gameChar_y - 23, 10, 14);
        image(dogjumpImg, gameChar_x - 45, gameChar_y - 75, 94, 80);

	}
	else
	{
		// add your standing front facing code
        // fill(220, 100, 30);
        // ellipse(gameChar_x, gameChar_y - 55, 27, 27);
        // fill(100, 100, 200);
        // rect(gameChar_x - 15, gameChar_y - 43, 30, 30);
        // fill(0);
        // ellipse(gameChar_x - 5, gameChar_y - 58, 4, 4);
        // ellipse(gameChar_x + 5, gameChar_y - 58, 4, 4);
        // rect(gameChar_x - 13, gameChar_y - 15, 10, 18);
        // rect(gameChar_x + 3, gameChar_y - 15, 10, 18);
        image(dogImg, gameChar_x - 45, gameChar_y - 72, 94, 80);
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(i = 0; i < clouds.length; i++)
    {
        fill(255,255,255);
        ellipse(clouds[i].x_pos + 15, clouds[i].y_pos + 15, clouds[i].width + 5, 30);
        ellipse(clouds[i].x_pos + 25, clouds[i].y_pos - 5, clouds[i].width + 5, 30);
        ellipse(clouds[i].x_pos + 35, clouds[i].y_pos + 5, clouds[i].width + 5, 30);
        ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].width, 30);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(i = 0; i < mountains.length; i++)
    {
        fill(46, 139, 87);
        triangle(mountains[i].x_pos, floorPos_y,
                 mountains[i].x_pos + mountains[i].width/8, floorPos_y - 150,
                 mountains[i].x_pos + mountains[i].width/4, floorPos_y);
        triangle(mountains[i].x_pos, floorPos_y,
                 mountains[i].x_pos + mountains[i].width/2, floorPos_y - 200,
                 mountains[i].x_pos + mountains[i].width, floorPos_y);
        triangle(mountains[i].x_pos + mountains[i].width *3/4, floorPos_y,
                 mountains[i].x_pos + mountains[i].width*7/8, floorPos_y - 150,
                 mountains[i].x_pos + mountains[i].width, floorPos_y);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(i = 0; i < trees_x.length; i++)
    {
        fill(222, 184, 136);
        rect(trees_x[i], floorPos_y - 100, 20, 100);
        fill(154, 205, 50);
        triangle(trees_x[i] - 30, 530, trees_x[i] + 50, 530, trees_x[i] + 10, 480);
        triangle(trees_x[i] - 30, 570, trees_x[i] + 50, 570, trees_x[i] + 10, 510);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    noStroke();
    fill(100,155,255);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.size, height - floorPos_y);    
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if((gameChar_world_x > t_canyon.x_pos && gameChar_world_x < (t_canyon.x_pos + t_canyon.size)) && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
}

// ---------------------------------
// platforms/ enemies render and check functions
// ---------------------------------

//function to create platforms and check if game character touch
function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(72, 61, 139);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

//function to create enemies and check if game character contact
function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    this.update = function()
        {
            this.currentX += this.inc;
            if(this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
            else if(this.currentX < this.x)
            {
                this.inc = 1;
            }
        }
    this.draw = function()
        {
            this.update();
            randomNumX = this.currentX + random(-0.5, 0.5);
            randomNumY = this.y + random(-1.5, 1.5);
            fill(255, 0, 0);
            vec1 = createVector(randomNumX, randomNumY);
            vec2 = createVector(randomNumX + 50, randomNumY + 50);
            ellipse(vec1.x,
                constrain(vec1.y, this.y-7, this.y+7),
                20,
                20);
            // for(let i = 0; i < 10; i++)
            // {
            //     strokeWeight(5);
            //     stroke(0);
            //     line(vec1.x, vec1.y, vec2.x, vec2.y);
            //     vec2.rotate(PI/10);
            //     vec2.normalize();
            // }
        }
    this.checkContact = function(gc_x, gc_y)
        {
            var d = dist(gc_x, gc_y, this.currentX, this.y);
            if(d < 30)
            {
                return true;
            }
            return false;
        }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(255,215,0);
    stroke(0,0,0);
    strokeWeight(2);
    ellipse(t_collectable.x_pos - 2, t_collectable.y_pos -1, t_collectable.size, t_collectable.size);
    noStroke();
    fill(255,255,255);
    textSize(t_collectable.size - 10);
    text("$", t_collectable.x_pos - t_collectable.size/4, t_collectable.y_pos + t_collectable.size/4);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 57)
    {
        t_collectable.isFound = true;
        collectSound.play();
        game_score += 1;
    }
}

// ----------------------------------
// Flagpole render and check functions
// ----------------------------------

//draw flagpole
function renderFlagpole()
{
    if(flagpole.isReached == false)
    {
        fill(245, 245, 220);
        rect(flagpole.x_pos, floorPos_y - 100, 7, 100);
        fill(255, 69, 0);
        beginShape();
        vertex(flagpole.x_pos + 5, floorPos_y - 100);
        vertex(flagpole.x_pos + 5, floorPos_y - 70);
        vertex(flagpole.x_pos + 35, floorPos_y - 60);
        vertex(flagpole.x_pos + 30, floorPos_y - 75);
        endShape();
    }
    else
    {
        fill(245, 245, 220);
        rect(flagpole.x_pos, floorPos_y - 100, 7, 100);
        fill(255, 69, 0);
        beginShape();
        vertex(flagpole.x_pos + 5, floorPos_y - 100);
        vertex(flagpole.x_pos + 5, floorPos_y - 70);
        vertex(flagpole.x_pos + 55, floorPos_y - 70);
        vertex(flagpole.x_pos + 55, floorPos_y - 100);
        endShape();
    }
}

//when the gameChar reach to the flagpole
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 30 )
    {
        flagpole.isReached = true;
    }
}

// ----------------------------------
// check Player Die and set to restart
// ----------------------------------
//tests if your character has fallen below the bottom of the canvas.
function checkPlayerDie()
{
    if(isPlummeting == true && gameChar_y > height + 100)
    {
        lives -= 1;
        if(lives > 0)
        {
            failSound.play();
            startGame();
        }
    }
}

//start game settings and Restart the game if player still has lives
function startGame()
{
	createCanvas(450, 800);
	floorPos_y = height * 3/4;
	gameChar_x = width* 2/5;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isTouched = false;

	// Initialise arrays of scenery objects.
    trees_x = [100, 300, 700, 1100, 1600, 1800, 2500];
    clouds = [
        {x_pos: 100, y_pos: 200, width: 50}, 
        {x_pos: 400, y_pos: 135, width: 40},
        {x_pos: 600, y_pos: 180, width: 80},
        {x_pos: 1000, y_pos: 150, width: 50},
        {x_pos: 1300, y_pos: 170, width: 80},
        {x_pos: 1700, y_pos: 140, width: 40},
        {x_pos: 1900, y_pos: 230, width: 70},
        {x_pos: 2400, y_pos: 100, width: 50}
    ];
    mountains = [
        {x_pos: 50, width: 250},
        {x_pos: 1100, width: 250},
        {x_pos: 1800, width: 300},
        {x_pos: 2700, width: 250}
    ];
    canyons = [
        {x_pos: 500, size: 200},
        {x_pos: 900, size: 80},
        {x_pos: 1400, size: 150},
        {x_pos: 2200, size: 130}
    ];
    collectables = [
        {x_pos: 200, y_pos: 500, size: 50, isFound: false},
        {x_pos: 480, y_pos: 420, size: 50, isFound: false},
        {x_pos: 650, y_pos: 370, size: 50, isFound: false},
        {x_pos: 1000, y_pos: 500, size: 50, isFound: false},
        {x_pos: 1450, y_pos: 450, size: 50, isFound: false},
        {x_pos: 1850, y_pos: 310, size: 50, isFound: false},
        {x_pos: 2000, y_pos: 420, size: 50, isFound: false},
        {x_pos: 2350, y_pos: 450, size: 50, isFound: false}
    ];
    
    // initialize platform
    platforms = [];
    platforms.push(createPlatforms(500, 500, 100));
    platforms.push(createPlatforms(1650, 480, 80));
    platforms.push(createPlatforms(1750, 450, 50));

    // initialize enemies
    enemies = [];
    enemies.push(new Enemy(100, floorPos_y - 10, 100));
    enemies.push(new Enemy(720, floorPos_y - 10, 80));
    enemies.push(new Enemy(1200, floorPos_y - 10, 100));
    enemies.push(new Enemy(1730, floorPos_y - 10, 100));

    // initialize the game score and lives
    game_score = 0;
    if(lives == 0)
    {
        lives = 3;
    }

    // Initialise a flagpole at the very end of your level
    flagpole = {x_pos: 3100, isReached: false};
}