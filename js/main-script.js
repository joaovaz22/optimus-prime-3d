//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
let scene, renderer;

let activeCamera = 0;
let toggleWireframe = false;
let connectTrailer = false;
let ignoreCollision = false;

const cameras = new Array(5);

const materials = new Map();
const pivots = new Map();

//MEASURES
const Hfoot = 17;
const Lfoot = 42.5;
const Cfoot = 34;

const Hleg = 102;
const Lleg = 25.5;
const Cleg = 34;

const Hwheel = 17;
const Lwheel = 34;
const Cwheel = 34;

const Hthigh = 68;
const Lthigh = 17;
const Cthigh = 17;

const Hhip = 34;
const Lhip = 17 * 2 + 34;
const Chip = 51;

const Hab = 42.5;
const Lab = 34;
const Cab = Chip;

const Hwindow = 25.5;
const Lwindow = 34+8.5;
const Cwindow = 1;

const Hchest = 59.5;
const Lchest = 102;
const Cchest = Chip;

const Hhead = 25.5;
const Lhead = 25.5;
const Chead = 25.5;

const Hforearm = 42.4;
const Lforearm = (Lchest - Lab) / 2//34;
const Cforearm = Cab;

const HexhaustBottom = 17 * 2.5;
const LexhaustBottom = 17 * 0.8;
const CexhaustBottom= 17 * 0.8;

const HexhaustTop = 17 * 1.5;
const LexhaustTop = 17 * 0.5;
const CexhaustTop= 17 * 0.5;

const Harm = 59.5 + 42.4;
const Larm = Lchest/2//42.5;
const Carm = 42.5;

const Heye = 17*0.3;
const Leye = 8.5;
const Ceye = 1;

const Hantenna = 17;
const Lantenna = 1;
const Cantenna = 1;

const Htrailer = Hchest + Hab + Hhip / 2 + 68;
const Ltrailer = Lhip + 2 * Hwheel;
const Ctrailer = 500;
const DtrailerSpacing = 17;

const HattachPiece = 17;
const LattachPiece = 17;
const CattachPiece = 17;

const trailerXSpeed = 4;
const trailerZSpeed = 4;

const robotRotSpeed = 0.05;
const robotFeetRotMax = Math.PI / 2;
const robotLegsRotMax = Math.PI / 2;
const robotHeadRotMax = -(3 * Math.PI) / 4;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));

    createMaterials();

    const robot = createRobot();
    scene.add(robot);

    const trailer = createTrailer();
    trailer.position.set(0, Htrailer / 2 + Cleg / 2 + Lwheel / 2 - Hchest / 2 - Hab - Hhip,-300);
    scene.add(trailer);
}

//////////////////////////
/*   CREATE MATERIALS   */
//////////////////////////

function createMaterials() {
    materials.set("gray", new THREE.MeshBasicMaterial({color: 0x444444, wireframe: false}));
    materials.set("lightBlue", new THREE.MeshBasicMaterial({color: 0xADD8E6, wireframe: false}));
    materials.set("red", new THREE.MeshBasicMaterial({ color: 0xCF0B0B, wireframe: false}));
    materials.set("darkred", new THREE.MeshBasicMaterial({ color: 0xBB0B0B, wireframe: false}));
    materials.set("blue", new THREE.MeshBasicMaterial({ color: 0x00008B, wireframe: false }));
    materials.set("white", new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false }));
    materials.set("silver", new THREE.MeshBasicMaterial({ color: 0xC0C0C0, wireframe: false}));
    materials.set("darksilver", new THREE.MeshBasicMaterial({ color: 0x979799, wireframe: false}));
    materials.set("yellow", new THREE.MeshBasicMaterial({ color: 0xFFFF00, wireframe: false}))
}

//////////////////////
/*   CREATE TRAILER */
//////////////////////

