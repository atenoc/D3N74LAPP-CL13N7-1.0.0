import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SharedService } from 'src/app/services/shared.service';
import { Resources } from '../utils/resources';

@Component({
  selector: 'app-visor3d',
  templateUrl: './visor3d.component.html',
  styleUrls: ['./visor3d.component.css']
})
export class Visor3dComponent implements OnInit {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls | null = null;
  private composer: EffectComposer;
  private currentModel: THREE.Object3D | undefined; // Para almacenar el modelo actual
  private initialCameraPosition = new THREE.Vector3(0, 0, 5); // Guarda la posición inicial de la cámara

  imageModel1:string = Resources.URL_IMG_MODEL1

  constructor(private sharedService: SharedService) {
    this.scene = new THREE.Scene();
    //this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera = new THREE.PerspectiveCamera(75, 1000 / 600, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.composer = new EffectComposer(this.renderer); 
  }

  ngOnInit(): void {
    this.initScene();
    this.createGradientBackground();
    this.loadGLBModel(Resources.URL_MODEL1); // Cargar modelo inicial
    this.animate();

    this.setupControls();
    window.addEventListener('resize', () => this.onWindowResize(), false);
    document.addEventListener('fullscreenchange', () => this.onFullscreenChange());
  }

  private initScene(): void {
    // Configurar la cámara
    //this.camera.position.set(0, 0, 5);
    this.camera.position.copy(this.initialCameraPosition); // Posición inicial de la cámara
  
    // Configurar el renderizador
    this.renderer.setSize(1066, 600); // Set the renderer size to 1000px by 500px
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //this.renderer.setClearColor(0xeeeeee);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
    document.getElementById('modelContainer')?.appendChild(this.renderer.domElement);
  
    // Añadir luz
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(1, 1, 1).normalize();
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048; // Resolución del mapa de sombras
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;      // Distancias del plano de sombras
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    this.scene.add(directionalLight);
  
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  
    // Añadir controles de órbita
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
  
    // Configurar el post-procesamiento
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
  }

  /*private loadLocalModel(): void {
    // URL del modelo GLB local
    const url = 'assets/model3d/adult_tooth_morphology.glb';

    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      this.scene.add(gltf.scene);
    }, undefined, (error) => {
      console.error('Error al cargar el modelo GLB', error);
    });
  }*/

