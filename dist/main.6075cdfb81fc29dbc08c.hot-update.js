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

            if (cache && cache.timestamp && cache.timestamp < Date.now() - 24 * 60 * 60 * 1000) {
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
    const apiKey = '254547cd-b3df-4d55-8676-ddb0a4dc0a63';
    const baseUrl = 'https://airlabs.co/api/v9';

    const [departure, arrival] = await Promise.all([
        axios__WEBPACK_IMPORTED_MODULE_9__.default.get(`${baseUrl}/schedules?dep_iata=PRN&api_key=${apiKey}`),
        axios__WEBPACK_IMPORTED_MODULE_9__.default.get(`${baseUrl}/schedules?arr_iata=PRN&api_key=${apiKey}`)
    ]);

    const airportCodes = departure.data.response.map((flight) => flight.arr_iata);
    const arrivalCodes = arrival.data.response.map((flight) => flight.dep_iata);
    const prishtinaCode = arrival.data.response.map((flight) => flight.arr_iata);
    const allCodes = [...new Set([...airportCodes, ...arrivalCodes, ...prishtinaCode])];

    const allFlights = [...departure.data.response, ...arrival.data.response];
    console.log(_files_airports_json__WEBPACK_IMPORTED_MODULE_4__)
    const airportData = await Promise.all(allCodes.map(async(airport) => {
        // const response = await axios.get(`${baseUrl}/airports?iata_code=${airport}&api_key=${apiKey}`);
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
            console.log(flight.dep_iata, "ardit")
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
/******/ 		__webpack_require__.h = () => "073fc66183b9486fb9a9"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQVk5QjtBQUM4RDtBQUM1QjtBQUNHO0FBQ0E7QUFDSjtBQUN0QjtBQUNtQjtBQUNzQjs7QUFFbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBWSwyREFBYTtBQUN6QixXQUFXLDhEQUFXOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0Isd0NBQUs7QUFDckIsa0JBQWtCLCtDQUFZO0FBQzlCLDJCQUEyQix3Q0FBSzs7QUFFaEM7QUFDQSxpQkFBaUIsb0RBQWlCO0FBQ2xDO0FBQ0E7O0FBRUEscUJBQXFCLG1EQUFnQjtBQUNyQztBQUNBOztBQUVBLHNCQUFzQixtREFBZ0I7QUFDdEM7QUFDQTs7QUFFQSxzQkFBc0IsNkNBQVU7QUFDaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxvQkFBb0Isc0NBQUc7O0FBRXZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLHVGQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7O0FBT0E7QUFDQSxlQUFlLDhEQUFXO0FBQzFCLHFCQUFxQixzREFBRzs7QUFFeEI7QUFDQSxRQUFRLDBEQUFPO0FBQ2Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBLGdCQUFnQixzREFBRyxDQUFDLHNEQUFHO0FBQ3ZCO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMOzs7O0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSw4Q0FBUyxJQUFJLFFBQVEsa0NBQWtDLE9BQU87QUFDdEUsUUFBUSw4Q0FBUyxJQUFJLFFBQVEsa0NBQWtDLE9BQU87QUFDdEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsaURBQVc7QUFDM0I7QUFDQSwrQ0FBK0MsUUFBUSxzQkFBc0IsUUFBUSxXQUFXLE9BQU87QUFDdkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTCxZQUFZO0FBQ1o7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixnREFBVTtBQUMxQjtBQUNBO0FBQ0EsU0FBUztBQUNULHlCQUF5QixnRUFBa0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix3Q0FBSztBQUNuQyxpQ0FBaUMsd0NBQUs7QUFDdEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7V0MzVEEsb0QiLCJmaWxlIjoibWFpbi42MDc1Y2RmYjgxZmMyOWRiYzA4Yy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHtcbiAgICBQZXJzcGVjdGl2ZUNhbWVyYSxcbiAgICBBbWJpZW50TGlnaHQsXG4gICAgRGlyZWN0aW9uYWxMaWdodCxcbiAgICBDb2xvcixcbiAgICBGb2csXG4gICAgLy8gQXhlc0hlbHBlcixcbiAgICAvLyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyLFxuICAgIC8vIENhbWVyYUhlbHBlcixcbiAgICBQb2ludExpZ2h0LFxuICAgIFNwaGVyZUdlb21ldHJ5LFxufSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCB7IGNyZWF0ZUdsb3dNZXNoIH0gZnJvbSBcInRocmVlLWdsb3ctbWVzaFwiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgdHJhdmVsSGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1mbGlnaHRzLmpzb25cIjtcbmltcG9ydCBhbGxBaXJwb3J0cyBmcm9tIFwiLi9maWxlcy9haXJwb3J0cy5qc29uXCI7XG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSBcImZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UsIHJlZiwgc2V0LCBvblZhbHVlIH0gZnJvbSBcImZpcmViYXNlL2RhdGFiYXNlXCI7XG5cbmNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xuICAgIGFwaUtleTogXCJBSXphU3lCUkZmekc5aVppenhwR2t6ajRRRGZUQUgzOFgxOWJ6cjRcIixcbiAgICBhdXRoRG9tYWluOiBcInBsYW5lcy01NzU5ZC5maXJlYmFzZWFwcC5jb21cIixcbiAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL3BsYW5lcy01NzU5ZC1kZWZhdWx0LXJ0ZGIuZXVyb3BlLXdlc3QxLmZpcmViYXNlZGF0YWJhc2UuYXBwXCIsXG4gICAgcHJvamVjdElkOiBcInBsYW5lcy01NzU5ZFwiLFxuICAgIHN0b3JhZ2VCdWNrZXQ6IFwicGxhbmVzLTU3NTlkLmFwcHNwb3QuY29tXCIsXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMjAyNzA2NDM4MDA3XCIsXG4gICAgYXBwSWQ6IFwiMToyMDI3MDY0MzgwMDc6d2ViOjI3YmVhY2E5MDA4YmY1NDEyNTAzNzJcIixcbiAgICBtZWFzdXJlbWVudElkOiBcIkctQzU4WDAwVktaMlwiXG59O1xuXG5jb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbmNvbnN0IGRiID0gZ2V0RGF0YWJhc2UoKTtcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xubGV0IGFpcnBvcnRzID0gW11cblxuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICAgIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICAgIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDQwZDIxKTtcblxuICAgIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICAgIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICAgIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICAgIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gICAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gICAgc2NlbmUuYWRkKGNhbWVyYSk7XG5cbiAgICAvLyBBZGRpdGlvbmFsIGVmZmVjdHNcbiAgICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gICAgLy8gSGVscGVyc1xuICAgIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAgIC8vIHNjZW5lLmFkZChheGVzSGVscGVyKTtcbiAgICAvLyB2YXIgaGVscGVyID0gbmV3IERpcmVjdGlvbmFsTGlnaHRIZWxwZXIoZExpZ2h0KTtcbiAgICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgICAvLyB2YXIgaGVscGVyQ2FtZXJhID0gbmV3IENhbWVyYUhlbHBlcihkTGlnaHQuc2hhZG93LmNhbWVyYSk7XG4gICAgLy8gc2NlbmUuYWRkKGhlbHBlckNhbWVyYSk7XG5cbiAgICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gICAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICAgIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICAgIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICAgIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICAgIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuXG59XG5cblxuXG5cblxuXG5hc3luYyBmdW5jdGlvbiBnZXRBaXJwb3J0RGF0YUZyb21DYWNoZSgpIHtcbiAgICBjb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG4gICAgY29uc3QgY2hhY2VSZWYgPSByZWYoZGIsICdjYWNoZScpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgb25WYWx1ZShjaGFjZVJlZiwgYXN5bmMoc25hcHNob3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gYXdhaXQgc25hcHNob3QudmFsKCk7XG5cbiAgICAgICAgICAgIGlmIChjYWNoZSAmJiBjYWNoZS50aW1lc3RhbXAgJiYgY2FjaGUudGltZXN0YW1wIDwgRGF0ZS5ub3coKSAtIDI0ICogNjAgKiA2MCAqIDEwMDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhY2hlZFwiKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGNhY2hlLmRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZ2V0QWlycG9ydERhdGEoKTtcblxuICAgICAgICAgICAgICAgIHNldChyZWYoZGIsICdjYWNoZScpLCB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWlycG9ydERhdGEoKSB7XG4gICAgY29uc3QgYXBpS2V5ID0gJzI1NDU0N2NkLWIzZGYtNGQ1NS04Njc2LWRkYjBhNGRjMGE2Myc7XG4gICAgY29uc3QgYmFzZVVybCA9ICdodHRwczovL2FpcmxhYnMuY28vYXBpL3Y5JztcblxuICAgIGNvbnN0IFtkZXBhcnR1cmUsIGFycml2YWxdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2RlcF9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApLFxuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2Fycl9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApXG4gICAgXSk7XG5cbiAgICBjb25zdCBhaXJwb3J0Q29kZXMgPSBkZXBhcnR1cmUuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmFycl9pYXRhKTtcbiAgICBjb25zdCBhcnJpdmFsQ29kZXMgPSBhcnJpdmFsLmRhdGEucmVzcG9uc2UubWFwKChmbGlnaHQpID0+IGZsaWdodC5kZXBfaWF0YSk7XG4gICAgY29uc3QgcHJpc2h0aW5hQ29kZSA9IGFycml2YWwuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmFycl9pYXRhKTtcbiAgICBjb25zdCBhbGxDb2RlcyA9IFsuLi5uZXcgU2V0KFsuLi5haXJwb3J0Q29kZXMsIC4uLmFycml2YWxDb2RlcywgLi4ucHJpc2h0aW5hQ29kZV0pXTtcblxuICAgIGNvbnN0IGFsbEZsaWdodHMgPSBbLi4uZGVwYXJ0dXJlLmRhdGEucmVzcG9uc2UsIC4uLmFycml2YWwuZGF0YS5yZXNwb25zZV07XG4gICAgY29uc29sZS5sb2coYWxsQWlycG9ydHMpXG4gICAgY29uc3QgYWlycG9ydERhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChhbGxDb2Rlcy5tYXAoYXN5bmMoYWlycG9ydCkgPT4ge1xuICAgICAgICAvLyBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgJHtiYXNlVXJsfS9haXJwb3J0cz9pYXRhX2NvZGU9JHthaXJwb3J0fSZhcGlfa2V5PSR7YXBpS2V5fWApO1xuICAgICAgICBjb25zdCByZWZpbmVkQWlycG9ydCA9IHtcbiAgICAgICAgICAgIHRleHQ6IHJlc3BvbnNlLmRhdGEucmVzcG9uc2VbMF1bJ2lhdGFfY29kZSddLFxuICAgICAgICAgICAgc2l6ZTogMS4wLFxuICAgICAgICAgICAgY291bnRyeTogcmVzcG9uc2UuZGF0YS5yZXNwb25zZVswXVsnY291bnRyeV9jb2RlJ10sXG4gICAgICAgICAgICBjaXR5OiByZXNwb25zZS5kYXRhLnJlc3BvbnNlWzBdWyduYW1lJ10ucmVwbGFjZShcIkludGVybmF0aW9uYWwgQWlycG9ydFwiLCBcIlwiKS5yZXBsYWNlKFwiQWlycG9ydFwiLCBcIlwiKSxcbiAgICAgICAgICAgIGxhdDogcmVzcG9uc2UuZGF0YS5yZXNwb25zZVswXVsnbGF0J10sXG4gICAgICAgICAgICBsbmc6IHJlc3BvbnNlLmRhdGEucmVzcG9uc2VbMF1bJ2xuZyddLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVmaW5lZEFpcnBvcnQ7XG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHsgYWxsRmxpZ2h0cywgYWlycG9ydERhdGEgfTtcbn1cblxuXG4vLyBTRUNUSU9OIEdsb2JlXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgR2xvYmVcbiAgICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICAgICAgICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0ZUluOiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAgICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAgICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgICAgIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcblxuICAgIC8vIE5PVEUgQXJjIGFuaW1hdGlvbnMgYXJlIGZvbGxvd2VkIGFmdGVyIHRoZSBnbG9iZSBlbnRlcnMgdGhlIHNjZW5lXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICB9LCAxMDAwKTtcblxuICAgIGdldEFpcnBvcnREYXRhRnJvbUNhY2hlKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLCAndGVzdCcpXG4gICAgICAgIGxldCByZWZpbmVkQWlycG9ydHMgPSBkYXRhLmFpcnBvcnREYXRhXG4gICAgICAgIGxldCBhbGxGbGlnaHRzID0gZGF0YS5hbGxGbGlnaHRzO1xuICAgICAgICBHbG9iZS5wb2ludHNEYXRhKHJlZmluZWRBaXJwb3J0cylcbiAgICAgICAgR2xvYmUubGFiZWxzRGF0YShyZWZpbmVkQWlycG9ydHMpXG4gICAgICAgIGxldCBjb3VudHJpZXMgPSBbXVxuICAgICAgICByZWZpbmVkQWlycG9ydHMuZm9yRWFjaCgoYWlycG9ydCkgPT4ge1xuICAgICAgICAgICAgY291bnRyaWVzLnB1c2goYWlycG9ydC5jb3VudHJ5KVxuICAgICAgICB9KVxuICAgICAgICBHbG9iZS5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjb3VudHJpZXMuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgICAgIGUucHJvcGVydGllcy5JU09fQTJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJyZ2JhKDI1NSwyNTUsMjU1LCAxKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDAuNClcIjtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBsYXRMb25nRGF0YSA9IHt9XG5cbiAgICAgICAgcmVmaW5lZEFpcnBvcnRzLmZvckVhY2goKGFpcnBvcnQpID0+IHtcbiAgICAgICAgICAgIGxhdExvbmdEYXRhW2FpcnBvcnQudGV4dF0gPSBbYWlycG9ydC5sYXQsIGFpcnBvcnQubG5nXVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGxhdExvbmdEYXRhKVxuXG4gICAgICAgIGxldCBmbGlnaHRzID0gW11cbiAgICAgICAgYWxsRmxpZ2h0cy5tYXAoZmxpZ2h0ID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZsaWdodC5kZXBfaWF0YSwgXCJhcmRpdFwiKVxuICAgICAgICAgICAgZmxpZ2h0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmbGlnaHRcIixcbiAgICAgICAgICAgICAgICBcIm9yZGVyXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJmcm9tXCI6IGZsaWdodC5kZXBfaWF0YSxcbiAgICAgICAgICAgICAgICBcInRvXCI6IGZsaWdodC5hcnJfaWF0YSxcbiAgICAgICAgICAgICAgICBcImZsaWdodENvZGVcIjogZmxpZ2h0LmNzX2ZsaWdodF9pYXRhLFxuICAgICAgICAgICAgICAgIFwiZGF0ZVwiOiBmbGlnaHQuZGVwX3RpbWUsXG4gICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInN0YXJ0TGF0XCI6IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMF0gPyBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzBdIDogMCxcbiAgICAgICAgICAgICAgICBcInN0YXJ0TG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMV0gPyBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzFdIDogMCxcbiAgICAgICAgICAgICAgICBcImVuZExhdFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzBdID8gbGF0TG9uZ0RhdGFbZmxpZ2h0LmFycl9pYXRhXVswXSA6IDAsXG4gICAgICAgICAgICAgICAgXCJlbmRMbmdcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmFycl9pYXRhXVswXSA/IGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMF0gOiAwLFxuICAgICAgICAgICAgICAgIFwiYXJjQWx0XCI6IDAuMDVcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgR2xvYmUuYXJjc0RhdGEoZmxpZ2h0cylcbiAgICAgICAgICAgICAgICAuYXJjQ29sb3IoKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gXCIjOWNmZjAwXCIgOiBcIiNGRjQwMDBcIjtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5hcmNBbHRpdHVkZSgoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS5hcmNBbHQ7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYXJjU3Ryb2tlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlLnN0YXR1cyA/IDAuNSA6IDAuMztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5hcmNEYXNoTGVuZ3RoKDAuOSlcbiAgICAgICAgICAgICAgICAuYXJjRGFzaEdhcCg0KVxuICAgICAgICAgICAgICAgIC5hcmNEYXNoQW5pbWF0ZVRpbWUoMTAwMClcbiAgICAgICAgICAgICAgICAuYXJjc1RyYW5zaXRpb25EdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgICAgIC5hcmNEYXNoSW5pdGlhbEdhcCgoZSkgPT4gZS5vcmRlciAqIDEpXG4gICAgICAgICAgICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gXCIjZmZjYjIxXCIpXG4gICAgICAgICAgICAgICAgLmxhYmVsRG90T3JpZW50YXRpb24oKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudGV4dCA9PT0gXCJBTEFcIiA/IFwidG9wXCIgOiBcInJpZ2h0XCI7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAubGFiZWxEb3RSYWRpdXMoMC4zKVxuICAgICAgICAgICAgICAgIC5sYWJlbFNpemUoKGUpID0+IGUuc2l6ZSlcbiAgICAgICAgICAgICAgICAubGFiZWxUZXh0KFwiY2l0eVwiKVxuICAgICAgICAgICAgICAgIC5sYWJlbFJlc29sdXRpb24oNilcbiAgICAgICAgICAgICAgICAubGFiZWxBbHRpdHVkZSgwLjAxKVxuICAgICAgICAgICAgICAgIC5wb2ludENvbG9yKCgpID0+IFwiI2ZmZmZmZlwiKVxuICAgICAgICAgICAgICAgIC5wb2ludHNNZXJnZSh0cnVlKVxuICAgICAgICAgICAgICAgIC5wb2ludEFsdGl0dWRlKDAuMDcpXG4gICAgICAgICAgICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIEdsb2JlLnJvdGF0ZVkoLU1hdGguUEkgKiAoNSAvIDE4KSk7XG4gICAgR2xvYmUucm90YXRlWigtTWF0aC5QSSAvIDYpO1xuICAgIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gICAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDNhMjI4YSk7XG4gICAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDIyMDAzOCk7XG4gICAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDAuNztcblxuICAgIC8vIE5PVEUgQ29vbCBzdHVmZlxuICAgIC8vIGdsb2JlTWF0ZXJpYWwud2lyZWZyYW1lID0gdHJ1ZTtcblxuICAgIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICAgIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIng6IFwiICsgbW91c2VYICsgXCIgeTogXCIgKyBtb3VzZVkpO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICAgIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICAgICAgTWF0aC5hYnMobW91c2VYKSA8PSB3aW5kb3dIYWxmWCAvIDIgP1xuICAgICAgICAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1IDpcbiAgICAgICAgMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueSArPSAoLW1vdXNlWSAvIDIgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjAwNTtcbiAgICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgICBjb250cm9scy51cGRhdGUoKTtcbiAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufSIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiMDczZmM2NjE4M2I5NDg2ZmI5YTlcIiJdLCJzb3VyY2VSb290IjoiIn0=