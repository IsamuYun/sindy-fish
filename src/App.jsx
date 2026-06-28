import { useEffect, useRef, useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import PavilionPage from './pages/PavilionPage.jsx';
import TeaRoomPage from './pages/TeaRoomPage.jsx';

const initialForm = {
  name: '',
  contact: '',
  message: '',
  privacy: false,
};

function PageFrame({ active, children }) {
  return (
    <div
      className="app-page"
      data-active={active ? 'true' : 'false'}
      aria-hidden={active ? undefined : 'true'}
      inert={active ? undefined : ''}
    >
      {children}
    </div>
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
    <div className="app-shell" data-view={view}>
      <PageFrame active={view === 'home'}>
        <HomePage
          onOpenConsult={openConsult}
          onOpenTeaRoom={openTeaRoom}
          onOpenPavilion={openPavilion}
        />
      </PageFrame>

      <PageFrame active={view === 'tea-room'}>
        <TeaRoomPage
          onHome={openHome}
          onOpenConsult={openConsult}
          onOpenPavilion={openPavilion}
        />
      </PageFrame>

      <PageFrame active={view === 'pavilion'}>
        <PavilionPage
          onHome={openHome}
          onOpenConsult={openConsult}
          onOpenTeaRoom={openTeaRoom}
        />
      </PageFrame>

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
    </div>
  );
}
