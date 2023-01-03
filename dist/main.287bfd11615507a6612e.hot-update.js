self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three_globe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three-globe */ "./node_modules/three-globe/dist/three-globe.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_glow_mesh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three-glow-mesh */ "./node_modules/three-glow-mesh/dist/index.module.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
/* harmony import */ var _files_my_flights_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./files/my-flights.json */ "./src/files/my-flights.json");
/* harmony import */ var _files_airports_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./files/airports.json */ "./src/files/airports.json");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! firebase/app */ "./node_modules/firebase/app/dist/esm/index.esm.js");
/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! firebase/database */ "./node_modules/firebase/database/dist/esm/index.esm.js");













const firebaseConfig = {
    apiKey: "AIzaSyBRFfzG9iZizxpGkzj4QDfTAH38X19bzr4",
    authDomain: "planes-5759d.firebaseapp.com",
    databaseURL: "https://planes-5759d-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "planes-5759d",
    storageBucket: "planes-5759d.appspot.com",
    messagingSenderId: "202706438007",
    appId: "1:202706438007:web:27beaca9008bf541250372",
    measurementId: "G-C58X00VKZ2"
};

const app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_5__.initializeApp)(firebaseConfig);
const db = (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.getDatabase)();

var renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;
let airports = []
let textObjs = [];

init();
initGlobe();
onWindowResize();
animate();

// SECTION Initializing core ThreeJS elements
function init() {
    // Initialize renderer
    renderer = new three__WEBPACK_IMPORTED_MODULE_7__.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // Initialize scene, light
    scene = new three__WEBPACK_IMPORTED_MODULE_7__.Scene();
    scene.add(new three__WEBPACK_IMPORTED_MODULE_7__.AmbientLight(0xbbbbbb, 0.3));
    scene.background = new three__WEBPACK_IMPORTED_MODULE_7__.Color(0x040d21);

    // Initialize camera, light
    camera = new three__WEBPACK_IMPORTED_MODULE_7__.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    var dLight = new three__WEBPACK_IMPORTED_MODULE_7__.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(-800, 2000, 400);
    camera.add(dLight);

    var dLight1 = new three__WEBPACK_IMPORTED_MODULE_7__.DirectionalLight(0x7982f6, 1);
    dLight1.position.set(-200, 500, 200);
    camera.add(dLight1);

    var dLight2 = new three__WEBPACK_IMPORTED_MODULE_7__.PointLight(0x8566cc, 0.5);
    dLight2.position.set(-200, 500, 200);
    camera.add(dLight2);

    camera.position.z = 400;
    camera.position.x = 0;
    camera.position.y = 0;

    scene.add(camera);

    // Additional effects
    scene.fog = new three__WEBPACK_IMPORTED_MODULE_7__.Fog(0x535ef3, 400, 2000);

    // Helpers
    // const axesHelper = new AxesHelper(800);
    // scene.add(axesHelper);
    // var helper = new DirectionalLightHelper(dLight);
    // scene.add(helper);
    // var helperCamera = new CameraHelper(dLight.shadow.camera);
    // scene.add(helperCamera);

    // Initialize controls
    controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_8__.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dynamicDampingFactor = 0.01;
    controls.enablePan = false;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1;
    controls.autoRotate = false;

    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("mousemove", onMouseMove);

}






async function getAirportDataFromCache() {
    const db = (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.getDatabase)();
    const chaceRef = (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.ref)(db);

    return new Promise((resolve, reject) => {
        (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.get)((0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.child)(chaceRef, 'cache')).then(async(snapshot) => {
            const cache = snapshot.val();
            console.log(cache && cache.timestamp && cache.timestamp > Date.now() - 24 * 60 * 60 * 1000, "bruh")
            if (cache && cache.timestamp && cache.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
                console.log("cached");
                resolve(cache.data);
            } else {
                console.log("not cached")
                    // const data = await getAirportData();
                console.log(data)
                ;(0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.set)((0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.ref)(db, 'cache'), {
                    data: data,
                    timestamp: Date.now(),
                });

                resolve(data);
            }
        });
    });
}



