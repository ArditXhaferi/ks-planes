self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three_globe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three-globe */ "./node_modules/three-globe/dist/three-globe.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
/* harmony import */ var _files_airports_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files/airports.json */ "./src/files/airports.json");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/app */ "./node_modules/firebase/app/dist/esm/index.esm.js");
/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/database */ "./node_modules/firebase/database/dist/esm/index.esm.js");










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

const app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_3__.initializeApp)(firebaseConfig);
const db = (0,firebase_database__WEBPACK_IMPORTED_MODULE_4__.getDatabase)();

var renderer, camera, scene, controls;
let mouseX = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;
let textObjs = [];

init();

function init() {
    initRenderer()
    initScene()
    initCamera()
    initDirectionalLights()
    initPointLight()
    initFog()
    initControls()
    initListeners()
}

/**
 * Initialize renderer and append to body.
 */
function initRenderer() {
    renderer = new three__WEBPACK_IMPORTED_MODULE_5__.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

/**
 * Initialize scene and set background color.
 */
function initScene() {
    scene = new three__WEBPACK_IMPORTED_MODULE_5__.Scene();
    scene.add(new three__WEBPACK_IMPORTED_MODULE_5__.AmbientLight(0xbbbbbb, 0.3));
    scene.background = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x040d21);
}

/**
 * Initialize camera and set aspect ratio.
 */
function initCamera() {
    camera = new three__WEBPACK_IMPORTED_MODULE_5__.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    camera.position.z = 400;
    camera.position.x = 0;
    camera.position.y = 0;

    scene.add(camera);
}

/**
 * Create and add directional lights to camera.
 */
function initDirectionalLights() {
    const dLight = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(-800, 2000, 400);
    camera.add(dLight);

    const dLight1 = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0x7982f6, 1);
    dLight1.position.set(-200, 500, 200);
    camera.add(dLight1);
}

/**
 * Create and add point light to camera.
 */
function initPointLight() {
    const dLight2 = new three__WEBPACK_IMPORTED_MODULE_5__.PointLight(0x8566cc, 0.5);
    dLight2.position.set(-200, 500, 200);
    camera.add(dLight2);
}

/**
 * Create and add fog to the scene.
 */
function initFog() {
    scene.fog = new three__WEBPACK_IMPORTED_MODULE_5__.Fog(0x535ef3, 400, 2000);
}

/**
 * Setup Orbit Controls.
 */
function initControls() {
    controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_6__.OrbitControls(camera, renderer.domElement);
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
}

/**
 * Setup Event Listeners.
 */
function initListeners() {
    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("mousemove", updateMousePosition);
}

onWindowResize();

function onWindowResize() {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    windowHalfX = innerWidth / 1.5;
    windowHalfY = innerHeight / 1.5;
    renderer.setSize(innerWidth, innerHeight);
}

function updateMousePosition(event) {
    mouseX = event.clientX - windowHalfX;
}

animate();

/**
 * Animate camera and render scene.
 */
