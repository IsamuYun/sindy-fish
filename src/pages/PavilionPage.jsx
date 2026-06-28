import { StarMark } from '../components/StarMark.jsx';
import { sceneAssets } from '../sceneAssets.js';

export default function PavilionPage({ onHome, onOpenConsult, onOpenTeaRoom }) {
  return (
    <main className="space-page" aria-label="花影亭子" data-space="pavilion">
      <nav className="space-nav" aria-label="亭子页面导航">
        <button className="nav-link" type="button" onClick={onHome}>
          返回首页
        </button>
        <div className="nav-logo" aria-hidden="true">
          <StarMark />
        </div>
        <div className="space-nav-actions">
          <button className="nav-link" type="button" onClick={onOpenTeaRoom}>
            去茶室
          </button>
          <button className="nav-link" type="button" onClick={onOpenConsult}>
            预约
          </button>
        </div>
      </nav>

      <section className="space-hero">
        <article className="space-panel">
          <img src={sceneAssets.spaces.pavilion} alt="花影亭子" />
          <div className="space-copy">
            <p>Garden Pavilion</p>
            <h1>花影亭子</h1>
            <span>在开阔处安坐，把心绪交还给风与光。</span>
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
