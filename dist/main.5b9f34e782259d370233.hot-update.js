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

    const starCountRef = (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.ref)(db, 'cache');
    (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.onValue)(starCountRef, async(snapshot) => {
        const cache = snapshot.val();

        if (cache && cache.timestamp && cache.timestamp > Date.now() - 24 * 60 * 60 * 1000) {

            return cache.data;
        } else {
            const data = await getAirportData();

            (0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.set)((0,firebase_database__WEBPACK_IMPORTED_MODULE_6__.ref)(db, 'cache'), {
                data: data,
                timestamp: Date.now()
            });

            return data;
        }
    });
    // if (cache && cache.timestamp && cache.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
    //     // Return the cached data if it exists and the timestamp is less than 24 hours old
    //     return cache.data;
    // } else {
    //     // Fetch and cache the data if it doesn't exist or the cache has expired
    //     const data = await getAirportData();
    //     set({
    //         timestamp: Date.now(),
    //         data,
    //     });
    //     return data;
    // }
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
/******/ 		__webpack_require__.h = () => "ff2281211b5080e16e82"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQVk5QjtBQUM4RDtBQUM1QjtBQUNHO0FBQ0E7QUFDRTtBQUM1QjtBQUNtQjtBQUNzQjs7QUFFbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBWSwyREFBYTtBQUN6QixXQUFXLDhEQUFXOztBQUV0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0Isd0NBQUs7QUFDckIsa0JBQWtCLCtDQUFZO0FBQzlCLDJCQUEyQix3Q0FBSzs7QUFFaEM7QUFDQSxpQkFBaUIsb0RBQWlCO0FBQ2xDO0FBQ0E7O0FBRUEscUJBQXFCLG1EQUFnQjtBQUNyQztBQUNBOztBQUVBLHNCQUFzQixtREFBZ0I7QUFDdEM7QUFDQTs7QUFFQSxzQkFBc0IsNkNBQVU7QUFDaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxvQkFBb0Isc0NBQUc7O0FBRXZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLHVGQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7O0FBT0E7QUFDQSxlQUFlLDhEQUFXOztBQUUxQix5QkFBeUIsc0RBQUc7QUFDNUIsSUFBSSwwREFBTztBQUNYOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUOztBQUVBLFlBQVksc0RBQUcsQ0FBQyxzREFBRztBQUNuQjtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBUSw4Q0FBUyxJQUFJLFFBQVEsa0NBQWtDLE9BQU87QUFDdEUsUUFBUSw4Q0FBUyxJQUFJLFFBQVEsa0NBQWtDLE9BQU87QUFDdEU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0IsOENBQVMsSUFBSSxRQUFRLHNCQUFzQixRQUFRLFdBQVcsT0FBTztBQUNwRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLFlBQVk7QUFDWjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGdEQUFVO0FBQzFCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QseUJBQXlCLGdFQUFrQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix3Q0FBSztBQUNuQyxpQ0FBaUMsd0NBQUs7QUFDdEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7V0MvVEEsb0QiLCJmaWxlIjoibWFpbi41YjlmMzRlNzgyMjU5ZDM3MDIzMy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHtcbiAgICBQZXJzcGVjdGl2ZUNhbWVyYSxcbiAgICBBbWJpZW50TGlnaHQsXG4gICAgRGlyZWN0aW9uYWxMaWdodCxcbiAgICBDb2xvcixcbiAgICBGb2csXG4gICAgLy8gQXhlc0hlbHBlcixcbiAgICAvLyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyLFxuICAgIC8vIENhbWVyYUhlbHBlcixcbiAgICBQb2ludExpZ2h0LFxuICAgIFNwaGVyZUdlb21ldHJ5LFxufSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCB7IGNyZWF0ZUdsb3dNZXNoIH0gZnJvbSBcInRocmVlLWdsb3ctbWVzaFwiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgdHJhdmVsSGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1mbGlnaHRzLmpzb25cIjtcbmltcG9ydCBhaXJwb3J0SGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1haXJwb3J0cy5qc29uXCI7XG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSBcImZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UsIHJlZiwgc2V0LCBvblZhbHVlIH0gZnJvbSBcImZpcmViYXNlL2RhdGFiYXNlXCI7XG5cbmNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xuICAgIGFwaUtleTogXCJBSXphU3lCUkZmekc5aVppenhwR2t6ajRRRGZUQUgzOFgxOWJ6cjRcIixcbiAgICBhdXRoRG9tYWluOiBcInBsYW5lcy01NzU5ZC5maXJlYmFzZWFwcC5jb21cIixcbiAgICBkYXRhYmFzZVVSTDogXCJodHRwczovL3BsYW5lcy01NzU5ZC1kZWZhdWx0LXJ0ZGIuZXVyb3BlLXdlc3QxLmZpcmViYXNlZGF0YWJhc2UuYXBwXCIsXG4gICAgcHJvamVjdElkOiBcInBsYW5lcy01NzU5ZFwiLFxuICAgIHN0b3JhZ2VCdWNrZXQ6IFwicGxhbmVzLTU3NTlkLmFwcHNwb3QuY29tXCIsXG4gICAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMjAyNzA2NDM4MDA3XCIsXG4gICAgYXBwSWQ6IFwiMToyMDI3MDY0MzgwMDc6d2ViOjI3YmVhY2E5MDA4YmY1NDEyNTAzNzJcIixcbiAgICBtZWFzdXJlbWVudElkOiBcIkctQzU4WDAwVktaMlwiXG59O1xuXG5jb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbmNvbnN0IGRiID0gZ2V0RGF0YWJhc2UoKTtcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xubGV0IGFpcnBvcnRzID0gW11cblxuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICAgIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICAgIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDQwZDIxKTtcblxuICAgIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICAgIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICAgIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICAgIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gICAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gICAgc2NlbmUuYWRkKGNhbWVyYSk7XG5cbiAgICAvLyBBZGRpdGlvbmFsIGVmZmVjdHNcbiAgICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gICAgLy8gSGVscGVyc1xuICAgIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAgIC8vIHNjZW5lLmFkZChheGVzSGVscGVyKTtcbiAgICAvLyB2YXIgaGVscGVyID0gbmV3IERpcmVjdGlvbmFsTGlnaHRIZWxwZXIoZExpZ2h0KTtcbiAgICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgICAvLyB2YXIgaGVscGVyQ2FtZXJhID0gbmV3IENhbWVyYUhlbHBlcihkTGlnaHQuc2hhZG93LmNhbWVyYSk7XG4gICAgLy8gc2NlbmUuYWRkKGhlbHBlckNhbWVyYSk7XG5cbiAgICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gICAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICAgIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICAgIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICAgIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICAgIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuXG59XG5cblxuXG5cblxuXG5hc3luYyBmdW5jdGlvbiBnZXRBaXJwb3J0RGF0YUZyb21DYWNoZSgpIHtcbiAgICBjb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG5cbiAgICBjb25zdCBzdGFyQ291bnRSZWYgPSByZWYoZGIsICdjYWNoZScpO1xuICAgIG9uVmFsdWUoc3RhckNvdW50UmVmLCBhc3luYyhzbmFwc2hvdCkgPT4ge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHNuYXBzaG90LnZhbCgpO1xuXG4gICAgICAgIGlmIChjYWNoZSAmJiBjYWNoZS50aW1lc3RhbXAgJiYgY2FjaGUudGltZXN0YW1wID4gRGF0ZS5ub3coKSAtIDI0ICogNjAgKiA2MCAqIDEwMDApIHtcblxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlLmRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZ2V0QWlycG9ydERhdGEoKTtcblxuICAgICAgICAgICAgc2V0KHJlZihkYiwgJ2NhY2hlJyksIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gaWYgKGNhY2hlICYmIGNhY2hlLnRpbWVzdGFtcCAmJiBjYWNoZS50aW1lc3RhbXAgPiBEYXRlLm5vdygpIC0gMjQgKiA2MCAqIDYwICogMTAwMCkge1xuICAgIC8vICAgICAvLyBSZXR1cm4gdGhlIGNhY2hlZCBkYXRhIGlmIGl0IGV4aXN0cyBhbmQgdGhlIHRpbWVzdGFtcCBpcyBsZXNzIHRoYW4gMjQgaG91cnMgb2xkXG4gICAgLy8gICAgIHJldHVybiBjYWNoZS5kYXRhO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAgIC8vIEZldGNoIGFuZCBjYWNoZSB0aGUgZGF0YSBpZiBpdCBkb2Vzbid0IGV4aXN0IG9yIHRoZSBjYWNoZSBoYXMgZXhwaXJlZFxuICAgIC8vICAgICBjb25zdCBkYXRhID0gYXdhaXQgZ2V0QWlycG9ydERhdGEoKTtcbiAgICAvLyAgICAgc2V0KHtcbiAgICAvLyAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAvLyAgICAgICAgIGRhdGEsXG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgICByZXR1cm4gZGF0YTtcbiAgICAvLyB9XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWlycG9ydERhdGEoKSB7XG4gICAgY29uc3QgYXBpS2V5ID0gJzhlODNmOWYyLWI2MDEtNGI5NS1iYzljLTViNzRhNTVkYTYyZic7XG4gICAgY29uc3QgYmFzZVVybCA9ICdodHRwczovL2FpcmxhYnMuY28vYXBpL3Y5JztcblxuICAgIGNvbnN0IFtkZXBhcnR1cmUsIGFycml2YWxdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2RlcF9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApLFxuICAgICAgICBheGlvcy5nZXQoYCR7YmFzZVVybH0vc2NoZWR1bGVzP2Fycl9pYXRhPVBSTiZhcGlfa2V5PSR7YXBpS2V5fWApXG4gICAgXSk7XG5cbiAgICBjb25zdCBhaXJwb3J0Q29kZXMgPSBkZXBhcnR1cmUuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmFycl9pYXRhKTtcbiAgICBjb25zdCBhcnJpdmFsQ29kZXMgPSBhcnJpdmFsLmRhdGEucmVzcG9uc2UubWFwKChmbGlnaHQpID0+IGZsaWdodC5kZXBfaWF0YSk7XG4gICAgY29uc3QgYWxsQ29kZXMgPSBbLi4ubmV3IFNldChbLi4uYWlycG9ydENvZGVzLCAuLi5hcnJpdmFsQ29kZXNdKV07XG5cbiAgICBjb25zdCBhbGxGbGlnaHRzID0gWy4uLmRlcGFydHVyZS5kYXRhLnJlc3BvbnNlLCAuLi5hcnJpdmFsLmRhdGEucmVzcG9uc2VdO1xuICAgIGNvbnN0IGFpcnBvcnREYXRhID0gYXdhaXQgUHJvbWlzZS5hbGwoYWxsQ29kZXMubWFwKGFzeW5jKGFpcnBvcnQpID0+IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYCR7YmFzZVVybH0vYWlycG9ydHM/aWF0YV9jb2RlPSR7YWlycG9ydH0mYXBpX2tleT0ke2FwaUtleX1gKTtcbiAgICAgICAgY29uc3QgcmVmaW5lZEFpcnBvcnQgPSB7XG4gICAgICAgICAgICB0ZXh0OiByZXNwb25zZS5kYXRhLnJlc3BvbnNlWzBdWydpYXRhX2NvZGUnXSxcbiAgICAgICAgICAgIHNpemU6IDEuMCxcbiAgICAgICAgICAgIGNvdW50cnk6IHJlc3BvbnNlLmRhdGEucmVzcG9uc2VbMF1bJ2NvdW50cnlfY29kZSddLFxuICAgICAgICAgICAgY2l0eTogcmVzcG9uc2UuZGF0YS5yZXNwb25zZVswXVsnbmFtZSddLnJlcGxhY2UoXCJJbnRlcm5hdGlvbmFsIEFpcnBvcnRcIiwgXCJcIikucmVwbGFjZShcIkFpcnBvcnRcIiwgXCJcIiksXG4gICAgICAgICAgICBsYXQ6IHJlc3BvbnNlLmRhdGEucmVzcG9uc2VbMF1bJ2xhdCddLFxuICAgICAgICAgICAgbG5nOiByZXNwb25zZS5kYXRhLnJlc3BvbnNlWzBdWydsbmcnXSxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJlZmluZWRBaXJwb3J0O1xuICAgIH0pKTtcblxuICAgIHJldHVybiB7IGFsbEZsaWdodHMsIGFpcnBvcnREYXRhIH07XG59XG5cblxuLy8gU0VDVElPTiBHbG9iZVxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICAgIC8vIEluaXRpYWxpemUgdGhlIEdsb2JlXG4gICAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgICAgICAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgICAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgICAgIC5zaG93QXRtb3NwaGVyZSh0cnVlKVxuICAgICAgICAuYXRtb3NwaGVyZUNvbG9yKFwiIzNhMjI4YVwiKVxuICAgICAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG5cbiAgICAvLyBOT1RFIEFyYyBhbmltYXRpb25zIGFyZSBmb2xsb3dlZCBhZnRlciB0aGUgZ2xvYmUgZW50ZXJzIHRoZSBzY2VuZVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuXG4gICAgfSwgMTAwMCk7XG5cbiAgICBnZXRBaXJwb3J0RGF0YUZyb21DYWNoZSgpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgbGV0IHJlZmluZWRBaXJwb3J0cyA9IGRhdGEuYWlycG9ydERhdGFcbiAgICAgICAgbGV0IGFsbEZsaWdodHMgPSBkYXRhLmFsbEZsaWdodHM7XG4gICAgICAgIEdsb2JlLnBvaW50c0RhdGEocmVmaW5lZEFpcnBvcnRzKVxuICAgICAgICBHbG9iZS5sYWJlbHNEYXRhKHJlZmluZWRBaXJwb3J0cylcbiAgICAgICAgbGV0IGNvdW50cmllcyA9IFtdXG4gICAgICAgIHJlZmluZWRBaXJwb3J0cy5mb3JFYWNoKChhaXJwb3J0KSA9PiB7XG4gICAgICAgICAgICBjb3VudHJpZXMucHVzaChhaXJwb3J0LmNvdW50cnkpXG4gICAgICAgIH0pXG4gICAgICAgIEdsb2JlLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGNvdW50cmllcy5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICAgICAgZS5wcm9wZXJ0aWVzLklTT19BMlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDEpXCI7XG4gICAgICAgICAgICB9IGVsc2UgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMC40KVwiO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGxhdExvbmdEYXRhID0ge31cblxuICAgICAgICByZWZpbmVkQWlycG9ydHMuZm9yRWFjaCgoYWlycG9ydCkgPT4ge1xuICAgICAgICAgICAgbGF0TG9uZ0RhdGFbYWlycG9ydC50ZXh0XSA9IFthaXJwb3J0LmxhdCwgYWlycG9ydC5sbmddXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc29sZS5sb2cobGF0TG9uZ0RhdGEpXG4gICAgICAgIGxldCBmbGlnaHRzID0gW11cbiAgICAgICAgYWxsRmxpZ2h0cy5tYXAoZmxpZ2h0ID0+IHtcbiAgICAgICAgICAgIGZsaWdodHMucHVzaCh7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZmxpZ2h0XCIsXG4gICAgICAgICAgICAgICAgXCJvcmRlclwiOiAxLFxuICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBmbGlnaHQuZGVwX2lhdGEsXG4gICAgICAgICAgICAgICAgXCJ0b1wiOiBmbGlnaHQuYXJyX2lhdGEsXG4gICAgICAgICAgICAgICAgXCJmbGlnaHRDb2RlXCI6IGZsaWdodC5jc19mbGlnaHRfaWF0YSxcbiAgICAgICAgICAgICAgICBcImRhdGVcIjogZmxpZ2h0LmRlcF90aW1lLFxuICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgXCJzdGFydExhdFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzBdID8gbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVswXSA6IDAsXG4gICAgICAgICAgICAgICAgXCJzdGFydExuZ1wiOiBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzFdID8gbGF0TG9uZ0RhdGFbZmxpZ2h0LmRlcF9pYXRhXVsxXSA6IDAsXG4gICAgICAgICAgICAgICAgXCJlbmRMYXRcIjogbGF0TG9uZ0RhdGFbZmxpZ2h0LmFycl9pYXRhXVswXSA/IGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMF0gOiAwLFxuICAgICAgICAgICAgICAgIFwiZW5kTG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMF0gPyBsYXRMb25nRGF0YVtmbGlnaHQuYXJyX2lhdGFdWzBdIDogMCxcbiAgICAgICAgICAgICAgICBcImFyY0FsdFwiOiAwLjA1XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIEdsb2JlLmFyY3NEYXRhKGZsaWdodHMpXG4gICAgICAgICAgICAgICAgLmFyY0NvbG9yKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlLnN0YXR1cyA/IFwiIzljZmYwMFwiIDogXCIjRkY0MDAwXCI7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYXJjQWx0aXR1ZGUoKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUuYXJjQWx0O1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFyY1N0cm9rZSgoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS5zdGF0dXMgPyAwLjUgOiAwLjM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYXJjRGFzaExlbmd0aCgwLjkpXG4gICAgICAgICAgICAgICAgLmFyY0Rhc2hHYXAoNClcbiAgICAgICAgICAgICAgICAuYXJjRGFzaEFuaW1hdGVUaW1lKDEwMDApXG4gICAgICAgICAgICAgICAgLmFyY3NUcmFuc2l0aW9uRHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAuYXJjRGFzaEluaXRpYWxHYXAoKGUpID0+IGUub3JkZXIgKiAxKVxuICAgICAgICAgICAgICAgIC5sYWJlbENvbG9yKCgpID0+IFwiI2ZmY2IyMVwiKVxuICAgICAgICAgICAgICAgIC5sYWJlbERvdE9yaWVudGF0aW9uKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlLnRleHQgPT09IFwiQUxBXCIgPyBcInRvcFwiIDogXCJyaWdodFwiO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmxhYmVsRG90UmFkaXVzKDAuMylcbiAgICAgICAgICAgICAgICAubGFiZWxTaXplKChlKSA9PiBlLnNpemUpXG4gICAgICAgICAgICAgICAgLmxhYmVsVGV4dChcImNpdHlcIilcbiAgICAgICAgICAgICAgICAubGFiZWxSZXNvbHV0aW9uKDYpXG4gICAgICAgICAgICAgICAgLmxhYmVsQWx0aXR1ZGUoMC4wMSlcbiAgICAgICAgICAgICAgICAucG9pbnRDb2xvcigoKSA9PiBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgICAgICAucG9pbnRzTWVyZ2UodHJ1ZSlcbiAgICAgICAgICAgICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgICAgICAgICAgIC5wb2ludFJhZGl1cygwLjA1KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBHbG9iZS5yb3RhdGVZKC1NYXRoLlBJICogKDUgLyAxOCkpO1xuICAgIEdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA2KTtcbiAgICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICAgIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICAgIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICAgIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7XG4gICAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgICAvLyBOT1RFIENvb2wgc3R1ZmZcbiAgICAvLyBnbG9iZU1hdGVyaWFsLndpcmVmcmFtZSA9IHRydWU7XG5cbiAgICBzY2VuZS5hZGQoR2xvYmUpO1xufVxuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG4gICAgLy8gY29uc29sZS5sb2coXCJ4OiBcIiArIG1vdXNlWCArIFwiIHk6IFwiICsgbW91c2VZKTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIGNhbWVyYS5wb3NpdGlvbi54ICs9XG4gICAgICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyID9cbiAgICAgICAgKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNSA6XG4gICAgICAgIDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gICAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gICAgY29udHJvbHMudXBkYXRlKCk7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn0iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcImZmMjI4MTIxMWI1MDgwZTE2ZTgyXCIiXSwic291cmNlUm9vdCI6IiJ9