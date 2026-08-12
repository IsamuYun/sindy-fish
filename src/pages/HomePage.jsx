import seasideFar from '../assets/img/home/hero-seaside-1.webp';
import seasideMid from '../assets/img/home/hero-seaside-2.webp';
import seasideShore from '../assets/img/home/hero-seaside-3.webp';
import { ChevronDown } from '../components/Chevrons.jsx';
import PageDots from '../components/PageDots.jsx';

import { useParallaxScene } from '../useParallaxScene.js';
import ConsultProcessPage from './ConsultProcessPage.jsx';
import SeasideWalkPage from './SeasideWalkPage.jsx';

const slideLinks = [
  {
    href: `${import.meta.env.BASE_URL}src/slide/sand-game-1.html`,
    title: '沙盘游戏疗法 I',
    meta: '第八九章讲解',
  },
  {
    href: `${import.meta.env.BASE_URL}src/slide/sand-game-2.html`,
    title: '沙盘游戏疗法 II',
    meta: '神话与神经科学',
  },
];

// 三层背景 = 一段走向海边的路：裂隙中望见海 → 山道上的全景 → 站到岸边。
const journeyLayers = [
  { image: seasideFar, label: '裂隙' },
  { image: seasideMid, label: '途中' },
  { image: seasideShore, label: '岸边' },
];

function HeroScene({ sceneRef, entered }) {
  return (
    <section id="scene1" ref={sceneRef} aria-label="内庭心理咨询介绍">
      <div className={`hero-row fade-ui${entered ? ' in' : ''}`}>
        <div className="hero-left">
          <p className="hero-kicker">心理健康 · 始于1908</p>
          <h1 className="hero-title">
            <span className="title-zh">心理健康</span>
            <span className="title-zh">是另一种财富</span>
          </h1>
          <p className="hero-sub">
            强大，不是忍耐 —— 是懂得求助
          </p>

          <div className="hero-sub-row">
            <div className={`scroll-cue fade-ui${entered ? ' in' : ''}`} aria-hidden="true">
              <div className="chev">
                <ChevronDown />
              </div>
            </div>
            <p className="hero-cue-text">向下滑动，前行</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({
  onOpenConsult,
  onOpenTeaRoom,
  onOpenPavilion,
}) {
  const { scrollRootRef, registerLayer, registerScene, activePage, uiEntered, jumpToPage } =
    useParallaxScene(journeyLayers.length);

  return (
    <main
      id="scroll-root"
      ref={scrollRootRef}
      data-page={activePage + 1}
    >
      <div id="stage">
        {journeyLayers.map((layer, index) => (
          <div
            key={layer.label}
            className="layer world-layer"
            data-index={index}
            ref={registerLayer(index)}
            aria-hidden="true"
            style={{ backgroundImage: `url('${layer.image}')`, zIndex: index }}
          />
        ))}
        <HeroScene sceneRef={registerScene(0)} entered={uiEntered} />
        <SeasideWalkPage sceneRef={registerScene(1)} onNext={() => jumpToPage(2)} />
        <ConsultProcessPage
          sceneRef={registerScene(2)}
          onJump={jumpToPage}
          onOpenConsult={onOpenConsult}
          onOpenTeaRoom={onOpenTeaRoom}
          onOpenPavilion={onOpenPavilion}
        />
        <PageDots
          pages={journeyLayers.map((layer) => layer.label)}
          activePage={activePage}
          onJump={jumpToPage}
        />
      </div>
    </main>
  );
}