function animate() {
    if (Math.abs(mouseX) <= windowHalfX / 2) {
        camera.position.x += (mouseX / 2 - camera.position.x) * 0.005;
    }
    camera.lookAt(scene.position);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

initGlobe();

function initGlobe() {
    Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
            waitForGlobeReady: true,
            animateIn: true,
        })
        .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(true)
        .atmosphereColor("#3a228a")
        .atmosphereAltitude(0.25)

    getAirportDataFromCache().then((data) => {
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
            latLongData[airport.text] = [airport.lat, airport.lng, airport.city]
        })

        let flights = []
        let arcAlt = 0.05;
        let order = 0;
        allFlights.sort((a, b) => {
            let c = new Date(a.dep_time)
            let d = new Date(b.dep_time)
            return c.getTime() - d.getTime()
        });

        allFlights.forEach(flight => {
            order += 4;
            flights.push({
                "text": latLongData[flight.dep_iata][2] + "\n" + latLongData[flight.arr_iata][2],
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

        Globe.arcsData(flights)
            .arcColor(() => "#111")
            .arcAltitude((e) => {
                return e.arcAlt;
            })
            .arcStroke((e) => {
                return e.status ? 1 : 0.3;
            })
            .arcDashLength(0.9)
            .arcDashGap(20)
            .arcDashAnimateTime(1000)
            .arcsTransitionDuration(1000)
            .arcDashInitialGap((e) => e.order * 1)
            .labelColor(() => "#eee")
            .labelDotOrientation((e) => {
                return e.text === "Istanbul" ? "top" : "right";
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
            texts.push(flight['text'])
        })
        const loader = new three__WEBPACK_IMPORTED_MODULE_5__.FontLoader();
        loader.load('./font.json', function(font) {
            texts.forEach((planeText, index) => {
                const color = 0xEEEEEE;
                const matLite = new three__WEBPACK_IMPORTED_MODULE_5__.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.4,
                    side: three__WEBPACK_IMPORTED_MODULE_5__.DoubleSide
                });
                const message = planeText;
                const shapes = font.generateShapes(message, 100);
                const geometry = new three__WEBPACK_IMPORTED_MODULE_5__.ShapeGeometry(shapes);
                geometry.center();
                const text = new three__WEBPACK_IMPORTED_MODULE_5__.Mesh(geometry, matLite);
                text.position.z = -150 - index;
                text.material.opacity = 0;
                text.material.transparent = true;
                textObjs.push(text);
                scene.add(text);
            })
            loopThrough()
        });
    });

    Globe.rotateY(-Math.PI * (5 / 20));
    Globe.rotateZ(-Math.PI / 5);
    const globeMaterial = Globe.globeMaterial();
    globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x3a228a);
    globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x220038);
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 1;

    scene.add(Globe);
}

let textIndex = 0;

/**
 * Update the text behind the globe
 */
function loopThrough() {
    if (textIndex == 0) {
        textObjs[textObjs.length - 1].material.opacity = 0;
    }
    if (textIndex > 0) {
        textObjs[textIndex - 1].material.opacity = 0;
    }
    textObjs[textIndex].material.opacity = 1;
    textIndex++;
    if (textIndex >= textObjs.length) {
        textIndex = 0;
    }
    setTimeout(loopThrough, 3000);
}

