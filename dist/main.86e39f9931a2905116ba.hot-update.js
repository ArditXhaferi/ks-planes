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
initGlobe();
onWindowResize();
animate();

// SECTION Initializing core ThreeJS elements
function init() {
    // Initialize renderer
    renderer = new three__WEBPACK_IMPORTED_MODULE_5__.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // Initialize scene, light
    scene = new three__WEBPACK_IMPORTED_MODULE_5__.Scene();
    scene.add(new three__WEBPACK_IMPORTED_MODULE_5__.AmbientLight(0xbbbbbb, 0.3));
    scene.background = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x040d21);

    // Initialize camera, light
    camera = new three__WEBPACK_IMPORTED_MODULE_5__.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    var dLight = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(-800, 2000, 400);
    camera.add(dLight);

    var dLight1 = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0x7982f6, 1);
    dLight1.position.set(-200, 500, 200);
    camera.add(dLight1);

    var dLight2 = new three__WEBPACK_IMPORTED_MODULE_5__.PointLight(0x8566cc, 0.5);
    dLight2.position.set(-200, 500, 200);
    camera.add(dLight2);

    camera.position.z = 400;
    camera.position.x = 0;
    camera.position.y = 0;

    scene.add(camera);

    // Additional effects
    scene.fog = new three__WEBPACK_IMPORTED_MODULE_5__.Fog(0x535ef3, 400, 2000);

    // Helpers
    // const axesHelper = new AxesHelper(800);
    // scene.add(axesHelper);
    // var helper = new DirectionalLightHelper(dLight);
    // scene.add(helper);
    // var helperCamera = new CameraHelper(dLight.shadow.camera);
    // scene.add(helperCamera);

    // Initialize controls
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

    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("mousemove", onMouseMove);

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


function onMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
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
    // camera.position.y -= (mouseY / 2 - camera.position.y) * 0.005;
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
/******/ 		__webpack_require__.h = () => "e23341faf745a42189ab"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ047QUFDcUc7QUFDdkQ7QUFDekI7QUFDSjtBQUN0QjtBQUNtQjtBQUN5Qjs7QUFFdEU7QUFDQSxZQUFZLHlDQUFtQjtBQUMvQixnQkFBZ0IsOEJBQXVCO0FBQ3ZDLGlCQUFpQixxRUFBd0I7QUFDekMsZUFBZSxjQUFzQjtBQUNyQyxtQkFBbUIsMEJBQTBCO0FBQzdDLHVCQUF1QixjQUErQjtBQUN0RCxXQUFXLDJDQUFrQjtBQUM3QixtQkFBbUIsY0FBMEI7QUFDN0M7O0FBRUEsWUFBWSwyREFBYTtBQUN6QixXQUFXLDhEQUFXOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHdDQUFLO0FBQ3JCLGtCQUFrQiwrQ0FBWTtBQUM5QiwyQkFBMkIsd0NBQUs7O0FBRWhDO0FBQ0EsaUJBQWlCLG9EQUFpQjtBQUNsQztBQUNBOztBQUVBLHFCQUFxQixtREFBZ0I7QUFDckM7QUFDQTs7QUFFQSxzQkFBc0IsbURBQWdCO0FBQ3RDO0FBQ0E7O0FBRUEsc0JBQXNCLDZDQUFVO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esb0JBQW9CLHNDQUFHOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQix1RkFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7OztBQU9BO0FBQ0EscUJBQXFCLHNEQUFHOztBQUV4QjtBQUNBLFFBQVEsc0RBQUcsQ0FBQyx3REFBSztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsZ0JBQWdCLHNEQUFHLENBQUMsc0RBQUc7QUFDdkI7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7Ozs7QUFJQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLDhDQUFTLElBQUksUUFBUSxrQ0FBa0MsT0FBTztBQUN0RSxRQUFRLDhDQUFTLElBQUksUUFBUSxrQ0FBa0MsT0FBTztBQUN0RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0NBQStDLFFBQVEsc0JBQXNCLFFBQVEsV0FBVyxPQUFPO0FBQ3ZHLHlCQUF5QixpREFBVztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLFlBQVk7QUFDWjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGdEQUFVO0FBQzFCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QseUJBQXlCLGdFQUFrQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7OztBQUdUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUzs7O0FBR1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsMkJBQTJCLDZDQUFVO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxvREFBdUI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLDZDQUFnQjtBQUMxQyxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLHFDQUFxQyxnREFBbUI7QUFDeEQ7QUFDQSxpQ0FBaUMsdUNBQVU7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7OztBQUdULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHdDQUFLO0FBQ25DLGlDQUFpQyx3Q0FBSztBQUN0QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7O1dDcldBLG9EIiwiZmlsZSI6Im1haW4uODZlMzlmOTkzMWEyOTA1MTE2YmEuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSwgUGVyc3BlY3RpdmVDYW1lcmEsIEFtYmllbnRMaWdodCwgRGlyZWN0aW9uYWxMaWdodCwgQ29sb3IsIEZvZywgUG9pbnRMaWdodCwgRm9udExvYWRlciB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgYWxsQWlycG9ydHMgZnJvbSBcIi4vZmlsZXMvYWlycG9ydHMuanNvblwiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gXCJmaXJlYmFzZS9hcHBcIjtcbmltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIHNldCwgZ2V0LCBjaGlsZCB9IGZyb20gXCJmaXJlYmFzZS9kYXRhYmFzZVwiO1xuXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgICBhcGlLZXk6IHByb2Nlc3MuZW52LkFQSV9LRVksXG4gICAgYXV0aERvbWFpbjogcHJvY2Vzcy5lbnYuQVVUSF9ET01BSU4sXG4gICAgZGF0YWJhc2VVUkw6IHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTCxcbiAgICBwcm9qZWN0SWQ6IHByb2Nlc3MuZW52LlBST0pFQ1RfSUQsXG4gICAgc3RvcmFnZUJ1Y2tldDogcHJvY2Vzcy5lbnYuU1RPUkFHRV9CVUNLRVQsXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IHByb2Nlc3MuZW52Lk1FU1NBR0lOR19TRU5ERVJfSUQsXG4gICAgYXBwSWQ6IHByb2Nlc3MuZW52LkFQUF9JRCxcbiAgICBtZWFzdXJlbWVudElkOiBwcm9jZXNzLmVudi5NRUFTVVJFTUVOVF9JRFxufTtcblxuY29uc3QgYXBwID0gaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XG5jb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG5cbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5sZXQgdGV4dE9ianMgPSBbXTtcblxuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICAgIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICAgIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDQwZDIxKTtcblxuICAgIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICAgIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICAgIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICAgIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gICAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gICAgc2NlbmUuYWRkKGNhbWVyYSk7XG5cbiAgICAvLyBBZGRpdGlvbmFsIGVmZmVjdHNcbiAgICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gICAgLy8gSGVscGVyc1xuICAgIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAgIC8vIHNjZW5lLmFkZChheGVzSGVscGVyKTtcbiAgICAvLyB2YXIgaGVscGVyID0gbmV3IERpcmVjdGlvbmFsTGlnaHRIZWxwZXIoZExpZ2h0KTtcbiAgICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgICAvLyB2YXIgaGVscGVyQ2FtZXJhID0gbmV3IENhbWVyYUhlbHBlcihkTGlnaHQuc2hhZG93LmNhbWVyYSk7XG4gICAgLy8gc2NlbmUuYWRkKGhlbHBlckNhbWVyYSk7XG5cbiAgICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gICAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICAgIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICAgIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICAgIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICAgIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuXG59XG5cblxuXG5cblxuXG5hc3luYyBmdW5jdGlvbiBnZXRBaXJwb3J0RGF0YUZyb21DYWNoZSgpIHtcbiAgICBjb25zdCBjaGFjZVJlZiA9IHJlZihkYik7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBnZXQoY2hpbGQoY2hhY2VSZWYsICdjYWNoZScpKS50aGVuKGFzeW5jKHNuYXBzaG90KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgaWYgKGNhY2hlICYmIGNhY2hlLnRpbWVzdGFtcCAmJiBjYWNoZS50aW1lc3RhbXAgPiBEYXRlLm5vdygpIC0gMjQgKiA2MCAqIDYwICogMTAwMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FjaGVkXCIpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY2FjaGUuZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IGNhY2hlZFwiKVxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBnZXRBaXJwb3J0RGF0YSgpO1xuICAgICAgICAgICAgICAgIHNldChyZWYoZGIsICdjYWNoZScpLCB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWlycG9ydERhdGEoKSB7XG4gICAgY29uc3QgYXBpS2V5ID0gJzI1NDU0N2NkLWIzZGYtNGQ1NS04Njc2LWRkYjBhNGRjMGE2Myc7XG4gICAgY29uc3QgYmFzZVVybCA9ICdodHRwczovL2FpcmxhYnMuY28vYXBpL3Y5JztcblxuICAgIGNvbnN0IFtkZXBhcnR1cmUsIGFycml2YWxdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2RlcF9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApLFxuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2Fycl9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApXG4gICAgXSk7XG5cbiAgICBjb25zdCBhaXJwb3J0Q29kZXMgPSBkZXBhcnR1cmUuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmFycl9pY2FvKTtcbiAgICBjb25zdCBhcnJpdmFsQ29kZXMgPSBhcnJpdmFsLmRhdGEucmVzcG9uc2UubWFwKChmbGlnaHQpID0+IGZsaWdodC5kZXBfaWNhbyk7XG4gICAgY29uc3QgcHJpc2h0aW5hQ29kZSA9IGFycml2YWwuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmFycl9pY2FvKTtcbiAgICBjb25zdCBhbGxDb2RlcyA9IFsuLi5uZXcgU2V0KFsuLi5haXJwb3J0Q29kZXMsIC4uLmFycml2YWxDb2RlcywgLi4ucHJpc2h0aW5hQ29kZV0pXTtcblxuICAgIGNvbnN0IGFsbEZsaWdodHMgPSBbLi4uZGVwYXJ0dXJlLmRhdGEucmVzcG9uc2UsIC4uLmFycml2YWwuZGF0YS5yZXNwb25zZV07XG4gICAgY29uc3QgYWlycG9ydERhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChhbGxDb2Rlcy5tYXAoYXN5bmMoYWlycG9ydCkgPT4ge1xuICAgICAgICAvLyBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgJHtiYXNlVXJsfS9haXJwb3J0cz9pYXRhX2NvZGU9JHthaXJwb3J0fSZhcGlfa2V5PSR7YXBpS2V5fWApO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGFsbEFpcnBvcnRzW2FpcnBvcnRdO1xuICAgICAgICBjb25zdCByZWZpbmVkQWlycG9ydCA9IHtcbiAgICAgICAgICAgIHRleHQ6IHJlc3BvbnNlWydpYXRhJ10sXG4gICAgICAgICAgICBzaXplOiAxLjAsXG4gICAgICAgICAgICBjb3VudHJ5OiByZXNwb25zZVsnc3RhdGUnXSxcbiAgICAgICAgICAgIGNpdHk6IHJlc3BvbnNlWydjaXR5J10sXG4gICAgICAgICAgICBsYXQ6IHJlc3BvbnNlWydsYXQnXSxcbiAgICAgICAgICAgIGxuZzogcmVzcG9uc2VbJ2xvbiddLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVmaW5lZEFpcnBvcnQ7XG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHsgYWxsRmxpZ2h0cywgYWlycG9ydERhdGEgfTtcbn1cblxuXG4vLyBTRUNUSU9OIEdsb2JlXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgR2xvYmVcbiAgICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICAgICAgICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0ZUluOiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAgICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAgICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgICAgIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcblxuICAgIC8vIE5PVEUgQXJjIGFuaW1hdGlvbnMgYXJlIGZvbGxvd2VkIGFmdGVyIHRoZSBnbG9iZSBlbnRlcnMgdGhlIHNjZW5lXG5cbiAgICBnZXRBaXJwb3J0RGF0YUZyb21DYWNoZSgpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgbGV0IHJlZmluZWRBaXJwb3J0cyA9IGRhdGEuYWlycG9ydERhdGFcbiAgICAgICAgbGV0IGFsbEZsaWdodHMgPSBkYXRhLmFsbEZsaWdodHM7XG4gICAgICAgIEdsb2JlLnBvaW50c0RhdGEocmVmaW5lZEFpcnBvcnRzKVxuICAgICAgICBHbG9iZS5sYWJlbHNEYXRhKHJlZmluZWRBaXJwb3J0cylcbiAgICAgICAgbGV0IGNvdW50cmllcyA9IFtdXG4gICAgICAgIHJlZmluZWRBaXJwb3J0cy5mb3JFYWNoKChhaXJwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb3VudHJpZXMucHVzaChhaXJwb3J0LmNvdW50cnkpXG4gICAgICAgIH0pXG4gICAgICAgIEdsb2JlLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGNvdW50cmllcy5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICAgICAgZS5wcm9wZXJ0aWVzLklTT19BMlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDEpXCI7XG4gICAgICAgICAgICB9IGVsc2UgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMC40KVwiO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGxhdExvbmdEYXRhID0ge31cblxuICAgICAgICByZWZpbmVkQWlycG9ydHMuZm9yRWFjaCgoYWlycG9ydCkgPT4ge1xuICAgICAgICAgICAgbGF0TG9uZ0RhdGFbYWlycG9ydC50ZXh0XSA9IFthaXJwb3J0LmxhdCwgYWlycG9ydC5sbmcsIGFpcnBvcnQuY2l0eV1cbiAgICAgICAgfSlcblxuXG4gICAgICAgIGxldCBmbGlnaHRzID0gW11cbiAgICAgICAgbGV0IGFyY0FsdCA9IDAuMDU7XG4gICAgICAgIGxldCBvcmRlciA9IDA7XG4gICAgICAgIGFsbEZsaWdodHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgbGV0IGMgPSBuZXcgRGF0ZShhLmRlcF90aW1lKVxuICAgICAgICAgICAgbGV0IGQgPSBuZXcgRGF0ZShiLmRlcF90aW1lKVxuICAgICAgICAgICAgcmV0dXJuIGMuZ2V0VGltZSgpIC0gZC5nZXRUaW1lKClcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBhbGxGbGlnaHRzLmZvckVhY2goZmxpZ2h0ID0+IHtcbiAgICAgICAgICAgIG9yZGVyICs9IDQ7XG4gICAgICAgICAgICBmbGlnaHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIFwidGV4dFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzJdICsgXCJcXG5cIiArIGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMl0sXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZmxpZ2h0XCIsXG4gICAgICAgICAgICAgICAgXCJvcmRlclwiOiBvcmRlcixcbiAgICAgICAgICAgICAgICBcImZyb21cIjogZmxpZ2h0LmRlcF9pYXRhLFxuICAgICAgICAgICAgICAgIFwidG9cIjogZmxpZ2h0LmFycl9pYXRhLFxuICAgICAgICAgICAgICAgIFwiZmxpZ2h0Q29kZVwiOiBmbGlnaHQuY3NfZmxpZ2h0X2lhdGEsXG4gICAgICAgICAgICAgICAgXCJkYXRlXCI6IGZsaWdodC5kZXBfdGltZSxcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwic3RhcnRMYXRcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVswXSxcbiAgICAgICAgICAgICAgICBcInN0YXJ0TG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMV0sXG4gICAgICAgICAgICAgICAgXCJlbmRMYXRcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmFycl9pYXRhXVswXSxcbiAgICAgICAgICAgICAgICBcImVuZExuZ1wiOiBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzFdLFxuICAgICAgICAgICAgICAgIFwiYXJjQWx0XCI6IGFyY0FsdFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGFyY0FsdCArPSAwLjAzO1xuICAgICAgICB9KVxuXG5cbiAgICAgICAgR2xvYmUuYXJjc0RhdGEoZmxpZ2h0cylcbiAgICAgICAgICAgIC5hcmNDb2xvcigoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLnN0YXR1cyA/IFwiIzljZmYwMFwiIDogXCIjRkY0MDAwXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFyY0FsdGl0dWRlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUuYXJjQWx0O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hcmNTdHJva2UoKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5zdGF0dXMgPyAxIDogMC4zO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hcmNEYXNoTGVuZ3RoKDAuOSlcbiAgICAgICAgICAgIC5hcmNEYXNoR2FwKDIwKVxuICAgICAgICAgICAgLmFyY0Rhc2hBbmltYXRlVGltZSgxMDAwKVxuICAgICAgICAgICAgLmFyY3NUcmFuc2l0aW9uRHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgIC5hcmNEYXNoSW5pdGlhbEdhcCgoZSkgPT4gZS5vcmRlciAqIDEpXG4gICAgICAgICAgICAubGFiZWxDb2xvcigoKSA9PiBcIiNmZmNiMjFcIilcbiAgICAgICAgICAgIC5sYWJlbERvdE9yaWVudGF0aW9uKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUudGV4dCA9PT0gXCJJc3RhbmJ1bFwiID8gXCJ0b3BcIiA6IFwicmlnaHRcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubGFiZWxEb3RSYWRpdXMoMC4zKVxuICAgICAgICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgICAgICAgLmxhYmVsVGV4dChcImNpdHlcIilcbiAgICAgICAgICAgIC5sYWJlbFJlc29sdXRpb24oNilcbiAgICAgICAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAgICAgICAucG9pbnRDb2xvcigoKSA9PiBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgIC5wb2ludHNNZXJnZSh0cnVlKVxuICAgICAgICAgICAgLnBvaW50QWx0aXR1ZGUoMC4wNylcbiAgICAgICAgICAgIC5wb2ludFJhZGl1cygwLjA1KTtcblxuICAgICAgICBsZXQgdGV4dHMgPSBbXTtcbiAgICAgICAgZmxpZ2h0cy5mb3JFYWNoKChmbGlnaHQpID0+IHtcbiAgICAgICAgICAgIHRleHRzLnB1c2goZmxpZ2h0Wyd0ZXh0J10pXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBGb250TG9hZGVyKCk7XG4gICAgICAgIGxvYWRlci5sb2FkKCcuL2ZvbnQuanNvbicsIGZ1bmN0aW9uKGZvbnQpIHtcbiAgICAgICAgICAgIHRleHRzLmZvckVhY2goKHBsYW5lVGV4dCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IDB4MDA2Njk5O1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdExpdGUgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjQsXG4gICAgICAgICAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gcGxhbmVUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlcyA9IGZvbnQuZ2VuZXJhdGVTaGFwZXMobWVzc2FnZSwgMTAwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TaGFwZUdlb21ldHJ5KHNoYXBlcyk7XG4gICAgICAgICAgICAgICAgZ2VvbWV0cnkuY2VudGVyKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRMaXRlKTtcbiAgICAgICAgICAgICAgICB0ZXh0LnBvc2l0aW9uLnogPSAtMTUwIC0gaW5kZXg7XG4gICAgICAgICAgICAgICAgdGV4dC5tYXRlcmlhbC5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICB0ZXh0Lm1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0ZXh0T2Jqcy5wdXNoKHRleHQpO1xuICAgICAgICAgICAgICAgIHNjZW5lLmFkZCh0ZXh0KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBsb29wVGhyb3VnaCgpXG4gICAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIEdsb2JlLnJvdGF0ZVkoLU1hdGguUEkgKiAoNSAvIDIwKSk7XG4gICAgR2xvYmUucm90YXRlWigtTWF0aC5QSSAvIDUpO1xuICAgIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gICAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDNhMjI4YSk7XG4gICAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDIyMDAzOCk7XG4gICAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDAuNztcblxuICAgIC8vIE5PVEUgQ29vbCBzdHVmZlxuICAgIC8vIGdsb2JlTWF0ZXJpYWwud2lyZWZyYW1lID0gdHJ1ZTtcblxuICAgIHNjZW5lLmFkZChHbG9iZSk7XG5cbiAgICAvLyBzY2VuZS5hZGQoc3ByaXRlKTtcbn1cblxubGV0IHRleHRJbmRleCA9IDA7XG5cbi8qKlxuICogSXRlcmF0ZSB0aHJvdWdoIGFycmF5IGVsZW1lbnRzIGFuZCBtb2RpZnkgYmFzZWQgb24gcG9zaXRpb24uXG4gKi9cbmZ1bmN0aW9uIGxvb3BUaHJvdWdoKCkge1xuICAgIGlmICh0ZXh0SW5kZXggPT0gMCkge1xuICAgICAgICB0ZXh0T2Jqc1t0ZXh0T2Jqcy5sZW5ndGggLSAxXS5tYXRlcmlhbC5vcGFjaXR5ID0gMDtcbiAgICB9XG4gICAgaWYgKHRleHRJbmRleCA+IDApIHtcbiAgICAgICAgdGV4dE9ianNbdGV4dEluZGV4IC0gMV0ubWF0ZXJpYWwub3BhY2l0eSA9IDA7XG4gICAgfVxuICAgIHRleHRPYmpzW3RleHRJbmRleF0ubWF0ZXJpYWwub3BhY2l0eSA9IDE7XG4gICAgdGV4dEluZGV4Kys7XG4gICAgaWYgKHRleHRJbmRleCA+PSB0ZXh0T2Jqcy5sZW5ndGgpIHtcbiAgICAgICAgdGV4dEluZGV4ID0gMDtcbiAgICB9XG4gICAgc2V0VGltZW91dChsb29wVGhyb3VnaCwgMzAwMCk7XG59XG5cblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gICAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICBjYW1lcmEucG9zaXRpb24ueCArPVxuICAgICAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMiA/XG4gICAgICAgIChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDUgOlxuICAgICAgICAwO1xuICAgIC8vIGNhbWVyYS5wb3NpdGlvbi55IC09IChtb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gICAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gICAgY29udHJvbHMudXBkYXRlKCk7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn0iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcImUyMzM0MWZhZjc0NWE0MjE4OWFiXCIiXSwic291cmNlUm9vdCI6IiJ9