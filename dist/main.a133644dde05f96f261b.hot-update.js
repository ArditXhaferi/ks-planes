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
    initRest()
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

initGlobe();
onWindowResize();
animate();

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
        // const response = await axios.get(`${baseUrl}/airports?iata_code=${airport}&api_key=${apiKey}`);
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


// SECTION Globe
function initGlobe() {
    // Initialize the Globe
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

    // NOTE Arc animations are followed after the globe enters the scene

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
            .arcColor((e) => {
                return e.status ? "#9cff00" : "#FF4000";
            })
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
            .labelColor(() => "#ffcb21")
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
                const color = 0x006699;
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
    globeMaterial.shininess = 0.7;

    // NOTE Cool stuff
    // globeMaterial.wireframe = true;

    scene.add(Globe);

    // scene.add(sprite);
}

let textIndex = 0;

/**
 * Iterate through array elements and modify based on position.
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


function updateMousePosition(event) {
    mouseX = event.clientX - windowHalfX;
}

function onWindowResize() {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    windowHalfX = innerWidth / 1.5;
    windowHalfY = innerHeight / 1.5;
    renderer.setSize(innerWidth, innerHeight);
}

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

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "12d883cd4e2bb902558c"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ047QUFDcUc7QUFDdkQ7QUFDekI7QUFDSjtBQUN0QjtBQUNtQjtBQUN5Qjs7QUFFdEU7QUFDQSxZQUFZLHlDQUFtQjtBQUMvQixnQkFBZ0IsOEJBQXVCO0FBQ3ZDLGlCQUFpQixxRUFBd0I7QUFDekMsZUFBZSxjQUFzQjtBQUNyQyxtQkFBbUIsMEJBQTBCO0FBQzdDLHVCQUF1QixjQUErQjtBQUN0RCxXQUFXLDJDQUFrQjtBQUM3QixtQkFBbUIsY0FBMEI7QUFDN0M7O0FBRUEsWUFBWSwyREFBYTtBQUN6QixXQUFXLDhEQUFXOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixnREFBYSxFQUFFLGtCQUFrQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQix3Q0FBSztBQUNyQixrQkFBa0IsK0NBQVk7QUFDOUIsMkJBQTJCLHdDQUFLO0FBQ2hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG9EQUFpQjtBQUNsQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1EQUFnQjtBQUN2QztBQUNBOztBQUVBLHdCQUF3QixtREFBZ0I7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZDQUFVO0FBQ2xDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFD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LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUsIFBlcnNwZWN0aXZlQ2FtZXJhLCBBbWJpZW50TGlnaHQsIERpcmVjdGlvbmFsTGlnaHQsIENvbG9yLCBGb2csIFBvaW50TGlnaHQsIEZvbnRMb2FkZXIgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiO1xuaW1wb3J0IGFsbEFpcnBvcnRzIGZyb20gXCIuL2ZpbGVzL2FpcnBvcnRzLmpzb25cIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCB7IGluaXRpYWxpemVBcHAgfSBmcm9tIFwiZmlyZWJhc2UvYXBwXCI7XG5pbXBvcnQgeyBnZXREYXRhYmFzZSwgcmVmLCBzZXQsIGdldCwgY2hpbGQgfSBmcm9tIFwiZmlyZWJhc2UvZGF0YWJhc2VcIjtcblxuY29uc3QgZmlyZWJhc2VDb25maWcgPSB7XG4gICAgYXBpS2V5OiBwcm9jZXNzLmVudi5BUElfS0VZLFxuICAgIGF1dGhEb21haW46IHByb2Nlc3MuZW52LkFVVEhfRE9NQUlOLFxuICAgIGRhdGFiYXNlVVJMOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwsXG4gICAgcHJvamVjdElkOiBwcm9jZXNzLmVudi5QUk9KRUNUX0lELFxuICAgIHN0b3JhZ2VCdWNrZXQ6IHByb2Nlc3MuZW52LlNUT1JBR0VfQlVDS0VULFxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBwcm9jZXNzLmVudi5NRVNTQUdJTkdfU0VOREVSX0lELFxuICAgIGFwcElkOiBwcm9jZXNzLmVudi5BUFBfSUQsXG4gICAgbWVhc3VyZW1lbnRJZDogcHJvY2Vzcy5lbnYuTUVBU1VSRU1FTlRfSURcbn07XG5cbmNvbnN0IGFwcCA9IGluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xuY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuXG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xubGV0IHRleHRPYmpzID0gW107XG5cbmluaXQoKTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpbml0UmVuZGVyZXIoKVxuICAgIGluaXRTY2VuZSgpXG4gICAgaW5pdENhbWVyYSgpXG4gICAgaW5pdERpcmVjdGlvbmFsTGlnaHRzKClcbiAgICBpbml0UG9pbnRMaWdodCgpXG4gICAgaW5pdFJlc3QoKVxuICAgIGluaXRGb2coKVxuICAgIGluaXRDb250cm9scygpXG4gICAgaW5pdExpc3RlbmVycygpXG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSByZW5kZXJlciBhbmQgYXBwZW5kIHRvIGJvZHkuXG4gKi9cbmZ1bmN0aW9uIGluaXRSZW5kZXJlcigpIHtcbiAgICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHNjZW5lIGFuZCBzZXQgYmFja2dyb3VuZCBjb2xvci5cbiAqL1xuZnVuY3Rpb24gaW5pdFNjZW5lKCkge1xuICAgIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gICAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICAgIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwNDBkMjEpO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgY2FtZXJhIGFuZCBzZXQgYXNwZWN0IHJhdGlvLlxuICovXG5mdW5jdGlvbiBpbml0Q2FtZXJhKCkge1xuICAgIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICAgIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICAgIHNjZW5lLmFkZChjYW1lcmEpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbmQgYWRkIGRpcmVjdGlvbmFsIGxpZ2h0cyB0byBjYW1lcmEuXG4gKi9cbmZ1bmN0aW9uIGluaXREaXJlY3Rpb25hbExpZ2h0cygpIHtcbiAgICBjb25zdCBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gICAgY29uc3QgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQxKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIGFkZCBwb2ludCBsaWdodCB0byBjYW1lcmEuXG4gKi9cbmZ1bmN0aW9uIGluaXRQb2ludExpZ2h0KCkge1xuICAgIGNvbnN0IGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQyKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIGFkZCBmb2cgdG8gdGhlIHNjZW5lLlxuICovXG5mdW5jdGlvbiBpbml0Rm9nKCkge1xuICAgIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG59XG5cbi8qKlxuICogU2V0dXAgT3JiaXQgQ29udHJvbHMuXG4gKi9cbmZ1bmN0aW9uIGluaXRDb250cm9scygpIHtcbiAgICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gICAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICAgIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICAgIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICAgIGNvbnRyb2xzLm1heERpc3RhbmNlID0gNTAwO1xuICAgIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICAgIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gICAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuXG4gICAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gICAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcbn1cblxuLyoqXG4gKiBTZXR1cCBFdmVudCBMaXN0ZW5lcnMuXG4gKi9cbmZ1bmN0aW9uIGluaXRMaXN0ZW5lcnMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHVwZGF0ZU1vdXNlUG9zaXRpb24pO1xufVxuXG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFpcnBvcnREYXRhRnJvbUNhY2hlKCkge1xuICAgIGNvbnN0IGNoYWNlUmVmID0gcmVmKGRiKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGdldChjaGlsZChjaGFjZVJlZiwgJ2NhY2hlJykpLnRoZW4oYXN5bmMoc25hcHNob3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gc25hcHNob3QudmFsKCk7XG4gICAgICAgICAgICBpZiAoY2FjaGUgJiYgY2FjaGUudGltZXN0YW1wICYmIGNhY2hlLnRpbWVzdGFtcCA+IERhdGUubm93KCkgLSAyNCAqIDYwICogNjAgKiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWNoZWRcIik7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjYWNoZS5kYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3QgY2FjaGVkXCIpXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGdldEFpcnBvcnREYXRhKCk7XG4gICAgICAgICAgICAgICAgc2V0KHJlZihkYiwgJ2NhY2hlJyksIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cblxuXG5hc3luYyBmdW5jdGlvbiBnZXRBaXJwb3J0RGF0YSgpIHtcbiAgICBjb25zdCBhcGlLZXkgPSAnMjU0NTQ3Y2QtYjNkZi00ZDU1LTg2NzYtZGRiMGE0ZGMwYTYzJztcbiAgICBjb25zdCBiYXNlVXJsID0gJ2h0dHBzOi8vYWlybGFicy5jby9hcGkvdjknO1xuXG4gICAgY29uc3QgW2RlcGFydHVyZSwgYXJyaXZhbF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGF4aW9zLmdldChgJHtiYXNlVXJsfS9zY2hlZHVsZXM/ZGVwX2lhdGE9UFJOJmFwaV9rZXk9JHthcGlLZXl9YCksXG4gICAgICAgIGF4aW9zLmdldChgJHtiYXNlVXJsfS9zY2hlZHVsZXM/YXJyX2lhdGE9UFJOJmFwaV9rZXk9JHthcGlLZXl9YClcbiAgICBdKTtcblxuICAgIGNvbnN0IGFpcnBvcnRDb2RlcyA9IGRlcGFydHVyZS5kYXRhLnJlc3BvbnNlLm1hcCgoZmxpZ2h0KSA9PiBmbGlnaHQuYXJyX2ljYW8pO1xuICAgIGNvbnN0IGFycml2YWxDb2RlcyA9IGFycml2YWwuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmRlcF9pY2FvKTtcbiAgICBjb25zdCBwcmlzaHRpbmFDb2RlID0gYXJyaXZhbC5kYXRhLnJlc3BvbnNlLm1hcCgoZmxpZ2h0KSA9PiBmbGlnaHQuYXJyX2ljYW8pO1xuICAgIGNvbnN0IGFsbENvZGVzID0gWy4uLm5ldyBTZXQoWy4uLmFpcnBvcnRDb2RlcywgLi4uYXJyaXZhbENvZGVzLCAuLi5wcmlzaHRpbmFDb2RlXSldO1xuXG4gICAgY29uc3QgYWxsRmxpZ2h0cyA9IFsuLi5kZXBhcnR1cmUuZGF0YS5yZXNwb25zZSwgLi4uYXJyaXZhbC5kYXRhLnJlc3BvbnNlXTtcbiAgICBjb25zdCBhaXJwb3J0RGF0YSA9IGF3YWl0IFByb21pc2UuYWxsKGFsbENvZGVzLm1hcChhc3luYyhhaXJwb3J0KSA9PiB7XG4gICAgICAgIC8vIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KGAke2Jhc2VVcmx9L2FpcnBvcnRzP2lhdGFfY29kZT0ke2FpcnBvcnR9JmFwaV9rZXk9JHthcGlLZXl9YCk7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYWxsQWlycG9ydHNbYWlycG9ydF07XG4gICAgICAgIGNvbnN0IHJlZmluZWRBaXJwb3J0ID0ge1xuICAgICAgICAgICAgdGV4dDogcmVzcG9uc2VbJ2lhdGEnXSxcbiAgICAgICAgICAgIHNpemU6IDEuMCxcbiAgICAgICAgICAgIGNvdW50cnk6IHJlc3BvbnNlWydzdGF0ZSddLFxuICAgICAgICAgICAgY2l0eTogcmVzcG9uc2VbJ2NpdHknXSxcbiAgICAgICAgICAgIGxhdDogcmVzcG9uc2VbJ2xhdCddLFxuICAgICAgICAgICAgbG5nOiByZXNwb25zZVsnbG9uJ10sXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWZpbmVkQWlycG9ydDtcbiAgICB9KSk7XG5cbiAgICByZXR1cm4geyBhbGxGbGlnaHRzLCBhaXJwb3J0RGF0YSB9O1xufVxuXG5cbi8vIFNFQ1RJT04gR2xvYmVcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgICAvLyBJbml0aWFsaXplIHRoZSBHbG9iZVxuICAgIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgICAgICAgICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRlSW46IHRydWUsXG4gICAgICAgIH0pXG4gICAgICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgICAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAgICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgICAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAgICAgLmF0bW9zcGhlcmVDb2xvcihcIiMzYTIyOGFcIilcbiAgICAgICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuXG4gICAgLy8gTk9URSBBcmMgYW5pbWF0aW9ucyBhcmUgZm9sbG93ZWQgYWZ0ZXIgdGhlIGdsb2JlIGVudGVycyB0aGUgc2NlbmVcblxuICAgIGdldEFpcnBvcnREYXRhRnJvbUNhY2hlKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBsZXQgcmVmaW5lZEFpcnBvcnRzID0gZGF0YS5haXJwb3J0RGF0YVxuICAgICAgICBsZXQgYWxsRmxpZ2h0cyA9IGRhdGEuYWxsRmxpZ2h0cztcbiAgICAgICAgR2xvYmUucG9pbnRzRGF0YShyZWZpbmVkQWlycG9ydHMpXG4gICAgICAgIEdsb2JlLmxhYmVsc0RhdGEocmVmaW5lZEFpcnBvcnRzKVxuICAgICAgICBsZXQgY291bnRyaWVzID0gW11cbiAgICAgICAgcmVmaW5lZEFpcnBvcnRzLmZvckVhY2goKGFpcnBvcnQpID0+IHtcbiAgICAgICAgICAgIGNvdW50cmllcy5wdXNoKGFpcnBvcnQuY291bnRyeSlcbiAgICAgICAgfSlcbiAgICAgICAgR2xvYmUuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY291bnRyaWVzLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgICAgICBlLnByb3BlcnRpZXMuSVNPX0EyXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMSlcIjtcbiAgICAgICAgICAgIH0gZWxzZSByZXR1cm4gXCJyZ2JhKDI1NSwyNTUsMjU1LCAwLjQpXCI7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgbGF0TG9uZ0RhdGEgPSB7fVxuXG4gICAgICAgIHJlZmluZWRBaXJwb3J0cy5mb3JFYWNoKChhaXJwb3J0KSA9PiB7XG4gICAgICAgICAgICBsYXRMb25nRGF0YVthaXJwb3J0LnRleHRdID0gW2FpcnBvcnQubGF0LCBhaXJwb3J0LmxuZywgYWlycG9ydC5jaXR5XVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgbGV0IGZsaWdodHMgPSBbXVxuICAgICAgICBsZXQgYXJjQWx0ID0gMC4wNTtcbiAgICAgICAgbGV0IG9yZGVyID0gMDtcbiAgICAgICAgYWxsRmxpZ2h0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBsZXQgYyA9IG5ldyBEYXRlKGEuZGVwX3RpbWUpXG4gICAgICAgICAgICBsZXQgZCA9IG5ldyBEYXRlKGIuZGVwX3RpbWUpXG4gICAgICAgICAgICByZXR1cm4gYy5nZXRUaW1lKCkgLSBkLmdldFRpbWUoKVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGFsbEZsaWdodHMuZm9yRWFjaChmbGlnaHQgPT4ge1xuICAgICAgICAgICAgb3JkZXIgKz0gNDtcbiAgICAgICAgICAgIGZsaWdodHMucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMl0gKyBcIlxcblwiICsgbGF0TG9uZ0RhdGFbZmxpZ2h0LmFycl9pYXRhXVsyXSxcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmbGlnaHRcIixcbiAgICAgICAgICAgICAgICBcIm9yZGVyXCI6IG9yZGVyLFxuICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBmbGlnaHQuZGVwX2lhdGEsXG4gICAgICAgICAgICAgICAgXCJ0b1wiOiBmbGlnaHQuYXJyX2lhdGEsXG4gICAgICAgICAgICAgICAgXCJmbGlnaHRDb2RlXCI6IGZsaWdodC5jc19mbGlnaHRfaWF0YSxcbiAgICAgICAgICAgICAgICBcImRhdGVcIjogZmxpZ2h0LmRlcF90aW1lLFxuICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJzdGFydExhdFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzBdLFxuICAgICAgICAgICAgICAgIFwic3RhcnRMbmdcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVsxXSxcbiAgICAgICAgICAgICAgICBcImVuZExhdFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzBdLFxuICAgICAgICAgICAgICAgIFwiZW5kTG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMV0sXG4gICAgICAgICAgICAgICAgXCJhcmNBbHRcIjogYXJjQWx0XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgYXJjQWx0ICs9IDAuMDM7XG4gICAgICAgIH0pXG5cblxuICAgICAgICBHbG9iZS5hcmNzRGF0YShmbGlnaHRzKVxuICAgICAgICAgICAgLmFyY0NvbG9yKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gXCIjOWNmZjAwXCIgOiBcIiNGRjQwMDBcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXJjQWx0aXR1ZGUoKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5hcmNBbHQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFyY1N0cm9rZSgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLnN0YXR1cyA/IDEgOiAwLjM7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFyY0Rhc2hMZW5ndGgoMC45KVxuICAgICAgICAgICAgLmFyY0Rhc2hHYXAoMjApXG4gICAgICAgICAgICAuYXJjRGFzaEFuaW1hdGVUaW1lKDEwMDApXG4gICAgICAgICAgICAuYXJjc1RyYW5zaXRpb25EdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmFyY0Rhc2hJbml0aWFsR2FwKChlKSA9PiBlLm9yZGVyICogMSlcbiAgICAgICAgICAgIC5sYWJlbENvbG9yKCgpID0+IFwiI2ZmY2IyMVwiKVxuICAgICAgICAgICAgLmxhYmVsRG90T3JpZW50YXRpb24oKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS50ZXh0ID09PSBcIklzdGFuYnVsXCIgPyBcInRvcFwiIDogXCJyaWdodFwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5sYWJlbERvdFJhZGl1cygwLjMpXG4gICAgICAgICAgICAubGFiZWxTaXplKChlKSA9PiBlLnNpemUpXG4gICAgICAgICAgICAubGFiZWxUZXh0KFwiY2l0eVwiKVxuICAgICAgICAgICAgLmxhYmVsUmVzb2x1dGlvbig2KVxuICAgICAgICAgICAgLmxhYmVsQWx0aXR1ZGUoMC4wMSlcbiAgICAgICAgICAgIC5wb2ludENvbG9yKCgpID0+IFwiI2ZmZmZmZlwiKVxuICAgICAgICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAgICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuXG4gICAgICAgIGxldCB0ZXh0cyA9IFtdO1xuICAgICAgICBmbGlnaHRzLmZvckVhY2goKGZsaWdodCkgPT4ge1xuICAgICAgICAgICAgdGV4dHMucHVzaChmbGlnaHRbJ3RleHQnXSlcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgbG9hZGVyID0gbmV3IEZvbnRMb2FkZXIoKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoJy4vZm9udC5qc29uJywgZnVuY3Rpb24oZm9udCkge1xuICAgICAgICAgICAgdGV4dHMuZm9yRWFjaCgocGxhbmVUZXh0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gMHgwMDY2OTk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0TGl0ZSA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNCxcbiAgICAgICAgICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBwbGFuZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVzID0gZm9udC5nZW5lcmF0ZVNoYXBlcyhtZXNzYWdlLCAxMDApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoc2hhcGVzKTtcbiAgICAgICAgICAgICAgICBnZW9tZXRyeS5jZW50ZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdExpdGUpO1xuICAgICAgICAgICAgICAgIHRleHQucG9zaXRpb24ueiA9IC0xNTAgLSBpbmRleDtcbiAgICAgICAgICAgICAgICB0ZXh0Lm1hdGVyaWFsLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgIHRleHQubWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRleHRPYmpzLnB1c2godGV4dCk7XG4gICAgICAgICAgICAgICAgc2NlbmUuYWRkKHRleHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGxvb3BUaHJvdWdoKClcbiAgICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gMjApKTtcbiAgICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNSk7XG4gICAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4M2EyMjhhKTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xO1xuICAgIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuXG4gICAgLy8gTk9URSBDb29sIHN0dWZmXG4gICAgLy8gZ2xvYmVNYXRlcmlhbC53aXJlZnJhbWUgPSB0cnVlO1xuXG4gICAgc2NlbmUuYWRkKEdsb2JlKTtcblxuICAgIC8vIHNjZW5lLmFkZChzcHJpdGUpO1xufVxuXG5sZXQgdGV4dEluZGV4ID0gMDtcblxuLyoqXG4gKiBJdGVyYXRlIHRocm91Z2ggYXJyYXkgZWxlbWVudHMgYW5kIG1vZGlmeSBiYXNlZCBvbiBwb3NpdGlvbi5cbiAqL1xuZnVuY3Rpb24gbG9vcFRocm91Z2goKSB7XG4gICAgaWYgKHRleHRJbmRleCA9PSAwKSB7XG4gICAgICAgIHRleHRPYmpzW3RleHRPYmpzLmxlbmd0aCAtIDFdLm1hdGVyaWFsLm9wYWNpdHkgPSAwO1xuICAgIH1cbiAgICBpZiAodGV4dEluZGV4ID4gMCkge1xuICAgICAgICB0ZXh0T2Jqc1t0ZXh0SW5kZXggLSAxXS5tYXRlcmlhbC5vcGFjaXR5ID0gMDtcbiAgICB9XG4gICAgdGV4dE9ianNbdGV4dEluZGV4XS5tYXRlcmlhbC5vcGFjaXR5ID0gMTtcbiAgICB0ZXh0SW5kZXgrKztcbiAgICBpZiAodGV4dEluZGV4ID49IHRleHRPYmpzLmxlbmd0aCkge1xuICAgICAgICB0ZXh0SW5kZXggPSAwO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KGxvb3BUaHJvdWdoLCAzMDAwKTtcbn1cblxuXG5mdW5jdGlvbiB1cGRhdGVNb3VzZVBvc2l0aW9uKGV2ZW50KSB7XG4gICAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgICBjb25zdCB7IGlubmVyV2lkdGgsIGlubmVySGVpZ2h0IH0gPSB3aW5kb3c7XG4gICAgY2FtZXJhLmFzcGVjdCA9IGlubmVyV2lkdGggLyBpbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgIHdpbmRvd0hhbGZYID0gaW5uZXJXaWR0aCAvIDEuNTtcbiAgICB3aW5kb3dIYWxmWSA9IGlubmVySGVpZ2h0IC8gMS41O1xuICAgIHJlbmRlcmVyLnNldFNpemUoaW5uZXJXaWR0aCwgaW5uZXJIZWlnaHQpO1xufVxuXG4vKipcbiAqIEFuaW1hdGUgY2FtZXJhIGFuZCByZW5kZXIgc2NlbmUuXG4gKi9cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgaWYgKE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyKSB7XG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi54ICs9IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDU7XG4gICAgfVxuICAgIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICAgIGNvbnRyb2xzLnVwZGF0ZSgpO1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCIxMmQ4ODNjZDRlMmJiOTAyNTU4Y1wiIl0sInNvdXJjZVJvb3QiOiIifQ==