function createTrailer() {
    const trailer = new THREE.Group();
    trailer.name = "trailer";
    trailer.userData = { left: false, right: false, up: false, down: false };

    const trailerBox = new THREE.Mesh(new THREE.CubeGeometry(Ltrailer, Htrailer, Ctrailer), materials.get("silver"));
    trailer.add(trailerBox);

    const wheelSupport = new THREE.Mesh(new THREE.CubeGeometry(Ltrailer, Cleg / 2, Lwheel * 2 + DtrailerSpacing), materials.get("darksilver"));
    wheelSupport.position.set(0, -Htrailer / 2 - (Cleg / 2) / 2, -Ctrailer / 2 + DtrailerSpacing / 2 + Lwheel);
    trailer.add(wheelSupport);

    const attachPiece = new THREE.Mesh(new THREE.CylinderGeometry(LattachPiece / 2, CattachPiece / 2, HattachPiece), materials.get("blue"));
    attachPiece.position.set(0, -Htrailer / 2 - HattachPiece / 2, Ctrailer / 2 - DtrailerSpacing - CattachPiece / 2);
    trailer.add(attachPiece);

    const leftBackWheel = createWheel();
    leftBackWheel.position.set(0, 0, Cwheel);
    const leftFrontWheel = createWheel();

    const leftWheels = new THREE.Group();
    leftWheels.add(leftBackWheel);
    leftWheels.add(leftFrontWheel);
    leftWheels.position.set(-Ltrailer / 2 + Hwheel / 2, -Htrailer / 2 - Cleg / 2 - Lwheel / 2, -Ctrailer / 2 + DtrailerSpacing + Hwheel / 2);

    const rightBackWheel = createWheel();
    rightBackWheel.position.set(0, 0, Cwheel);
    const rightFrontWheel = createWheel();

    const rightWheels = new THREE.Group();
    rightWheels.add(rightBackWheel);
    rightWheels.add(rightFrontWheel);
    rightWheels.position.set(Ltrailer / 2 - Hwheel / 2, -Htrailer / 2 - Cleg / 2 - Lwheel / 2, -Ctrailer / 2 + DtrailerSpacing + Hwheel / 2);

    trailer.add(leftWheels);
    trailer.add(rightWheels);

    return trailer;
}

//////////////////////
/*   CREATE ROBOT   */
//////////////////////

function createRobot() {
    const chest = createChest();
    chest.name = "robot";
    chest.userData = {
        feetRotPositive: false, feetRotNegative: false,
        legsRotPositive: false, legsRotNegative: false,
        armsTransPositive: false, armsTransNegative: false,
        headRotPositive: false, headRotNegative: false
        };
    const head = createHead();

    head.position.set(0,(Hhead/2),-Chead/2);

    const pivot = new THREE.Group();
    pivot.position.set(0,(Hchest/2),0);
    pivot.add(head);
    chest.add(pivot);

    pivots.set("head", pivot);

    return chest;
}

function createHead(){
    const rightEye = new THREE.Mesh(new THREE.CubeGeometry(Leye, Heye, Ceye), materials.get("yellow"));
    rightEye.position.set(-8.5/1.5,8.5/2,(Chead/2));
    const leftEye = new THREE.Mesh(new THREE.CubeGeometry(Leye, Heye, Ceye), materials.get("yellow"));
    leftEye.position.set(8.5/1.5,8.5/2,(Chead/2));

    const rightAntenna = new THREE.Mesh(new THREE.CylinderGeometry(Lantenna, Cantenna, Hantenna), materials.get("blue"));
    rightAntenna.position.set(-Lhead/2 - 1, Hhead/2,0);

    const leftAntenna = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 17), materials.get("blue"));
    leftAntenna.position.set(Lhead/2 + 1, Hhead/2,0);


    const headCube = new THREE.Mesh(new THREE.CubeGeometry(Lhead, Hhead, Chead), materials.get("blue"));
    const head = new THREE.Group();

    head.add(rightEye);
    head.add(leftEye);
    head.add(rightAntenna);
    head.add(leftAntenna);
    head.add(headCube);

    return head;
}

