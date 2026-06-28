import backgroundOne from '../assets/img/home.jpg';
import backgroundTwo from '../assets/img/background-2.jpg';
import { ChevronDown, ChevronLeft, ChevronRight } from '../components/Chevrons.jsx';
import { sceneAssets } from '../sceneAssets.js';
import { useParallaxScene } from '../useParallaxScene.js';
import ConsultProcessPage from './ConsultProcessPage.jsx';

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

const homePageAssets = {
  backgroundOne,
  backgroundTwo,
  cards: [backgroundTwo, sceneAssets.spaces.teaRoomRain, sceneAssets.spaces.pavilion],
};

function HeroScene({
  sceneRef,
  entered,
  onOpenConsultProcess,
  onOpenTeaRoom,
  onOpenPavilion,
}) {
  return (
    <section id="scene1" ref={sceneRef} aria-label="内庭心理咨询介绍">
      <div className={`hero-row fade-ui${entered ? ' in' : ''}`}>
        <div className="hero-left">
          <p className="hero-kicker">心理健康 · 始于1908</p>
          <h1 className="hero-title">
            <span className="title-zh">心理健康</span>
            <span className="title-zh">是另一种财富</span>
          </h1>
          <div className="hero-sub-row">
            <div className={`scroll-cue fade-ui${entered ? ' in' : ''}`} aria-hidden="true">
              <div className="chev">
                <ChevronDown />
              </div>
            </div>
            <p className="hero-sub">
              强大，不是忍耐 —— 是懂得求助
            </p>
          </div>
        </div>

        <div className="hero-right">
          <button
            className="hero-card"
            type="button"
            style={{ backgroundImage: `url('${homePageAssets.cards[0]}')` }}
            onClick={onOpenConsultProcess}
            aria-label="什么是心理咨询"
          >
            <div className="card-label consult-card-label">
              <ChevronDown />
              什么是心理咨询
            </div>
          </button>

          <button
            className="hero-card"
            type="button"
            style={{ backgroundImage: `url('${homePageAssets.cards[1]}')` }}
            onClick={onOpenTeaRoom}
            aria-label="进入雨中茶室页面"
          >
            <div className="card-label consult-card-label">
              <ChevronLeft />
              我能为你做什么
            </div>
          </button>

          <button
            className="hero-card"
            type="button"
            style={{ backgroundImage: `url('${homePageAssets.cards[2]}')` }}
            onClick={onOpenPavilion}
            aria-label="进入花影亭子页面"
          >
            <div className="card-label consult-card-label">
              庭院回廊
              <ChevronRight />
            </div>
          </button>
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
  const { refs, activePage, uiEntered, jumpToProgress } = useParallaxScene();

  return (
    <main
      id="scroll-root"
      ref={refs.scrollRootRef}
      data-page={activePage + 1}
    >
      <div id="stage">
        <div
          id="world"
          className="layer"
          ref={refs.worldRef}
          aria-hidden="true"
          style={{ backgroundImage: `url('${homePageAssets.backgroundOne}')` }}
        />
        <div
          id="world-end"
          className="layer"
          ref={refs.worldEndRef}
          aria-hidden="true"
          style={{ backgroundImage: `url('${homePageAssets.backgroundTwo}')` }}
        />
        <HeroScene
          sceneRef={refs.sceneOneRef}
          entered={uiEntered}
          onOpenConsultProcess={() => jumpToProgress(1)}
          onOpenTeaRoom={onOpenTeaRoom}
          onOpenPavilion={onOpenPavilion}
        />
        <ConsultProcessPage
          sceneRef={refs.sceneTwoRef}
          onJump={jumpToProgress}
          onOpenConsult={onOpenConsult}
          onOpenTeaRoom={onOpenTeaRoom}
          onOpenPavilion={onOpenPavilion}
        />
      </div>
    </main>
  );
}
