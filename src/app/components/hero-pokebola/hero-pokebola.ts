import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

@Component({
  imports: [],
  selector: 'app-hero-pokebola',
  templateUrl: './hero-pokebola.html',
})
export class HeroPokebola {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private renderer?: WebGLRenderer;
  private scene?: Scene;
  private observer?: ResizeObserver;

  constructor() {
    // afterNextRender roda depois que o canvas existe no DOM
    afterNextRender(() => this.iniciarCena());
    // Sem isso, o loop de renderização continua rodando após o componente sair da tela
    inject(DestroyRef).onDestroy(() => this.limparCena());
  }

  private iniciarCena(): void {
    const canvas = this.canvas().nativeElement;

    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.outputColorSpace = SRGBColorSpace;

    const scene = new Scene();

    // Ambiente de estúdio: reflexos realistas no material da Pokébola
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Luz principal branca, luz de contorno ciano e um leve preenchimento
    const luzPrincipal = new DirectionalLight(0xffffff, 2);
    luzPrincipal.position.set(3, 4, 5);
    const luzCiano = new DirectionalLight(0x22d3ee, 1.5);
    luzCiano.position.set(-4, 2, -3);
    scene.add(luzPrincipal, luzCiano, new AmbientLight(0xffffff, 0.2));

    const pokebola = this.criarPokebola();
    scene.add(pokebola);

    const camera = new PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 5;

    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    renderer.setAnimationLoop((tempo) => {
      if (!reduzirMovimento) {
        pokebola.rotation.y = tempo / 2000;
        pokebola.rotation.x = 0.2 + Math.sin(tempo / 1500) * 0.15;
      }
      renderer.render(scene, camera);
    });

    // O tamanho do canvas vem do CSS; aqui só ajustamos a resolução interna
    this.observer = new ResizeObserver(() => {
      const largura = canvas.clientWidth;
      const altura = canvas.clientHeight;
      renderer.setSize(largura, altura, false);
      camera.aspect = largura / altura;
      camera.updateProjectionMatrix();
    });
    this.observer.observe(canvas);

    this.renderer = renderer;
    this.scene = scene;
  }

  private criarPokebola(): Group {
    const grupo = new Group();

    const vermelho = new MeshStandardMaterial({ color: 0xdc0a2d, roughness: 0.3, metalness: 0.1 });
    const branco = new MeshStandardMaterial({ color: 0xf5f7fb, roughness: 0.3, metalness: 0.1 });
    const escuro = new MeshStandardMaterial({ color: 0x0f1b2d, roughness: 0.5, metalness: 0.2 });

    // Metade superior vermelha: do polo de cima até o equador (PI/2)
    const metadeSuperior = new Mesh(
      new SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2),
      vermelho,
    );
    // Metade inferior branca: do equador até o polo de baixo
    const metadeInferior = new Mesh(
      new SphereGeometry(1, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
      branco,
    );
    // Faixa preta no equador, um pouco mais larga que a esfera para cobrir a emenda
    const faixa = new Mesh(new CylinderGeometry(1.01, 1.01, 0.12, 64), escuro);

    // Botão central, de frente para a câmera (o cilindro gira 90° no eixo X)
    const anelBotao = new Mesh(new CylinderGeometry(0.3, 0.3, 0.12, 48), escuro);
    anelBotao.rotation.x = Math.PI / 2;
    anelBotao.position.z = 0.98;

    const botao = new Mesh(new CylinderGeometry(0.2, 0.2, 0.14, 48), branco);
    botao.rotation.x = Math.PI / 2;
    botao.position.z = 1.02;

    grupo.add(metadeSuperior, metadeInferior, faixa, anelBotao, botao);
    return grupo;
  }

  private limparCena(): void {
    this.observer?.disconnect();
    this.renderer?.setAnimationLoop(null);

    // Geometrias e materiais ficam na memória da GPU até serem liberados
    this.scene?.traverse((objeto) => {
      if (objeto instanceof Mesh) {
        objeto.geometry.dispose();
        (objeto.material as Material).dispose();
      }
    });
    this.scene?.environment?.dispose();
    this.renderer?.dispose();
  }
}