function createChest() {

    const abdomen = createAbdomen();
    abdomen.name = "ab";
    abdomen.position.set(0, -(Hchest/2) - (Hab/2), 0);

    const chestCube = new THREE.Mesh(new THREE.BoxGeometry(Lchest, Hchest, Cchest), materials.get("red"));

    const rightWindow = new THREE.Mesh(new THREE.CubeGeometry(Lwindow, Hwindow, Cwindow), materials.get("lightBlue"));
    rightWindow.position.set(-Lchest/2 + 7 + Lwindow/2, 1, Cchest/2);
    const leftWindow = new THREE.Mesh(new THREE.CubeGeometry(Lwindow, Hwindow, Cwindow), materials.get("lightBlue"));
    leftWindow.position.set(Lchest/2 - 7 - Lwindow/2, 1, Cchest/2);

    const pivotLeft = new THREE.Group();
    const leftArm = createArm(1);
    pivotLeft.add(leftArm);
    pivots.set("leftArm", leftArm);
    const rightArm = createArm(-1);
    const pivotRight = new THREE.Group();
    pivotRight.add(rightArm);
    pivots.set("rightArm", rightArm);

    const chest = new THREE.Group();
    chest.add(rightWindow);
    chest.add(leftWindow);
    chest.add(abdomen);
    chest.add(chestCube);
    chest.add(pivotLeft);
    chest.add(pivotRight);

    return chest;
}

function createArm(multi) {
    //TODO
    const exhaustBottom = new THREE.Mesh(new THREE.CylinderGeometry(LexhaustBottom / 2, CexhaustBottom / 2, HexhaustBottom), materials.get("darksilver"));;
    exhaustBottom.position.set(multi*(-(Larm/2) - LexhaustBottom/2), Hforearm -(Harm/2) + HexhaustBottom/2, CexhaustBottom/2 - Carm/2);

    const exhaustTop = new THREE.Mesh(new THREE.CylinderGeometry(LexhaustTop / 2, CexhaustTop / 2, HexhaustTop), materials.get("silver"));;
    exhaustTop.position.set(multi*(-(Larm/2) - LexhaustTop/2), HexhaustBottom + Hforearm -(Harm/2) + HexhaustTop/2, CexhaustBottom/2 - Carm/2);

    const forearm = new THREE.Mesh(new THREE.CubeGeometry(Lforearm, Hforearm, Cforearm), materials.get("darkred"));
    forearm.position.set(multi * (-(Larm / 2) + (Lforearm / 2)), -(Harm / 2) + (Hforearm / 2), (Carm / 2) + (Cforearm/2) );

    const armCube = new THREE.Mesh(new THREE.CubeGeometry(Larm, Harm, Carm), materials.get("blue"));

    const arm = new THREE.Group();


    arm.add(exhaustBottom);
    arm.add(exhaustTop);
    arm.add(forearm);
    arm.add(armCube);

    arm.position.set(multi * (-(Lchest/2) - (Larm /2)), (Hchest / 2) - (Harm / 2) , -(Cchest / 2) + (Carm / 2));
    return arm;
}

function createAbdomen(){

    const hip = createHip();
    hip.position.set(0, (-Hab/2) - (Hhip / 2), 0);

    const abdomenCube = new THREE.Mesh(new THREE.CubeGeometry(Lab, Hab, Cab), materials.get("red"));

    const abdomen = new THREE.Group();
    abdomen.add(hip);
    abdomen.add(abdomenCube);

    return abdomen;
}

function createHip() {
    const leftLeg = createLeg(1, "left");
    const rightLeg = createLeg(-1, "right");

    const pivot = new THREE.Group();
    pivot.add(leftLeg);
    pivot.add(rightLeg);

    pivots.set("legs", pivot);

    const hipCube = new THREE.Mesh(new THREE.CubeGeometry(Lhip, Hhip, Chip), materials.get("red"));

    const leftWheel = createWheel();
    const rightWheel = createWheel();

    leftWheel.position.set((-Lhip / 2) - Hwheel/2, (-Hhip/2), 0);
    rightWheel.position.set((Lhip / 2) + Hwheel/2, (-Hhip/2), 0);

    const hip = new THREE.Group();
    hip.add(pivot);
    hip.add(hipCube);
    hip.add(leftWheel);
    hip.add(rightWheel);

    return hip;
}

