import { StarMark } from '../components/StarMark.jsx';
import { sceneAssets } from '../sceneAssets.js';

export default function TeaRoomPage({ onHome, onOpenConsult, onOpenPavilion }) {
  return (
    <main className="space-page" aria-label="雨中茶室" data-space="tea-room">
      <nav className="space-nav" aria-label="茶室页面导航">
        <button className="nav-link" type="button" onClick={onHome}>
          返回首页
        </button>
        <div className="nav-logo" aria-hidden="true">
          <StarMark />
        </div>
        <div className="space-nav-actions">
          <button className="nav-link" type="button" onClick={onOpenPavilion}>
            去亭子
          </button>
          <button className="nav-link" type="button" onClick={onOpenConsult}>
            预约
          </button>
        </div>
      </nav>

      <section className="space-hero">
        <article className="space-panel">
          <img src={sceneAssets.spaces.teaRoomRain} alt="雨中的茶室" />
          <div className="space-copy">
            <p>Rain Tea Room</p>
            <h1>雨中茶室</h1>
            <span>在雨声与茶香之间，让谈话慢下来。</span>
          </div>
        </article>
      </section>

      <div className="space-footer">
        <button className="cta-button" type="button" onClick={onOpenConsult}>
          预约初谈
        </button>
      </div>
    </main>
  );
}
