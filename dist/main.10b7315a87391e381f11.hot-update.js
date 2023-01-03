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
            texts.forEach((planeText, index) => {
                const color = 0x006699;
                const matLite = new three__WEBPACK_IMPORTED_MODULE_7__.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.4,
                    side: three__WEBPACK_IMPORTED_MODULE_7__.DoubleSide
                });
                const message = planeText;
                const shapes = font.generateShapes(message, 100);
                const geometry = new three__WEBPACK_IMPORTED_MODULE_7__.ShapeGeometry(shapes);
                geometry.center();
                const text = new three__WEBPACK_IMPORTED_MODULE_7__.Mesh(geometry, matLite);
                text.position.z = -150 - index;
                text.material.opacity = 0;
                text.material.transparent = true;
                textObjs.push(text);
                scene.add(text);
            })
            loopThrough()
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
    console.log(textObjs);
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
    setTimeout(loopThrough, 3000)
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
/******/ 		__webpack_require__.h = () => "d04f794aa06fec370025"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQUNkO0FBYWhCO0FBQzhEO0FBQzVCO0FBQ0c7QUFDQTtBQUNKO0FBQ3RCO0FBQ21CO0FBQ3lCOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFZLDJEQUFhO0FBQ3pCLFdBQVcsOERBQVc7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHdDQUFLO0FBQ3JCLGtCQUFrQiwrQ0FBWTtBQUM5QiwyQkFBMkIsd0NBQUs7O0FBRWhDO0FBQ0EsaUJBQWlCLG9EQUFpQjtBQUNsQztBQUNBOztBQUVBLHFCQUFxQixtREFBZ0I7QUFDckM7QUFDQTs7QUFFQSxzQkFBc0IsbURBQWdCO0FBQ3RDO0FBQ0E7O0FBRUEsc0JBQXNCLDZDQUFVO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esb0JBQW9CLHNDQUFHOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQix1RkFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7OztBQU9BO0FBQ0EsZUFBZSw4REFBVztBQUMxQixxQkFBcUIsc0RBQUc7O0FBRXhCO0FBQ0EsUUFBUSxzREFBRyxDQUFDLHdEQUFLO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHVEQUFHLENBQUMsc0RBQUc7QUFDdkI7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7Ozs7QUFJQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLDhDQUFTLElBQUksUUFBUSxrQ0FBa0MsT0FBTztBQUN0RSxRQUFRLDhDQUFTLElBQUksUUFBUSxrQ0FBa0MsT0FBTztBQUN0RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0NBQStDLFFBQVEsc0JBQXNCLFFBQVEsV0FBVyxPQUFPO0FBQ3ZHLHlCQUF5QixpREFBVztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsWUFBWTtBQUNaOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZ0RBQVU7QUFDMUI7QUFDQTtBQUNBLFNBQVM7QUFDVCx5QkFBeUIsZ0VBQWtCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCwyQkFBMkIsNkNBQVU7QUFDckM7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLG9EQUF1QjtBQUMzRDtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsNkNBQWdCO0FBQzFDLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EscUNBQXFDLGdEQUFtQjtBQUN4RDtBQUNBLGlDQUFpQyx1Q0FBVTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUzs7O0FBR1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsd0NBQUs7QUFDbkMsaUNBQWlDLHdDQUFLO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7OztXQzlYQSxvRCIsImZpbGUiOiJtYWluLjEwYjczMTVhODczOTFlMzgxZjExLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5pbXBvcnQge1xuICAgIFBlcnNwZWN0aXZlQ2FtZXJhLFxuICAgIEFtYmllbnRMaWdodCxcbiAgICBEaXJlY3Rpb25hbExpZ2h0LFxuICAgIENvbG9yLFxuICAgIEZvZyxcbiAgICAvLyBBeGVzSGVscGVyLFxuICAgIC8vIERpcmVjdGlvbmFsTGlnaHRIZWxwZXIsXG4gICAgLy8gQ2FtZXJhSGVscGVyLFxuICAgIFBvaW50TGlnaHQsXG4gICAgU3BoZXJlR2VvbWV0cnksXG4gICAgRm9udExvYWRlclxufSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCB7IGNyZWF0ZUdsb3dNZXNoIH0gZnJvbSBcInRocmVlLWdsb3ctbWVzaFwiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgdHJhdmVsSGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1mbGlnaHRzLmpzb25cIjtcbmltcG9ydCBhbGxBaXJwb3J0cyBmcm9tIFwiLi9maWxlcy9haXJwb3J0cy5qc29uXCI7XG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSBcImZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UsIHJlZiwgc2V0LCBnZXQsIGNoaWxkIH0gZnJvbSBcImZpcmViYXNlL2RhdGFiYXNlXCI7XG5cbmNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xuICAgIGFwaUtleTogXCJBSXphU3lCUkZmekc5aVppenhwR2t6ajRRRGZUQUgzOFgxOWJ6cjRcIixcbiAgICBhdXRoRG9tYWluOiBcInBsYW5lcy01NzU5ZC5maXJlYmFzZWFwcC5jb21cIixcbiAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL3BsYW5lcy01NzU5ZC1kZWZhdWx0LXJ0ZGIuZXVyb3BlLXdlc3QxLmZpcmViYXNlZGF0YWJhc2UuYXBwXCIsXG4gICAgcHJvamVjdElkOiBcInBsYW5lcy01NzU5ZFwiLFxuICAgIHN0b3JhZ2VCdWNrZXQ6IFwicGxhbmVzLTU3NTlkLmFwcHNwb3QuY29tXCIsXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMjAyNzA2NDM4MDA3XCIsXG4gICAgYXBwSWQ6IFwiMToyMDI3MDY0MzgwMDc6d2ViOjI3YmVhY2E5MDA4YmY1NDEyNTAzNzJcIixcbiAgICBtZWFzdXJlbWVudElkOiBcIkctQzU4WDAwVktaMlwiXG59O1xuXG5jb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbmNvbnN0IGRiID0gZ2V0RGF0YWJhc2UoKTtcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xubGV0IGFpcnBvcnRzID0gW11cbmxldCB0ZXh0T2JqcyA9IFtdO1xuXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gICAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIC8vIHJlbmRlcmVyLm91dHB1dEVuY29kaW5nID0gVEhSRUUuc1JHQkVuY29kaW5nO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAvLyBJbml0aWFsaXplIHNjZW5lLCBsaWdodFxuICAgIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gICAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICAgIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwNDBkMjEpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBjYW1lcmEsIGxpZ2h0XG4gICAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gICAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICAgIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICAgIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gICAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICAgIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICAgIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgICBzY2VuZS5hZGQoY2FtZXJhKTtcblxuICAgIC8vIEFkZGl0aW9uYWwgZWZmZWN0c1xuICAgIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgICAvLyBIZWxwZXJzXG4gICAgLy8gY29uc3QgYXhlc0hlbHBlciA9IG5ldyBBeGVzSGVscGVyKDgwMCk7XG4gICAgLy8gc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuICAgIC8vIHZhciBoZWxwZXIgPSBuZXcgRGlyZWN0aW9uYWxMaWdodEhlbHBlcihkTGlnaHQpO1xuICAgIC8vIHNjZW5lLmFkZChoZWxwZXIpO1xuICAgIC8vIHZhciBoZWxwZXJDYW1lcmEgPSBuZXcgQ2FtZXJhSGVscGVyKGRMaWdodC5zaGFkb3cuY2FtZXJhKTtcbiAgICAvLyBzY2VuZS5hZGQoaGVscGVyQ2FtZXJhKTtcblxuICAgIC8vIEluaXRpYWxpemUgY29udHJvbHNcbiAgICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gICAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICAgIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICAgIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICAgIGNvbnRyb2xzLm1heERpc3RhbmNlID0gNTAwO1xuICAgIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICAgIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gICAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuXG4gICAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gICAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG5cbn1cblxuXG5cblxuXG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFpcnBvcnREYXRhRnJvbUNhY2hlKCkge1xuICAgIGNvbnN0IGRiID0gZ2V0RGF0YWJhc2UoKTtcbiAgICBjb25zdCBjaGFjZVJlZiA9IHJlZihkYik7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBnZXQoY2hpbGQoY2hhY2VSZWYsICdjYWNoZScpKS50aGVuKGFzeW5jKHNuYXBzaG90KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coY2FjaGUgJiYgY2FjaGUudGltZXN0YW1wICYmIGNhY2hlLnRpbWVzdGFtcCA+IERhdGUubm93KCkgLSAyNCAqIDYwICogNjAgKiAxMDAwLCBcImJydWhcIilcbiAgICAgICAgICAgIGlmIChjYWNoZSAmJiBjYWNoZS50aW1lc3RhbXAgJiYgY2FjaGUudGltZXN0YW1wID4gRGF0ZS5ub3coKSAtIDI0ICogNjAgKiA2MCAqIDEwMDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNhY2hlZFwiKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGNhY2hlLmRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vdCBjYWNoZWRcIilcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgZGF0YSA9IGF3YWl0IGdldEFpcnBvcnREYXRhKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgICAgICBzZXQocmVmKGRiLCAnY2FjaGUnKSwge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuXG5cbmFzeW5jIGZ1bmN0aW9uIGdldEFpcnBvcnREYXRhKCkge1xuICAgIGNvbnN0IGFwaUtleSA9ICcyNTQ1NDdjZC1iM2RmLTRkNTUtODY3Ni1kZGIwYTRkYzBhNjMnO1xuICAgIGNvbnN0IGJhc2VVcmwgPSAnaHR0cHM6Ly9haXJsYWJzLmNvL2FwaS92OSc7XG5cbiAgICBjb25zdCBbZGVwYXJ0dXJlLCBhcnJpdmFsXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgYXhpb3MuZ2V0KGAke2Jhc2VVcmx9L3NjaGVkdWxlcz9kZXBfaWF0YT1QUk4mYXBpX2tleT0ke2FwaUtleX1gKSxcbiAgICAgICAgYXhpb3MuZ2V0KGAke2Jhc2VVcmx9L3NjaGVkdWxlcz9hcnJfaWF0YT1QUk4mYXBpX2tleT0ke2FwaUtleX1gKVxuICAgIF0pO1xuXG4gICAgY29uc3QgYWlycG9ydENvZGVzID0gZGVwYXJ0dXJlLmRhdGEucmVzcG9uc2UubWFwKChmbGlnaHQpID0+IGZsaWdodC5hcnJfaWNhbyk7XG4gICAgY29uc3QgYXJyaXZhbENvZGVzID0gYXJyaXZhbC5kYXRhLnJlc3BvbnNlLm1hcCgoZmxpZ2h0KSA9PiBmbGlnaHQuZGVwX2ljYW8pO1xuICAgIGNvbnN0IHByaXNodGluYUNvZGUgPSBhcnJpdmFsLmRhdGEucmVzcG9uc2UubWFwKChmbGlnaHQpID0+IGZsaWdodC5hcnJfaWNhbyk7XG4gICAgY29uc3QgYWxsQ29kZXMgPSBbLi4ubmV3IFNldChbLi4uYWlycG9ydENvZGVzLCAuLi5hcnJpdmFsQ29kZXMsIC4uLnByaXNodGluYUNvZGVdKV07XG5cbiAgICBjb25zdCBhbGxGbGlnaHRzID0gWy4uLmRlcGFydHVyZS5kYXRhLnJlc3BvbnNlLCAuLi5hcnJpdmFsLmRhdGEucmVzcG9uc2VdO1xuICAgIGNvbnN0IGFpcnBvcnREYXRhID0gYXdhaXQgUHJvbWlzZS5hbGwoYWxsQ29kZXMubWFwKGFzeW5jKGFpcnBvcnQpID0+IHtcbiAgICAgICAgLy8gY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYCR7YmFzZVVybH0vYWlycG9ydHM/aWF0YV9jb2RlPSR7YWlycG9ydH0mYXBpX2tleT0ke2FwaUtleX1gKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhbGxBaXJwb3J0c1thaXJwb3J0XTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICBjb25zdCByZWZpbmVkQWlycG9ydCA9IHtcbiAgICAgICAgICAgIHRleHQ6IHJlc3BvbnNlWydpYXRhJ10sXG4gICAgICAgICAgICBzaXplOiAxLjAsXG4gICAgICAgICAgICBjb3VudHJ5OiByZXNwb25zZVsnc3RhdGUnXSxcbiAgICAgICAgICAgIGNpdHk6IHJlc3BvbnNlWydjaXR5J10sXG4gICAgICAgICAgICBsYXQ6IHJlc3BvbnNlWydsYXQnXSxcbiAgICAgICAgICAgIGxuZzogcmVzcG9uc2VbJ2xvbiddLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVmaW5lZEFpcnBvcnQ7XG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHsgYWxsRmxpZ2h0cywgYWlycG9ydERhdGEgfTtcbn1cblxuXG4vLyBTRUNUSU9OIEdsb2JlXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgR2xvYmVcbiAgICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICAgICAgICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0ZUluOiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAgICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAgICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgICAgIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcblxuICAgIC8vIE5PVEUgQXJjIGFuaW1hdGlvbnMgYXJlIGZvbGxvd2VkIGFmdGVyIHRoZSBnbG9iZSBlbnRlcnMgdGhlIHNjZW5lXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICB9LCAxMDAwKTtcblxuICAgIGdldEFpcnBvcnREYXRhRnJvbUNhY2hlKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLCAndGVzdCcpXG4gICAgICAgIGxldCByZWZpbmVkQWlycG9ydHMgPSBkYXRhLmFpcnBvcnREYXRhXG4gICAgICAgIGxldCBhbGxGbGlnaHRzID0gZGF0YS5hbGxGbGlnaHRzO1xuICAgICAgICBHbG9iZS5wb2ludHNEYXRhKHJlZmluZWRBaXJwb3J0cylcbiAgICAgICAgR2xvYmUubGFiZWxzRGF0YShyZWZpbmVkQWlycG9ydHMpXG4gICAgICAgIGxldCBjb3VudHJpZXMgPSBbXVxuICAgICAgICByZWZpbmVkQWlycG9ydHMuZm9yRWFjaCgoYWlycG9ydCkgPT4ge1xuICAgICAgICAgICAgY291bnRyaWVzLnB1c2goYWlycG9ydC5jb3VudHJ5KVxuICAgICAgICB9KVxuICAgICAgICBHbG9iZS5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjb3VudHJpZXMuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgICAgIGUucHJvcGVydGllcy5JU09fQTJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJyZ2JhKDI1NSwyNTUsMjU1LCAxKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDAuNClcIjtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBsYXRMb25nRGF0YSA9IHt9XG5cbiAgICAgICAgcmVmaW5lZEFpcnBvcnRzLmZvckVhY2goKGFpcnBvcnQpID0+IHtcbiAgICAgICAgICAgIGxhdExvbmdEYXRhW2FpcnBvcnQudGV4dF0gPSBbYWlycG9ydC5sYXQsIGFpcnBvcnQubG5nXVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGxhdExvbmdEYXRhLCBcImxhdGxvbmdcIilcblxuICAgICAgICBsZXQgZmxpZ2h0cyA9IFtdXG4gICAgICAgIGxldCBhcmNBbHQgPSAwLjA1O1xuICAgICAgICBsZXQgb3JkZXIgPSAwO1xuICAgICAgICBjb25zb2xlLmxvZyhhbGxGbGlnaHRzKVxuICAgICAgICBhbGxGbGlnaHRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGxldCBjID0gbmV3IERhdGUoYS5kZXBfdGltZSlcbiAgICAgICAgICAgIGxldCBkID0gbmV3IERhdGUoYi5kZXBfdGltZSlcbiAgICAgICAgICAgIHJldHVybiBjLmdldFRpbWUoKSAtIGQuZ2V0VGltZSgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFsbEZsaWdodHMuZm9yRWFjaChmbGlnaHQgPT4ge1xuICAgICAgICAgICAgb3JkZXIgKz0gNDtcbiAgICAgICAgICAgIGZsaWdodHMucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZmxpZ2h0XCIsXG4gICAgICAgICAgICAgICAgXCJvcmRlclwiOiBvcmRlcixcbiAgICAgICAgICAgICAgICBcImZyb21cIjogZmxpZ2h0LmRlcF9pYXRhLFxuICAgICAgICAgICAgICAgIFwidG9cIjogZmxpZ2h0LmFycl9pYXRhLFxuICAgICAgICAgICAgICAgIFwiZmxpZ2h0Q29kZVwiOiBmbGlnaHQuY3NfZmxpZ2h0X2lhdGEsXG4gICAgICAgICAgICAgICAgXCJkYXRlXCI6IGZsaWdodC5kZXBfdGltZSxcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwic3RhcnRMYXRcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVswXSxcbiAgICAgICAgICAgICAgICBcInN0YXJ0TG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMV0sXG4gICAgICAgICAgICAgICAgXCJlbmRMYXRcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmFycl9pYXRhXVswXSxcbiAgICAgICAgICAgICAgICBcImVuZExuZ1wiOiBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzFdLFxuICAgICAgICAgICAgICAgIFwiYXJjQWx0XCI6IGFyY0FsdFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGFyY0FsdCArPSAwLjAzO1xuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGZsaWdodHMsIFwiaW1wb3J0YW50XCIpXG5cbiAgICAgICAgR2xvYmUuYXJjc0RhdGEoZmxpZ2h0cylcbiAgICAgICAgICAgIC5hcmNDb2xvcigoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLnN0YXR1cyA/IFwiIzljZmYwMFwiIDogXCIjRkY0MDAwXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFyY0FsdGl0dWRlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUuYXJjQWx0O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hcmNTdHJva2UoKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5zdGF0dXMgPyAwLjUgOiAwLjM7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFyY0Rhc2hMZW5ndGgoMC45KVxuICAgICAgICAgICAgLmFyY0Rhc2hHYXAoNClcbiAgICAgICAgICAgIC5hcmNEYXNoQW5pbWF0ZVRpbWUoMTAwMClcbiAgICAgICAgICAgIC5hcmNzVHJhbnNpdGlvbkR1cmF0aW9uKDEwMDApXG4gICAgICAgICAgICAuYXJjRGFzaEluaXRpYWxHYXAoKGUpID0+IGUub3JkZXIgKiAxKVxuICAgICAgICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gXCIjZmZjYjIxXCIpXG4gICAgICAgICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLnRleHQgPT09IFwiQUxBXCIgPyBcInRvcFwiIDogXCJyaWdodFwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5sYWJlbERvdFJhZGl1cygwLjMpXG4gICAgICAgICAgICAubGFiZWxTaXplKChlKSA9PiBlLnNpemUpXG4gICAgICAgICAgICAubGFiZWxUZXh0KFwiY2l0eVwiKVxuICAgICAgICAgICAgLmxhYmVsUmVzb2x1dGlvbig2KVxuICAgICAgICAgICAgLmxhYmVsQWx0aXR1ZGUoMC4wMSlcbiAgICAgICAgICAgIC5wb2ludENvbG9yKCgpID0+IFwiI2ZmZmZmZlwiKVxuICAgICAgICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAgICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuXG4gICAgICAgIGxldCB0ZXh0cyA9IFtdO1xuICAgICAgICBmbGlnaHRzLmZvckVhY2goKGZsaWdodCkgPT4ge1xuICAgICAgICAgICAgdGV4dHMucHVzaChmbGlnaHRbJ2Zyb20nXSArIFwiLVwiICsgZmxpZ2h0Wyd0byddKVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgRm9udExvYWRlcigpO1xuICAgICAgICBsb2FkZXIubG9hZCgnLi9mb250Lmpzb24nLCBmdW5jdGlvbihmb250KSB7XG4gICAgICAgICAgICB0ZXh0cy5mb3JFYWNoKChwbGFuZVRleHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSAweDAwNjY5OTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRMaXRlID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC40LFxuICAgICAgICAgICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHBsYW5lVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZXMgPSBmb250LmdlbmVyYXRlU2hhcGVzKG1lc3NhZ2UsIDEwMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeShzaGFwZXMpO1xuICAgICAgICAgICAgICAgIGdlb21ldHJ5LmNlbnRlcigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0TGl0ZSk7XG4gICAgICAgICAgICAgICAgdGV4dC5wb3NpdGlvbi56ID0gLTE1MCAtIGluZGV4O1xuICAgICAgICAgICAgICAgIHRleHQubWF0ZXJpYWwub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgdGV4dC5tYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGV4dE9ianMucHVzaCh0ZXh0KTtcbiAgICAgICAgICAgICAgICBzY2VuZS5hZGQodGV4dCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgbG9vcFRocm91Z2goKVxuICAgICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICBHbG9iZS5yb3RhdGVZKC1NYXRoLlBJICogKDUgLyAxOCkpO1xuICAgIEdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA2KTtcbiAgICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICAgIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICAgIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICAgIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7XG4gICAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgICAvLyBOT1RFIENvb2wgc3R1ZmZcbiAgICAvLyBnbG9iZU1hdGVyaWFsLndpcmVmcmFtZSA9IHRydWU7XG5cbiAgICBzY2VuZS5hZGQoR2xvYmUpO1xuXG4gICAgLy8gc2NlbmUuYWRkKHNwcml0ZSk7XG59XG5cbmxldCB0ZXh0SW5kZXggPSAwO1xuXG5mdW5jdGlvbiBsb29wVGhyb3VnaCgpIHtcbiAgICBjb25zb2xlLmxvZyh0ZXh0T2Jqcyk7XG4gICAgaWYgKHRleHRJbmRleCA9PSAwKSB7XG4gICAgICAgIHRleHRPYmpzW3RleHRPYmpzLmxlbmd0aCAtIDFdLm1hdGVyaWFsLm9wYWNpdHkgPSAwO1xuICAgIH1cbiAgICBpZiAodGV4dEluZGV4ID4gMCkge1xuICAgICAgICB0ZXh0T2Jqc1t0ZXh0SW5kZXggLSAxXS5tYXRlcmlhbC5vcGFjaXR5ID0gMDtcbiAgICB9XG4gICAgdGV4dE9ianNbdGV4dEluZGV4XS5tYXRlcmlhbC5vcGFjaXR5ID0gMTtcbiAgICB0ZXh0SW5kZXgrKztcbiAgICBpZiAodGV4dEluZGV4ID49IHRleHRPYmpzLmxlbmd0aCkge1xuICAgICAgICB0ZXh0SW5kZXggPSAwO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KGxvb3BUaHJvdWdoLCAzMDAwKVxufVxuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG4gICAgLy8gY29uc29sZS5sb2coXCJ4OiBcIiArIG1vdXNlWCArIFwiIHk6IFwiICsgbW91c2VZKTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIGNhbWVyYS5wb3NpdGlvbi54ICs9XG4gICAgICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyID9cbiAgICAgICAgKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNSA6XG4gICAgICAgIDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gICAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gICAgY29udHJvbHMudXBkYXRlKCk7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn0iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcImQwNGY3OTRhYTA2ZmVjMzcwMDI1XCIiXSwic291cmNlUm9vdCI6IiJ9