async function getAirportData() {
    const apiKey = '254547cd-b3df-4d55-8676-ddb0a4dc0a63';
    const baseUrl = 'https://airlabs.co/api/v9';

    const [departure, arrival] = await Promise.all([
        axios__WEBPACK_IMPORTED_MODULE_9__.default.get(`${baseUrl}/schedules?dep_iata=PRN&api_key=${apiKey}`),
        axios__WEBPACK_IMPORTED_MODULE_9__.default.get(`${baseUrl}/schedules?arr_iata=PRN&api_key=${apiKey}`)
    ]);

    const airportCodes = departure.data.response.map((flight) => flight.arr_icao);
    const arrivalCodes = arrival.data.response.map((flight) => flight.dep_icao);
    const prishtinaCode = arrival.data.response.map((flight) => flight.arr_icao);
    const allCodes = [...new Set([...airportCodes, ...arrivalCodes, ...prishtinaCode])];

    const allFlights = [...departure.data.response, ...arrival.data.response];
    const airportData = await Promise.all(allCodes.map(async(airport) => {
        // const response = await axios.get(`${baseUrl}/airports?iata_code=${airport}&api_key=${apiKey}`);
        const response = _files_airports_json__WEBPACK_IMPORTED_MODULE_4__[airport];
        console.log(response);
        const refinedAirport = {
            text: response['iata'],
            size: 1.0,
            country: response['state'],
            city: response['city'],
            lat: response['lat'],
            lng: response['lon'],
        };
        return refinedAirport;
    }));

    return { allFlights, airportData };
}


// SECTION Globe
function initGlobe() {
    // Initialize the Globe
    Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
            waitForGlobeReady: true,
            animateIn: true,
        })
        .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(true)
        .atmosphereColor("#3a228a")
        .atmosphereAltitude(0.25)

    // NOTE Arc animations are followed after the globe enters the scene
    setTimeout(() => {

    }, 1000);

    getAirportDataFromCache().then((data) => {
        console.log(data, 'test')
        let refinedAirports = data.airportData
        let allFlights = data.allFlights;
        Globe.pointsData(refinedAirports)
        Globe.labelsData(refinedAirports)
        let countries = []
        refinedAirports.forEach((airport) => {
            countries.push(airport.country)
        })
        Globe.hexPolygonColor((e) => {
            if (
                countries.includes(
                    e.properties.ISO_A2
                )
            ) {
                return "rgba(255,255,255, 1)";
            } else return "rgba(255,255,255, 0.4)";
        });
        let latLongData = {}

        refinedAirports.forEach((airport) => {
            latLongData[airport.text] = [airport.lat, airport.lng]
        })

        console.log(latLongData, "latlong")

        let flights = []
        let arcAlt = 0.05;
        let order = 0;
        console.log(allFlights)
        allFlights.sort((a, b) => {
            let c = new Date(a.dep_time)
            let d = new Date(b.dep_time)
            return c.getTime() - d.getTime()
        });

        allFlights.forEach(flight => {
            order += 4;
            flights.push({
                "type": "flight",
                "order": order,
                "from": flight.dep_iata,
                "to": flight.arr_iata,
                "flightCode": flight.cs_flight_iata,
                "date": flight.dep_time,
                "status": true,
                "startLat": latLongData[flight.dep_iata][0],
                "startLng": latLongData[flight.dep_iata][1],
                "endLat": latLongData[flight.arr_iata][0],
                "endLng": latLongData[flight.arr_iata][1],
                "arcAlt": arcAlt
            })
            arcAlt += 0.03;
        })

        console.log(flights, "important")

        Globe.arcsData(flights)
            .arcColor((e) => {
                return e.status ? "#9cff00" : "#FF4000";
            })
            .arcAltitude((e) => {
                return e.arcAlt;
            })
            .arcStroke((e) => {
                return e.status ? 0.5 : 0.3;
            })
            .arcDashLength(0.9)
            .arcDashGap(4)
            .arcDashAnimateTime(1000)
            .arcsTransitionDuration(1000)
            .arcDashInitialGap((e) => e.order * 1)
            .labelColor(() => "#ffcb21")
            .labelDotOrientation((e) => {
                return e.text === "ALA" ? "top" : "right";
            })
            .labelDotRadius(0.3)
            .labelSize((e) => e.size)
            .labelText("city")
            .labelResolution(6)
            .labelAltitude(0.01)
            .pointColor(() => "#ffffff")
            .pointsMerge(true)
            .pointAltitude(0.07)
            .pointRadius(0.05);

        let texts = [];
        flights.forEach((flight) => {
            texts.push(flight['from'] + "-" + flight['to'])
        })
        const loader = new three__WEBPACK_IMPORTED_MODULE_7__.FontLoader();
        loader.load('./font.json', function(font) {
            const color = 0x006699;
            const matLite = new three__WEBPACK_IMPORTED_MODULE_7__.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.4,
                side: three__WEBPACK_IMPORTED_MODULE_7__.DoubleSide
            });
            texts.forEach((planeText) => {
                const message = planeText;
                const shapes = font.generateShapes(message, 100);
                const geometry = new three__WEBPACK_IMPORTED_MODULE_7__.ShapeGeometry(shapes);
                geometry.center();
                const text = new three__WEBPACK_IMPORTED_MODULE_7__.Mesh(geometry, matLite);
                text.position.z = -150;
                text.material.opacity = 0;
                text.material.transparent = true;
                textObjs.push(text);
                scene.add(text);
                loopThrough()
            })

        });


    });

    Globe.rotateY(-Math.PI * (5 / 18));
    Globe.rotateZ(-Math.PI / 6);
    const globeMaterial = Globe.globeMaterial();
    globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_7__.Color(0x3a228a);
    globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_7__.Color(0x220038);
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.7;

    // NOTE Cool stuff
    // globeMaterial.wireframe = true;

    scene.add(Globe);

    // scene.add(sprite);
}

