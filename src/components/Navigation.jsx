import { StarMark } from './StarMark.jsx';

// 数字是首页的页序：0 裂隙 → 1 途中 → 2 岸边。
const navLeft = [
  ['内庭', 0],
  ['途中', 1],
  ['岸边', 2],
];

const navRight = [['初谈', 2]];

function TimelineButton({ children, page, onJump }) {
  return (
    <button className="nav-link" type="button" onClick={() => onJump(page)}>
      {children}
    </button>
  );
}

export default function Navigation({ onJump, onOpenConsult, onOpenTeaRoom, onOpenPavilion }) {
  return (
    <nav className="top-nav" aria-label="内庭页面导航">
      <div className="nav-group left">
        {navLeft.map(([label, page]) => (
          <TimelineButton key={label} page={page} onJump={onJump}>
            {label}
          </TimelineButton>
        ))}
      </div>

      <div className="nav-group right">
        {navRight.map(([label, page]) => (
          <TimelineButton key={label} page={page} onJump={onJump}>
            {label}
          </TimelineButton>
        ))}
        <button className="nav-link" type="button" onClick={onOpenTeaRoom}>
          茶室
        </button>
        <button className="nav-link" type="button" onClick={onOpenPavilion}>
          亭子
        </button>
        <button className="nav-link" type="button" onClick={onOpenConsult}>
          预约
        </button>
      </div>
      <div className="nav-mobile">
        <TimelineButton page={0} onJump={onJump}>
          进入
        </TimelineButton>
        <div className="nav-logo" aria-hidden="true">
          <StarMark />
        </div>
        <button className="nav-link" type="button" onClick={onOpenTeaRoom}>
          茶室
        </button>
        <button className="nav-link" type="button" onClick={onOpenPavilion}>
          亭子
        </button>
        <button className="nav-link" type="button" onClick={onOpenConsult}>
          预约
        </button>
      </div>
    </nav>
  );
}