  private loadGLBModel(url: string): void {
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        if (this.currentModel) {
          this.scene.remove(this.currentModel); // Eliminar el modelo anterior si existe
        }
        this.currentModel = gltf.scene;
        this.scene.add(gltf.scene); // Añadir el nuevo modelo
      }, undefined, (error) => {
        console.error('Error al cargar el modelo GLB', error);
      });
  }

  private loadSTLModel(url: string): void {
    const loader = new STLLoader();
    loader.load(url, (geometry) => {
      if (this.currentModel) {
        this.scene.remove(this.currentModel); // Eliminar el modelo anterior si existe
      }
      // Crear un material básico para el modelo STL
      const material = new THREE.MeshStandardMaterial({ color: 0xadadad });
      // Crear una malla a partir de la geometría y el material
      this.currentModel = new THREE.Mesh(geometry, material);
      this.scene.add(this.currentModel); // Añadir el nuevo modelo
    }, undefined, (error) => {
      console.error('Error al cargar el modelo STL', error);
    });
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    if (this.controls) {
      this.controls.update(); // Actualiza los controles si están inicializados
    }
    this.composer.render(); // Usar el compositor para renderizado
  }

  private setupControls(): void {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const exitFullscreenButton = document.getElementById('exitFullscreenButton');
    const zoomInButton = document.getElementById('zoomInButton');
    const zoomOutButton = document.getElementById('zoomOutButton');
    const captureButton = document.getElementById('captureButton');

    fullscreenButton?.addEventListener('click', () => this.toggleFullscreen());
    exitFullscreenButton?.addEventListener('click', () => this.exitFullscreen());
    zoomInButton?.addEventListener('click', () => this.zoomIn());
    zoomOutButton?.addEventListener('click', () => this.zoomOut());
    captureButton?.addEventListener('click', () => this.captureImage());

    this.updateFullscreenButtons();
  }

  private toggleFullscreen(): void {
    const elem = document.getElementById('modelContainer');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((<any>elem).webkitRequestFullscreen) { /* Safari */
        (<any>elem).webkitRequestFullscreen();
      } else if ((<any>elem).msRequestFullscreen) { /* IE11 */
        (<any>elem).msRequestFullscreen();
      }
      this.onWindowResize(); // Llama a la función para ajustar el tamaño al entrar en modo pantalla completa
    }
  }

  private exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((<any>document).webkitExitFullscreen) { /* Safari */
      (<any>document).webkitExitFullscreen();
    } else if ((<any>document).msExitFullscreen) { /* IE11 */
      (<any>document).msExitFullscreen();
    }
  }

  private zoomIn(): void {
    if (this.camera && this.controls) {
      const distance = this.camera.position.distanceTo(this.controls.target);
      const newDistance = Math.max(distance * 0.9, 5); // Adjust the zoom factor as needed
      this.camera.position.setLength(newDistance);
      this.controls.update();
    }
  }

  private zoomOut(): void {
    if (this.camera && this.controls) {
      const distance = this.camera.position.distanceTo(this.controls.target);
      const newDistance = distance * 1.5; // Adjust the zoom factor as needed
      this.camera.position.setLength(newDistance);
      this.controls.update();
    }
  }

  resetView(): void {
    if (this.camera && this.controls) {
      this.camera.position.copy(this.initialCameraPosition); // Restablece la posición de la cámara
      this.controls.reset(); // Restablece los controles de órbita
      this.controls.update();
    }
  }

  private onWindowResize(): void {
    const container = document.getElementById('modelContainer');
    if (container) {
      const width = container.clientWidth;
      const height = container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.composer.setSize(width, height);
    }
  }

  private onFullscreenChange(): void {
    this.updateFullscreenButtons();
    this.onWindowResize(); // Adjust size when entering/exiting fullscreen
  }

  private updateFullscreenButtons(): void {
    const fullscreenButton = document.getElementById('fullscreenButton');
    const exitFullscreenButton = document.getElementById('exitFullscreenButton');
    const captureButton = document.getElementById('captureButton');

    const isFullscreen = !!document.fullscreenElement;

    if (fullscreenButton) {
      fullscreenButton.style.display = isFullscreen ? 'none' : 'block';
    }
    if (exitFullscreenButton) {
      exitFullscreenButton.style.display = isFullscreen ? 'block' : 'none';
    }
    if (captureButton) {
      captureButton.style.display = isFullscreen ? 'none' : 'block';
    }
  }

  private captureImage(): void {
    this.renderer.render(this.scene, this.camera);
    const canvas = this.renderer.domElement;
    const dataURL = canvas.toDataURL('image/png');
    const imageElement = document.getElementById('capturedImage') as HTMLImageElement;
    imageElement.src = dataURL;
    //imageElement.style.display = 'block';
    this.sharedService.setImage(dataURL)
    console.log("imágen capturada: "+dataURL)
  }

  private createGradientBackground(): void {
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        void main() {
            vec3 color = mix(color1, color2, vUv.y);
            color = mix(color, color3, smoothstep(0.5, 1.0, vUv.y));
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const uniforms = {
        color1: { value: new THREE.Color(0xadadad) }, // Color inferior   gris
        color2: { value: new THREE.Color(0x000000) }, // Color medio      negro
        color3: { value: new THREE.Color(0xadadad) }  // Color superior   gris
        //color3: { value: new THREE.Color(0xededed) }  // Color superior   blanco
    };

    const gradientMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.BackSide // Renderizar el interior de la esfera
    });

    const sphereGeometry = new THREE.SphereGeometry(500, 32, 32);
    const gradientMesh = new THREE.Mesh(sphereGeometry, gradientMaterial);
    this.scene.add(gradientMesh);
  }

  loadGLBModel1(): void {
    const newModelUrl = Resources.URL_MODEL1; // Cambia a la URL del nuevo modelo
    this.loadGLBModel(newModelUrl);
    this.resetView()
    
  }

  loadGLBModel2(): void {
    const newModelUrl = Resources.URL_MODEL2; // Cambia a la URL del nuevo modelo
    this.loadGLBModel(newModelUrl);
    this.resetView()
  }

  loadSTLModel1(): void {
    this.loadSTLModel('assets/images/Upper_teeth.stl')
  }

  loadSTLModel2(): void {
    this.loadSTLModel('assets/images/Teeth_1.stl')
  }

  loadSTLModel3(): void {
    this.loadSTLModel('assets/images/Lower_teeth.stl')
  }

}
