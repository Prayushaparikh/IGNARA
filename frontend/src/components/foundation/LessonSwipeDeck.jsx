import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./LessonSwipeDeck.module.css";
import { COPY } from "../../copy/foundationCopy.js";

/**
 * Tinder-style horizontal cards: "What you'll learn" vs "What you'll do".
 * Touch swipe, keyboard arrows, dots, prev/next.
 */
export default function LessonSwipeDeck({ slides, anchorId = "section-2" }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const wrapRef = useRef(null);
  const n = slides?.length || 0;

  const go = useCallback(
    (delta) => {
      setIndex((i) => Math.min(Math.max(0, i + delta), Math.max(0, n - 1)));
    },
    [n]
  );

  useEffect(() => {
    const onKey = (e) => {
      const root = wrapRef.current;
      if (!root || !root.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx < -48) go(1);
    else if (dx > 48) go(-1);
  };

  if (!n) return null;

  const pctPerSlide = 100 / n;
  /** translateX % is relative to the track width */
  const translate = -index * pctPerSlide;

  return (
    <div ref={wrapRef} className={styles.wrap} id={anchorId || undefined}>
      <p className={styles.hint}>
        {COPY.lesson.swipeDeckHint} {COPY.lesson.swipeOf(index + 1, n)}
      </p>

      <div className={styles.dots} role="tablist" aria-label="Lesson cards">
        {slides.map((s, i) => (
          <button
            key={s.id}
            id={`lesson-swipe-tab-${s.id}`}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-controls={`lesson-swipe-panel-${s.id}`}
            aria-label={`Go to card ${i + 1}: ${s.title}`}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <div
        className={styles.viewport}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-label="Swipeable lesson cards"
      >
        <div className={styles.track} style={{ width: `${n * 100}%`, transform: `translateX(${translate}%)` }}>
          {slides.map((slide, i) => (
            <article
              key={slide.id}
              id={`lesson-swipe-panel-${slide.id}`}
              className={styles.slide}
              style={{ width: `${pctPerSlide}%` }}
              role="tabpanel"
              aria-labelledby={`lesson-swipe-tab-${slide.id}`}
              aria-hidden={i !== index}
            >
              <div className={styles.slideInner}>
                <h4 className={styles.title}>{slide.title}</h4>
                <div className={styles.grid}>
                  <div className={`${styles.col} ${styles.colLearn}`}>
                    <div className={styles.colLabel}>{COPY.lesson.swipeLearn}</div>
                    <ul className={styles.list}>
                      {(slide.learn || []).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={`${styles.col} ${styles.colDo}`}>
                    <div className={styles.colLabel}>{COPY.lesson.swipeDo}</div>
                    {Array.isArray(slide.do) ? (
                      <ul className={styles.list}>
                        {slide.do.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      slide.do && (
                        <p style={{ margin: 0, fontSize: 14, color: "var(--text-soft)", lineHeight: 1.55 }}>{slide.do}</p>
                      )
                    )}
                    {slide.code && <pre className={styles.code}>{slide.code}</pre>}
                  </div>
                </div>
                {slide.alert && <div className={styles.alert}>{slide.alert}</div>}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.navRow}>
        <button type="button" className="btn btn-ghost" disabled={index <= 0} onClick={() => go(-1)}>
          {COPY.lesson.swipePrev}
        </button>
        <span className={styles.swipeCue}>Swipe on your phone</span>
        <button type="button" className="btn btn-primary" disabled={index >= n - 1} onClick={() => go(1)}>
          {COPY.lesson.swipeNext}
        </button>
      </div>
    </div>
  );
}
