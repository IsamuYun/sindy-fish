import { StarMark } from './StarMark.jsx';

const navLeft = [
  ['内庭', 0],
  ['初谈', 0.12],
  ['边界', 0.2],
];

const navRight = [
  ['向内', 0.56],
  ['门槛', 0.78],
];

function TimelineButton({ children, progress, onJump }) {
  return (
    <button className="nav-link" type="button" onClick={() => onJump(progress)}>
      {children}
    </button>
  );
}

export default function Navigation({ onJump, onOpenConsult, onOpenTeaRoom, onOpenPavilion }) {
  return (
    <nav className="top-nav" aria-label="内庭页面导航">
      <div className="nav-group left">
        {navLeft.map(([label, progress]) => (
          <TimelineButton key={label} progress={progress} onJump={onJump}>
            {label}
          </TimelineButton>
        ))}
      </div>
      
      <div className="nav-group right">
        {navRight.map(([label, progress]) => (
          <TimelineButton key={label} progress={progress} onJump={onJump}>
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
        <TimelineButton progress={0} onJump={onJump}>
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