async function getAirportDataFromCache() {
    const chaceRef = (0,firebase_database__WEBPACK_IMPORTED_MODULE_4__.ref)(db);

    return new Promise((resolve, reject) => {
        (0,firebase_database__WEBPACK_IMPORTED_MODULE_4__.get)((0,firebase_database__WEBPACK_IMPORTED_MODULE_4__.child)(chaceRef, 'cache')).then(async(snapshot) => {
            const cache = snapshot.val();
            if (cache && cache.timestamp && cache.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
                console.log("cached");
                resolve(cache.data);
            } else {
                console.log("not cached")
                const data = await getAirportData();
                (0,firebase_database__WEBPACK_IMPORTED_MODULE_4__.set)((0,firebase_database__WEBPACK_IMPORTED_MODULE_4__.ref)(db, 'cache'), {
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
        axios__WEBPACK_IMPORTED_MODULE_7__.default.get(`${baseUrl}/schedules?dep_iata=PRN&api_key=${apiKey}`),
        axios__WEBPACK_IMPORTED_MODULE_7__.default.get(`${baseUrl}/schedules?arr_iata=PRN&api_key=${apiKey}`)
    ]);

    const airportCodes = departure.data.response.map((flight) => flight.arr_icao);
    const arrivalCodes = arrival.data.response.map((flight) => flight.dep_icao);
    const prishtinaCode = arrival.data.response.map((flight) => flight.arr_icao);
    const allCodes = [...new Set([...airportCodes, ...arrivalCodes, ...prishtinaCode])];

    const allFlights = [...departure.data.response, ...arrival.data.response];
    const airportData = await Promise.all(allCodes.map(async(airport) => {
        const response = _files_airports_json__WEBPACK_IMPORTED_MODULE_2__[airport];
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

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "8b46d843de7209fb2ebf"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ047QUFDcUc7QUFDdkQ7QUFDekI7QUFDSjtBQUN0QjtBQUNtQjtBQUN5Qjs7QUFFdEU7QUFDQSxZQUFZLHlDQUFtQjtBQUMvQixnQkFBZ0IsOEJBQXVCO0FBQ3ZDLGlCQUFpQixxRUFBd0I7QUFDekMsZUFBZSxjQUFzQjtBQUNyQyxtQkFBbUIsMEJBQTBCO0FBQzdDLHVCQUF1QixjQUErQjtBQUN0RCxXQUFXLDJDQUFrQjtBQUM3QixtQkFBbUIsY0FBMEI7QUFDN0M7O0FBRUEsWUFBWSwyREFBYTtBQUN6QixXQUFXLDhEQUFXOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isd0NBQUs7QUFDckIsa0JBQWtCLCtDQUFZO0FBQzlCLDJCQUEyQix3Q0FBSztBQUNoQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvREFBaUI7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixtREFBZ0I7QUFDdkM7QUFDQTs7QUFFQSx3QkFBd0IsbURBQWdCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw2Q0FBVTtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0NBQUc7QUFDdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsdUZBQWE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxXQUFXLDBCQUEwQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGdCQUFnQixnREFBVTtBQUMxQjtBQUNBO0FBQ0EsU0FBUztBQUNULHlCQUF5QixnRUFBa0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULDJCQUEyQiw2Q0FBVTtBQUNyQztBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msb0RBQXVCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw2Q0FBZ0I7QUFDMUMsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxxQ0FBcUMsZ0RBQW1CO0FBQ3hEO0FBQ0EsaUNBQWlDLHVDQUFVO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsd0NBQUs7QUFDbkMsaUNBQWlDLHdDQUFLO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLHNEQUFHOztBQUV4QjtBQUNBLFFBQVEsc0RBQUcsQ0FBQyx3REFBSztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsZ0JBQWdCLHNEQUFHLENBQUMsc0RBQUc7QUFDdkI7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSw4Q0FBUyxJQUFJLFFBQVEsa0NBQWtDLE9BQU87QUFDdEUsUUFBUSw4Q0FBUyxJQUFJLFFBQVEsa0NBQWtDLE9BQU87QUFDdEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF5QixpREFBVztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLFlBQVk7QUFDWixDOzs7Ozs7Ozs7O1dDalhBLG9EIiwiZmlsZSI6Im1haW4uNTc5MThmZTFhZmQ0OTA2NDM3NmIuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSwgUGVyc3BlY3RpdmVDYW1lcmEsIEFtYmllbnRMaWdodCwgRGlyZWN0aW9uYWxMaWdodCwgQ29sb3IsIEZvZywgUG9pbnRMaWdodCwgRm9udExvYWRlciB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgYWxsQWlycG9ydHMgZnJvbSBcIi4vZmlsZXMvYWlycG9ydHMuanNvblwiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gXCJmaXJlYmFzZS9hcHBcIjtcbmltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIHNldCwgZ2V0LCBjaGlsZCB9IGZyb20gXCJmaXJlYmFzZS9kYXRhYmFzZVwiO1xuXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgICBhcGlLZXk6IHByb2Nlc3MuZW52LkFQSV9LRVksXG4gICAgYXV0aERvbWFpbjogcHJvY2Vzcy5lbnYuQVVUSF9ET01BSU4sXG4gICAgZGF0YWJhc2VVUkw6IHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCxcbiAgICBwcm9qZWN0SWQ6IHByb2Nlc3MuZW52LlBST0pFQ1RfSUQsXG4gICAgc3RvcmFnZUJ1Y2tldDogcHJvY2Vzcy5lbnYuU1RPUkFHRV9CVUNLRVQsXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IHByb2Nlc3MuZW52Lk1FU1NBR0lOR19TRU5ERVJfSUQsXG4gICAgYXBwSWQ6IHByb2Nlc3MuZW52LkFQUF9JRCxcbiAgICBtZWFzdXJlbWVudElkOiBwcm9jZXNzLmVudi5NRUFTVVJFTUVOVF9JRFxufTtcblxuY29uc3QgYXBwID0gaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XG5jb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG5cbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5sZXQgdGV4dE9ianMgPSBbXTtcblxuaW5pdCgpO1xuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIGluaXRSZW5kZXJlcigpXG4gICAgaW5pdFNjZW5lKClcbiAgICBpbml0Q2FtZXJhKClcbiAgICBpbml0RGlyZWN0aW9uYWxMaWdodHMoKVxuICAgIGluaXRQb2ludExpZ2h0KClcbiAgICBpbml0Rm9nKClcbiAgICBpbml0Q29udHJvbHMoKVxuICAgIGluaXRMaXN0ZW5lcnMoKVxufVxuXG4vKipcbiAqIEluaXRpYWxpemUgcmVuZGVyZXIgYW5kIGFwcGVuZCB0byBib2R5LlxuICovXG5mdW5jdGlvbiBpbml0UmVuZGVyZXIoKSB7XG4gICAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBzY2VuZSBhbmQgc2V0IGJhY2tncm91bmQgY29sb3IuXG4gKi9cbmZ1bmN0aW9uIGluaXRTY2VuZSgpIHtcbiAgICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICAgIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDQwZDIxKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGNhbWVyYSBhbmQgc2V0IGFzcGVjdCByYXRpby5cbiAqL1xuZnVuY3Rpb24gaW5pdENhbWVyYSgpIHtcbiAgICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICAgIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgICBzY2VuZS5hZGQoY2FtZXJhKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIGFkZCBkaXJlY3Rpb25hbCBsaWdodHMgdG8gY2FtZXJhLlxuICovXG5mdW5jdGlvbiBpbml0RGlyZWN0aW9uYWxMaWdodHMoKSB7XG4gICAgY29uc3QgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gICAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICAgIGNvbnN0IGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gICAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuZCBhZGQgcG9pbnQgbGlnaHQgdG8gY2FtZXJhLlxuICovXG5mdW5jdGlvbiBpbml0UG9pbnRMaWdodCgpIHtcbiAgICBjb25zdCBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gICAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuZCBhZGQgZm9nIHRvIHRoZSBzY2VuZS5cbiAqL1xuZnVuY3Rpb24gaW5pdEZvZygpIHtcbiAgICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xufVxuXG4vKipcbiAqIFNldHVwIE9yYml0IENvbnRyb2xzLlxuICovXG5mdW5jdGlvbiBpbml0Q29udHJvbHMoKSB7XG4gICAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICAgIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICAgIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICAgIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICAgIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG59XG5cbi8qKlxuICogU2V0dXAgRXZlbnQgTGlzdGVuZXJzLlxuICovXG5mdW5jdGlvbiBpbml0TGlzdGVuZXJzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB1cGRhdGVNb3VzZVBvc2l0aW9uKTtcbn1cblxub25XaW5kb3dSZXNpemUoKTtcblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gICAgY29uc3QgeyBpbm5lcldpZHRoLCBpbm5lckhlaWdodCB9ID0gd2luZG93O1xuICAgIGNhbWVyYS5hc3BlY3QgPSBpbm5lcldpZHRoIC8gaW5uZXJIZWlnaHQ7XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICB3aW5kb3dIYWxmWCA9IGlubmVyV2lkdGggLyAxLjU7XG4gICAgd2luZG93SGFsZlkgPSBpbm5lckhlaWdodCAvIDEuNTtcbiAgICByZW5kZXJlci5zZXRTaXplKGlubmVyV2lkdGgsIGlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTW91c2VQb3NpdGlvbihldmVudCkge1xuICAgIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbn1cblxuYW5pbWF0ZSgpO1xuXG4vKipcbiAqIEFuaW1hdGUgY2FtZXJhIGFuZCByZW5kZXIgc2NlbmUuXG4gKi9cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgaWYgKE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyKSB7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi54ICs9IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDU7XG4gICAgfVxuICAgIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICAgIGNvbnRyb2xzLnVwZGF0ZSgpO1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG5cbmluaXRHbG9iZSgpO1xuXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gICAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgICAgICAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgICAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgICAgIC5zaG93QXRtb3NwaGVyZSh0cnVlKVxuICAgICAgICAuYXRtb3NwaGVyZUNvbG9yKFwiIzNhMjI4YVwiKVxuICAgICAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG5cbiAgICBnZXRBaXJwb3J0RGF0YUZyb21DYWNoZSgpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgbGV0IHJlZmluZWRBaXJwb3J0cyA9IGRhdGEuYWlycG9ydERhdGFcbiAgICAgICAgbGV0IGFsbEZsaWdodHMgPSBkYXRhLmFsbEZsaWdodHM7XG4gICAgICAgIEdsb2JlLnBvaW50c0RhdGEocmVmaW5lZEFpcnBvcnRzKVxuICAgICAgICBHbG9iZS5sYWJlbHNEYXRhKHJlZmluZWRBaXJwb3J0cylcbiAgICAgICAgbGV0IGNvdW50cmllcyA9IFtdXG4gICAgICAgIHJlZmluZWRBaXJwb3J0cy5mb3JFYWNoKChhaXJwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb3VudHJpZXMucHVzaChhaXJwb3J0LmNvdW50cnkpXG4gICAgICAgIH0pXG4gICAgICAgIEdsb2JlLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGNvdW50cmllcy5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICAgICAgZS5wcm9wZXJ0aWVzLklTT19BMlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDEpXCI7XG4gICAgICAgICAgICB9IGVsc2UgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMC40KVwiO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGxhdExvbmdEYXRhID0ge31cblxuICAgICAgICByZWZpbmVkQWlycG9ydHMuZm9yRWFjaCgoYWlycG9ydCkgPT4ge1xuICAgICAgICAgICAgbGF0TG9uZ0RhdGFbYWlycG9ydC50ZXh0XSA9IFthaXJwb3J0LmxhdCwgYWlycG9ydC5sbmcsIGFpcnBvcnQuY2l0eV1cbiAgICAgICAgfSlcblxuICAgICAgICBsZXQgZmxpZ2h0cyA9IFtdXG4gICAgICAgIGxldCBhcmNBbHQgPSAwLjA1O1xuICAgICAgICBsZXQgb3JkZXIgPSAwO1xuICAgICAgICBhbGxGbGlnaHRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGxldCBjID0gbmV3IERhdGUoYS5kZXBfdGltZSlcbiAgICAgICAgICAgIGxldCBkID0gbmV3IERhdGUoYi5kZXBfdGltZSlcbiAgICAgICAgICAgIHJldHVybiBjLmdldFRpbWUoKSAtIGQuZ2V0VGltZSgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFsbEZsaWdodHMuZm9yRWFjaChmbGlnaHQgPT4ge1xuICAgICAgICAgICAgb3JkZXIgKz0gNDtcbiAgICAgICAgICAgIGZsaWdodHMucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMl0gKyBcIlxcblwiICsgbGF0TG9uZ0RhdGFbZmxpZ2h0LmFycl9pYXRhXVsyXSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmbGlnaHRcIixcbiAgICAgICAgICAgICAgICBcIm9yZGVyXCI6IG9yZGVyLFxuICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBmbGlnaHQuZGVwX2lhdGEsXG4gICAgICAgICAgICAgICAgXCJ0b1wiOiBmbGlnaHQuYXJyX2lhdGEsXG4gICAgICAgICAgICAgICAgXCJmbGlnaHRDb2RlXCI6IGZsaWdodC5jc19mbGlnaHRfaWF0YSxcbiAgICAgICAgICAgICAgICBcImRhdGVcIjogZmxpZ2h0LmRlcF90aW1lLFxuICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJzdGFydExhdFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzBdLFxuICAgICAgICAgICAgICAgIFwic3RhcnRMbmdcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVsxXSxcbiAgICAgICAgICAgICAgICBcImVuZExhdFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzBdLFxuICAgICAgICAgICAgICAgIFwiZW5kTG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMV0sXG4gICAgICAgICAgICAgICAgXCJhcmNBbHRcIjogYXJjQWx0XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgYXJjQWx0ICs9IDAuMDM7XG4gICAgICAgIH0pXG5cbiAgICAgICAgR2xvYmUuYXJjc0RhdGEoZmxpZ2h0cylcbiAgICAgICAgICAgIC5hcmNDb2xvcigoKSA9PiBcIiMxMTFcIilcbiAgICAgICAgICAgIC5hcmNBbHRpdHVkZSgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLmFyY0FsdDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXJjU3Ryb2tlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gMSA6IDAuMztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXJjRGFzaExlbmd0aCgwLjkpXG4gICAgICAgICAgICAuYXJjRGFzaEdhcCgyMClcbiAgICAgICAgICAgIC5hcmNEYXNoQW5pbWF0ZVRpbWUoMTAwMClcbiAgICAgICAgICAgIC5hcmNzVHJhbnNpdGlvbkR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXJjRGFzaEluaXRpYWxHYXAoKGUpID0+IGUub3JkZXIgKiAxKVxuICAgICAgICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gXCIjZWVlXCIpXG4gICAgICAgICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLnRleHQgPT09IFwiSXN0YW5idWxcIiA/IFwidG9wXCIgOiBcInJpZ2h0XCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmxhYmVsRG90UmFkaXVzKDAuMylcbiAgICAgICAgICAgIC5sYWJlbFNpemUoKGUpID0+IGUuc2l6ZSlcbiAgICAgICAgICAgIC5sYWJlbFRleHQoXCJjaXR5XCIpXG4gICAgICAgICAgICAubGFiZWxSZXNvbHV0aW9uKDYpXG4gICAgICAgICAgICAubGFiZWxBbHRpdHVkZSgwLjAxKVxuICAgICAgICAgICAgLnBvaW50Q29sb3IoKCkgPT4gXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAucG9pbnRzTWVyZ2UodHJ1ZSlcbiAgICAgICAgICAgIC5wb2ludEFsdGl0dWRlKDAuMDcpXG4gICAgICAgICAgICAucG9pbnRSYWRpdXMoMC4wNSk7XG5cbiAgICAgICAgbGV0IHRleHRzID0gW107XG4gICAgICAgIGZsaWdodHMuZm9yRWFjaCgoZmxpZ2h0KSA9PiB7XG4gICAgICAgICAgICB0ZXh0cy5wdXNoKGZsaWdodFsndGV4dCddKVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgRm9udExvYWRlcigpO1xuICAgICAgICBsb2FkZXIubG9hZCgnLi9mb250Lmpzb24nLCBmdW5jdGlvbihmb250KSB7XG4gICAgICAgICAgICB0ZXh0cy5mb3JFYWNoKChwbGFuZVRleHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSAweEVFRUVFRTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRMaXRlID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC40LFxuICAgICAgICAgICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHBsYW5lVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZXMgPSBmb250LmdlbmVyYXRlU2hhcGVzKG1lc3NhZ2UsIDEwMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeShzaGFwZXMpO1xuICAgICAgICAgICAgICAgIGdlb21ldHJ5LmNlbnRlcigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0TGl0ZSk7XG4gICAgICAgICAgICAgICAgdGV4dC5wb3NpdGlvbi56ID0gLTE1MCAtIGluZGV4O1xuICAgICAgICAgICAgICAgIHRleHQubWF0ZXJpYWwub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgdGV4dC5tYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGV4dE9ianMucHVzaCh0ZXh0KTtcbiAgICAgICAgICAgICAgICBzY2VuZS5hZGQodGV4dCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgbG9vcFRocm91Z2goKVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIEdsb2JlLnJvdGF0ZVkoLU1hdGguUEkgKiAoNSAvIDIwKSk7XG4gICAgR2xvYmUucm90YXRlWigtTWF0aC5QSSAvIDUpO1xuICAgIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gICAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDNhMjI4YSk7XG4gICAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDIyMDAzOCk7XG4gICAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDE7XG5cbiAgICBzY2VuZS5hZGQoR2xvYmUpO1xufVxuXG5sZXQgdGV4dEluZGV4ID0gMDtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIHRleHQgYmVoaW5kIHRoZSBnbG9iZVxuICovXG5mdW5jdGlvbiBsb29wVGhyb3VnaCgpIHtcbiAgICBpZiAodGV4dEluZGV4ID09IDApIHtcbiAgICAgICAgdGV4dE9ianNbdGV4dE9ianMubGVuZ3RoIC0gMV0ubWF0ZXJpYWwub3BhY2l0eSA9IDA7XG4gICAgfVxuICAgIGlmICh0ZXh0SW5kZXggPiAwKSB7XG4gICAgICAgIHRleHRPYmpzW3RleHRJbmRleCAtIDFdLm1hdGVyaWFsLm9wYWNpdHkgPSAwO1xuICAgIH1cbiAgICB0ZXh0T2Jqc1t0ZXh0SW5kZXhdLm1hdGVyaWFsLm9wYWNpdHkgPSAxO1xuICAgIHRleHRJbmRleCsrO1xuICAgIGlmICh0ZXh0SW5kZXggPj0gdGV4dE9ianMubGVuZ3RoKSB7XG4gICAgICAgIHRleHRJbmRleCA9IDA7XG4gICAgfVxuICAgIHNldFRpbWVvdXQobG9vcFRocm91Z2gsIDMwMDApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBaXJwb3J0RGF0YUZyb21DYWNoZSgpIHtcbiAgICBjb25zdCBjaGFjZVJlZiA9IHJlZihkYik7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBnZXQoY2hpbGQoY2hhY2VSZWYsICdjYWNoZScpKS50aGVuKGFzeW5jKHNuYXBzaG90KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgaWYgKGNhY2hlICYmIGNhY2hlLnRpbWVzdGFtcCAmJiBjYWNoZS50aW1lc3RhbXAgPiBEYXRlLm5vdygpIC0gMjQgKiA2MCAqIDYwICogMTAwMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FjaGVkXCIpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY2FjaGUuZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IGNhY2hlZFwiKVxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBnZXRBaXJwb3J0RGF0YSgpO1xuICAgICAgICAgICAgICAgIHNldChyZWYoZGIsICdjYWNoZScpLCB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBaXJwb3J0RGF0YSgpIHtcbiAgICBjb25zdCBhcGlLZXkgPSAnMjU0NTQ3Y2QtYjNkZi00ZDU1LTg2NzYtZGRiMGE0ZGMwYTYzJztcbiAgICBjb25zdCBiYXNlVXJsID0gJ2h0dHBzOi8vYWlybGFicy5jby9hcGkvdjknO1xuXG4gICAgY29uc3QgW2RlcGFydHVyZSwgYXJyaXZhbF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGF4aW9zLmdldChgJHtiYXNlVXJsfS9zY2hlZHVsZXM/ZGVwX2lhdGE9UFJOJmFwaV9rZXk9JHthcGlLZXl9YCksXG4gICAgICAgIGF4aW9zLmdldChgJHtiYXNlVXJsfS9zY2hlZHVsZXM/YXJyX2lhdGE9UFJOJmFwaV9rZXk9JHthcGlLZXl9YClcbiAgICBdKTtcblxuICAgIGNvbnN0IGFpcnBvcnRDb2RlcyA9IGRlcGFydHVyZS5kYXRhLnJlc3BvbnNlLm1hcCgoZmxpZ2h0KSA9PiBmbGlnaHQuYXJyX2ljYW8pO1xuICAgIGNvbnN0IGFycml2YWxDb2RlcyA9IGFycml2YWwuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmRlcF9pY2FvKTtcbiAgICBjb25zdCBwcmlzaHRpbmFDb2RlID0gYXJyaXZhbC5kYXRhLnJlc3BvbnNlLm1hcCgoZmxpZ2h0KSA9PiBmbGlnaHQuYXJyX2ljYW8pO1xuICAgIGNvbnN0IGFsbENvZGVzID0gWy4uLm5ldyBTZXQoWy4uLmFpcnBvcnRDb2RlcywgLi4uYXJyaXZhbENvZGVzLCAuLi5wcmlzaHRpbmFDb2RlXSldO1xuXG4gICAgY29uc3QgYWxsRmxpZ2h0cyA9IFsuLi5kZXBhcnR1cmUuZGF0YS5yZXNwb25zZSwgLi4uYXJyaXZhbC5kYXRhLnJlc3BvbnNlXTtcbiAgICBjb25zdCBhaXJwb3J0RGF0YSA9IGF3YWl0IFByb21pc2UuYWxsKGFsbENvZGVzLm1hcChhc3luYyhhaXJwb3J0KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYWxsQWlycG9ydHNbYWlycG9ydF07XG4gICAgICAgIGNvbnN0IHJlZmluZWRBaXJwb3J0ID0ge1xuICAgICAgICAgICAgdGV4dDogcmVzcG9uc2VbJ2lhdGEnXSxcbiAgICAgICAgICAgIHNpemU6IDEuMCxcbiAgICAgICAgICAgIGNvdW50cnk6IHJlc3BvbnNlWydzdGF0ZSddLFxuICAgICAgICAgICAgY2l0eTogcmVzcG9uc2VbJ2NpdHknXSxcbiAgICAgICAgICAgIGxhdDogcmVzcG9uc2VbJ2xhdCddLFxuICAgICAgICAgICAgbG5nOiByZXNwb25zZVsnbG9uJ10sXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWZpbmVkQWlycG9ydDtcbiAgICB9KSk7XG5cbiAgICByZXR1cm4geyBhbGxGbGlnaHRzLCBhaXJwb3J0RGF0YSB9O1xufSIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiOGI0NmQ4NDNkZTcyMDlmYjJlYmZcIiJdLCJzb3VyY2VSb290IjoiIn0=