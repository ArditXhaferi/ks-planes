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
/* harmony import */ var three_glow_mesh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three-glow-mesh */ "./node_modules/three-glow-mesh/dist/index.module.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
/* harmony import */ var _files_my_flights_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./files/my-flights.json */ "./src/files/my-flights.json");
/* harmony import */ var _files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./files/my-airports.json */ "./src/files/my-airports.json");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");










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
async function getAirportData() {
    const apiKey = '682c54a6-ba6c-4273-a005-dd56577a6698';
    const baseUrl = 'https://airlabs.co/api/v9';

    const [departure, arrival] = await Promise.all([
        axios__WEBPACK_IMPORTED_MODULE_7__.default.get(`${baseUrl}/schedules?dep_iata=PRN&api_key=${apiKey}`),
        axios__WEBPACK_IMPORTED_MODULE_7__.default.get(`${baseUrl}/schedules?arr_iata=PRN&api_key=${apiKey}`)
    ]);

    const airportCodes = departure.data.response.map((flight) => flight.arr_iata);
    const arrivalCodes = arrival.data.response.map((flight) => flight.dep_iata);
    const allCodes = [...new Set([...airportCodes, ...arrivalCodes])];

    const allFlights = [...departure.data.response, ...arrival.data.response];
    const airportData = await Promise.all(allCodes.map(async(airport) => {
        const response = await axios__WEBPACK_IMPORTED_MODULE_7__.default.get(`${baseUrl}/airports?iata_code=${airport}&api_key=${apiKey}`);
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

    getAirportData().then((data) => {
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
        }).then(() => {
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
                    "startLat": latLongData[flight.dep_iata][0],
                    "startLng": latLongData[flight.dep_iata][1],
                    "endLat": latLongData[flight.arr_iata][0],
                    "endLng": latLongData[flight.arr_iata][0],
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
        })
    });

    Globe.rotateY(-Math.PI * (5 / 18));
    Globe.rotateZ(-Math.PI / 6);
    const globeMaterial = Globe.globeMaterial();
    globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x3a228a);
    globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x220038);
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
/******/ 		__webpack_require__.h = () => "1d33340ed88363e8acf0"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ1E7QUFZOUI7QUFDOEQ7QUFDNUI7QUFDRztBQUNBO0FBQ0U7QUFDNUI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixnREFBYSxFQUFFLGtCQUFrQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQix3Q0FBSztBQUNyQixrQkFBa0IsK0NBQVk7QUFDOUIsMkJBQTJCLHdDQUFLOztBQUVoQztBQUNBLGlCQUFpQixvREFBaUI7QUFDbEM7QUFDQTs7QUFFQSxxQkFBcUIsbURBQWdCO0FBQ3JDO0FBQ0E7O0FBRUEsc0JBQXNCLG1EQUFnQjtBQUN0QztBQUNBOztBQUVBLHNCQUFzQiw2Q0FBVTtBQUNoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLG9CQUFvQixzQ0FBRzs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsdUZBQWE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLDhDQUFTLElBQUksUUFBUSxrQ0FBa0MsT0FBTztBQUN0RSxRQUFRLDhDQUFTLElBQUksUUFBUSxrQ0FBa0MsT0FBTztBQUN0RTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtCQUErQiw4Q0FBUyxJQUFJLFFBQVEsc0JBQXNCLFFBQVEsV0FBVyxPQUFPO0FBQ3BHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUwsWUFBWTtBQUNaOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZ0RBQVU7QUFDMUI7QUFDQTtBQUNBLFNBQVM7QUFDVCx5QkFBeUIsZ0VBQWtCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHdDQUFLO0FBQ25DLGlDQUFpQyx3Q0FBSztBQUN0QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7OztXQ25RQSxvRCIsImZpbGUiOiJtYWluLmJhMmE2YTRiMDQ3ZjM2NjY5YjhmLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQge1xuICAgIFBlcnNwZWN0aXZlQ2FtZXJhLFxuICAgIEFtYmllbnRMaWdodCxcbiAgICBEaXJlY3Rpb25hbExpZ2h0LFxuICAgIENvbG9yLFxuICAgIEZvZyxcbiAgICAvLyBBeGVzSGVscGVyLFxuICAgIC8vIERpcmVjdGlvbmFsTGlnaHRIZWxwZXIsXG4gICAgLy8gQ2FtZXJhSGVscGVyLFxuICAgIFBvaW50TGlnaHQsXG4gICAgU3BoZXJlR2VvbWV0cnksXG59IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlR2xvd01lc2ggfSBmcm9tIFwidGhyZWUtZ2xvdy1tZXNoXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjtcbmltcG9ydCB0cmF2ZWxIaXN0b3J5IGZyb20gXCIuL2ZpbGVzL215LWZsaWdodHMuanNvblwiO1xuaW1wb3J0IGFpcnBvcnRIaXN0b3J5IGZyb20gXCIuL2ZpbGVzL215LWFpcnBvcnRzLmpzb25cIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xubGV0IGFpcnBvcnRzID0gW11cblxuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICAgIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICAgIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDQwZDIxKTtcblxuICAgIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICAgIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICAgIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICAgIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gICAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gICAgc2NlbmUuYWRkKGNhbWVyYSk7XG5cbiAgICAvLyBBZGRpdGlvbmFsIGVmZmVjdHNcbiAgICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gICAgLy8gSGVscGVyc1xuICAgIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgQXhlc0hlbHBlcig4MDApO1xuICAgIC8vIHNjZW5lLmFkZChheGVzSGVscGVyKTtcbiAgICAvLyB2YXIgaGVscGVyID0gbmV3IERpcmVjdGlvbmFsTGlnaHRIZWxwZXIoZExpZ2h0KTtcbiAgICAvLyBzY2VuZS5hZGQoaGVscGVyKTtcbiAgICAvLyB2YXIgaGVscGVyQ2FtZXJhID0gbmV3IENhbWVyYUhlbHBlcihkTGlnaHQuc2hhZG93LmNhbWVyYSk7XG4gICAgLy8gc2NlbmUuYWRkKGhlbHBlckNhbWVyYSk7XG5cbiAgICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gICAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICAgIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICAgIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICAgIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICAgIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuXG59XG5hc3luYyBmdW5jdGlvbiBnZXRBaXJwb3J0RGF0YSgpIHtcbiAgICBjb25zdCBhcGlLZXkgPSAnNjgyYzU0YTYtYmE2Yy00MjczLWEwMDUtZGQ1NjU3N2E2Njk4JztcbiAgICBjb25zdCBiYXNlVXJsID0gJ2h0dHBzOi8vYWlybGFicy5jby9hcGkvdjknO1xuXG4gICAgY29uc3QgW2RlcGFydHVyZSwgYXJyaXZhbF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGF4aW9zLmdldChgJHtiYXNlVXJsfS9zY2hlZHVsZXM/ZGVwX2lhdGE9UFJOJmFwaV9rZXk9JHthcGlLZXl9YCksXG4gICAgICAgIGF4aW9zLmdldChgJHtiYXNlVXJsfS9zY2hlZHVsZXM/YXJyX2lhdGE9UFJOJmFwaV9rZXk9JHthcGlLZXl9YClcbiAgICBdKTtcblxuICAgIGNvbnN0IGFpcnBvcnRDb2RlcyA9IGRlcGFydHVyZS5kYXRhLnJlc3BvbnNlLm1hcCgoZmxpZ2h0KSA9PiBmbGlnaHQuYXJyX2lhdGEpO1xuICAgIGNvbnN0IGFycml2YWxDb2RlcyA9IGFycml2YWwuZGF0YS5yZXNwb25zZS5tYXAoKGZsaWdodCkgPT4gZmxpZ2h0LmRlcF9pYXRhKTtcbiAgICBjb25zdCBhbGxDb2RlcyA9IFsuLi5uZXcgU2V0KFsuLi5haXJwb3J0Q29kZXMsIC4uLmFycml2YWxDb2Rlc10pXTtcblxuICAgIGNvbnN0IGFsbEZsaWdodHMgPSBbLi4uZGVwYXJ0dXJlLmRhdGEucmVzcG9uc2UsIC4uLmFycml2YWwuZGF0YS5yZXNwb25zZV07XG4gICAgY29uc3QgYWlycG9ydERhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChhbGxDb2Rlcy5tYXAoYXN5bmMoYWlycG9ydCkgPT4ge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgJHtiYXNlVXJsfS9haXJwb3J0cz9pYXRhX2NvZGU9JHthaXJwb3J0fSZhcGlfa2V5PSR7YXBpS2V5fWApO1xuICAgICAgICBjb25zdCByZWZpbmVkQWlycG9ydCA9IHtcbiAgICAgICAgICAgIHRleHQ6IHJlc3BvbnNlLmRhdGEucmVzcG9uc2VbMF1bJ2lhdGFfY29kZSddLFxuICAgICAgICAgICAgc2l6ZTogMS4wLFxuICAgICAgICAgICAgY291bnRyeTogcmVzcG9uc2UuZGF0YS5yZXNwb25zZVswXVsnY291bnRyeV9jb2RlJ10sXG4gICAgICAgICAgICBjaXR5OiByZXNwb25zZS5kYXRhLnJlc3BvbnNlWzBdWyduYW1lJ10ucmVwbGFjZShcIkludGVybmF0aW9uYWwgQWlycG9ydFwiLCBcIlwiKS5yZXBsYWNlKFwiQWlycG9ydFwiLCBcIlwiKSxcbiAgICAgICAgICAgIGxhdDogcmVzcG9uc2UuZGF0YS5yZXNwb25zZVswXVsnbGF0J10sXG4gICAgICAgICAgICBsbmc6IHJlc3BvbnNlLmRhdGEucmVzcG9uc2VbMF1bJ2xuZyddLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVmaW5lZEFpcnBvcnQ7XG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHsgYWxsRmxpZ2h0cywgYWlycG9ydERhdGEgfTtcbn1cblxuXG4vLyBTRUNUSU9OIEdsb2JlXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgR2xvYmVcbiAgICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICAgICAgICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0ZUluOiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAgICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAgICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgICAgIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcblxuICAgIC8vIE5PVEUgQXJjIGFuaW1hdGlvbnMgYXJlIGZvbGxvd2VkIGFmdGVyIHRoZSBnbG9iZSBlbnRlcnMgdGhlIHNjZW5lXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICB9LCAxMDAwKTtcblxuICAgIGdldEFpcnBvcnREYXRhKCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBsZXQgcmVmaW5lZEFpcnBvcnRzID0gZGF0YS5haXJwb3J0RGF0YVxuICAgICAgICBsZXQgYWxsRmxpZ2h0cyA9IGRhdGEuYWxsRmxpZ2h0cztcbiAgICAgICAgR2xvYmUucG9pbnRzRGF0YShyZWZpbmVkQWlycG9ydHMpXG4gICAgICAgIEdsb2JlLmxhYmVsc0RhdGEocmVmaW5lZEFpcnBvcnRzKVxuICAgICAgICBsZXQgY291bnRyaWVzID0gW11cbiAgICAgICAgcmVmaW5lZEFpcnBvcnRzLmZvckVhY2goKGFpcnBvcnQpID0+IHtcbiAgICAgICAgICAgIGNvdW50cmllcy5wdXNoKGFpcnBvcnQuY291bnRyeSlcbiAgICAgICAgfSlcbiAgICAgICAgR2xvYmUuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY291bnRyaWVzLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgICAgICBlLnByb3BlcnRpZXMuSVNPX0EyXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMSlcIjtcbiAgICAgICAgICAgIH0gZWxzZSByZXR1cm4gXCJyZ2JhKDI1NSwyNTUsMjU1LCAwLjQpXCI7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgbGF0TG9uZ0RhdGEgPSB7fVxuICAgICAgICByZWZpbmVkQWlycG9ydHMuZm9yRWFjaCgoYWlycG9ydCkgPT4ge1xuICAgICAgICAgICAgbGF0TG9uZ0RhdGFbYWlycG9ydC50ZXh0XSA9IFthaXJwb3J0LmxhdCwgYWlycG9ydC5sbmddXG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZsaWdodHMgPSBbXVxuICAgICAgICAgICAgYWxsRmxpZ2h0cy5tYXAoZmxpZ2h0ID0+IHtcbiAgICAgICAgICAgICAgICBmbGlnaHRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmbGlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJvcmRlclwiOiAxLFxuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogZmxpZ2h0LmRlcF9pYXRhLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IGZsaWdodC5hcnJfaWF0YSxcbiAgICAgICAgICAgICAgICAgICAgXCJmbGlnaHRDb2RlXCI6IGZsaWdodC5jc19mbGlnaHRfaWF0YSxcbiAgICAgICAgICAgICAgICAgICAgXCJkYXRlXCI6IGZsaWdodC5kZXBfdGltZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzdGFydExhdFwiOiBsYXRMb25nRGF0YVtmbGlnaHQuZGVwX2lhdGFdWzBdLFxuICAgICAgICAgICAgICAgICAgICBcInN0YXJ0TG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5kZXBfaWF0YV1bMV0sXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kTGF0XCI6IGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMF0sXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kTG5nXCI6IGxhdExvbmdEYXRhW2ZsaWdodC5hcnJfaWF0YV1bMF0sXG4gICAgICAgICAgICAgICAgICAgIFwiYXJjQWx0XCI6IDAuMDVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgR2xvYmUuYXJjc0RhdGEoZmxpZ2h0cylcbiAgICAgICAgICAgICAgICAgICAgLmFyY0NvbG9yKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS5zdGF0dXMgPyBcIiM5Y2ZmMDBcIiA6IFwiI0ZGNDAwMFwiO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYXJjQWx0aXR1ZGUoKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlLmFyY0FsdDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFyY1N0cm9rZSgoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gMC41IDogMC4zO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYXJjRGFzaExlbmd0aCgwLjkpXG4gICAgICAgICAgICAgICAgICAgIC5hcmNEYXNoR2FwKDQpXG4gICAgICAgICAgICAgICAgICAgIC5hcmNEYXNoQW5pbWF0ZVRpbWUoMTAwMClcbiAgICAgICAgICAgICAgICAgICAgLmFyY3NUcmFuc2l0aW9uRHVyYXRpb24oMTAwMClcbiAgICAgICAgICAgICAgICAgICAgLmFyY0Rhc2hJbml0aWFsR2FwKChlKSA9PiBlLm9yZGVyICogMSlcbiAgICAgICAgICAgICAgICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gXCIjZmZjYjIxXCIpXG4gICAgICAgICAgICAgICAgICAgIC5sYWJlbERvdE9yaWVudGF0aW9uKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZS50ZXh0ID09PSBcIkFMQVwiID8gXCJ0b3BcIiA6IFwicmlnaHRcIjtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmxhYmVsRG90UmFkaXVzKDAuMylcbiAgICAgICAgICAgICAgICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgICAgICAgICAgICAgICAubGFiZWxUZXh0KFwiY2l0eVwiKVxuICAgICAgICAgICAgICAgICAgICAubGFiZWxSZXNvbHV0aW9uKDYpXG4gICAgICAgICAgICAgICAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAgICAgICAgICAgICAgIC5wb2ludENvbG9yKCgpID0+IFwiI2ZmZmZmZlwiKVxuICAgICAgICAgICAgICAgICAgICAucG9pbnRzTWVyZ2UodHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgLnBvaW50QWx0aXR1ZGUoMC4wNylcbiAgICAgICAgICAgICAgICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfSk7XG5cbiAgICBHbG9iZS5yb3RhdGVZKC1NYXRoLlBJICogKDUgLyAxOCkpO1xuICAgIEdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA2KTtcbiAgICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICAgIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICAgIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICAgIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7XG4gICAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgICAvLyBOT1RFIENvb2wgc3R1ZmZcbiAgICAvLyBnbG9iZU1hdGVyaWFsLndpcmVmcmFtZSA9IHRydWU7XG5cbiAgICBzY2VuZS5hZGQoR2xvYmUpO1xufVxuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICAgIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG4gICAgLy8gY29uc29sZS5sb2coXCJ4OiBcIiArIG1vdXNlWCArIFwiIHk6IFwiICsgbW91c2VZKTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICAgIGNhbWVyYS5wb3NpdGlvbi54ICs9XG4gICAgICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyID9cbiAgICAgICAgKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNSA6XG4gICAgICAgIDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gICAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gICAgY29udHJvbHMudXBkYXRlKCk7XG4gICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn0iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcIjFkMzMzNDBlZDg4MzYzZThhY2YwXCIiXSwic291cmNlUm9vdCI6IiJ9