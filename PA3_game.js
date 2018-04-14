

/*
Game 0: Group 29
This is a ThreeJS program which implements a simple game
The user moves a monkey around the board trying to knock balls into a cone
*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, camera3;  // we have two cameras in the main scene
	var avatar;
	var enemy;
	// here are some mesh objects ...

	//var cone;
	var box;


	var endScene, endCamera, endText;
	var lostScene, lostText;
  var npc, cube;

	var startScene, startCam, startText;

	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}

	var gameState =
	     {score:0, health:10, scene: 'start', camera:'none' }
			 //scene: 'start',


	// Here is the main game control
  init(); //
	initControls();
	console.log("PA03!");
	animate();  // start the animation loop!


	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createEndScene();
			createLoseScene();
			initRenderer();
			createStartScene();
			createMainScene();
	}

	function createStartScene(){
		startScene = initScene();
		startText =createSkyBox2('start_game.jpg', 1); // essentially one side of a box
		//createSkyBox
		startScene.add(startText);
		var light = createPointLight();
		light.position.set(0,200,20);
		startScene.add(light);
		//gameState.scene='start';
		startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		startCamera.position.set(0,50,1);
		startCamera.lookAt(0,0,0);
	}


		function createEndScene(){
			endScene = initScene();
			endText = createSkyBox2('youwon.png',1);
			//endText.rotateX(Math.PI);
			endScene.add(endText);
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			endScene.add(light1);
			endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			endCamera.position.set(0,50,1);
			endCamera.lookAt(0,0,0);

		}

		function createLoseScene(){
			loseScene = initScene();
			loseText = createSkyBox2('youlose.jpeg',1);
			//endText.rotateX(Math.PI);
			loseScene.add(loseText);
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			loseScene.add(light1);
			endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			endCamera.position.set(0,50,1);
			endCamera.lookAt(0,0,0);

		}


	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,50,0);
			camera.lookAt(0,0,0);

			camera3 = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera3.position.set(20,20,30);


			// create the ground and the skybox
			var ground = createGround('grass.png');
			scene.add(ground);
			var skybox = createSkyBox('sky.jpg',1);
			scene.add(skybox);
			var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);// better light
			scene.add(ambientLight);

			// create the avatar
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			avatar = createAvatar();
			avatar.translateY(20);
			avatarCam.translateY(0);
			avatarCam.translateZ(10);
			scene.add(avatar);
			gameState.camera = avatarCam;

			addSheeps();

			//cone = createConeMesh(4,6);
			box = createBoxMesh(2,2);
			box.position.set(10,0,7);
			box.rotateX(Math.PI/2);
			scene.add(box);

			// npc = createNPC();
			// npc.position.set(20,1,10);
			// scene.add(npc);
			npc = createBoxMesh2(0x0000ff,2,2,2);
			npc.position.set(20,5,-20);
      npc.addEventListener('collision',function(other_object){
      if (other_object==avatar){
						//updates the health if avatar obj is touch by the NPC obj
						gameState.health --;

						 if (gameState.health==0) {
						 	gameState.scene='youlose';
						 }
						//Teleport the NPC obj to a random position
						npc.__dirtyPosition = true;
						npc.position.set(randN(50)-25,30,randN(50)-25);//Random

						        }
						      })
		  scene.add(npc);

			cube = createEnemy();
			cube.position.set(-20,5,-20);
			cube.addEventListener('collision',function(other_object){
			      if (other_object==sheep){
									//updates the health if avatar obj is touch by the NPC obj
									gameState.health --;
									soundEffect('foxbark.wav');
									 if (gameState.health==0) {
									 	gameState.scene='youlose';
									 }
								 }
							 })
			scene.add(cube);
			playGameMusic();

	}


	function randN(n){
		return Math.random()*n;
	}
	function addSheeps(){
		var numSheeps = 12;


		for(i=0;i<numSheeps;i++){
			var sheep = createSheeps();
			sheep.position.set(randN(20)+10,0.5,randN(20)+10);
			scene.add(sheep);

			sheep.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==cube){
						console.log("sheep "+i+" hit the box");
						soundEffect('sheep-bleat.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==10) {
							gameState.scene='youwon';
						}
						scene.remove(this);  //why not disapearing??
						// make the ball drop below the scene ..
						// threejs doesn't let us remove it from the schene...

						// this.position.y = this.position.y - 100;
						// this.__dirtyPosition = true;
					}
				}
			)
						sheep.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==box){
						console.log("sheep "+i+" hit the box");
						soundEffect('sheep-bleat.wav');
						gameState.score += 1; 
						if (gameState.score==10) {
							gameState.scene='youwon';
						}
						scene.remove(this);  
					}
				}
			)
		}
	}



	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}



	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}



	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );

		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,1);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.receiveShadow = true;
		mesh.rotateX(Math.PI/2);

		//treetop
		var particleMaterial = new THREE.MeshLambertMaterial();
		particleMaterial.map = THREE.ImageUtils.loadTexture('models/pink.jpg');
		particleMaterial.side = THREE.DoubleSide;
		var jsonLoader = new THREE.JSONLoader();
		jsonLoader.load( "models/treetop.js", function (geometry2) {
			var s = new THREE.Mesh(geometry2, particleMaterial);
			s.rotateX(Math.PI/2*3);
			s.scale.set( 0.4, 0.4, 0.4 );
			s.position.set(25,-25,-15);
			mesh.add(s);
		}
		);

		//tree trunk
		var particleMaterial2 = new THREE.MeshBasicMaterial();
		particleMaterial2.map = THREE.ImageUtils.loadTexture('models/brown.jpg');
		particleMaterial2.side = THREE.DoubleSide;
		var jsonLoader = new THREE.JSONLoader();
		jsonLoader.load( "models/treebody.js", function (geometry2) {
			var s = new THREE.Mesh(geometry2, particleMaterial2);
			s.rotateX(Math.PI/2*3);
			s.scale.set( 0.1, 0.1, 0.1 );
			s.position.set(25,-25,0);
			mesh.add(s);
		}
		);

		//mountains
		var particleMaterial3 = new THREE.MeshBasicMaterial();
		particleMaterial3.map = THREE.ImageUtils.loadTexture('models/Ground_D2.png');
		particleMaterial3.side = THREE.DoubleSide;
		jsonLoader.load( "models/mountain.js", function (geometry2) {
			var s = new THREE.Mesh(geometry2, particleMaterial3);
			var s2 = new THREE.Mesh(geometry2, particleMaterial3);
			s.rotateX(Math.PI/2*3);
			s.scale.set( 2, 2, 2 );
			s.position.set(30,30,0);
			s2.rotateX(Math.PI/2*3);
			s2.scale.set( 2, 2, 2 );
			s2.position.set(40,90,0);
			mesh.add(s);
			mesh.add(s2);
		}
		);

		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}



	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;
		return mesh;
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}

	function createSkyBox2(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.BoxGeometry( 90, 50, 50 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.receiveShadow = false;
		return mesh;
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createAvatar(){
					var geometry = new THREE.BoxGeometry( 3, 3, 6);
					var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
					var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
					pmaterial.visible = false;
					var mesh = new Physijs.BoxMesh( geometry, pmaterial );
					mesh.setDamping(0.1,0.1);
					mesh.castShadow = true;

					avatarCam.position.set(0,8,0);
					avatarCam.lookAt(0,7,10);
					mesh.add(avatarCam);


					var particleMaterial = new THREE.MeshBasicMaterial();
					particleMaterial.map = THREE.ImageUtils.loadTexture('models/dog.jpg');
					particleMaterial.side = THREE.DoubleSide;
					var jsonLoader = new THREE.JSONLoader();
					jsonLoader.load( "models/dog.js", function (geometry2) {
						var fox = new THREE.Mesh(geometry2, particleMaterial);
						mesh.add(fox);
					}
				  );
					//
					// var scoop = createBoxMesh2(0xff0000,5,1,0.1);
					// scoop.position.set(0,-1,2);
					// mesh.add(scoop);
					return mesh;
	}

	function createEnemy(){
					var geometry = new THREE.BoxGeometry( 3, 3, 6);
					var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
					var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
					pmaterial.visible = false;
					var mesh = new Physijs.BoxMesh( geometry, pmaterial );
					mesh.setDamping(0.1,0.1);
					mesh.castShadow = true;

					// avatarCam.position.set(0,8,0);
					// avatarCam.lookAt(0,7,10);
					// mesh.add(avatarCam);

					var particleMaterial = new THREE.MeshBasicMaterial();
					//particleMaterial.map = THREE.ImageUtils.loadTexture('models/dog.jpg');
					particleMaterial.side = THREE.DoubleSide;
					var jsonLoader = new THREE.JSONLoader();
					jsonLoader.load( "models/fox.js", function (geometry2) {
					var fox = new THREE.Mesh(geometry2, particleMaterial);
					mesh.add(fox);
					}
				  );
					return mesh;
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	// function createConeMesh(r,h){
	// 	var geometry = new THREE.ConeGeometry( r, h, 32);
	// 	var texture = new THREE.TextureLoader().load( '../images/tile.jpg' );
	// 	texture.wrapS = THREE.RepeatWrapping;
	// 	texture.wrapT = THREE.RepeatWrapping;
	// 	texture.repeat.set( 1, 1 );
	// 	var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
	// 	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
	// 	var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
	// 	mesh.castShadow = true;
	// 	return mesh;
	// }

	function createBoxMesh(r,h){
		var geometry = new THREE.BoxGeometry( r, h, 10);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		pmaterial.visible = false;
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;

		//center box
		var particleMaterial = new THREE.MeshBasicMaterial();
		particleMaterial.map = THREE.ImageUtils.loadTexture('models/wood.jpg');
		particleMaterial.side = THREE.DoubleSide;
		var jsonLoader = new THREE.JSONLoader();
		jsonLoader.load( "../models/boxChiken.js", function (geometry2) {
			var box = new THREE.Mesh(geometry2, particleMaterial);
			mesh.add(box);
		}
		);

		return mesh;
	}



	// function createBall(){
	// 	//var geometry = new THREE.SphereGeometry( 4, 20, 20);
	// 	var geometry = new THREE.SphereGeometry( 1, 16, 16);
	//
	// 	var friction = 0.8; // high friction
	// 	var restitution = 0.3; // low restitution
	//
	// 	var material = Physijs.createMaterial(
  //   	new THREE.MeshBasicMaterial({ color: 0xffff00 }),
  //   	friction,
  //   	restitution
	// 	);
	//
	// 	//var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
	// 	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
  //   var mesh = new Physijs.BoxMesh( geometry, material );
	// 	mesh.setDamping(0.1,0.1);
	// 	mesh.castShadow = true;
	// 	return mesh;
	// }



	function createSheeps(){

	var geometry = new THREE.BoxGeometry( 2, 2, 6);
	var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
	var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
	pmaterial.visible = false;
	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
	mesh.setDamping(0.1,0.1);
	mesh.castShadow = true;

	var particleMaterial = new THREE.MeshBasicMaterial();
	particleMaterial.map = THREE.ImageUtils.loadTexture('../models/wool.jpg');
	particleMaterial.side = THREE.DoubleSide;
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load( "models/sheep.js", function (geometry2) {
		var sheep = new THREE.Mesh(geometry2, particleMaterial);
		mesh.add(sheep);
	}
	);
	return mesh;

}


	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		console.log("Keydown:"+event.key);
		//console.dir(event);
		// first we handle the "play again" key in the "youwon" scene
		if ((gameState.scene == 'youwon'||gameState.scene == 'lose')&& event.key=='r') {
				gameState.scene = 'start';
				gameState.score = 0;
				gameState.health = 10;
				return;
			}

			if(event.key=='p'){
				gameState.scene = 'main';
				gameState.score = 0;
				gameState.health = 10;
			}

		if (gameState.scene == 'youlose' && event.key=='r') {
			gameState.scene = 'main';
			gameState.score = 0;
			addSheeps();
			return;
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "r": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;
      			case " ": controls.fly = true; break;
      			case "h": controls.reset = true; break;
						case "x": avatar.rotation.set(0,0,0);
						avatar.__dirtyRotation = true;
						console.dir(avatar.rotation);
						break;


			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
			case "3": gameState.camera = camera3; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;
			case "q": avatarCam.rotateY(.15);break;
			case "e": avatarCam.rotateY(-.15);break;
		}

	}

	function keyup(event){
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}
	function updateNPC(){
		npc.lookAt(avatar.position);
		  //npc.__dirtyPosition = true;
		npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(0.8));
	}

	function updateCube(){
		cube.lookAt(avatar.position);
		  //npc.__dirtyPosition = true;
		cube.setLinearVelocity(cube.getWorldDirection().multiplyScalar(1.2));
	}


  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();

		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      avatar.__dirtyPosition = true;
      avatar.position.set(40,10,40);
    }

	}



	function animate() {

		requestAnimationFrame( animate );

		switch(gameState.scene) {
			case "youwon":
				endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;

			case "youlose":
				loseText.rotateY(0.005);
				renderer.render( loseScene, endCamera );
				break;

			case "main":
				updateAvatar();
				updateCube();
				//updateNPC();
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
					camera3.lookAt(avatar.position);
				}
				if (npc.position.distanceTo(avatar.position) < 20){
					updateNPC();
				}
				break;

			case "start":
				// startText.rotateY(0.005);
				renderer.render( startScene, startCamera );
				break;

			default:
			  console.log("don't know the scene "+gameState.scene);

		}

		//draw heads up display ..
	   var info = document.getElementById("info");
info.innerHTML='<div style="font-size:24pt">Score: '+ gameState.score
    + " health="+gameState.health
    + '</div>';

	}