function createLeg(multi, side) {
    //multi 1 = left ; -1 = right

    let foot, backDownWheel, backUpWheel, wheels, legCube, leg, thigh, thighCylinder;

    foot = new THREE.Mesh(new THREE.BoxGeometry(Lfoot, Hfoot, Cfoot), materials.get("blue"));
    foot.position.set(0, Hfoot / 2, Cfoot/2);//(-Lleg / 2) + , (Hfoot / 2) - (Hleg / 2) , Lfoot / 2);

    const pivot = new THREE.Group();
    pivot.add(foot);

    pivot.position.set(multi * (Lleg/2 - Lfoot/2), -Hleg/2, 0);
    pivots.set(side + "Foot", pivot);

    backDownWheel = createWheel();
    backUpWheel = createWheel();

    backDownWheel.position.set(0, (-3 * Lwheel) / 2, 0);

    wheels = new THREE.Group();
    wheels.add(backUpWheel);
    wheels.add(backDownWheel);
    wheels.position.set( multi * ((-Lleg/2) - (Hwheel/2)), (Hleg / 2) - (Lwheel / 2), (Cleg / 2));

    legCube = new THREE.Mesh(new THREE.BoxGeometry(Lleg, Hleg, Cleg), materials.get("blue"));

    leg = new THREE.Group();

    leg.add(wheels);
    leg.add(legCube);
    leg.add(pivot);

    leg.position.set(0, (-Hthigh / 2) - (Hleg/2), 0);


    thighCylinder = new THREE.Mesh(new THREE.CylinderGeometry(Lthigh / 2, Cthigh / 2, Hthigh), materials.get("silver"));
    thigh = new THREE.Group();

    thigh.add(leg);
    thigh.add(thighCylinder);

    thigh.position.set(multi * ((-Lhip/ 2) + (Lleg / 2)), (-Hhip / 2) - (Hthigh/ 2) , 0);

    //objects.set(side + "Leg", thigh);
    return thigh;
    //-----------------------------------------------------------------------------------------------------


}

function createWheel() {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(Lwheel / 2, Cwheel / 2, Hwheel), materials.get("gray"));
    wheel.rotateZ(Math.PI / 2);
    return wheel;
}


//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';
    cameras[0] = new THREE.OrthographicCamera(window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        1,
        5000);
    cameras[0].position.x = 0;
    cameras[0].position.y = 0;
    cameras[0].position.z = 500;
    cameras[0].lookAt(scene.position);

    cameras[1] = new THREE.OrthographicCamera(window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        1,
        5000);
    cameras[1].position.x = 500;
    cameras[1].position.y = 0;
    cameras[1].position.z = 0;
    cameras[1].lookAt(scene.position);

    cameras[2] = new THREE.OrthographicCamera(window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        1,
        5000);
    cameras[2].position.x = 0;
    cameras[2].position.y = 500;
    cameras[2].position.z = 0;
    cameras[2].lookAt(scene.position);

    cameras[3] = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        5000);
    cameras[3].position.x = 200;
    cameras[3].position.y = 200;
    cameras[3].position.z = 200;
    cameras[3].lookAt(scene.position);


    cameras[4] = new THREE.OrthographicCamera(window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        1,
        5000);
    cameras[4].position.x = 500;
    cameras[4].position.y = 500;
    cameras[4].position.z = 500;
    cameras[4].lookAt(scene.position);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
    'use strict';

    if (!isTruckMode())
        return;

    const trailer = scene.getObjectByName("trailer");
    const robot = scene.getObjectByName("robot");

    const robotMin = new THREE.Vector3(
        robot.position.x - Lchest / 2,
        robot.position.y - Hchest / 2 - Hab - Hhip,
        robot.position.z - Chip / 2 - Hthigh - Hleg - Cfoot);
    const robotMax = new THREE.Vector3(
        robot.position.x + Lchest / 2,
        robot.position.y + Hchest / 2,
        robot.position.z + Cchest / 2);
    const trailerMin = new THREE.Vector3(
        trailer.position.x - Ltrailer / 2,
        trailer.position.y - Htrailer / 2,
        trailer.position.z - Ctrailer / 2);
    const trailerMax = new THREE.Vector3(
        trailer.position.x + Ltrailer / 2,
        trailer.position.y + Htrailer / 2,
        trailer.position.z + Ctrailer / 2);

    if (robotMax.x > trailerMin.x
    && robotMin.x < trailerMax.x
    && robotMax.y > trailerMin.y
    && robotMin.y < trailerMax.y
    && robotMax.z > trailerMin.z
    && robotMin.z < trailerMax.z) {
        handleCollisions();
    }
    else {
        ignoreCollision = false;
    }
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';
    if (!ignoreCollision) {
        connectTrailer = true;
        ignoreCollision = true;
    }
}

