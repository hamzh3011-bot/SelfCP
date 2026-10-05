import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const light1 = new THREE.DirectionalLight(0xC5A059, 1.5);
    light1.position.set(5, 5, 5);
    scene.add(light1);
    const light2 = new THREE.PointLight(0xC5A059, 1, 20);
    light2.position.set(-5, 3, 3);
    scene.add(light2);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xC5A059, metalness: 0.9, roughness: 0.2 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.5 });

    const tiles = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 6 : 12;

    for (let i = 0; i < count; i++) {
        const isGold = Math.random() > 0.5;
        const size = 0.5 + Math.random() * 0.8;
        const geo = new THREE.BoxGeometry(size, 0.1, size);
        const mesh = new THREE.Mesh(geo, isGold ? goldMat : darkMat);
        mesh.position.x = (Math.random() - 0.5) * 12;
        mesh.position.y = (Math.random() - 0.5) * 6;
        mesh.position.z = (Math.random() - 0.5) * 4 - 2;
        mesh.rotation.x = Math.random() * 0.3;
        mesh.rotation.y = Math.random() * 0.5;
        mesh.userData = {
            floatSpeed: 0.5 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.005
        };
        scene.add(mesh);
        tiles.push(mesh);
    }

    let mouseX = 0, mouseY = 0;
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
        });
    }

    function resize() {
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || 550;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', resize);
    resize();

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        tiles.forEach(tile => {
            tile.position.y += Math.sin(t * tile.userData.floatSpeed + tile.userData.floatOffset) * 0.003;
            tile.rotation.y += tile.userData.rotSpeed;
        });
        if (!isMobile) {
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);
        }
        renderer.render(scene, camera);
    }
    animate();
}
