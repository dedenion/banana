import type { NextPage } from 'next'
import { useState,useEffect } from 'react'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { TextGeometry } from "three/examples/fonts/TextGeometry"
import { FontLoader } from "three/examples/fonts/FontLoader"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"


const Home: NextPage = () => {
        let canvas: HTMLElement
        let bananacat: THREE.Group;
        let banana: THREE.Group;
    useEffect(() => {
    if (canvas) return
    // canvasを取得
    canvas = document.getElementById('canvas')!

    // シーン
    const scene = new THREE.Scene();

    // カメラ
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.set(0, 1, 2)

    const color = new THREE.Color();

    

    // レンダラー
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas || undefined,
        antialias: true,
        alpha: false
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000); // 背景色を真っ黒に設定する

    // ライト
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5); // 太陽のような位置に配置する
    scene.add(light);
    
    
    

    // fps
    const controls = new PointerLockControls(camera, renderer.domElement)
    window.addEventListener('click', () => {
        controls.lock()
    })

    // オブジェクトの生成
    // シェーダーの定義
const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float time; // 時間を受け取るuniform変数
void main() {
    gl_FragColor = vec4(sin(time), cos(time), abs(sin(time + vUv.x)), 1.0);
}
`;

// シェーダーマテリアルの作成
const shaderMaterial = new THREE.ShaderMaterial({
vertexShader: vertexShader,
fragmentShader: fragmentShader,
wireframe: true,
uniforms: { time: { value: 0.0 } } // 時間の初期値を設定
});

// 平面オブジェクトの作成
const planeGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
plane.rotateX(-Math.PI / 2);
scene.add(plane);


    // ライトの位置に球体を生成してマテリアルとしての役割を果たす
    const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    // 球体のマテリアルを作成
    
    const sphereMesh = new THREE.Mesh(sphereGeometry,  shaderMaterial);
    // スケールを変更して球体のサイズを調整
    sphereMesh.scale.set(100, 100, 100); // X, Y, Z方向のスケールを設定
    sphereMesh.position.copy(light.position); // ライトの位置に配置
    scene.add(sphereMesh);
    
    
    
    const lightPivot = new THREE.Object3D(); // ライトの親オブジェクト
    lightPivot.add(light); // ライトを親オブジェクトに追加
    scene.add(lightPivot); // 親オブジェクトをシーンに追加
    

    

    //テキストオブジェクト
    const fontLoader = new FontLoader()
    fontLoader.load('/fonts/DotGothic16_Regular.json', (font) => {
    console.log("loaded font!!")
    const textGeometry = new TextGeometry("バナナ", {
        font: font,
        size: 100.5,
        height: 10.4,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    })
    textGeometry.center()

    
    const text = new THREE.Mesh(textGeometry, shaderMaterial)
    text.castShadow = true
    text.position.x = 2;
    text.position.y = 80;
    text.position.z = -500;
    
    scene.add(text)
    })
    
    //3Dオブジェクト
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./textures/scene.gltf", (gltf) => {
        bananacat = gltf.scene
        bananacat.scale.set(300,300,300);
        bananacat.position.x = 0;
        bananacat.position.y = 10;
        bananacat.position.z = -1000;
        scene.add(bananacat);
        
    });

    gltfLoader.load('./textures/banana/scene.gltf', (gltf) =>{

        banana = gltf.scene
        banana.scale.set(10,10,10);
        banana.position.x = 0;
        banana.position.y = 10;
        banana.position.z = 1000;
        scene.add(banana);
    })

    




    //立方体オブジェクト
    const boxGeometry = new THREE.SphereGeometry(1, 1, 1);
    let position = boxGeometry.attributes.position;
    const colorsBox = [];
    for (let i = 0, l = position.count; i < l; i++) {
        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        colorsBox.push(color.r, color.g, color.b);
    }
    boxGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colorsBox, 3)
    );
        for (let i = 0; i < 3000; i++) {
    const boxMaterial = new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        flatShading: true,
        vertexColors: true,
    });
    boxMaterial.color.setHSL(
    Math.random() * 0.2 + 0.5,
    0.75,
    Math.random() * 0.25 + 0.75
    );
    const box = new THREE.Mesh(boxGeometry, shaderMaterial);
    // 広大な範囲でランダムな座標を生成
    box.position.x = Math.random() * 1000 - 500;  // 例: -500 から 500 の範囲
    box.position.y = Math.random() * 1000 - 500;  // 例: -500 から 500 の範囲
    box.position.z = Math.random() * 1000 - 500;  // 例: -500 から 500 の範囲
    scene.add(box);
    }

    // キーボード操作
    let moveForward = false
    let moveBackward = false
    let moveLeft = false
    let moveRight = false
    // ジャンプに必要な変数
    let isJumping = false;
    const jumpHeight = 1000.0; // ジャンプの高さ

    //押されたとき
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
        case 'KeyW':
            moveForward = true
            break
        case 'KeyS':
            moveBackward = true
            break
        case 'KeyA':
            moveLeft = true
            break
        case 'KeyD':
            moveRight = true
            break
        case 'Space':
            if (!isJumping) {
                isJumping = true;
                velocity.y += Math.sqrt(2 * jumpHeight * 9.8);// ジャンプの速度を設定（物理法則を考慮）
            }
            break;
        }
    }
    //指が離されたとき
    const onKeyUp = (e: KeyboardEvent) => {
        switch (e.code) {
        case 'KeyW':
            moveForward = false
            break
        case 'KeyS':
            moveBackward = false
            break
        case 'KeyA':
            moveLeft = false
            break
        case 'KeyD':
            moveRight = false
            break
        }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)

    let prevTime = performance.now()
    const velocity = new THREE.Vector3()
    const direction = new THREE.Vector3()

    function animate() {
        //ライトの周回に関する記述
        const lighttime = Date.now() * 0.0005; // 時間に基づいた値
        const radius = 200; // 周回の半径
        const speedY = 1; // y 軸の周回速度
        const speedZ = 1; // z 軸の周回速度
        const speedX = 1; // x 軸の周回速度
        
        const y = Math.cos(lighttime * speedY) * radius;
        const z = Math.sin(lighttime * speedZ) * radius;
        const x = Math.sin(lighttime * speedX) * radius;
        
        lightPivot.position.set(x, y, z);
        
        // 球体（マテリアル）をライトの周囲に移動
        sphereMesh.position.set(x, y, z);


        requestAnimationFrame(animate)

        const time = performance.now()
        const delta = (time - prevTime) / 1000 //パソコンの性能による速度の違いをなくす
        // 時間の更新
    shaderMaterial.uniforms.time.value += 0.005;


        direction.z = Number(moveForward) - Number(moveBackward)
        direction.x = Number(moveRight) - Number(moveLeft)

        if (controls.isLocked) {
        velocity.z -= velocity.z * 5.0 * delta
        velocity.x -= velocity.x * 5.0 * delta

        if (moveForward || moveBackward) {
          velocity.z -= direction.z * 200 * delta
        }

        if (moveRight || moveLeft) {
          velocity.x -= direction.x * 200 * delta
        }

        // ジャンプの処理
        if (isJumping) {
            velocity.y -= 50.8 * delta; // 重力を適用（物理法則を考慮）
            controls.getObject().position.y += velocity.y * delta;

        // 地面に着地したらジャンプを終了
        if (controls.getObject().position.y <= 1.0) {
            isJumping = false;
            velocity.y = 0;
            controls.getObject().position.y = 1.0; // 地面の高さに位置を設定
            }
        }

        controls.moveForward(-velocity.z * delta)
        controls.moveRight(-velocity.x * delta)
        }

    prevTime = time

    renderer.render(scene, camera)
    }

    animate()

    // 画面リサイズ設定
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
    })
    }, [])
    
    return (
        <>
        <canvas id="canvas"></canvas>
        
        
    </>
    )
}

export default Home