function isTruckMode() {
    const leftFoot = pivots.get("leftFoot");
    const legs = pivots.get("legs");
    const head = pivots.get("head");
    const rightArm = pivots.get("rightArm");

    if (leftFoot.rotation.x === robotFeetRotMax
    && legs.rotation.x === robotLegsRotMax
    && head.rotation.x === robotHeadRotMax
    && rightArm.position.x === ((Lchest - Larm) / 2)) {
        return true;
    }
    else {
        return false;
    }
}

function moveArms(robot) {

    const leftArm = pivots.get("leftArm");
    const rightArm = pivots.get("rightArm");

    const armMovement = robot.userData.armsTransNegative * 1.0 + robot.userData.armsTransPositive * -1.0;

    const isMiddlePos = leftArm.position.z === ((Carm - Cchest) / 2) - Carm  && leftArm.position.x === (-Lchest/2 - Larm/2);

    if ((leftArm.position.z > ((Carm - Cchest) / 2) - Carm) || (isMiddlePos && armMovement > 0)) {
        leftArm.position.z = Math.min((Carm - Cchest) / 2, Math.max(((Carm - Cchest) / 2) - Carm, leftArm.position.z + (armMovement * 1.5)));
        rightArm.position.z = leftArm.position.z;
    }


    if ((leftArm.position.z === ((Carm - Cchest) / 2) - Carm) || (isMiddlePos && armMovement < 0)) {
        leftArm.position.x = Math.min((-Lchest/2) + (Larm/2), Math.max((-(Lchest + Larm) / 2) , (leftArm.position.x - (armMovement * 1.5))));
        rightArm.position.x = Math.min((Lchest/2) + (Larm/2), Math.max(((Lchest - Larm) / 2), (rightArm.position.x + (armMovement * 1.5))));
    }
}

function rotateFeet(robot) {
    const leftFoot = pivots.get("leftFoot");
    const rightFoot = pivots.get("rightFoot");
    const footRotation = robot.userData.feetRotNegative * -1.0 + robot.userData.feetRotPositive * 1.0;
    leftFoot.rotation.x = Math.max(0, Math.min(robotFeetRotMax, leftFoot.rotation.x + (footRotation * robotRotSpeed)));
    rightFoot.rotation.x = Math.max(0, Math.min(robotFeetRotMax, leftFoot.rotation.x + (footRotation * robotRotSpeed)));
}

function rotateLegs(robot) {
    const legs = pivots.get("legs");
    const legsRotation = robot.userData.legsRotNegative * -1.0 + robot.userData.legsRotPositive * 1.0;
    legs.rotation.x = Math.max(0, Math.min(robotLegsRotMax, legs.rotation.x + (legsRotation * robotRotSpeed)));
}

