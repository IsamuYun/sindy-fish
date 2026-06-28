import Navigation from '../components/Navigation.jsx';

const consultationGuideItems = [
  {
    title: '初次咨询是什么样的',
    text: '第一次通常会先了解你最近最困扰的事、想改善的方向，以及目前的生活状态。单次会谈约 50 分钟；你不需要提前准备“正确答案”，不知道从哪里说起也没关系。',
  },
  {
    title: '咨询的节奏',
    text: '多数情况下会按每周一次或隔周一次的节奏进行。变化速度和议题深浅有关：有些人几次后会更清楚自己在发生什么，更长期的关系或情绪困扰则需要更稳定的时间。这里不承诺速效。',
  },
  {
    title: '咨询中你可以做什么',
    text: '沉默没关系，哭没关系，不知道说什么也没关系。你可以停下来、重复、修正，也可以直接说“这个我还不想谈”。咨询不是考试。',
  },
  {
    title: '保密原则',
    text: '你谈到的内容会被认真保密。只有在出现自伤、他伤、儿童或老人等受保护人群安全风险，或法律要求时，才会为了安全启动必要的例外处理。',
  },
  {
    title: '费用与支付',
    text: '费用、单次时长、支付方式和改约规则会在预约前清楚说明。你确认能够接受后，再安排初谈；不需要临场不好意思问。',
  },
];

export default function ConsultProcessPage({
  sceneRef,
  onJump,
  onOpenConsult,
  onOpenTeaRoom,
  onOpenPavilion,
}) {
  return (
    <section id="scene2" ref={sceneRef} aria-label="咨询是怎么进行的">
      <Navigation
        onJump={onJump}
        onOpenConsult={onOpenConsult}
        onOpenTeaRoom={onOpenTeaRoom}
        onOpenPavilion={onOpenPavilion}
      />
      <div className="cta-wrap">
        <p className="cta-kicker">咨询前你可能想知道</p>
        <h2 className="cta-title">咨询是怎么进行的</h2>
        <p className="cta-text">
          很多犹豫来自“不知道会发生什么”。你可以把这一页当作一次预先说明：不用表现得很好，也不用把问题整理得很漂亮。
        </p>

        <div className="consult-guide" aria-label="咨询流程说明">
          {consultationGuideItems.map((item) => (
            <article className="consult-guide-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="cta-actions">
          <button className="cta-button" type="button" onClick={onOpenConsult}>
            预约初谈
          </button>
          <span className="cta-note">你可以带着犹豫来，也可以先只问一个“不好意思问”的问题。</span>
        </div>
      </div>
    </section>
  );
}
