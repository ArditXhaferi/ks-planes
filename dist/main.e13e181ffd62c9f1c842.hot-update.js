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
    const response = await axios__WEBPACK_IMPORTED_MODULE_7__.default.get('https://airlabs.co/api/v9/schedules?dep_iata=PRN&api_key=682c54a6-ba6c-4273-a005-dd56577a6698');
    const arrival = await axios__WEBPACK_IMPORTED_MODULE_7__.default.get('https://airlabs.co/api/v9/schedules?arr_iata=PRN&api_key=682c54a6-ba6c-4273-a005-dd56577a6698');
    const airportCodes = response.data.response.map((flight) => flight.arr_iata);
    const arrivalCodes = arrival.data.response.map((flight) => flight.dep_iata);
    const ks = arrival.data.response.map((flight) => flight.arr_iata);
    airportCodes.push(...arrivalCodes);
    airportCodes.push(...ks);

    airports = [...new Set(airportCodes)]; // remove duplicates

    return await Promise.all(airports.map(async(airport) => {
        const response = await axios__WEBPACK_IMPORTED_MODULE_7__.default.get('https://airlabs.co/api/v9/airports?iata_code=' + airport + '&api_key=682c54a6-ba6c-4273-a005-dd56577a6698');
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
        Globe.arcsData(_files_my_flights_json__WEBPACK_IMPORTED_MODULE_3__.flights)
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
    }, 1000);

    getAirportData().then((refinedAirports) => {

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
    });

    Globe.rotateY(-Math.PI * (5 / 20));
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
/******/ 		__webpack_require__.h = () => "8fdb87b546077aeeda44"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ1E7QUFZOUI7QUFDOEQ7QUFDNUI7QUFDRztBQUNBO0FBQ0U7QUFDNUI7O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixnREFBYSxFQUFFLGtCQUFrQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQix3Q0FBSztBQUNyQixrQkFBa0IsK0NBQVk7QUFDOUIsMkJBQTJCLHdDQUFLOztBQUVoQztBQUNBLGlCQUFpQixvREFBaUI7QUFDbEM7QUFDQTs7QUFFQSxxQkFBcUIsbURBQWdCO0FBQ3JDO0FBQ0E7O0FBRUEsc0JBQXNCLG1EQUFnQjtBQUN0QztBQUNBOztBQUVBLHNCQUFzQiw2Q0FBVTtBQUNoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLG9CQUFvQixzQ0FBRzs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsdUZBQWE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwyQkFBMkIsOENBQVM7QUFDcEMsMEJBQTBCLDhDQUFTO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMENBQTBDOztBQUUxQztBQUNBLCtCQUErQiw4Q0FBUztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixnREFBVTtBQUMxQjtBQUNBO0FBQ0EsU0FBUztBQUNULHlCQUF5QixnRUFBa0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLDJEQUFxQjtBQUM1QztBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsd0NBQUs7QUFDbkMsaUNBQWlDLHdDQUFLO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7O1dDdE9BLG9EIiwiZmlsZSI6Im1haW4uZTEzZTE4MWZmZDYyYzlmMWM4NDIuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7XG4gICAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gICAgQW1iaWVudExpZ2h0LFxuICAgIERpcmVjdGlvbmFsTGlnaHQsXG4gICAgQ29sb3IsXG4gICAgRm9nLFxuICAgIC8vIEF4ZXNIZWxwZXIsXG4gICAgLy8gRGlyZWN0aW9uYWxMaWdodEhlbHBlcixcbiAgICAvLyBDYW1lcmFIZWxwZXIsXG4gICAgUG9pbnRMaWdodCxcbiAgICBTcGhlcmVHZW9tZXRyeSxcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgeyBjcmVhdGVHbG93TWVzaCB9IGZyb20gXCJ0aHJlZS1nbG93LW1lc2hcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiO1xuaW1wb3J0IHRyYXZlbEhpc3RvcnkgZnJvbSBcIi4vZmlsZXMvbXktZmxpZ2h0cy5qc29uXCI7XG5pbXBvcnQgYWlycG9ydEhpc3RvcnkgZnJvbSBcIi4vZmlsZXMvbXktYWlycG9ydHMuanNvblwiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5sZXQgYWlycG9ydHMgPSBbXVxuXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gICAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIC8vIHJlbmRlcmVyLm91dHB1dEVuY29kaW5nID0gVEhSRUUuc1JHQkVuY29kaW5nO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAvLyBJbml0aWFsaXplIHNjZW5lLCBsaWdodFxuICAgIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gICAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICAgIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwNDBkMjEpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBjYW1lcmEsIGxpZ2h0XG4gICAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gICAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICAgIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICAgIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICAgIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gICAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gICAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICAgIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICAgIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgICBzY2VuZS5hZGQoY2FtZXJhKTtcblxuICAgIC8vIEFkZGl0aW9uYWwgZWZmZWN0c1xuICAgIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgICAvLyBIZWxwZXJzXG4gICAgLy8gY29uc3QgYXhlc0hlbHBlciA9IG5ldyBBeGVzSGVscGVyKDgwMCk7XG4gICAgLy8gc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuICAgIC8vIHZhciBoZWxwZXIgPSBuZXcgRGlyZWN0aW9uYWxMaWdodEhlbHBlcihkTGlnaHQpO1xuICAgIC8vIHNjZW5lLmFkZChoZWxwZXIpO1xuICAgIC8vIHZhciBoZWxwZXJDYW1lcmEgPSBuZXcgQ2FtZXJhSGVscGVyKGRMaWdodC5zaGFkb3cuY2FtZXJhKTtcbiAgICAvLyBzY2VuZS5hZGQoaGVscGVyQ2FtZXJhKTtcblxuICAgIC8vIEluaXRpYWxpemUgY29udHJvbHNcbiAgICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gICAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICAgIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICAgIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICAgIGNvbnRyb2xzLm1heERpc3RhbmNlID0gNTAwO1xuICAgIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICAgIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gICAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuXG4gICAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gICAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG5cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWlycG9ydERhdGEoKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHBzOi8vYWlybGFicy5jby9hcGkvdjkvc2NoZWR1bGVzP2RlcF9pYXRhPVBSTiZhcGlfa2V5PTY4MmM1NGE2LWJhNmMtNDI3My1hMDA1LWRkNTY1NzdhNjY5OCcpO1xuICAgIGNvbnN0IGFycml2YWwgPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHBzOi8vYWlybGFicy5jby9hcGkvdjkvc2NoZWR1bGVzP2Fycl9pYXRhPVBSTiZhcGlfa2V5PTY4MmM1NGE2LWJhNmMtNDI3My1hMDA1LWRkNTY1NzdhNjY5OCcpO1xuICAgIGNvbnN0IGFpcnBvcnRDb2RlcyA9IHJlc3BvbnNlLmRhdGEucmVzcG9uc2UubWFwKChmbGlnaHQpID0+IGZsaWdodC5hcnJfaWF0YSk7XG4gICAgY29uc3QgYXJyaXZhbENvZGVzID0gYXJyaXZhbC5kYXRhLnJlc3BvbnNlLm1hcCgoZmxpZ2h0KSA9PiBmbGlnaHQuZGVwX2lhdGEpO1xuICAgIGNvbnN0IGtzID0gYXJyaXZhbC5kYXRhLnJlc3BvbnNlLm1hcCgoZmxpZ2h0KSA9PiBmbGlnaHQuYXJyX2lhdGEpO1xuICAgIGFpcnBvcnRDb2Rlcy5wdXNoKC4uLmFycml2YWxDb2Rlcyk7XG4gICAgYWlycG9ydENvZGVzLnB1c2goLi4ua3MpO1xuXG4gICAgYWlycG9ydHMgPSBbLi4ubmV3IFNldChhaXJwb3J0Q29kZXMpXTsgLy8gcmVtb3ZlIGR1cGxpY2F0ZXNcblxuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChhaXJwb3J0cy5tYXAoYXN5bmMoYWlycG9ydCkgPT4ge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cHM6Ly9haXJsYWJzLmNvL2FwaS92OS9haXJwb3J0cz9pYXRhX2NvZGU9JyArIGFpcnBvcnQgKyAnJmFwaV9rZXk9NjgyYzU0YTYtYmE2Yy00MjczLWEwMDUtZGQ1NjU3N2E2Njk4Jyk7XG4gICAgICAgIGNvbnN0IHJlZmluZWRBaXJwb3J0ID0ge1xuICAgICAgICAgICAgdGV4dDogcmVzcG9uc2UuZGF0YS5yZXNwb25zZVswXVsnaWF0YV9jb2RlJ10sXG4gICAgICAgICAgICBzaXplOiAxLjAsXG4gICAgICAgICAgICBjb3VudHJ5OiByZXNwb25zZS5kYXRhLnJlc3BvbnNlWzBdWydjb3VudHJ5X2NvZGUnXSxcbiAgICAgICAgICAgIGNpdHk6IHJlc3BvbnNlLmRhdGEucmVzcG9uc2VbMF1bJ25hbWUnXS5yZXBsYWNlKFwiSW50ZXJuYXRpb25hbCBBaXJwb3J0XCIsIFwiXCIpLnJlcGxhY2UoXCJBaXJwb3J0XCIsIFwiXCIpLFxuICAgICAgICAgICAgbGF0OiByZXNwb25zZS5kYXRhLnJlc3BvbnNlWzBdWydsYXQnXSxcbiAgICAgICAgICAgIGxuZzogcmVzcG9uc2UuZGF0YS5yZXNwb25zZVswXVsnbG5nJ10sXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZWZpbmVkQWlycG9ydDtcbiAgICB9KSk7XG59XG5cblxuLy8gU0VDVElPTiBHbG9iZVxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICAgIC8vIEluaXRpYWxpemUgdGhlIEdsb2JlXG4gICAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgICAgICAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgICAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgICAgIC5zaG93QXRtb3NwaGVyZSh0cnVlKVxuICAgICAgICAuYXRtb3NwaGVyZUNvbG9yKFwiIzNhMjI4YVwiKVxuICAgICAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG5cbiAgICAvLyBOT1RFIEFyYyBhbmltYXRpb25zIGFyZSBmb2xsb3dlZCBhZnRlciB0aGUgZ2xvYmUgZW50ZXJzIHRoZSBzY2VuZVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBHbG9iZS5hcmNzRGF0YSh0cmF2ZWxIaXN0b3J5LmZsaWdodHMpXG4gICAgICAgICAgICAuYXJjQ29sb3IoKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5zdGF0dXMgPyBcIiM5Y2ZmMDBcIiA6IFwiI0ZGNDAwMFwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hcmNBbHRpdHVkZSgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBlLmFyY0FsdDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYXJjU3Ryb2tlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gMC41IDogMC4zO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hcmNEYXNoTGVuZ3RoKDAuOSlcbiAgICAgICAgICAgIC5hcmNEYXNoR2FwKDQpXG4gICAgICAgICAgICAuYXJjRGFzaEFuaW1hdGVUaW1lKDEwMDApXG4gICAgICAgICAgICAuYXJjc1RyYW5zaXRpb25EdXJhdGlvbigxMDAwKVxuICAgICAgICAgICAgLmFyY0Rhc2hJbml0aWFsR2FwKChlKSA9PiBlLm9yZGVyICogMSlcbiAgICAgICAgICAgIC5sYWJlbENvbG9yKCgpID0+IFwiI2ZmY2IyMVwiKVxuICAgICAgICAgICAgLmxhYmVsRG90T3JpZW50YXRpb24oKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS50ZXh0ID09PSBcIkFMQVwiID8gXCJ0b3BcIiA6IFwicmlnaHRcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubGFiZWxEb3RSYWRpdXMoMC4zKVxuICAgICAgICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgICAgICAgLmxhYmVsVGV4dChcImNpdHlcIilcbiAgICAgICAgICAgIC5sYWJlbFJlc29sdXRpb24oNilcbiAgICAgICAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAgICAgICAucG9pbnRDb2xvcigoKSA9PiBcIiNmZmZmZmZcIilcbiAgICAgICAgICAgIC5wb2ludHNNZXJnZSh0cnVlKVxuICAgICAgICAgICAgLnBvaW50QWx0aXR1ZGUoMC4wNylcbiAgICAgICAgICAgIC5wb2ludFJhZGl1cygwLjA1KTtcbiAgICB9LCAxMDAwKTtcblxuICAgIGdldEFpcnBvcnREYXRhKCkudGhlbigocmVmaW5lZEFpcnBvcnRzKSA9PiB7XG5cbiAgICAgICAgR2xvYmUucG9pbnRzRGF0YShyZWZpbmVkQWlycG9ydHMpXG4gICAgICAgIEdsb2JlLmxhYmVsc0RhdGEocmVmaW5lZEFpcnBvcnRzKVxuICAgICAgICBsZXQgY291bnRyaWVzID0gW11cbiAgICAgICAgcmVmaW5lZEFpcnBvcnRzLmZvckVhY2goKGFpcnBvcnQpID0+IHtcbiAgICAgICAgICAgIGNvdW50cmllcy5wdXNoKGFpcnBvcnQuY291bnRyeSlcbiAgICAgICAgfSlcbiAgICAgICAgR2xvYmUuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY291bnRyaWVzLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgICAgICBlLnByb3BlcnRpZXMuSVNPX0EyXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMSlcIjtcbiAgICAgICAgICAgIH0gZWxzZSByZXR1cm4gXCJyZ2JhKDI1NSwyNTUsMjU1LCAwLjQpXCI7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gMjApKTtcbiAgICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG4gICAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4M2EyMjhhKTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xO1xuICAgIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuXG4gICAgLy8gTk9URSBDb29sIHN0dWZmXG4gICAgLy8gZ2xvYmVNYXRlcmlhbC53aXJlZnJhbWUgPSB0cnVlO1xuXG4gICAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gICAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xuICAgIC8vIGNvbnNvbGUubG9nKFwieDogXCIgKyBtb3VzZVggKyBcIiB5OiBcIiArIG1vdXNlWSk7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gICAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICBjYW1lcmEucG9zaXRpb24ueCArPVxuICAgICAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMiA/XG4gICAgICAgIChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDUgOlxuICAgICAgICAwO1xuICAgIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICAgIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICAgIGNvbnRyb2xzLnVwZGF0ZSgpO1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI4ZmRiODdiNTQ2MDc3YWVlZGE0NFwiIl0sInNvdXJjZVJvb3QiOiIifQ==