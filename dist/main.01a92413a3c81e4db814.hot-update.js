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
/* harmony import */ var _files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./files/my-airports.json */ "./src/files/my-airports.json");
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
    const chaceRef = (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.ref)(db, 'cache');

    return new Promise((resolve, reject) => {
        (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.onValue)(chaceRef, async(snapshot) => {
            const cache = await snapshot.val();

            if (cache && cache.timestamp && cache.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
                console.log("cached");
                resolve(cache.data);
            } else {
                const data = await getAirportData();

                (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.set)((0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.ref)(db, 'cache'), {
                    data: data,
                    timestamp: Date.now(),
                });

                resolve(data);
            }
        });
    });
}



async function getAirportData() {
    const apiKey = '8e83f9f2-b601-4b95-bc9c-5b74a55da62f';
    const baseUrl = 'https://airlabs.co/api/v9';

    const [departure, arrival] = await Promise.all([
        axios__WEBPACK_IMPORTED_MODULE_9__.default.get(`${baseUrl}/schedules?dep_iata=PRN&api_key=${apiKey}`),
        axios__WEBPACK_IMPORTED_MODULE_9__.default.get(`${baseUrl}/schedules?arr_iata=PRN&api_key=${apiKey}`)
    ]);

    const airportCodes = departure.data.response.map((flight) => flight.arr_iata);
    const arrivalCodes = arrival.data.response.map((flight) => flight.dep_iata);
    const allCodes = [...new Set([...airportCodes, ...arrivalCodes])];

    const allFlights = [...departure.data.response, ...arrival.data.response];
    const airportData = await Promise.all(allCodes.map(async(airport) => {
        const response = await axios__WEBPACK_IMPORTED_MODULE_9__.default.get(`${baseUrl}/airports?iata_code=${airport}&api_key=${apiKey}`);
        const refinedAirport = {
            text: response.data.response[0]['iata_code'],
            size: 1.0,
            country: response.data.response[0]['country_code'],
            city: response.data.response[0]['name'].replace("International Airport", "").replace("Airport", ""),
            lat: response.data.response[0]['lat'],
            lng: response.data.response[0]['lng'],
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
        console.log(latLongData)
        let flights = []
        allFlights.map(flight => {
            flights.push({
                "type": "flight",
                "order": 1,
                "from": flight.dep_iata,
                "to": flight.arr_iata,
                "flightCode": flight.cs_flight_iata,
                "date": flight.dep_time,
                "status": true,
                "startLat": latLongData[flight.dep_iata][0] ? latLongData[flight.dep_iata][0] : 0,
                "startLng": latLongData[flight.dep_iata][1] ? latLongData[flight.dep_iata][1] : 0,
                "endLat": latLongData[flight.arr_iata][0] ? latLongData[flight.arr_iata][0] : 0,
                "endLng": latLongData[flight.arr_iata][0] ? latLongData[flight.arr_iata][0] : 0,
                "arcAlt": 0.05
            })
        }).then(() => {
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
/******/ 		__webpack_require__.h = () => "86d1597b75463be94317"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQVk5QjtBQUM4RDtBQUM1QjtBQUNHO0FBQ0E7QUFDRTtBQUM1QjtBQUNtQjtBQUNzQjs7QUFFbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBWSwyREFBYTtBQUN6QixXQUFXLDhEQUFXOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0Isd0NBQUs7QUFDckIsa0JBQWtCLCtDQUFZO0FBQzlCLDJCQUEyQix3Q0FBSzs7QUFFaEM7QUFDQSxpQkFBaUIsb0RBQWlCO0FBQ2xDO0FBQ0E7O0FBRUEscUJBQXFCLG1EQUFnQjtBQUNyQztBQUNBOztBQUVBLHNCQUFzQixtREFBZ0I7QUFDdEM7QUFDQTs7QUFFQSxzQkFBc0IsNkNBQVU7QUFDaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxvQkFBb0Isc0NBQUc7O0FBRXZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLHVGQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7O0FBT0E7QUFDQSxlQUFlLDhEQUFXO0FBQzFCLHFCQUFxQixzREFBRzs7QUFFeEI7QUFDQSxRQUFRLDBEQUFPO0FBQ2Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBLGdCQUFnQixzREFBRyxDQUFDLHNEQUFHO0FBQ3ZCO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMOzs7O0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSw4Q0FBUyxJQUFJLFFBQVEsa0NBQWtDLE9BQU87QUFDdEUsUUFBUSw4Q0FBUyxJQUFJLFFBQVEsa0NBQWtDLE9BQU87QUFDdEU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0IsOENBQVMsSUFBSSxRQUFRLHNCQUFzQixRQUFRLFdBQVcsT0FBTztBQUNwRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLFlBQVk7QUFDWjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGdEQUFVO0FBQzFCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QseUJBQXlCLGdFQUFrQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsd0NBQUs7QUFDbkMsaUNBQWlDLHdDQUFLO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7O1dDdFRBLG9EIiwiZmlsZSI6Im1haW4uMDFhOTI0MTNhM2M4MWU0ZGI4MTQuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7XG4gICAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gICAgQW1iaWVudExpZ2h0LFxuICAgIERpcmVjdGlvbmFsTGlnaHQsXG4gICAgQ29sb3IsXG4gICAgRm9nLFxuICAgIC8vIEF4ZXNIZWxwZXIsXG4gICAgLy8gRGlyZWN0aW9uYWxMaWdodEhlbHBlcixcbiAgICAvLyBDYW1lcmFIZWxwZXIsXG4gICAgUG9pbnRMaWdodCxcbiAgICBTcGhlcmVHZW9tZXRyeSxcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgeyBjcmVhdGVHbG93TWVzaCB9IGZyb20gXCJ0aHJlZS1nbG93LW1lc2hcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiO1xuaW1wb3J0IHRyYXZlbEhpc3RvcnkgZnJvbSBcIi4vZmlsZXMvbXktZmxpZ2h0cy5qc29uXCI7XG5pbXBvcnQgYWlycG9ydEhpc3RvcnkgZnJvbSBcIi4vZmlsZXMvbXktYWlycG9ydHMuanNvblwiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gXCJmaXJlYmFzZS9hcHBcIjtcbmltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIHNldCwgb25WYWx1ZSB9IGZyb20gXCJmaXJlYmFzZS9kYXRhYmFzZVwiO1xuXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgICBhcGlLZXk6IFwiQUl6YVN5QlJGZnpHOWlaaXp4cEdremo0UURmVEFIMzhYMTlienI0XCIsXG4gICAgYXV0aERvbWFpbjogXCJwbGFuZXMtNTc1OWQuZmlyZWJhc2VhcHAuY29tXCIsXG4gICAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9wbGFuZXMtNTc1OWQtZGVmYXVsdC1ydGRiLmV1cm9wZS13ZXN0MS5maXJlYmFzZWRhdGFiYXNlLmFwcFwiLFxuICAgIHByb2plY3RJZDogXCJwbGFuZXMtNTc1OWRcIixcbiAgICBzdG9yYWdlQnVja2V0OiBcInBsYW5lcy01NzU5ZC5hcHBzcG90LmNvbVwiLFxuICAgIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjIwMjcwNjQzODAwN1wiLFxuICAgIGFwcElkOiBcIjE6MjAyNzA2NDM4MDA3OndlYjoyN2JlYWNhOTAwOGJmNTQxMjUwMzcyXCIsXG4gICAgbWVhc3VyZW1lbnRJZDogXCJHLUM1OFgwMFZLWjJcIlxufTtcblxuY29uc3QgYXBwID0gaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XG5jb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG5cbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCBtb3VzZVkgPSAwO1xubGV0IHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xubGV0IHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbnZhciBHbG9iZTtcbmxldCBhaXJwb3J0cyA9IFtdXG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemUgcmVuZGVyZXJcbiAgICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgLy8gcmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgIC8vIEluaXRpYWxpemUgc2NlbmUsIGxpZ2h0XG4gICAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDA0MGQyMSk7XG5cbiAgICAvLyBJbml0aWFsaXplIGNhbWVyYSwgbGlnaHRcbiAgICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gICAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gICAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICAgIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gICAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICAgIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICAgIHNjZW5lLmFkZChjYW1lcmEpO1xuXG4gICAgLy8gQWRkaXRpb25hbCBlZmZlY3RzXG4gICAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICAgIC8vIEhlbHBlcnNcbiAgICAvLyBjb25zdCBheGVzSGVscGVyID0gbmV3IEF4ZXNIZWxwZXIoODAwKTtcbiAgICAvLyBzY2VuZS5hZGQoYXhlc0hlbHBlcik7XG4gICAgLy8gdmFyIGhlbHBlciA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyKGRMaWdodCk7XG4gICAgLy8gc2NlbmUuYWRkKGhlbHBlcik7XG4gICAgLy8gdmFyIGhlbHBlckNhbWVyYSA9IG5ldyBDYW1lcmFIZWxwZXIoZExpZ2h0LnNoYWRvdy5jYW1lcmEpO1xuICAgIC8vIHNjZW5lLmFkZChoZWxwZXJDYW1lcmEpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBjb250cm9sc1xuICAgIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gICAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gICAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gICAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gICAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gICAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG5cbiAgICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcblxufVxuXG5cblxuXG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWlycG9ydERhdGFGcm9tQ2FjaGUoKSB7XG4gICAgY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuICAgIGNvbnN0IGNoYWNlUmVmID0gcmVmKGRiLCAnY2FjaGUnKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIG9uVmFsdWUoY2hhY2VSZWYsIGFzeW5jKHNuYXBzaG90KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZSA9IGF3YWl0IHNuYXBzaG90LnZhbCgpO1xuXG4gICAgICAgICAgICBpZiAoY2FjaGUgJiYgY2FjaGUudGltZXN0YW1wICYmIGNhY2hlLnRpbWVzdGFtcCA+IERhdGUubm93KCkgLSAyNCAqIDYwICogNjAgKiAxMDAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYWNoZWRcIik7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjYWNoZS5kYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGdldEFpcnBvcnREYXRhKCk7XG5cbiAgICAgICAgICAgICAgICBzZXQocmVmKGRiLCAnY2FjaGUnKSwge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuXG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFpcnBvcnREYXRhKCkge1xuICAgIGNvbnN0IGFwaUtleSA9ICc4ZTgzZjlmMi1iNjAxLTRiOTUtYmM5Yy01Yjc0YTU1ZGE2MmYnO1xuICAgIGNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9haXJsYWJzLmNvL2FwaS92OSc7XG5cbiAgICBjb25zdCBbZGVwYXJ0dXJlLCBhcnJpdmFsXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgYXhpb3MuZ2V0KGAke2Jhc2VVcmx9L3NjaGVkdWxlcz9kZXBfaWF0YT1QUk4mYXBpX2tleT0ke2FwaUtleX1gKSxcbiAgICAgICAgYXhpb3MuZ2V0KGAke2Jhc2VVcmx9L3NjaGVkdWxlcz9hcnJfaWF0YT1QUk4mYXBpX2tleT0ke2FwaUtleX1gKVxuICAgIF0pO1xuXG4gICAgY29uc3QgYWlycG9ydENvZGVzID0gZGVwYXJ0dXJlLmRhdGEucmVzcG9uc2UubWFwKChmbGlnaHQpID0+IGZsaWdodC5hcnJfaWF0YSk7XG4gICAgY29uc3QgYXJyaXZhbENvZGVzID0gYXJyaXZhbC5kYXRhLnJlc3BvbnNlLm1hcCgoZmxpZ2h0KSA9PiBmbGlnaHQuZGVwX2lhdGEpO1xuICAgIGNvbnN0IGFsbENvZGVzID0gWy4uLm5ldyBTZXQoWy4uLmFpcnBvcnRDb2RlcywgLi4uYXJyaXZhbENvZGVzXSldO1xuXG4gICAgY29uc3QgYWxsRmxpZ2h0cyA9IFsuLi5kZXBhcnR1cmUuZGF0YS5yZXNwb25zZSwgLi4uYXJyaXZhbC5kYXRhLnJlc3BvbnNlXTtcbiAgICBjb25zdCBhaXJwb3J0RGF0YSA9IGF3YWl0IFByb21pc2UuYWxsKGFsbENvZGVzLm1hcChhc3luYyhhaXJwb3J0KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KGAke2Jhc2VVcmx9L2FpcnBvcnRzP2lhdGFfY29kZT0ke2FpcnBvcnR9JmFwaV9rZXk9JHthcGlLZXl9YCk7XG4gICAgICAgIGNvbnN0IHJlZmluZWRBaXJwb3J0ID0ge1xuICAgICAgICAgICAgdGV4dDogcmVzcG9uc2UuZGF0YS5yZXNwb25zZVswXVsnaWF0YV9jb2RlJ10sXG4gICAgICAgICAgICBzaXplOiAxLjAsXG4gICAgICAgICAgICBjb3VudHJ5OiByZXNwb25zZS5kYXRhLnJlc3BvbnNlWzBdWydjb3VudHJ5X2NvZGUnXSxcbiAgICAgICAgICAgIGNpdHk6IHJlc3BvbnNlLmRhdGEucmVzcG9uc2VbMF1bJ25hbWUnXS5yZXBsYWNlKFwiSW50ZXJuYXRpb25hbCBBaXJwb3J0XCIsIFwiXCIpLnJlcGxhY2UoXCJBaXJwb3J0XCIsIFwiXCIpLFxuICAgICAgICAgICAgbGF0OiByZXNwb25zZS5kYXRhLnJlc3BvbnNlWzBdWydsYXQnXSxcbiAgICAgICAgICAgIGxuZzogcmVzcG9uc2UuZGF0YS5yZXNwb25zZVswXVsnbG5nJ10sXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWZpbmVkQWlycG9ydDtcbiAgICB9KSk7XG5cbiAgICByZXR1cm4geyBhbGxGbGlnaHRzLCBhaXJwb3J0RGF0YSB9O1xufVxuXG5cbi8vIFNFQ1RJT04gR2xvYmVcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgICAvLyBJbml0aWFsaXplIHRoZSBHbG9iZVxuICAgIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgICAgICAgICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRlSW46IHRydWUsXG4gICAgICAgIH0pXG4gICAgICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgICAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAgICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgICAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAgICAgLmF0bW9zcGhlcmVDb2xvcihcIiMzYTIyOGFcIilcbiAgICAgICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuXG4gICAgLy8gTk9URSBBcmMgYW5pbWF0aW9ucyBhcmUgZm9sbG93ZWQgYWZ0ZXIgdGhlIGdsb2JlIGVudGVycyB0aGUgc2NlbmVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcblxuICAgIH0sIDEwMDApO1xuXG4gICAgZ2V0QWlycG9ydERhdGFGcm9tQ2FjaGUoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEsICd0ZXN0JylcbiAgICAgICAgbGV0IHJlZmluZWRBaXJwb3J0cyA9IGRhdGEuYWlycG9ydERhdGFcbiAgICAgICAgbGV0IGFsbEZsaWdodHMgPSBkYXRhLmFsbEZsaWdodHM7XG4gICAgICAgIEdsb2JlLnBvaW50c0RhdGEocmVmaW5lZEFpcnBvcnRzKVxuICAgICAgICBHbG9iZS5sYWJlbHNEYXRhKHJlZmluZWRBaXJwb3J0cylcbiAgICAgICAgbGV0IGNvdW50cmllcyA9IFtdXG4gICAgICAgIHJlZmluZWRBaXJwb3J0cy5mb3JFYWNoKChhaXJwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb3VudHJpZXMucHVzaChhaXJwb3J0LmNvdW50cnkpXG4gICAgICAgIH0pXG4gICAgICAgIEdsb2JlLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGNvdW50cmllcy5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICAgICAgZS5wcm9wZXJ0aWVzLklTT19BMlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDEpXCI7XG4gICAgICAgICAgICB9IGVsc2UgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMC40KVwiO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGxhdExvbmdEYXRhID0ge31cblxuICAgICAgICByZWZpbmVkQWlycG9ydHMuZm9yRWFjaCgoYWlycG9ydCkgPT4ge1xuICAgICAgICAgICAgbGF0TG9uZ0RhdGFbYWlycG9ydC50ZXh0XSA9IFthaXJwb3J0LmxhdCwgYWlycG9ydC5sbmddXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKGxhdExvbmdEYXRhKVxuICAgICAgICBsZXQgZmxpZ2h0cyA9IFtdXG4gICAgICAgIGFsbEZsaWdodHMubWFwKGZsaWdodCA9PiB7XG4gICAgICAgICAgICBmbGlnaHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImZsaWdodFwiLFxuICAgICAgICAgICAgICAgIFwib3JkZXJcIjogMSxcbiAgICAgICAgICAgICAgICBcImZyb21cIjogZmxpZ2h0LmRlcF9pYXRhLFxuICAgICAgICAgICAgICAgIFwidG9cIjogZmxpZ2h0LmFycl9pYXRhLFxuICAgICAgICAgICAgICAgIFwiZmxpZ2h0Q29kZVwiOiBmbGlnaHQuY3NfZmxpZ2h0X2lhdGEsXG4gICAgICAgICAgICAgICAgXCJkYXRlXCI6IGZsaWdodC5kZXBfdGltZSxcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwic3RhcnRMYXRcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVswXSA/IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMF0gOiAwLFxuICAgICAgICAgICAgICAgIFwic3RhcnRMbmdcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVsxXSA/IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMV0gOiAwLFxuICAgICAgICAgICAgICAgIFwiZW5kTGF0XCI6IGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMF0gPyBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzBdIDogMCxcbiAgICAgICAgICAgICAgICBcImVuZExuZ1wiOiBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzBdID8gbGF0TG9uZ0RhdGFbZmxpZ2h0LmFycl9pYXRhXVswXSA6IDAsXG4gICAgICAgICAgICAgICAgXCJhcmNBbHRcIjogMC4wNVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBHbG9iZS5hcmNzRGF0YShmbGlnaHRzKVxuICAgICAgICAgICAgICAgIC5hcmNDb2xvcigoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS5zdGF0dXMgPyBcIiM5Y2ZmMDBcIiA6IFwiI0ZGNDAwMFwiO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFyY0FsdGl0dWRlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlLmFyY0FsdDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5hcmNTdHJva2UoKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gMC41IDogMC4zO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFyY0Rhc2hMZW5ndGgoMC45KVxuICAgICAgICAgICAgICAgIC5hcmNEYXNoR2FwKDQpXG4gICAgICAgICAgICAgICAgLmFyY0Rhc2hBbmltYXRlVGltZSgxMDAwKVxuICAgICAgICAgICAgICAgIC5hcmNzVHJhbnNpdGlvbkR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAgICAgLmFyY0Rhc2hJbml0aWFsR2FwKChlKSA9PiBlLm9yZGVyICogMSlcbiAgICAgICAgICAgICAgICAubGFiZWxDb2xvcigoKSA9PiBcIiNmZmNiMjFcIilcbiAgICAgICAgICAgICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS50ZXh0ID09PSBcIkFMQVwiID8gXCJ0b3BcIiA6IFwicmlnaHRcIjtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5sYWJlbERvdFJhZGl1cygwLjMpXG4gICAgICAgICAgICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgICAgICAgICAgIC5sYWJlbFRleHQoXCJjaXR5XCIpXG4gICAgICAgICAgICAgICAgLmxhYmVsUmVzb2x1dGlvbig2KVxuICAgICAgICAgICAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAgICAgICAgICAgLnBvaW50Q29sb3IoKCkgPT4gXCIjZmZmZmZmXCIpXG4gICAgICAgICAgICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAgICAgICAgICAgLnBvaW50QWx0aXR1ZGUoMC4wNylcbiAgICAgICAgICAgICAgICAucG9pbnRSYWRpdXMoMC4wNSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gMTgpKTtcbiAgICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG4gICAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4M2EyMjhhKTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xO1xuICAgIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuXG4gICAgLy8gTk9URSBDb29sIHN0dWZmXG4gICAgLy8gZ2xvYmVNYXRlcmlhbC53aXJlZnJhbWUgPSB0cnVlO1xuXG4gICAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gICAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xuICAgIC8vIGNvbnNvbGUubG9nKFwieDogXCIgKyBtb3VzZVggKyBcIiB5OiBcIiArIG1vdXNlWSk7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gICAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICBjYW1lcmEucG9zaXRpb24ueCArPVxuICAgICAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMiA/XG4gICAgICAgIChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDUgOlxuICAgICAgICAwO1xuICAgIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICAgIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICAgIGNvbnRyb2xzLnVwZGF0ZSgpO1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI4NmQxNTk3Yjc1NDYzYmU5NDMxN1wiIl0sInNvdXJjZVJvb3QiOiIifQ==