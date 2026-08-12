export default function PageDots({ pages, activePage, onJump }) {
  return (
    <div className="page-dots" role="group" aria-label="首页分页导航">
      {pages.map((label, index) => (
        <button
          key={label}
          className="page-dot"
          type="button"
          data-active={index === activePage ? 'true' : 'false'}
          aria-current={index === activePage ? 'true' : undefined}
          aria-label={`第 ${index + 1} 页：${label}`}
          onClick={() => onJump(index)}
        >
          <span className="page-dot-mark" aria-hidden="true" />
          <span className="page-dot-label" aria-hidden="true">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
