// Import Three.js FontLoader for 3D text
let fontLoader = new THREE.FontLoader();
let font;
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (loadedFont) {
    font = loadedFont; // Load the font asynchronously
});

// Create a Three.js Scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Basic Lighting
let light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Define a 9x9 Sudoku grid (0 means empty cell)
let sudokuGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Store the selected cell
let selectedCell = null;

// Create an array for hobbies (Reading and Traveling only)
let hobbies = ["Reading", "Traveling"];
let hobbyIndex = 0; // To keep track of which hobby to display next

// Create the 3D grid
let grid = [];
for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
        let geometry = new THREE.BoxGeometry(1, 0.1, 1);
        let material = new THREE.MeshBasicMaterial({ color: sudokuGrid[i][j] !== 0 ? 0xaaaaaa : 0xffffff });
        let cell = new THREE.Mesh(geometry, material);
        cell.position.set(i - 4, 0, j - 4);
        cell.userData = { row: i, col: j };
        scene.add(cell);
        grid[i][j] = cell;
    }
}

// Camera position
camera.position.z = 10;

// Render the scene
let animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();

// Raycaster for detecting cell clicks
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Handle cell selection on mouse click
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        let cell = intersects[0].object;
        selectedCell = cell.userData;  // Save selected cell
        addNameToCell(cell); // Add the name and hobby to the selected cell
    }
});

// Function to add your name and hobbies in the clicked cell
function addNameToCell(cell) {
    if (font) {
        // Remove previous text if it exists
        if (cell.userData.textMesh) {
            scene.remove(cell.userData.textMesh);
        }

        // Create 3D text using TextGeometry for name and hobby
        let text = `Samreen\n${hobbies[hobbyIndex]}`; // Display Samreen and a hobby
        let textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.4,
            height: 0.1
        });
        let textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        let textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Position the text in the cell
        textMesh.position.set(cell.position.x - 0.3, cell.position.y + 0.2, cell.position.z - 0.3);
        scene.add(textMesh);

        // Store the text mesh to remove it later if needed
        cell.userData.textMesh = textMesh;

        // Cycle through the two hobbies
        hobbyIndex = (hobbyIndex + 1) % hobbies.length; // Move to next hobby (Reading -> Traveling -> Reading ...)
    }
}