let textIndex = 0;

function loopThrough() {
    textObjs[textIndex].opacity = 1;
    textIndex++;
    setTimeout(loopThrough, 4000)
}

function onMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    // console.log("x: " + mouseX + " y: " + mouseY);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    windowHalfX = window.innerWidth / 1.5;
    windowHalfY = window.innerHeight / 1.5;
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    camera.position.x +=
        Math.abs(mouseX) <= windowHalfX / 2 ?
        (mouseX / 2 - camera.position.x) * 0.005 :
        0;
    camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
    camera.lookAt(scene.position);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "685cfed09cad96345808"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQUNkO0FBYWhCO0FBQzhEO0FBQzVCO0FBQ0c7QUFDQTtBQUNKO0FBQ3RCO0FBQ21CO0FBQ3lCOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLDJEQUFhO0FBQ3pCLFdBQVcsOERBQVc7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHdDQUFLO0FBQ3JCLGtCQUFrQiwrQ0FBWTtBQUM5QiwyQkFBMkIsd0NBQUs7O0FBRWhDO0FBQ0EsaUJBQWlCLG9EQUFpQjtBQUNsQztBQUNBOztBQUVBLHFCQUFxQixtREFBZ0I7QUFDckM7QUFDQTs7QUFFQSxzQkFBc0IsbURBQWdCO0FBQ3RDO0FBQ0E7O0FBRUEsc0JBQXNCLDZDQUFVO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esb0JBQW9CLHNDQUFHOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQix1RkFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7OztBQU9BO0FBQ0EsZUFBZSw4REFBVztBQUMxQixxQkFBcUIsc0RBQUc7O0FBRXhCO0FBQ0EsUUFBUSxzREFBRyxDQUFDLHdEQUFLO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHVEQUFHLENBQUMsc0RBQUc7QUFDdkI7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7Ozs7QUFJQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLDhDQUFTLElBQUksUUFBUSxrQ0FBa0MsT0FBTztBQUN0RSxRQUFRLDhDQUFTLElBQUksUUFBUSxrQ0FBa0MsT0FBTztBQUN0RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0NBQStDLFFBQVEsc0JBQXNCLFFBQVEsV0FBVyxPQUFPO0FBQ3ZHLHlCQUF5QixpREFBVztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsWUFBWTtBQUNaOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZ0RBQVU7QUFDMUI7QUFDQTtBQUNBLFNBQVM7QUFDVCx5QkFBeUIsZ0VBQWtCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCwyQkFBMkIsNkNBQVU7QUFDckM7QUFDQTtBQUNBLGdDQUFnQyxvREFBdUI7QUFDdkQ7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDZDQUFnQjtBQUN0QyxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLGdEQUFtQjtBQUN4RDtBQUNBLGlDQUFpQyx1Q0FBVTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViLFNBQVM7OztBQUdULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHdDQUFLO0FBQ25DLGlDQUFpQyx3Q0FBSztBQUN0QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7O1dDclhBLG9EIiwiZmlsZSI6Im1haW4uMjg3YmZkMTE2MTU1MDdhNjYxMmUuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcbmltcG9ydCB7XG4gICAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gICAgQW1iaWVudExpZ2h0LFxuICAgIERpcmVjdGlvbmFsTGlnaHQsXG4gICAgQ29sb3IsXG4gICAgRm9nLFxuICAgIC8vIEF4ZXNIZWxwZXIsXG4gICAgLy8gRGlyZWN0aW9uYWxMaWdodEhlbHBlcixcbiAgICAvLyBDYW1lcmFIZWxwZXIsXG4gICAgUG9pbnRMaWdodCxcbiAgICBTcGhlcmVHZW9tZXRyeSxcbiAgICBGb250TG9hZGVyXG59IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlR2xvd01lc2ggfSBmcm9tIFwidGhyZWUtZ2xvdy1tZXNoXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjtcbmltcG9ydCB0cmF2ZWxIaXN0b3J5IGZyb20gXCIuL2ZpbGVzL215LWZsaWdodHMuanNvblwiO1xuaW1wb3J0IGFsbEFpcnBvcnRzIGZyb20gXCIuL2ZpbGVzL2FpcnBvcnRzLmpzb25cIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCB7IGluaXRpYWxpemVBcHAgfSBmcm9tIFwiZmlyZWJhc2UvYXBwXCI7XG5pbXBvcnQgeyBnZXREYXRhYmFzZSwgcmVmLCBzZXQsIGdldCwgY2hpbGQgfSBmcm9tIFwiZmlyZWJhc2UvZGF0YWJhc2VcIjtcblxuY29uc3QgZmlyZWJhc2VDb25maWcgPSB7XG4gICAgYXBpS2V5OiBcIkFJemFTeUJSRmZ6RzlpWml6eHBHa3pqNFFEZlRBSDM4WDE5YnpyNFwiLFxuICAgIGF1dGhEb21haW46IFwicGxhbmVzLTU3NTlkLmZpcmViYXNlYXBwLmNvbVwiLFxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vcGxhbmVzLTU3NTlkLWRlZmF1bHQtcnRkYi5ldXJvcGUtd2VzdDEuZmlyZWJhc2VkYXRhYmFzZS5hcHBcIixcbiAgICBwcm9qZWN0SWQ6IFwicGxhbmVzLTU3NTlkXCIsXG4gICAgc3RvcmFnZUJ1Y2tldDogXCJwbGFuZXMtNTc1OWQuYXBwc3BvdC5jb21cIixcbiAgICBtZXNzYWdpbmdTZW5kZXJJZDogXCIyMDI3MDY0MzgwMDdcIixcbiAgICBhcHBJZDogXCIxOjIwMjcwNjQzODAwNzp3ZWI6MjdiZWFjYTkwMDhiZjU0MTI1MDM3MlwiLFxuICAgIG1lYXN1cmVtZW50SWQ6IFwiRy1DNThYMDBWS1oyXCJcbn07XG5cbmNvbnN0IGFwcCA9IGluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xuY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuXG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5sZXQgYWlycG9ydHMgPSBbXVxubGV0IHRleHRPYmpzID0gW107XG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemUgcmVuZGVyZXJcbiAgICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgLy8gcmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgIC8vIEluaXRpYWxpemUgc2NlbmUsIGxpZ2h0XG4gICAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDA0MGQyMSk7XG5cbiAgICAvLyBJbml0aWFsaXplIGNhbWVyYSwgbGlnaHRcbiAgICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gICAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gICAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICAgIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gICAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICAgIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICAgIHNjZW5lLmFkZChjYW1lcmEpO1xuXG4gICAgLy8gQWRkaXRpb25hbCBlZmZlY3RzXG4gICAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICAgIC8vIEhlbHBlcnNcbiAgICAvLyBjb25zdCBheGVzSGVscGVyID0gbmV3IEF4ZXNIZWxwZXIoODAwKTtcbiAgICAvLyBzY2VuZS5hZGQoYXhlc0hlbHBlcik7XG4gICAgLy8gdmFyIGhlbHBlciA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyKGRMaWdodCk7XG4gICAgLy8gc2NlbmUuYWRkKGhlbHBlcik7XG4gICAgLy8gdmFyIGhlbHBlckNhbWVyYSA9IG5ldyBDYW1lcmFIZWxwZXIoZExpZ2h0LnNoYWRvdy5jYW1lcmEpO1xuICAgIC8vIHNjZW5lLmFkZChoZWxwZXJDYW1lcmEpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBjb250cm9sc1xuICAgIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gICAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gICAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gICAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gICAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gICAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG5cbiAgICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcblxufVxuXG5cblxuXG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWlycG9ydERhdGFGcm9tQ2FjaGUoKSB7XG4gICAgY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuICAgIGNvbnN0IGNoYWNlUmVmID0gcmVmKGRiKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGdldChjaGlsZChjaGFjZVJlZiwgJ2NhY2hlJykpLnRoZW4oYXN5bmMoc25hcHNob3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gc25hcHNob3QudmFsKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYWNoZSAmJiBjYWNoZS50aW1lc3RhbXAgJiYgY2FjaGUudGltZXN0YW1wID4gRGF0ZS5ub3coKSAtIDI0ICogNjAgKiA2MCAqIDEwMDAsIFwiYnJ1aFwiKVxuICAgICAgICAgICAgaWYgKGNhY2hlICYmIGNhY2hlLnRpbWVzdGFtcCAmJiBjYWNoZS50aW1lc3RhbXAgPiBEYXRlLm5vdygpIC0gMjQgKiA2MCAqIDYwICogMTAwMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FjaGVkXCIpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY2FjaGUuZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IGNhY2hlZFwiKVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBkYXRhID0gYXdhaXQgZ2V0QWlycG9ydERhdGEoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgIHNldChyZWYoZGIsICdjYWNoZScpLCB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWlycG9ydERhdGEoKSB7XG4gICAgY29uc3QgYXBpS2V5ID0gJzI1NDU0N2NkLWIzZGYtNGQ1NS04Njc2LWRkYjBhNGRjMGE2Myc7XG4gICAgY29uc3QgYmFzZVVybCA9ICdodHRwczovL2FpcmxhYnMuY28vYXBpL3Y5JztcblxuICAgIGNvbnN0IFtkZXBhcnR1cmUsIGFycml2YWxdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2RlcF9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApLFxuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2Fycl9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApXG4gICAgXSk7XG5cbiAgICBjb25zdCBhaXJwb3J0Q29kZXMgPSBkZXBhcnR1cmUuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmFycl9pY2FvKTtcbiAgICBjb25zdCBhcnJpdmFsQ29kZXMgPSBhcnJpdmFsLmRhdGEucmVzcG9uc2UubWFwKChmbGlnaHQpID0+IGZsaWdodC5kZXBfaWNhbyk7XG4gICAgY29uc3QgcHJpc2h0aW5hQ29kZSA9IGFycml2YWwuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmFycl9pY2FvKTtcbiAgICBjb25zdCBhbGxDb2RlcyA9IFsuLi5uZXcgU2V0KFsuLi5haXJwb3J0Q29kZXMsIC4uLmFycml2YWxDb2RlcywgLi4ucHJpc2h0aW5hQ29kZV0pXTtcblxuICAgIGNvbnN0IGFsbEZsaWdodHMgPSBbLi4uZGVwYXJ0dXJlLmRhdGEucmVzcG9uc2UsIC4uLmFycml2YWwuZGF0YS5yZXNwb25zZV07XG4gICAgY29uc3QgYWlycG9ydERhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChhbGxDb2Rlcy5tYXAoYXN5bmMoYWlycG9ydCkgPT4ge1xuICAgICAgICAvLyBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgJHtiYXNlVXJsfS9haXJwb3J0cz9pYXRhX2NvZGU9JHthaXJwb3J0fSZhcGlfa2V5PSR7YXBpS2V5fWApO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGFsbEFpcnBvcnRzW2FpcnBvcnRdO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgIGNvbnN0IHJlZmluZWRBaXJwb3J0ID0ge1xuICAgICAgICAgICAgdGV4dDogcmVzcG9uc2VbJ2lhdGEnXSxcbiAgICAgICAgICAgIHNpemU6IDEuMCxcbiAgICAgICAgICAgIGNvdW50cnk6IHJlc3BvbnNlWydzdGF0ZSddLFxuICAgICAgICAgICAgY2l0eTogcmVzcG9uc2VbJ2NpdHknXSxcbiAgICAgICAgICAgIGxhdDogcmVzcG9uc2VbJ2xhdCddLFxuICAgICAgICAgICAgbG5nOiByZXNwb25zZVsnbG9uJ10sXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWZpbmVkQWlycG9ydDtcbiAgICB9KSk7XG5cbiAgICByZXR1cm4geyBhbGxGbGlnaHRzLCBhaXJwb3J0RGF0YSB9O1xufVxuXG5cbi8vIFNFQ1RJT04gR2xvYmVcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgICAvLyBJbml0aWFsaXplIHRoZSBHbG9iZVxuICAgIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgICAgICAgICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRlSW46IHRydWUsXG4gICAgICAgIH0pXG4gICAgICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgICAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAgICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgICAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAgICAgLmF0bW9zcGhlcmVDb2xvcihcIiMzYTIyOGFcIilcbiAgICAgICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuXG4gICAgLy8gTk9URSBBcmMgYW5pbWF0aW9ucyBhcmUgZm9sbG93ZWQgYWZ0ZXIgdGhlIGdsb2JlIGVudGVycyB0aGUgc2NlbmVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcblxuICAgIH0sIDEwMDApO1xuXG4gICAgZ2V0QWlycG9ydERhdGFGcm9tQ2FjaGUoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEsICd0ZXN0JylcbiAgICAgICAgbGV0IHJlZmluZWRBaXJwb3J0cyA9IGRhdGEuYWlycG9ydERhdGFcbiAgICAgICAgbGV0IGFsbEZsaWdodHMgPSBkYXRhLmFsbEZsaWdodHM7XG4gICAgICAgIEdsb2JlLnBvaW50c0RhdGEocmVmaW5lZEFpcnBvcnRzKVxuICAgICAgICBHbG9iZS5sYWJlbHNEYXRhKHJlZmluZWRBaXJwb3J0cylcbiAgICAgICAgbGV0IGNvdW50cmllcyA9IFtdXG4gICAgICAgIHJlZmluZWRBaXJwb3J0cy5mb3JFYWNoKChhaXJwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb3VudHJpZXMucHVzaChhaXJwb3J0LmNvdW50cnkpXG4gICAgICAgIH0pXG4gICAgICAgIEdsb2JlLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGNvdW50cmllcy5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICAgICAgZS5wcm9wZXJ0aWVzLklTT19BMlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDEpXCI7XG4gICAgICAgICAgICB9IGVsc2UgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMC40KVwiO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGxhdExvbmdEYXRhID0ge31cblxuICAgICAgICByZWZpbmVkQWlycG9ydHMuZm9yRWFjaCgoYWlycG9ydCkgPT4ge1xuICAgICAgICAgICAgbGF0TG9uZ0RhdGFbYWlycG9ydC50ZXh0XSA9IFthaXJwb3J0LmxhdCwgYWlycG9ydC5sbmddXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc29sZS5sb2cobGF0TG9uZ0RhdGEsIFwibGF0bG9uZ1wiKVxuXG4gICAgICAgIGxldCBmbGlnaHRzID0gW11cbiAgICAgICAgbGV0IGFyY0FsdCA9IDAuMDU7XG4gICAgICAgIGxldCBvcmRlciA9IDA7XG4gICAgICAgIGNvbnNvbGUubG9nKGFsbEZsaWdodHMpXG4gICAgICAgIGFsbEZsaWdodHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgbGV0IGMgPSBuZXcgRGF0ZShhLmRlcF90aW1lKVxuICAgICAgICAgICAgbGV0IGQgPSBuZXcgRGF0ZShiLmRlcF90aW1lKVxuICAgICAgICAgICAgcmV0dXJuIGMuZ2V0VGltZSgpIC0gZC5nZXRUaW1lKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWxsRmxpZ2h0cy5mb3JFYWNoKGZsaWdodCA9PiB7XG4gICAgICAgICAgICBvcmRlciArPSA0O1xuICAgICAgICAgICAgZmxpZ2h0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmbGlnaHRcIixcbiAgICAgICAgICAgICAgICBcIm9yZGVyXCI6IG9yZGVyLFxuICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBmbGlnaHQuZGVwX2lhdGEsXG4gICAgICAgICAgICAgICAgXCJ0b1wiOiBmbGlnaHQuYXJyX2lhdGEsXG4gICAgICAgICAgICAgICAgXCJmbGlnaHRDb2RlXCI6IGZsaWdodC5jc19mbGlnaHRfaWF0YSxcbiAgICAgICAgICAgICAgICBcImRhdGVcIjogZmxpZ2h0LmRlcF90aW1lLFxuICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJzdGFydExhdFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzBdLFxuICAgICAgICAgICAgICAgIFwic3RhcnRMbmdcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVsxXSxcbiAgICAgICAgICAgICAgICBcImVuZExhdFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzBdLFxuICAgICAgICAgICAgICAgIFwiZW5kTG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMV0sXG4gICAgICAgICAgICAgICAgXCJhcmNBbHRcIjogYXJjQWx0XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgYXJjQWx0ICs9IDAuMDM7XG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc29sZS5sb2coZmxpZ2h0cywgXCJpbXBvcnRhbnRcIilcblxuICAgICAgICBHbG9iZS5hcmNzRGF0YShmbGlnaHRzKVxuICAgICAgICAgICAgLmFyY0NvbG9yKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gXCIjOWNmZjAwXCIgOiBcIiNGRjQwMDBcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXJjQWx0aXR1ZGUoKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5hcmNBbHQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFyY1N0cm9rZSgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLnN0YXR1cyA/IDAuNSA6IDAuMztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXJjRGFzaExlbmd0aCgwLjkpXG4gICAgICAgICAgICAuYXJjRGFzaEdhcCg0KVxuICAgICAgICAgICAgLmFyY0Rhc2hBbmltYXRlVGltZSgxMDAwKVxuICAgICAgICAgICAgLmFyY3NUcmFuc2l0aW9uRHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgIC5hcmNEYXNoSW5pdGlhbEdhcCgoZSkgPT4gZS5vcmRlciAqIDEpXG4gICAgICAgICAgICAubGFiZWxDb2xvcigoKSA9PiBcIiNmZmNiMjFcIilcbiAgICAgICAgICAgIC5sYWJlbERvdE9yaWVudGF0aW9uKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUudGV4dCA9PT0gXCJBTEFcIiA/IFwidG9wXCIgOiBcInJpZ2h0XCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmxhYmVsRG90UmFkaXVzKDAuMylcbiAgICAgICAgICAgIC5sYWJlbFNpemUoKGUpID0+IGUuc2l6ZSlcbiAgICAgICAgICAgIC5sYWJlbFRleHQoXCJjaXR5XCIpXG4gICAgICAgICAgICAubGFiZWxSZXNvbHV0aW9uKDYpXG4gICAgICAgICAgICAubGFiZWxBbHRpdHVkZSgwLjAxKVxuICAgICAgICAgICAgLnBvaW50Q29sb3IoKCkgPT4gXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAucG9pbnRzTWVyZ2UodHJ1ZSlcbiAgICAgICAgICAgIC5wb2ludEFsdGl0dWRlKDAuMDcpXG4gICAgICAgICAgICAucG9pbnRSYWRpdXMoMC4wNSk7XG5cbiAgICAgICAgbGV0IHRleHRzID0gW107XG4gICAgICAgIGZsaWdodHMuZm9yRWFjaCgoZmxpZ2h0KSA9PiB7XG4gICAgICAgICAgICB0ZXh0cy5wdXNoKGZsaWdodFsnZnJvbSddICsgXCItXCIgKyBmbGlnaHRbJ3RvJ10pXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBGb250TG9hZGVyKCk7XG4gICAgICAgIGxvYWRlci5sb2FkKCcuL2ZvbnQuanNvbicsIGZ1bmN0aW9uKGZvbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gMHgwMDY2OTk7XG4gICAgICAgICAgICBjb25zdCBtYXRMaXRlID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC40LFxuICAgICAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGV4dHMuZm9yRWFjaCgocGxhbmVUZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHBsYW5lVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZXMgPSBmb250LmdlbmVyYXRlU2hhcGVzKG1lc3NhZ2UsIDEwMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeShzaGFwZXMpO1xuICAgICAgICAgICAgICAgIGdlb21ldHJ5LmNlbnRlcigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0TGl0ZSk7XG4gICAgICAgICAgICAgICAgdGV4dC5wb3NpdGlvbi56ID0gLTE1MDtcbiAgICAgICAgICAgICAgICB0ZXh0Lm1hdGVyaWFsLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgIHRleHQubWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRleHRPYmpzLnB1c2godGV4dCk7XG4gICAgICAgICAgICAgICAgc2NlbmUuYWRkKHRleHQpO1xuICAgICAgICAgICAgICAgIGxvb3BUaHJvdWdoKClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gMTgpKTtcbiAgICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG4gICAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4M2EyMjhhKTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xO1xuICAgIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuXG4gICAgLy8gTk9URSBDb29sIHN0dWZmXG4gICAgLy8gZ2xvYmVNYXRlcmlhbC53aXJlZnJhbWUgPSB0cnVlO1xuXG4gICAgc2NlbmUuYWRkKEdsb2JlKTtcblxuICAgIC8vIHNjZW5lLmFkZChzcHJpdGUpO1xufVxuXG5sZXQgdGV4dEluZGV4ID0gMDtcblxuZnVuY3Rpb24gbG9vcFRocm91Z2goKSB7XG4gICAgdGV4dE9ianNbdGV4dEluZGV4XS5vcGFjaXR5ID0gMTtcbiAgICB0ZXh0SW5kZXgrKztcbiAgICBzZXRUaW1lb3V0KGxvb3BUaHJvdWdoLCA0MDAwKVxufVxuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG4gICAgLy8gY29uc29sZS5sb2coXCJ4OiBcIiArIG1vdXNlWCArIFwiIHk6IFwiICsgbW91c2VZKTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIGNhbWVyYS5wb3NpdGlvbi54ICs9XG4gICAgICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyID9cbiAgICAgICAgKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNSA6XG4gICAgICAgIDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gICAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gICAgY29udHJvbHMudXBkYXRlKCk7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn0iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcIjY4NWNmZWQwOWNhZDk2MzQ1ODA4XCIiXSwic291cmNlUm9vdCI6IiJ9