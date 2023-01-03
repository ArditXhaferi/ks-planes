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
        .atmosphereColor("#672ae9")
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
            console.log(flight)
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
                "arcAlt": arcAlt,
                "id": flight.flight_number
            })
            arcAlt += 0.03;
        })

        Globe.arcsData(flights)
            .arcColor(() => "#ffff00")
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

        let textLoop = "";
        let rotate = document.getElementById("scroll-text");
        flights.forEach((flight) => {
            textLoop += "#" + flight.id + " " + flight.from + " => " + flight.to + " : " + flight.date + " | ";
        })
        rotate.innerHTML = textLoop
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
/******/ 		__webpack_require__.h = () => "a2b12358e4984d235a25"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ047QUFDcUc7QUFDdkQ7QUFDekI7QUFDSjtBQUN0QjtBQUNtQjtBQUN5Qjs7QUFFdEU7QUFDQSxZQUFZLHlDQUFtQjtBQUMvQixnQkFBZ0IsOEJBQXVCO0FBQ3ZDLGlCQUFpQixxRUFBd0I7QUFDekMsZUFBZSxjQUFzQjtBQUNyQyxtQkFBbUIsMEJBQTBCO0FBQzdDLHVCQUF1QixjQUErQjtBQUN0RCxXQUFXLDJDQUFrQjtBQUM3QixtQkFBbUIsY0FBMEI7QUFDN0M7O0FBRUEsWUFBWSwyREFBYTtBQUN6QixXQUFXLDhEQUFXOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isd0NBQUs7QUFDckIsa0JBQWtCLCtDQUFZO0FBQzlCLDJCQUEyQix3Q0FBSztBQUNoQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvREFBaUI7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixtREFBZ0I7QUFDdkM7QUFDQTs7QUFFQSx3QkFBd0IsbURBQWdCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw2Q0FBVTtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0NBQUc7QUFDdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsdUZBQWE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxXQUFXLDBCQUEwQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGdCQUFnQixnREFBVTtBQUMxQjtBQUNBO0FBQ0EsU0FBUztBQUNULHlCQUF5QixnRUFBa0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwyQkFBMkIsNkNBQVU7QUFDckM7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLG9EQUF1QjtBQUMzRDtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsNkNBQWdCO0FBQzFDLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EscUNBQXFDLGdEQUFtQjtBQUN4RDtBQUNBLGlDQUFpQyx1Q0FBVTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHdDQUFLO0FBQ25DLGlDQUFpQyx3Q0FBSztBQUN0QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixzREFBRzs7QUFFeEI7QUFDQSxRQUFRLHNEQUFHLENBQUMsd0RBQUs7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGdCQUFnQixzREFBRyxDQUFDLHNEQUFHO0FBQ3ZCO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsOENBQVMsSUFBSSxRQUFRLGtDQUFrQyxPQUFPO0FBQ3RFLFFBQVEsOENBQVMsSUFBSSxRQUFRLGtDQUFrQyxPQUFPO0FBQ3RFOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBeUIsaURBQVc7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxZQUFZO0FBQ1osQzs7Ozs7Ozs7OztXQzFYQSxvRCIsImZpbGUiOiJtYWluLmE4OTVkNzAwYTk4ZGZiZDNjMzE4LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUsIFBlcnNwZWN0aXZlQ2FtZXJhLCBBbWJpZW50TGlnaHQsIERpcmVjdGlvbmFsTGlnaHQsIENvbG9yLCBGb2csIFBvaW50TGlnaHQsIEZvbnRMb2FkZXIgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiO1xuaW1wb3J0IGFsbEFpcnBvcnRzIGZyb20gXCIuL2ZpbGVzL2FpcnBvcnRzLmpzb25cIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCB7IGluaXRpYWxpemVBcHAgfSBmcm9tIFwiZmlyZWJhc2UvYXBwXCI7XG5pbXBvcnQgeyBnZXREYXRhYmFzZSwgcmVmLCBzZXQsIGdldCwgY2hpbGQgfSBmcm9tIFwiZmlyZWJhc2UvZGF0YWJhc2VcIjtcblxuY29uc3QgZmlyZWJhc2VDb25maWcgPSB7XG4gICAgYXBpS2V5OiBwcm9jZXNzLmVudi5BUElfS0VZLFxuICAgIGF1dGhEb21haW46IHByb2Nlc3MuZW52LkFVVEhfRE9NQUlOLFxuICAgIGRhdGFiYXNlVVJMOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwsXG4gICAgcHJvamVjdElkOiBwcm9jZXNzLmVudi5QUk9KRUNUX0lELFxuICAgIHN0b3JhZ2VCdWNrZXQ6IHByb2Nlc3MuZW52LlNUT1JBR0VfQlVDS0VULFxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBwcm9jZXNzLmVudi5NRVNTQUdJTkdfU0VOREVSX0lELFxuICAgIGFwcElkOiBwcm9jZXNzLmVudi5BUFBfSUQsXG4gICAgbWVhc3VyZW1lbnRJZDogcHJvY2Vzcy5lbnYuTUVBU1VSRU1FTlRfSURcbn07XG5cbmNvbnN0IGFwcCA9IGluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xuY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuXG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xubGV0IHRleHRPYmpzID0gW107XG5cbmluaXQoKTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpbml0UmVuZGVyZXIoKVxuICAgIGluaXRTY2VuZSgpXG4gICAgaW5pdENhbWVyYSgpXG4gICAgaW5pdERpcmVjdGlvbmFsTGlnaHRzKClcbiAgICBpbml0UG9pbnRMaWdodCgpXG4gICAgaW5pdEZvZygpXG4gICAgaW5pdENvbnRyb2xzKClcbiAgICBpbml0TGlzdGVuZXJzKClcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHJlbmRlcmVyIGFuZCBhcHBlbmQgdG8gYm9keS5cbiAqL1xuZnVuY3Rpb24gaW5pdFJlbmRlcmVyKCkge1xuICAgIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgc2NlbmUgYW5kIHNldCBiYWNrZ3JvdW5kIGNvbG9yLlxuICovXG5mdW5jdGlvbiBpbml0U2NlbmUoKSB7XG4gICAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDA0MGQyMSk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBjYW1lcmEgYW5kIHNldCBhc3BlY3QgcmF0aW8uXG4gKi9cbmZ1bmN0aW9uIGluaXRDYW1lcmEoKSB7XG4gICAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gICAgc2NlbmUuYWRkKGNhbWVyYSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuZCBhZGQgZGlyZWN0aW9uYWwgbGlnaHRzIHRvIGNhbWVyYS5cbiAqL1xuZnVuY3Rpb24gaW5pdERpcmVjdGlvbmFsTGlnaHRzKCkge1xuICAgIGNvbnN0IGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICAgIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgICBjb25zdCBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICAgIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodDEpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbmQgYWRkIHBvaW50IGxpZ2h0IHRvIGNhbWVyYS5cbiAqL1xuZnVuY3Rpb24gaW5pdFBvaW50TGlnaHQoKSB7XG4gICAgY29uc3QgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICAgIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodDIpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbmQgYWRkIGZvZyB0byB0aGUgc2NlbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRGb2coKSB7XG4gICAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcbn1cblxuLyoqXG4gKiBTZXR1cCBPcmJpdCBDb250cm9scy5cbiAqL1xuZnVuY3Rpb24gaW5pdENvbnRyb2xzKCkge1xuICAgIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gICAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gICAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gICAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gICAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gICAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG5cbiAgICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xufVxuXG4vKipcbiAqIFNldHVwIEV2ZW50IExpc3RlbmVycy5cbiAqL1xuZnVuY3Rpb24gaW5pdExpc3RlbmVycygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdXBkYXRlTW91c2VQb3NpdGlvbik7XG59XG5cbm9uV2luZG93UmVzaXplKCk7XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICAgIGNvbnN0IHsgaW5uZXJXaWR0aCwgaW5uZXJIZWlnaHQgfSA9IHdpbmRvdztcbiAgICBjYW1lcmEuYXNwZWN0ID0gaW5uZXJXaWR0aCAvIGlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgd2luZG93SGFsZlggPSBpbm5lcldpZHRoIC8gMS41O1xuICAgIHdpbmRvd0hhbGZZID0gaW5uZXJIZWlnaHQgLyAxLjU7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZShpbm5lcldpZHRoLCBpbm5lckhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU1vdXNlUG9zaXRpb24oZXZlbnQpIHtcbiAgICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG59XG5cbmFuaW1hdGUoKTtcblxuLyoqXG4gKiBBbmltYXRlIGNhbWVyYSBhbmQgcmVuZGVyIHNjZW5lLlxuICovXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIGlmIChNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMikge1xuICAgICAgICBjYW1lcmEucG9zaXRpb24ueCArPSAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1O1xuICAgIH1cbiAgICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgICBjb250cm9scy51cGRhdGUoKTtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuXG5pbml0R2xvYmUoKTtcblxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICAgIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgICAgICAgICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRlSW46IHRydWUsXG4gICAgICAgIH0pXG4gICAgICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgICAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAgICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgICAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAgICAgLmF0bW9zcGhlcmVDb2xvcihcIiM2NzJhZTlcIilcbiAgICAgICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuXG4gICAgZ2V0QWlycG9ydERhdGFGcm9tQ2FjaGUoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGxldCByZWZpbmVkQWlycG9ydHMgPSBkYXRhLmFpcnBvcnREYXRhXG4gICAgICAgIGxldCBhbGxGbGlnaHRzID0gZGF0YS5hbGxGbGlnaHRzO1xuICAgICAgICBHbG9iZS5wb2ludHNEYXRhKHJlZmluZWRBaXJwb3J0cylcbiAgICAgICAgR2xvYmUubGFiZWxzRGF0YShyZWZpbmVkQWlycG9ydHMpXG4gICAgICAgIGxldCBjb3VudHJpZXMgPSBbXVxuICAgICAgICByZWZpbmVkQWlycG9ydHMuZm9yRWFjaCgoYWlycG9ydCkgPT4ge1xuICAgICAgICAgICAgY291bnRyaWVzLnB1c2goYWlycG9ydC5jb3VudHJ5KVxuICAgICAgICB9KVxuICAgICAgICBHbG9iZS5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjb3VudHJpZXMuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgICAgIGUucHJvcGVydGllcy5JU09fQTJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJyZ2JhKDI1NSwyNTUsMjU1LCAxKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDAuNClcIjtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBsYXRMb25nRGF0YSA9IHt9XG5cbiAgICAgICAgcmVmaW5lZEFpcnBvcnRzLmZvckVhY2goKGFpcnBvcnQpID0+IHtcbiAgICAgICAgICAgIGxhdExvbmdEYXRhW2FpcnBvcnQudGV4dF0gPSBbYWlycG9ydC5sYXQsIGFpcnBvcnQubG5nLCBhaXJwb3J0LmNpdHldXG4gICAgICAgIH0pXG5cbiAgICAgICAgbGV0IGZsaWdodHMgPSBbXVxuICAgICAgICBsZXQgYXJjQWx0ID0gMC4wNTtcbiAgICAgICAgbGV0IG9yZGVyID0gMDtcbiAgICAgICAgYWxsRmxpZ2h0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBsZXQgYyA9IG5ldyBEYXRlKGEuZGVwX3RpbWUpXG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKGIuZGVwX3RpbWUpXG4gICAgICAgICAgICByZXR1cm4gYy5nZXRUaW1lKCkgLSBkLmdldFRpbWUoKVxuICAgICAgICB9KTtcblxuICAgICAgICBhbGxGbGlnaHRzLmZvckVhY2goZmxpZ2h0ID0+IHtcbiAgICAgICAgICAgIG9yZGVyICs9IDQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmbGlnaHQpXG4gICAgICAgICAgICBmbGlnaHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIFwidGV4dFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzJdICsgXCJcXG5cIiArIGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMl0sXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZmxpZ2h0XCIsXG4gICAgICAgICAgICAgICAgXCJvcmRlclwiOiBvcmRlcixcbiAgICAgICAgICAgICAgICBcImZyb21cIjogZmxpZ2h0LmRlcF9pYXRhLFxuICAgICAgICAgICAgICAgIFwidG9cIjogZmxpZ2h0LmFycl9pYXRhLFxuICAgICAgICAgICAgICAgIFwiZmxpZ2h0Q29kZVwiOiBmbGlnaHQuY3NfZmxpZ2h0X2lhdGEsXG4gICAgICAgICAgICAgICAgXCJkYXRlXCI6IGZsaWdodC5kZXBfdGltZSxcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwic3RhcnRMYXRcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVswXSxcbiAgICAgICAgICAgICAgICBcInN0YXJ0TG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMV0sXG4gICAgICAgICAgICAgICAgXCJlbmRMYXRcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmFycl9pYXRhXVswXSxcbiAgICAgICAgICAgICAgICBcImVuZExuZ1wiOiBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzFdLFxuICAgICAgICAgICAgICAgIFwiYXJjQWx0XCI6IGFyY0FsdCxcbiAgICAgICAgICAgICAgICBcImlkXCI6IGZsaWdodC5mbGlnaHRfbnVtYmVyXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgYXJjQWx0ICs9IDAuMDM7XG4gICAgICAgIH0pXG5cbiAgICAgICAgR2xvYmUuYXJjc0RhdGEoZmxpZ2h0cylcbiAgICAgICAgICAgIC5hcmNDb2xvcigoKSA9PiBcIiNmZmZmMDBcIilcbiAgICAgICAgICAgIC5hcmNBbHRpdHVkZSgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLmFyY0FsdDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXJjU3Ryb2tlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gMSA6IDAuMztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXJjRGFzaExlbmd0aCgwLjkpXG4gICAgICAgICAgICAuYXJjRGFzaEdhcCgyMClcbiAgICAgICAgICAgIC5hcmNEYXNoQW5pbWF0ZVRpbWUoMTAwMClcbiAgICAgICAgICAgIC5hcmNzVHJhbnNpdGlvbkR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXJjRGFzaEluaXRpYWxHYXAoKGUpID0+IGUub3JkZXIgKiAxKVxuICAgICAgICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gXCIjZWVlXCIpXG4gICAgICAgICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLnRleHQgPT09IFwiSXN0YW5idWxcIiA/IFwidG9wXCIgOiBcInJpZ2h0XCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmxhYmVsRG90UmFkaXVzKDAuMylcbiAgICAgICAgICAgIC5sYWJlbFNpemUoKGUpID0+IGUuc2l6ZSlcbiAgICAgICAgICAgIC5sYWJlbFRleHQoXCJjaXR5XCIpXG4gICAgICAgICAgICAubGFiZWxSZXNvbHV0aW9uKDYpXG4gICAgICAgICAgICAubGFiZWxBbHRpdHVkZSgwLjAxKVxuICAgICAgICAgICAgLnBvaW50Q29sb3IoKCkgPT4gXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAucG9pbnRzTWVyZ2UodHJ1ZSlcbiAgICAgICAgICAgIC5wb2ludEFsdGl0dWRlKDAuMDcpXG4gICAgICAgICAgICAucG9pbnRSYWRpdXMoMC4wNSk7XG5cbiAgICAgICAgbGV0IHRleHRzID0gW107XG4gICAgICAgIGZsaWdodHMuZm9yRWFjaCgoZmxpZ2h0KSA9PiB7XG4gICAgICAgICAgICB0ZXh0cy5wdXNoKGZsaWdodFsndGV4dCddKVxuICAgICAgICB9KVxuXG4gICAgICAgIGxldCB0ZXh0TG9vcCA9IFwiXCI7XG4gICAgICAgIGxldCByb3RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcm9sbC10ZXh0XCIpO1xuICAgICAgICBmbGlnaHRzLmZvckVhY2goKGZsaWdodCkgPT4ge1xuICAgICAgICAgICAgdGV4dExvb3AgKz0gXCIjXCIgKyBmbGlnaHQuaWQgKyBcIiBcIiArIGZsaWdodC5mcm9tICsgXCIgPT4gXCIgKyBmbGlnaHQudG8gKyBcIiA6IFwiICsgZmxpZ2h0LmRhdGUgKyBcIiB8IFwiO1xuICAgICAgICB9KVxuICAgICAgICByb3RhdGUuaW5uZXJIVE1MID0gdGV4dExvb3BcbiAgICAgICAgY29uc3QgbG9hZGVyID0gbmV3IEZvbnRMb2FkZXIoKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoJy4vZm9udC5qc29uJywgZnVuY3Rpb24oZm9udCkge1xuICAgICAgICAgICAgdGV4dHMuZm9yRWFjaCgocGxhbmVUZXh0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gMHhFRUVFRUU7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0TGl0ZSA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNCxcbiAgICAgICAgICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBwbGFuZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVzID0gZm9udC5nZW5lcmF0ZVNoYXBlcyhtZXNzYWdlLCAxMDApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoc2hhcGVzKTtcbiAgICAgICAgICAgICAgICBnZW9tZXRyeS5jZW50ZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdExpdGUpO1xuICAgICAgICAgICAgICAgIHRleHQucG9zaXRpb24ueiA9IC0xNTAgLSBpbmRleDtcbiAgICAgICAgICAgICAgICB0ZXh0Lm1hdGVyaWFsLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgIHRleHQubWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRleHRPYmpzLnB1c2godGV4dCk7XG4gICAgICAgICAgICAgICAgc2NlbmUuYWRkKHRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGxvb3BUaHJvdWdoKClcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBHbG9iZS5yb3RhdGVZKC1NYXRoLlBJICogKDUgLyAyMCkpO1xuICAgIEdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA1KTtcbiAgICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICAgIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICAgIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICAgIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7XG4gICAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAxO1xuXG4gICAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxubGV0IHRleHRJbmRleCA9IDA7XG5cbi8qKlxuICogVXBkYXRlIHRoZSB0ZXh0IGJlaGluZCB0aGUgZ2xvYmVcbiAqL1xuZnVuY3Rpb24gbG9vcFRocm91Z2goKSB7XG4gICAgaWYgKHRleHRJbmRleCA9PSAwKSB7XG4gICAgICAgIHRleHRPYmpzW3RleHRPYmpzLmxlbmd0aCAtIDFdLm1hdGVyaWFsLm9wYWNpdHkgPSAwO1xuICAgIH1cbiAgICBpZiAodGV4dEluZGV4ID4gMCkge1xuICAgICAgICB0ZXh0T2Jqc1t0ZXh0SW5kZXggLSAxXS5tYXRlcmlhbC5vcGFjaXR5ID0gMDtcbiAgICB9XG4gICAgdGV4dE9ianNbdGV4dEluZGV4XS5tYXRlcmlhbC5vcGFjaXR5ID0gMTtcbiAgICB0ZXh0SW5kZXgrKztcbiAgICBpZiAodGV4dEluZGV4ID49IHRleHRPYmpzLmxlbmd0aCkge1xuICAgICAgICB0ZXh0SW5kZXggPSAwO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KGxvb3BUaHJvdWdoLCAzMDAwKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWlycG9ydERhdGFGcm9tQ2FjaGUoKSB7XG4gICAgY29uc3QgY2hhY2VSZWYgPSByZWYoZGIpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZ2V0KGNoaWxkKGNoYWNlUmVmLCAnY2FjaGUnKSkudGhlbihhc3luYyhzbmFwc2hvdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FjaGUgPSBzbmFwc2hvdC52YWwoKTtcbiAgICAgICAgICAgIGlmIChjYWNoZSAmJiBjYWNoZS50aW1lc3RhbXAgJiYgY2FjaGUudGltZXN0YW1wID4gRGF0ZS5ub3coKSAtIDI0ICogNjAgKiA2MCAqIDEwMDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhY2hlZFwiKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGNhY2hlLmRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vdCBjYWNoZWRcIilcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZ2V0QWlycG9ydERhdGEoKTtcbiAgICAgICAgICAgICAgICBzZXQocmVmKGRiLCAnY2FjaGUnKSwge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWlycG9ydERhdGEoKSB7XG4gICAgY29uc3QgYXBpS2V5ID0gJzI1NDU0N2NkLWIzZGYtNGQ1NS04Njc2LWRkYjBhNGRjMGE2Myc7XG4gICAgY29uc3QgYmFzZVVybCA9ICdodHRwczovL2FpcmxhYnMuY28vYXBpL3Y5JztcblxuICAgIGNvbnN0IFtkZXBhcnR1cmUsIGFycml2YWxdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2RlcF9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApLFxuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2Fycl9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApXG4gICAgXSk7XG5cbiAgICBjb25zdCBhaXJwb3J0Q29kZXMgPSBkZXBhcnR1cmUuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmFycl9pY2FvKTtcbiAgICBjb25zdCBhcnJpdmFsQ29kZXMgPSBhcnJpdmFsLmRhdGEucmVzcG9uc2UubWFwKChmbGlnaHQpID0+IGZsaWdodC5kZXBfaWNhbyk7XG4gICAgY29uc3QgcHJpc2h0aW5hQ29kZSA9IGFycml2YWwuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmFycl9pY2FvKTtcbiAgICBjb25zdCBhbGxDb2RlcyA9IFsuLi5uZXcgU2V0KFsuLi5haXJwb3J0Q29kZXMsIC4uLmFycml2YWxDb2RlcywgLi4ucHJpc2h0aW5hQ29kZV0pXTtcblxuICAgIGNvbnN0IGFsbEZsaWdodHMgPSBbLi4uZGVwYXJ0dXJlLmRhdGEucmVzcG9uc2UsIC4uLmFycml2YWwuZGF0YS5yZXNwb25zZV07XG4gICAgY29uc3QgYWlycG9ydERhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChhbGxDb2Rlcy5tYXAoYXN5bmMoYWlycG9ydCkgPT4ge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGFsbEFpcnBvcnRzW2FpcnBvcnRdO1xuICAgICAgICBjb25zdCByZWZpbmVkQWlycG9ydCA9IHtcbiAgICAgICAgICAgIHRleHQ6IHJlc3BvbnNlWydpYXRhJ10sXG4gICAgICAgICAgICBzaXplOiAxLjAsXG4gICAgICAgICAgICBjb3VudHJ5OiByZXNwb25zZVsnc3RhdGUnXSxcbiAgICAgICAgICAgIGNpdHk6IHJlc3BvbnNlWydjaXR5J10sXG4gICAgICAgICAgICBsYXQ6IHJlc3BvbnNlWydsYXQnXSxcbiAgICAgICAgICAgIGxuZzogcmVzcG9uc2VbJ2xvbiddLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVmaW5lZEFpcnBvcnQ7XG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHsgYWxsRmxpZ2h0cywgYWlycG9ydERhdGEgfTtcbn0iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcImEyYjEyMzU4ZTQ5ODRkMjM1YTI1XCIiXSwic291cmNlUm9vdCI6IiJ9