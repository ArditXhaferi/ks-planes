import ThreeGlobe from "three-globe";
import * as THREE from "three";
import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight, Color, Fog, PointLight, FontLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import countries from "./files/globe-data-min.json";
import allAirports from "./files/airports.json";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

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
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

/**
 * Initialize scene and set background color.
 */
function initScene() {
    scene = new Scene();
    scene.add(new AmbientLight(0xbbbbbb, 0.3));
    scene.background = new Color(0x040d21);
}

/**
 * Initialize camera and set aspect ratio.
 */
function initCamera() {
    camera = new PerspectiveCamera();
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
    const dLight = new DirectionalLight(0xffffff, 0.8);
    dLight.position.set(-800, 2000, 400);
    camera.add(dLight);

    const dLight1 = new DirectionalLight(0x7982f6, 1);
    dLight1.position.set(-200, 500, 200);
    camera.add(dLight1);
}

/**
 * Create and add point light to camera.
 */
function initPointLight() {
    const dLight2 = new PointLight(0x8566cc, 0.5);
    dLight2.position.set(-200, 500, 200);
    camera.add(dLight2);
}

/**
 * Create and add fog to the scene.
 */
function initFog() {
    scene.fog = new Fog(0x535ef3, 400, 2000);
}

/**
 * Setup Orbit Controls.
 */
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
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

    if (window.innerWidth > 768) {
        document.addEventListener("mousemove", updateMousePosition);
    }
}

onWindowResize();

function onWindowResize() {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    windowHalfX = innerWidth / 2;
    windowHalfY = innerHeight / 2;
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
    Globe = new ThreeGlobe({
            waitForGlobeReady: true,
            animateIn: true,
        })
        .hexPolygonsData(countries.features)
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
        const loader = new FontLoader();
        loader.load('./font.json', function(font) {
            texts.forEach((planeText, index) => {
                const color = 0xEEEEEE;
                const matLite = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.4,
                    side: THREE.DoubleSide
                });
                const message = planeText;
                const shapes = font.generateShapes(message, 100);
                const geometry = new THREE.ShapeGeometry(shapes);
                geometry.center();
                const text = new THREE.Mesh(geometry, matLite);
                text.position.z = -300 - index;
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
    globeMaterial.color = new Color(0x3a228a);
    globeMaterial.emissive = new Color(0x220038);
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
    const chaceRef = ref(db);

    return new Promise((resolve, reject) => {
        get(child(chaceRef, 'cache')).then(async(snapshot) => {
            const cache = snapshot.val();
            if (cache && cache.timestamp && cache.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
                console.log("cached");
                resolve(cache.data);
            } else {
                console.log("not cached")
                const data = await getAirportData();
                set(ref(db, 'cache'), {
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
        axios.get(`${baseUrl}/schedules?dep_iata=PRN&api_key=${apiKey}`),
        axios.get(`${baseUrl}/schedules?arr_iata=PRN&api_key=${apiKey}`)
    ]);

    const airportCodes = departure.data.response.map((flight) => flight.arr_icao);
    const arrivalCodes = arrival.data.response.map((flight) => flight.dep_icao);
    const prishtinaCode = arrival.data.response.map((flight) => flight.arr_icao);
    const allCodes = [...new Set([...airportCodes, ...arrivalCodes, ...prishtinaCode])];

    const allFlights = [...departure.data.response, ...arrival.data.response];
    const airportData = await Promise.all(allCodes.map(async(airport) => {
        const response = allAirports[airport];
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