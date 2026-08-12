import { ChevronDown } from '../components/Chevrons.jsx';

export default function SeasideWalkPage({ sceneRef, onNext }) {
  return (
    <section id="scene2" ref={sceneRef} aria-label="走向海边">
      <div className="walk-wrap">
        <p className="walk-kicker">途中</p>
        <h2 className="walk-title">海就在前面</h2>
        <p className="walk-text">
          改变很少是一步跨过去的。多数时候，是一段一段往前走 —— 先在裂隙里看见海，再慢慢走近它。
        </p>
        <button className="walk-next" type="button" onClick={onNext}>
          <span className="chev" aria-hidden="true">
            <ChevronDown />
          </span>
          继续往前走，到岸边
        </button>
      </div>
    </section>
  );
}
