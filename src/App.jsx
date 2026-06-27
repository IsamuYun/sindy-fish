import { useEffect, useRef, useState } from 'react';
import { sceneAssets } from './sceneAssets.js';
import { useParallaxScene } from './useParallaxScene.js';

const navLeft = [
  ['内庭', 0],
  ['初谈', 0.12],
  ['边界', 0.2],
];

const navRight = [
  ['向内', 0.56],
  ['门槛', 0.78],
];

const initialForm = {
  name: '',
  contact: '',
  message: '',
  privacy: false,
};

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

function StarMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M14 2l2.09 6.42H23l-5.45 3.96L19.64 19 14 15.04 8.36 19l2.09-6.62L5 8.42h6.91L14 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <span className="play-icon" aria-hidden="true">
      <svg
        width="11"
        height="11"
        viewBox="0 0 12 12"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M3 2l7 4-7 4V2z" />
      </svg>
    </span>
  );
}

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.8)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TimelineButton({ children, progress, onJump }) {
  return (
    <button className="nav-link" type="button" onClick={() => onJump(progress)}>
      {children}
    </button>
  );
}

function Navigation({ onJump, onOpenConsult, onOpenTeaRoom, onOpenPavilion }) {
  return (
    <nav aria-label="内庭页面导航">
      <div className="nav-group left">
        {navLeft.map(([label, progress]) => (
          <TimelineButton key={label} progress={progress} onJump={onJump}>
            {label}
          </TimelineButton>
        ))}
      </div>
      <div className="nav-logo" aria-hidden="true">
        <StarMark />
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

function HeroScene({ sceneRef, entered, onOpenConsult, onOpenTeaRoom, onOpenPavilion }) {
  return (
    <section id="scene1" ref={sceneRef} aria-label="内庭心理咨询介绍">
      <div className={`hero-left fade-ui${entered ? ' in' : ''}`}>
        <p className="hero-kicker">女性心理咨询师 · 保密会谈</p>
        <h1 className="hero-title">
          <span className="title-zh">走入内庭</span>
          <span className="title-en">INNER COURT</span>
        </h1>
        <p className="hero-sub">
          在层叠檐影与静水之间，安放情绪、关系与自我回声。这里不是逃离现实，而是在安全边界里慢慢看见自己。
        </p>
        <div className="hero-slide-links" aria-label="沙盘游戏疗法页面">
          {slideLinks.map((item) => (
            <a className="slide-link" key={item.href} href={item.href}>
              <span>{item.title}</span>
              <small>{item.meta}</small>
            </a>
          ))}
        </div>
      </div>

      <div className={`hero-right fade-ui${entered ? ' in' : ''}`}>
        <button
          className="hero-card"
          type="button"
          style={{ backgroundImage: `url('${sceneAssets.cards[0]}')` }}
          onClick={onOpenConsult}
          aria-label="预约初谈"
        >
          <div className="card-label">
            <PlayIcon />
            预约初谈
          </div>
        </button>

        <div
          className="hero-card"
          style={{ backgroundImage: `url('${sceneAssets.cards[1]}')` }}
          aria-label="进入雨中茶室页面"
        >
          <button className="card-hit-area" type="button" onClick={onOpenTeaRoom}>
            <span>
              雨中茶室
              <small>雨声 · 茶香 · 静坐</small>
            </span>
          </button>
        </div>

        <button
          className="hero-card"
          type="button"
          style={{ backgroundImage: `url('${sceneAssets.cards[2]}')` }}
          onClick={onOpenPavilion}
          aria-label="进入花影亭子页面"
        >
          <div className="card-label">
            <PlayIcon />
            花影亭子
          </div>
        </button>
      </div>

      <div className={`dots fade-ui${entered ? ' in' : ''}`} aria-hidden="true">
        <i className="wide" />
        <i className="thin" />
        <i className="thin" />
        <i className="thin" />
      </div>

      <div className={`scroll-cue fade-ui${entered ? ' in' : ''}`} aria-hidden="true">
        <span>向内</span>
        <div className="chev">
          <ChevronDown />
        </div>
      </div>
    </section>
  );
}

const spaceContent = {
  'tea-room': {
    image: sceneAssets.spaces.teaRoomRain,
    alt: '雨中的茶室',
    eyebrow: 'Rain Tea Room',
    title: '雨中茶室',
    text: '在雨声与茶香之间，让谈话慢下来。',
    otherLabel: '去亭子',
    navLabel: '茶室页面导航',
  },
  pavilion: {
    image: sceneAssets.spaces.pavilion,
    alt: '花影亭子',
    eyebrow: 'Garden Pavilion',
    title: '花影亭子',
    text: '在开阔处安坐，把心绪交还给风与光。',
    otherLabel: '去茶室',
    navLabel: '亭子页面导航',
  },
};

function SpacePage({ space, onHome, onOpenConsult, onOpenTeaRoom, onOpenPavilion }) {
  const content = spaceContent[space] ?? spaceContent['tea-room'];
  const openOtherSpace = space === 'tea-room' ? onOpenPavilion : onOpenTeaRoom;

  return (
    <main className="space-page" aria-label={content.title} data-space={space}>
      <nav className="space-nav" aria-label={content.navLabel}>
        <button className="nav-link" type="button" onClick={onHome}>
          返回首页
        </button>
        <div className="nav-logo" aria-hidden="true">
          <StarMark />
        </div>
        <div className="space-nav-actions">
          <button className="nav-link" type="button" onClick={openOtherSpace}>
            {content.otherLabel}
          </button>
          <button className="nav-link" type="button" onClick={onOpenConsult}>
            预约
          </button>
        </div>
      </nav>

      <section className="space-hero">
        <article className="space-panel">
          <img src={content.image} alt={content.alt} />
          <div className="space-copy">
            <p>{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <span>{content.text}</span>
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

function ThresholdScene({ sceneRef, onOpenConsult }) {
  return (
    <section id="scene2" ref={sceneRef} aria-label="预约咨询">
      <div className="cta-wrap">
        <h2 className="cta-title">跨过安静的门槛</h2>
        <p className="cta-text">
          预约一次初谈，让困扰被缓慢展开，也让新的秩序在安全、保密的关系里重新成形。
        </p>
        <div className="cta-actions">
          <button className="cta-button" type="button" onClick={onOpenConsult}>
            预约初谈
          </button>
          <span className="cta-note">非紧急支持 · 初谈中共同确认咨询设置与保密边界</span>
        </div>
      </div>
    </section>
  );
}

function ConsultationDialog({
  isOpen,
  form,
  invalidFields,
  status,
  statusTone,
  submitting,
  nameInputRef,
  onClose,
  onChange,
  onSubmit,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll(
        'button, input, textarea, [href], [tabindex]:not([tabindex="-1"])',
      );

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      ref={panelRef}
      className={`consult-panel${isOpen ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultTitle"
      aria-describedby="consultDesc"
      aria-hidden={!isOpen}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form className="consult-card" noValidate aria-busy={submitting} onSubmit={onSubmit}>
        <h3 id="consultTitle">初谈预约</h3>
        <p id="consultDesc">
          留下一个可以被温柔回应的入口。你只需要写下必要信息；正式咨询设置、保密范围与边界会在初谈中共同确认。
        </p>

        <label className="consult-field">
          称呼
          <input
            ref={nameInputRef}
            name="name"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={invalidFields.has('name') ? 'true' : undefined}
            aria-describedby="consultStatus"
            placeholder="如何称呼你"
            value={form.name}
            onChange={onChange}
          />
        </label>

        <label className="consult-field">
          联系方式
          <input
            name="contact"
            autoComplete="email"
            inputMode="text"
            required
            aria-required="true"
            aria-invalid={invalidFields.has('contact') ? 'true' : undefined}
            aria-describedby="consultStatus"
            placeholder="邮箱、电话或微信"
            value={form.contact}
            onChange={onChange}
          />
        </label>

        <label className="consult-field">
          想先谈什么
          <textarea
            name="message"
            placeholder="可以只写一句话，也可以暂时留空"
            value={form.message}
            onChange={onChange}
          />
        </label>

        <label className="privacy-consent">
          <input
            name="privacy"
            type="checkbox"
            required
            aria-required="true"
            aria-invalid={invalidFields.has('privacy') ? 'true' : undefined}
            aria-describedby="consultStatus"
            checked={form.privacy}
            onChange={onChange}
          />
          我理解这些信息只用于初步联系与预约沟通，正式设置会在初谈中再确认。
        </label>

        <p className="consult-safety">
          若正在经历自伤、他伤或其他紧急风险，请立即联系当地紧急救援，或请可信赖的人陪同就医。
        </p>

        <div className="consult-row">
          <button type="button" onClick={onClose}>
            稍后
          </button>
          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? '正在确认' : '发送预约意向'}
          </button>
        </div>

        <div className="consult-status" id="consultStatus" role="status" aria-live="polite" data-tone={statusTone}>
          {status}
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const { refs, activePage, uiEntered, jumpToProgress } = useParallaxScene();
  const [view, setView] = useState('home');
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [invalidFields, setInvalidFields] = useState(new Set());
  const [status, setStatus] = useState('');
  const [statusTone, setStatusTone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nameInputRef = useRef(null);
  const lastFocusRef = useRef(null);
  const sendTimerRef = useRef(0);

  useEffect(() => {
    document.body.classList.toggle('modal-open', isConsultOpen);
    if (isConsultOpen) {
      window.setTimeout(() => nameInputRef.current?.focus(), 0);
    }

    return () => document.body.classList.remove('modal-open');
  }, [isConsultOpen]);

  useEffect(
    () => () => {
      window.clearTimeout(sendTimerRef.current);
    },
    [],
  );

  const clearConsultState = () => {
    window.clearTimeout(sendTimerRef.current);
    sendTimerRef.current = 0;
    setSubmitting(false);
    setInvalidFields(new Set());
    setStatus('');
    setStatusTone('');
  };

  const openConsult = () => {
    lastFocusRef.current = document.activeElement;
    clearConsultState();
    setIsConsultOpen(true);
  };

  const openSpace = (space) => {
    lastFocusRef.current = document.activeElement;
    setView(space);
  };

  const openTeaRoom = () => openSpace('tea-room');

  const openPavilion = () => openSpace('pavilion');

  const openHome = () => {
    jumpToProgress(0);
    setView('home');
  };

  const closeConsult = () => {
    setIsConsultOpen(false);
    clearConsultState();
    window.setTimeout(() => {
      if (lastFocusRef.current && typeof lastFocusRef.current.focus === 'function') {
        lastFocusRef.current.focus();
      }
    }, 0);
  };

  const updateForm = (event) => {
    const { name, type, checked, value } = event.target;
    window.clearTimeout(sendTimerRef.current);
    sendTimerRef.current = 0;
    setSubmitting(false);
    setStatus('');
    setStatusTone('');
    setInvalidFields((current) => {
      const next = new Set(current);
      next.delete(name);
      return next;
    });
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitConsult = (event) => {
    event.preventDefault();

    const nextInvalid = new Set();
    if (!form.name.trim()) nextInvalid.add('name');
    if (!form.contact.trim()) nextInvalid.add('contact');
    if (!form.privacy) nextInvalid.add('privacy');

    if (nextInvalid.size) {
      setInvalidFields(nextInvalid);
      setStatusTone('error');
      if (nextInvalid.has('name')) {
        setStatus('请先留下一个称呼。');
        nameInputRef.current?.focus();
      } else if (nextInvalid.has('contact')) {
        setStatus('请留下一个可联系的方式。');
        event.currentTarget.elements.contact.focus();
      } else {
        setStatus('请先确认信息只用于初步联系与预约沟通。');
        event.currentTarget.elements.privacy.focus();
      }
      return;
    }

    setInvalidFields(new Set());
    setSubmitting(true);
    setStatusTone('success');
    setStatus('正在整理预约意向...');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sendTimerRef.current = window.setTimeout(
      () => {
        sendTimerRef.current = 0;
        setSubmitting(false);
        setStatusTone('success');
        setStatus('已记录预约意向，我会按你留下的方式确认初谈安排。');
        setForm(initialForm);
      },
      reducedMotion ? 0 : 520,
    );
  };

  return (
    <>
      {view === 'home' ? (
        <main id="scroll-root" ref={refs.scrollRootRef} data-page={activePage + 1}>
          <div id="stage">
            <div
              id="world"
              className="layer"
              ref={refs.worldRef}
              aria-hidden="true"
              style={{ backgroundImage: `url('${sceneAssets.world}')` }}
            />
            <div
              id="world-end"
              className="layer"
              ref={refs.worldEndRef}
              aria-hidden="true"
              style={{ backgroundImage: `url('${sceneAssets.worldEnd}')` }}
            />
            <Navigation
              onJump={jumpToProgress}
              onOpenConsult={openConsult}
              onOpenTeaRoom={openTeaRoom}
              onOpenPavilion={openPavilion}
            />
            <HeroScene
              sceneRef={refs.sceneOneRef}
              entered={uiEntered}
              onOpenConsult={openConsult}
              onOpenTeaRoom={openTeaRoom}
              onOpenPavilion={openPavilion}
            />
            <ThresholdScene sceneRef={refs.sceneTwoRef} onOpenConsult={openConsult} />
          </div>
        </main>
      ) : (
        <SpacePage
          space={view}
          onHome={openHome}
          onOpenConsult={openConsult}
          onOpenTeaRoom={openTeaRoom}
          onOpenPavilion={openPavilion}
        />
      )}

      <ConsultationDialog
        isOpen={isConsultOpen}
        form={form}
        invalidFields={invalidFields}
        status={status}
        statusTone={statusTone}
        submitting={submitting}
        nameInputRef={nameInputRef}
        onClose={closeConsult}
        onChange={updateForm}
        onSubmit={submitConsult}
      />
    </>
  );
}