function rotateHead(robot) {
    const head = pivots.get("head");
    const headRotation = robot.userData.headRotNegative * 1.0 + robot.userData.headRotPositive * -1.0;
    head.rotation.x = Math.max(robotHeadRotMax, Math.min(0, head.rotation.x + (headRotation * robotRotSpeed)));
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

    checkCollisions();

    if (toggleWireframe) {
        materials.forEach((material, key) => {
            material.wireframe = !material.wireframe;
        });
        toggleWireframe = false;
    }

    const trailer = scene.getObjectByName("trailer");
    const robot = scene.getObjectByName("robot");
    if (connectTrailer) {
        trailer.position.lerp(new THREE.Vector3(0, trailer.position.y, -Cchest / 2 - Hthigh - Ctrailer / 2), 0.03);

        if (trailer.position.distanceTo(new THREE.Vector3(0, trailer.position.y, -Cchest / 2 - Hthigh - Ctrailer / 2)) < 0.2) {
            connectTrailer = false;
        }
    }
    else {
        const xMovement = trailer.userData.left * -1.0 + trailer.userData.right * 1.0;
        const zMovement = trailer.userData.up * -1.0 + trailer.userData.down * 1.0;
        trailer.position.x += xMovement * trailerXSpeed;
        trailer.position.z += zMovement * trailerZSpeed;



        rotateFeet(robot);


        rotateLegs(robot);


        rotateHead(robot);

        moveArms(robot);
    }
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';

    renderer.render(scene, cameras[activeCamera]);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xADD8E6);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCameras();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    update();

    render();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        let camera;
        for (camera in cameras) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    const trailer = scene.getObjectByName("trailer");
    const robot = scene.getObjectByName("robot");
    switch (e.keyCode) {
        case 37: // Left Arrow - Move trailer
            trailer.userData.right = true;
            break;
        case 38: // Up Arrow - Move trailer
            trailer.userData.down = true;
            break;
        case 39: // Right Arrow - Move trailer
            trailer.userData.left = true;
            break;
        case 40: // Down Arrow - Move trailer
            trailer.userData.up = true;
            break;
        case 49: // 1 - Switch to frontal camera
            activeCamera = 0;
            break;
        case 50: // 2 - Switch to side camera
            activeCamera = 1;
            break;
        case 51: // 3 - Switch to top camera
            activeCamera = 2;
            break;
        case 52: // 4 - Switch to isometric orthographic camera
            activeCamera = 3;
            break;
        case 53: // 5 - Switch to isometric perspective camera
            activeCamera = 4;
            break;
        case 54: // 6 - Toggle wireframe
            toggleWireframe = true;
            break;
        case 81: // Q
        case 113: // q - Robot feet rotation positive
            robot.userData.feetRotPositive = true;
            break;
        case 65: // A
        case 97: // a - Robot feet rotation negative
            robot.userData.feetRotNegative = true;
            break;
        case 87: // W
        case 119: // w - Robot legs rotation positive
            robot.userData.legsRotPositive = true;
            break;
        case 83: // S
        case 115: // s - Robot legs rotation negative
            robot.userData.legsRotNegative = true;
            break;
        case 69: // E
        case 101: // e - Robot arms translation positive
            robot.userData.armsTransPositive = true;
            break;
        case 68: // D
        case 100: // d - Robot arms translation negative
            robot.userData.armsTransNegative = true;
            break;
        case 82: // R
        case 114: // r - Robot head rotation positive
            robot.userData.headRotPositive = true;
            break;
        case 70: // F
        case 102: // f - Robot head rotation negative
            robot.userData.headRotNegative = true;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    const trailer = scene.getObjectByName("trailer");
    const robot = scene.getObjectByName("robot");
    switch (e.keyCode) {
        case 37: // Left Arrow - Move trailer
            trailer.userData.right = false;
            break;
        case 38: // Up Arrow - Move trailer
            trailer.userData.down = false;
            break;
        case 39: // Right Arrow - Move trailer
            trailer.userData.left = false;
            break;
        case 40: // Down Arrow - Move trailer
            trailer.userData.up = false;
            break;
        case 81: // Q
        case 113: // q - Robot feet rotation positive
            robot.userData.feetRotPositive = false;
            break;
        case 65: // A
        case 97: // a - Robot feet rotation negative
            robot.userData.feetRotNegative = false;
            break;
        case 87: // W
        case 119: // w - Robot legs rotation positive
            robot.userData.legsRotPositive = false;
            break;
        case 83: // S
        case 115: // s - Robot legs rotation negative
            robot.userData.legsRotNegative = false;
            break;
        case 69: // E
        case 101: // e - Robot arms translation positive
            robot.userData.armsTransPositive = false;
            break;
        case 68: // D
        case 100: // d - Robot arms translation negative
            robot.userData.armsTransNegative = false;
            break;
        case 82: // R
        case 114: // r - Robot head rotation positive
            robot.userData.headRotPositive = false;
            break;
        case 70: // F
        case 102: // f - Robot head rotation negative
            robot.userData.headRotNegative = false;
            break;
    }
}
