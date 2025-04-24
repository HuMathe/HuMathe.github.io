let scene, camera, renderer;
let raycaster, mouse;
let chart;
let width, height;
let selected = null;
let selectedMtlFile = null;
let currentObject = null;
const MAXWINSIZE = 800;

const unselectedColor = 0xff0000;
const selectedColor = 0x00ff00;

let markers = [];

init();
animate();
// Done.

function loadModel(mtlFile, objFile) {
    if (currentObject) {
        scene.remove(currentObject);
    }
    selectedMtlFile = mtlFile;
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(mtlFile, (materials) => {
        materials.preload();

        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            objFile,
            (obj) => {
                currentObject = obj;
                scene.add(currentObject);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened', error);
            }
        );
    });

    if (selected) {
        const index = selected.userData.index;
        const marker = markers[index];
        const uniqueURL = marker.photoURL + '?_=' + Date.now();
        document.getElementById('idemoImage').src = uniqueURL;
        updateChart(marker.data[selectedMtlFile]);
    }
}

function loadMarkersFromFile() {
    fetch('static/data/markers.json')
        .then(response => response.json())
        .then(data => {
            markers = data.map(marker => {
                return {
                    position: new THREE.Vector3(marker.position[0], marker.position[1], marker.position[2]),
                    photoURL: marker.photoURL,
                    data: marker.data
                };
            });
            markers.forEach(
                (marker, index) => {
                    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
                    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    const sphere = new THREE.Mesh(geometry, material);
                    sphere.position.copy(marker.position);
                    sphere.userData = { index: index };
                    scene.add(sphere);
                }
            );
        })
        .catch(error => console.error('Error loading markers:', error));
}

function init() {
    // width = document.getElementById('idemo').width;
    // height = document.getElementById('idemo').height;
    width = Math.min(window.innerWidth - 400, MAXWINSIZE, window.innerHeight);
    height = width;
    scene = new THREE.Scene();
    // camera = new THREE.PerspectiveCamera(75, (window.innerWidth -400)/ window.innerHeight, 0.1, 1000);
    // Get from css idemo.width and idemo.height
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    document.getElementById('idemo').appendChild(renderer.domElement);
    
    
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(-1, 1.5, 0);
    camera.position.set(-1, 1.5, 1);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
   
    loadModel('static/objects/mesh.mtl', 'static/objects/mesh.obj');

    document.getElementById('mtl0').addEventListener('click', () => loadModel('static/objects/mesh.mtl', 'static/objects/mesh.obj'));
    document.getElementById('mtl1').addEventListener('click', () => loadModel('static/objects/mesh1.mtl', 'static/objects/mesh.obj'));
    document.getElementById('mtl2').addEventListener('click', () => loadModel('static/objects/mesh0.01.mtl', 'static/objects/mesh.obj'));
    document.getElementById('mtl3').addEventListener('click', () => loadModel('static/objects/mesh_nov.mtl', 'static/objects/mesh.obj'));

    loadMarkersFromFile();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const ctx = document.getElementById('chartCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0, 0, 0, 0],
            datasets: [{
                label: 'Marker Data',
                data: [],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('click', onMouseClick, false);
}

function onWindowResize() {
    // width = document.getElementById('idemo').width;
    // height = document.getElementById('idemo').height;
    width = Math.min(window.innerWidth - 400, MAXWINSIZE, window.innerHeight);
    height = width;
    console.log(width, height);
    // camera.aspect = (window.innerWidth - 400) / window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // renderer.setSize(window.innerWidth - 400, window.innerHeight);
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onMouseClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.userData && intersected.userData.index !== undefined) {
            const index = intersected.userData.index;
            const marker = markers[index];
            
            // const uniqueURL = marker.photoURL + '?_=' + Date.now();
            // document.getElementById('idemoImage').src = uniqueURL;
            updateChart(marker.data[selectedMtlFile]);
            
            if (selected) {
                selected.material.color.set(unselectedColor);
            }
            selected = intersected;
            selected.material.color.set(selectedColor);
        }
    }
}

function updateChart(data) {
    const labels = data.map((_, index) => index.toString());

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}
