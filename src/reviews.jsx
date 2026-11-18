import { useState, useEffect } from 'react';

const DESKTOP_PER_PAGE = 3;
const EMPTY_REVIEWS = [];

export default function Reviews({ reviews = EMPTY_REVIEWS }) {
  const [desktopPage, setDesktopPage] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopAnim, setDesktopAnim] = useState('idle');
  const [mobileAnim, setMobileAnim] = useState('idle');
  const [desktopDir, setDesktopDir] = useState('forward');
  const [mobileDir, setMobileDir] = useState('forward');
  const [prevDesktopPage, setPrevDesktopPage] = useState(0);
  const [prevMobileIndex, setPrevMobileIndex] = useState(0);

  const [previousReviews, setPreviousReviews] = useState(reviews);
  if (previousReviews !== reviews) {
    setPreviousReviews(reviews);
    setDesktopPage(0);
    setMobileIndex(0);
    setDesktopAnim('idle');
    setMobileAnim('idle');
  }

  useEffect(() => {
    if (desktopAnim === 'idle') return;
    const timer = setTimeout(() => setDesktopAnim('idle'), 700);
    return () => clearTimeout(timer);
  }, [desktopAnim]);

  useEffect(() => {
    if (mobileAnim === 'idle') return;
    const timer = setTimeout(() => setMobileAnim('idle'), 700);
    return () => clearTimeout(timer);
  }, [mobileAnim]);

  // Desktop pagination (groups of 3)
  const totalDesktopPages = Math.ceil(reviews.length / DESKTOP_PER_PAGE);
  const desktopStart = desktopPage * DESKTOP_PER_PAGE;
  const desktopSlice = reviews.slice(desktopStart, desktopStart + DESKTOP_PER_PAGE);

  const desktopPrev = () => {
    if (desktopAnim !== 'idle' || desktopPage === 0) return;
    setDesktopDir('back');
    setPrevDesktopPage(desktopPage);
    setDesktopPage(desktopPage - 1);
    setDesktopAnim('sliding');
  };

  const desktopNext = () => {
    if (desktopAnim !== 'idle' || desktopPage === totalDesktopPages - 1) return;
    setDesktopDir('forward');
    setPrevDesktopPage(desktopPage);
    setDesktopPage(desktopPage + 1);
    setDesktopAnim('sliding');
  };

  const onDesktopAnimEnd = () => {
    setDesktopAnim('idle');
  };

  // Mobile pagination (1 at a time)
  const mobilePrev = () => {
    if (mobileAnim !== 'idle' || mobileIndex === 0) return;
    setMobileDir('back');
    setPrevMobileIndex(mobileIndex);
    setMobileIndex(mobileIndex - 1);
    setMobileAnim('sliding');
  };

  const mobileNext = () => {
    if (mobileAnim !== 'idle' || mobileIndex === reviews.length - 1) return;
    setMobileDir('forward');
    setPrevMobileIndex(mobileIndex);
    setMobileIndex(mobileIndex + 1);
    setMobileAnim('sliding');
  };

  const onMobileAnimEnd = () => {
    setMobileAnim('idle');
  };

  const getSlideClass = (anim, dir) => {
    if (anim !== 'sliding') return '';
    return dir === 'forward' ? 'review-slide-in-right' : 'review-slide-in-left';
  };

  const getOutSlideClass = (anim, dir) => {
    if (anim !== 'sliding') return '';
    return dir === 'forward' ? 'review-slide-out-left' : 'review-slide-out-right';
  };

  if (reviews.length === 0) return null;

  const cardStyle = {
    backgroundColor: '#CDB895',
    borderRadius: '1rem',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    flex: '1 1 0',
    minWidth: 0,
    justifyContent: 'space-between',
  };

  const quoteStyle = {
    fontFamily: 'Alexandria, sans-serif',
    color: '#D8263E',
    fontSize: '1.125rem',
    lineHeight: 1.6,
    margin: 0,
  };

  const nameStyle = {
    fontFamily: 'Alexandria, sans-serif',
    fontWeight: 700,
    color: '#002F49',
    fontSize: '1.125rem',
    margin: 0,
  };

  const arrowBtn = (disabled) => ({
    background: 'none',
    border: 'none',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.35 : 1,
    fontSize: '1.5rem',
    padding: '0.25rem 0.5rem',
    color: '#0D2C40',
    transition: 'opacity 0.2s',
  });

  const controlsBlock = (page, onPrev, onNext, prevDisabled, nextDisabled) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginTop: '1.25rem',
      }}
    >
      <span
        style={{
          fontFamily: 'Karantina, cursive',
          fontWeight: 'bold',
          fontSize: '1.75rem',
          color: '#0D2C40',
          minWidth: '1.5rem',
        }}
      >
        {page + 1}
      </span>

      <button
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous review"
        style={arrowBtn(prevDisabled)}
      >
        &#8592;
      </button>

      <button
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next review"
        style={arrowBtn(nextDisabled)}
      >
        &#8594;
      </button>
    </div>
  );

  return (
    <section
      id="reviews"
      className="reviews-section"
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: '3rem',
        paddingBottom: '3rem',
        maxWidth: '92vw',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Title — full width, right-aligned on desktop */}
      <h2
        className="reviews-title"
        style={{
          fontFamily: 'Karantina, cursive',
          color: '#0D2C40',
          fontWeight: 'bold',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}
      >
        What People Say
      </h2>

      {/* Desktop: 3 cards per page with controls */}
      <div className="reviews-desktop" style={{ padding: '0 3rem', boxSizing: 'border-box' }}>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          {/* Outgoing cards */}
          {desktopAnim === 'sliding' && (() => {
            const prevStart = prevDesktopPage * DESKTOP_PER_PAGE;
            const prevSlice = reviews.slice(prevStart, prevStart + DESKTOP_PER_PAGE);
            return (
              <div
                className={getOutSlideClass(desktopAnim, desktopDir)}
                style={{ display: 'flex', gap: '2rem', position: 'absolute', inset: 0, zIndex: 1 }}
              >
                {prevSlice.map((r, i) => (
                  <div key={prevStart + i} style={{ ...cardStyle, minHeight: '500px' }}>
                    <p style={quoteStyle}>&ldquo;{r.text}&rdquo;</p>
                    <p style={nameStyle}>&mdash; {r.name}</p>
                  </div>
                ))}
              </div>
            );
          })()}
          {/* Incoming cards */}
          <div
            className={getSlideClass(desktopAnim, desktopDir)}
            onAnimationEnd={onDesktopAnimEnd}
            style={{ display: 'flex', gap: '2rem' }}
          >
          {desktopSlice.map((r, i) => (
            <div key={desktopStart + i} style={{ ...cardStyle, minHeight: '500px' }}>
              <p style={quoteStyle}>&ldquo;{r.text}&rdquo;</p>
              <p style={nameStyle}>&mdash; {r.name}</p>
            </div>
          ))}
          </div>
        </div>
        {controlsBlock(
          desktopPage,
          desktopPrev,
          desktopNext,
          desktopPage === 0,
          desktopPage === totalDesktopPages - 1,
        )}
      </div>

      {/* Mobile: single card with controls */}
      <div className="reviews-mobile" style={{ display: 'none', padding: '0 1.5rem', boxSizing: 'border-box' }}>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          {/* Outgoing card */}
          {mobileAnim === 'sliding' && (
            <div
              className={`review-card ${getOutSlideClass(mobileAnim, mobileDir)}`}
              style={{ ...cardStyle, position: 'absolute', inset: 0, zIndex: 1 }}
            >
              <p style={quoteStyle}>&ldquo;{reviews[prevMobileIndex]?.text}&rdquo;</p>
              <p style={nameStyle}>&mdash; {reviews[prevMobileIndex]?.name}</p>
            </div>
          )}
          {/* Incoming card */}
          <div
            className={`review-card ${getSlideClass(mobileAnim, mobileDir)}`}
            onAnimationEnd={onMobileAnimEnd}
            style={cardStyle}
          >
            <p style={quoteStyle}>&ldquo;{reviews[mobileIndex]?.text}&rdquo;</p>
            <p style={nameStyle}>&mdash; {reviews[mobileIndex]?.name}</p>
          </div>
        </div>
        {controlsBlock(
          mobileIndex,
          mobilePrev,
          mobileNext,
          mobileIndex === 0,
          mobileIndex === reviews.length - 1,
        )}
      </div>
    </section>
  );
}
