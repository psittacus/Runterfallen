var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

	game.load.image('sky', 'assets/sky.png');
	game.load.image('firstaid', 'assets/firstaid.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.image('star', 'assets/star.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function create() {

	//  We're going to be using physics, so enable the Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//  A simple background for our game
	game.add.sprite(0, 0, 'sky');


	//  The platforms group contains the ground and the 2 ledges we can jump on
	rockets = game.add.group();

	//  We will enable physics for any object that is created in this group
	rockets.enableBody = true;

	// The player and its settings
	player = game.add.sprite(game.world.width / 2, 5, 'dude');

	//  We need to enable physics on the player
	game.physics.arcade.enable(player);

	//  Player physics properties. Give the little guy a slight bounce.
	player.body.bounce.y = 0;
	player.body.gravity.y = 0;
	player.body.collideWorldBounds = true;

	//  Our two animations, walking left and right.
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);

	//  Finally some stars to collect
	stars = game.add.group();

	//  We will enable physics for any star that is created in this group
	stars.enableBody = true;

	//  Here we'll create 12 of them evenly spaced apart
/*    for (var i = 0; i < 12; i++)
	{
		//  Create a star inside of the 'stars' group
		var star = stars.create(i * 70, 0, 'star');

		//  Let gravity do its thing
		star.body.gravity.y = 300;

		//  This just gives each star a slightly random bounce value
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}
*/
	//  The score
	scoreText = game.add.text(16, 16, 'Alive', { fontSize: '32px', fill: '#000' });

	//  Our controls.
	cursors = game.input.keyboard.createCursorKeys();
	
}
var starI = 0;
var rocketI = 0;
var objectCounter = [];

function update() {
	if(starI > 1) {
		var star = stars.create(Math.random() * game.world.width, game.world.height*2, 'star');
		star.body.gravity.y = -(Math.random() * 200);
		star.body.immovable = true;
		objectCounter.push(star);

		starI = 0;
	} else {
		starI++;
	}

	if(rocketI > 10) {
		if(Math.random() * 10 > 2) {
			var rocket = rockets.create(Math.random() * game.world.width, game.world.height*2, 'firstaid');
			rocket.body.gravity.y = -(Math.random() * 100);
			rocket.body.immovable = true;
			objectCounter.push(rocket);
		} else {
			var rocket = rockets.create(-100, Math.random() * game.world.height, 'firstaid');
			rocket.body.gravity.x = Math.random() * 100;
			rocket.body.immovable = true;
			objectCounter.push(rocket);
		}
		rocketI = 0;
	} else {
		rocketI++;
	}

	for(var i = 0; i < objectCounter.length; i++) {
		if(objectCounter[i].body.y < 0) {
			objectCounter[i].kill();
		}
	}


	//  Collide the player and the stars with the platforms
	//game.physics.arcade.collide(player, platforms);
//    game.physics.arcade.collide(stars, platforms);

	//  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
	game.physics.arcade.overlap(player, stars, belohne, null, this);
	game.physics.arcade.overlap(player, rockets, killPlayer, null, this);

	//  Reset the players velocity (movement)
	player.body.velocity.x = 0;

	//  Now let's create two ledges

	if (cursors.left.isDown) {
		//  Move to the left
		player.body.velocity.x = -350;

		player.animations.play('left');
	}
	if (cursors.right.isDown) {
		//  Move to the right
		player.body.velocity.x = 350;

		player.animations.play('right');
	}
	if(cursors.down.isDown) {
		player.animations.stop();
		player.frame = 4;
		player.body.velocity.y = 350;
	}
	if(cursors.up.isDown) {
		player.animations.stop();
		player.frame = 4;
		player.body.velocity.y = -350;
	}
	if (! (cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown)) {
		//  Stand still
		player.animations.stop();
		player.body.velocity.y = 0;
		player.body.velocity.x = 0;
		player.frame = 4;
	}
	
	//  Allow the player to jump if they are touching the ground.
	if (cursors.up.isDown && player.body.touching.down)
	{
		player.body.velocity.y = -350;
	}

}

function belohne (player, star) {
	
	// Removes the star from the screen
	star.kill();
	//player.kill();
	//  Add and update the score
	score += 10;
	scoreText.text = 'Score: ' + score;

}

function killPlayer (player, rocket) {
	rocket.kill();
	// Removes the star from the screen
	player.kill();
	//player.kill();
	//  Add and update the score
	scoreText.text = 'DEAD! Your Score was:' + score;
}
