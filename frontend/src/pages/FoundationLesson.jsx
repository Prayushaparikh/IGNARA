import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import styles from "./Foundation.module.css";
import { FOUNDATION_LESSONS } from "../data/foundationCurriculum.js";
import { useProgressStore } from "../store/progressStore.js";
import TryItBlock from "../components/foundation/TryItBlock.jsx";
import LessonPageGuide from "../components/foundation/LessonPageGuide.jsx";
import CodeWalkthrough from "../components/foundation/CodeWalkthrough.jsx";
import LessonSwipeDeck from "../components/foundation/LessonSwipeDeck.jsx";
import B1TextbookLesson from "../components/foundation/B1TextbookLesson.jsx";
import { COPY } from "../copy/foundationCopy.js";
import { B1_LESSON_PART_COUNT, getB1LessonPartForSectionId } from "../data/b1LessonData.js";

function EnhancedSection({ section, index }) {
  return (
    <div className={styles.section} id={section.id}>
      <h4>
        {index + 1}. {section.title}
      </h4>
      <p>{section.body}</p>
      {section.bullets?.length > 0 && (
        <ul className={styles.keyBullets}>
          {section.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {section.analogy && (
        <p className={styles.analogy}>
          <strong>{COPY.lesson.analogyLabel}</strong> {section.analogy}
        </p>
      )}
      {section.whyItMatters && (
        <p className={styles.whyMatters}>
          <strong>{COPY.lesson.whyLabel}</strong> {section.whyItMatters}
        </p>
      )}
      {section.asciiDiagram && <pre className={styles.flowAscii}>{section.asciiDiagram}</pre>}
      {section.asciiDiagrams?.map((block, i) => (
        <pre key={i} className={styles.flowAscii}>
          {block}
        </pre>
      ))}
      {section.criticalWarning && <div className={styles.warnBanner}>{section.criticalWarning}</div>}
      {section.examples?.length > 0 && (
        <pre className={styles.codeBlock}>{section.examples.join("\n")}</pre>
      )}
      {section.namingRules && (
        <div className={styles.twoCol}>
          <div>
            <strong>Valid names</strong>
            <ul className={styles.inlineList}>
              {section.namingRules.valid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Invalid names</strong>
            <ul className={styles.inlineList}>
              {section.namingRules.invalid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {section.comparisonVisual && (
        <>
          <p className={styles.whyMatters}>
            <strong>{section.comparisonVisual.title}</strong>
          </p>
          <div className={styles.compareTable}>
            <div className={`${styles.compareRow} ${styles.compareHead}`}>
              <span>Expression</span>
              <span>Result</span>
            </div>
            {section.comparisonVisual.rows.map((row, i) => (
              <div key={i} className={styles.compareRow}>
                <span>{row.left}</span>
                <span>{row.right}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {section.codeCompare?.length > 0 && (
        <div className={styles.codeCompareWrap}>
          {section.codeCompare.map((row, i) => (
            <div key={i} className={styles.codeComparePair}>
              {row.label && <p className={styles.codeCompareTitle}>{row.label}</p>}
              <div className={styles.codeCompareRow}>
                <div>
                  <span className={styles.codeCompareLabel}>{COPY.lesson.codeCompareAvoid}</span>
                  <pre className={styles.codeComparePre}>{row.wrong}</pre>
                </div>
                <div>
                  <span className={styles.codeCompareLabel}>{COPY.lesson.codeCompareBetter}</span>
                  <pre className={styles.codeComparePreOk}>{row.right}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {section.operators?.length > 0 && (
        <div className={styles.operatorTable}>
          <div className={styles.operatorHead}>
            <span>Operator</span>
            <span>Meaning</span>
            <span>Example</span>
          </div>
          {section.operators.map(([op, meaning, example]) => (
            <div key={op} className={styles.operatorRow}>
              <span>{op}</span>
              <span>{meaning}</span>
              <span>{example}</span>
            </div>
          ))}
        </div>
      )}
      {section.divisionCompare?.length > 0 && (
        <div className={styles.divisionMini}>
          <strong>Division family</strong>
          {section.divisionCompare.map((d) => (
            <div key={d.op}>
              <code>{d.op}</code> {d.example} → {d.result}
            </div>
          ))}
        </div>
      )}
      {section.parenthesesExamples?.length > 0 && (
        <ul className={styles.inlineList}>
          {section.parenthesesExamples.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      )}
      {section.mistakesDetailed?.length > 0 && (
        <div>
          {section.mistakesDetailed.map((m) => (
            <div key={m.title} className={styles.mistake}>
              <strong>{m.title}</strong>
              {m.symptom && (
                <p className={styles.whyMatters}>
                  <strong>You might notice:</strong> {m.symptom}
                </p>
              )}
              {m.memoryTrick && (
                <p className={styles.analogy}>
                  <strong>Easy reminder:</strong> {m.memoryTrick}
                </p>
              )}
              <pre className={styles.codeBlock}>Wrong: {m.wrong}</pre>
              <pre className={styles.codeBlock}>Correct: {m.correct}</pre>
            </div>
          ))}
        </div>
      )}
      {section.fullExample && (
        <>
          <pre className={styles.codeBlock}>{section.fullExample}</pre>
          {section.predict && (
            <p>
              <strong>Try to predict:</strong> {section.predict}
            </p>
          )}
          {section.predictAnswer && <p className={styles.whyMatters}>{section.predictAnswer}</p>}
        </>
      )}
      {(section.tryIts?.length ? section.tryIts : section.tryIt ? [section.tryIt] : []).map((t, i) => (
        <TryItBlock key={i} tryIt={t} />
      ))}
    </div>
  );
}

export default function FoundationLesson() {
  const { unitId = "b1", part } = useParams();
  const lesson = FOUNDATION_LESSONS[unitId];

  const { units, sync, markLessonRead } = useProgressStore();
  useEffect(() => { if (!units) sync(); }, [units, sync]);

  const unitProgress = units?.[unitId];

  const enhanced = Boolean(lesson?.heroIntro);
  const useLessonParts = unitId === "b1" && enhanced && lesson.splitIntoParts === true;
  const partNum = Number(part);
  const validPart = useLessonParts && partNum >= 1 && partNum <= B1_LESSON_PART_COUNT && !Number.isNaN(partNum);

  const sectionsForPart = useMemo(() => {
    if (!lesson?.sections) return [];
    if (!useLessonParts) return lesson.sections;
    return lesson.sections.filter((s) => getB1LessonPartForSectionId(s.id) === partNum);
  }, [lesson, useLessonParts, partNum]);

  const firstSectionIndexInLesson = useMemo(() => {
    if (!lesson?.sections?.length || !useLessonParts) return 0;
    const first = lesson.sections.find((s) => getB1LessonPartForSectionId(s.id) === partNum);
    if (!first) return 0;
    return lesson.sections.indexOf(first);
  }, [lesson, useLessonParts, partNum]);

  useEffect(() => {
    if (useLessonParts && partNum === B1_LESSON_PART_COUNT) {
      markLessonRead(unitId);
    }
  }, [useLessonParts, partNum, unitId, markLessonRead]);

  if (units && !unitProgress?.unlocked) return <Navigate to="/foundation" replace />;
  if (!lesson) return <Navigate to="/foundation" replace />;
  if (useLessonParts && partNum === 3) {
    return <Navigate to={`/foundation/${unitId}/lesson/2`} replace />;
  }
  if (useLessonParts && !validPart) {
    return <Navigate to={`/foundation/${unitId}/lesson/1`} replace />;
  }

  if (lesson.lessonFormat === "textbook") {
    return (
      <div className={styles.page}>
        <B1TextbookLesson lesson={lesson} unitId={unitId} />
      </div>
    );
  }

  if (lesson.lessonFormat === "minimal") {
    const wt = lesson.walkthrough;
    const swipeSlides = lesson.swipeSlides;
    const hasDeck = Array.isArray(swipeSlides) && swipeSlides.length > 0;

    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <span className="badge badge-ember">Foundation › {unitId.toUpperCase()} lesson</span>
          <h1>{lesson.title}</h1>
          <p>
            {lesson.subtitle} · {lesson.readingTime}
          </p>
        </div>

        <div className={styles.lessonMain}>
          <section className={styles.lessonPanel}>
            <h3>{COPY.lesson.minimalPanelTitle}</h3>
            <p className={styles.softPause}>
              {hasDeck
                ? "Flip the cards — learn vs do — then watch the code animate. Stuck later? Hints live on the practice page."
                : lesson.heroIntro?.blurb}
            </p>

            {hasDeck ? (
              <LessonSwipeDeck slides={swipeSlides} anchorId="section-2" />
            ) : (
              <>
                <div className={styles.section}>
                  <h4>{lesson.variables?.title}</h4>
                  <p>{lesson.variables?.body}</p>
                  <pre className={styles.codeBlock}>{lesson.variables?.example}</pre>
                </div>
                <div className={styles.section}>
                  <h4>{lesson.io?.title}</h4>
                  <p>{lesson.io?.body}</p>
                  <div className={styles.warnBanner}>{lesson.io?.warning}</div>
                  <pre className={styles.codeBlock}>{lesson.io?.example}</pre>
                </div>
                <div className={styles.section}>
                  <h4>{lesson.math?.title}</h4>
                  <p>{lesson.math?.body}</p>
                  <pre className={styles.codeBlock}>{lesson.math?.example}</pre>
                </div>
                <div className={styles.section}>
                  <h4>{lesson.mistakes?.title}</h4>
                  <ul className={styles.keyBullets}>
                    {lesson.mistakes?.items?.map((m) => (
                      <li key={m.title}>
                        <strong>{m.title}</strong> — {m.tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.section}>
                  <h4>{COPY.lesson.rememberHeading}</h4>
                  <ul className={styles.inlineList}>
                    {lesson.remember?.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {wt?.code && wt?.steps?.length > 0 && (
              <CodeWalkthrough title={wt.title} subtitle={wt.subtitle} code={wt.code} steps={wt.steps} />
            )}

            <div className={styles.nav} style={{ marginTop: 24 }}>
              <Link className="btn btn-ghost" to="/foundation">
                {COPY.lesson.backToTrack}
              </Link>
              <div className={styles.lessonNavRight}>
                <Link
                  className="btn btn-primary"
                  to={`/foundation/${unitId}/practice/1`}
                  onClick={() => markLessonRead(unitId)}
                >
                  {COPY.lesson.startPractice}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="badge badge-ember">
          Foundation › {unitId.toUpperCase()} lesson
          {useLessonParts && ` › ${COPY.lesson.partChip(partNum)}`}
        </span>
        <h1>{lesson.title}</h1>
        <p>
          {lesson.subtitle} · {lesson.readingTime}
          {useLessonParts && ` · ${COPY.lesson.partProgress(partNum, B1_LESSON_PART_COUNT)}`}
        </p>
      </div>

      <div className={styles.lessonMain}>
        <section className={styles.lessonPanel}>
          <h3>{COPY.lesson.panelTitle}</h3>

          {useLessonParts && (
            <nav className={styles.lessonPartNav} aria-label={COPY.lesson.partNavAria}>
              <div className={styles.lessonPartNavLabel}>{COPY.lesson.partProgress(partNum, B1_LESSON_PART_COUNT)}</div>
              <p className={styles.lessonPartHint}>{COPY.lesson.partHint}</p>
              <div className={styles.partPills}>
                {COPY.lesson.parts.map((meta, i) => {
                  const n = i + 1;
                  return (
                    <Link
                      key={n}
                      to={`/foundation/${unitId}/lesson/${n}`}
                      className={`${styles.partPill} ${n === partNum ? styles.partPillActive : ""}`}
                    >
                      <span className={styles.partPillTitle}>{meta.title}</span>
                      <span className={styles.partPillSub}>{meta.sub}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}

          {useLessonParts && partNum === 2 && (
            <>
              <p className={styles.softPause}>{COPY.lesson.part2PauseLine}</p>
              <aside className={styles.miniVisualGuide} aria-label={COPY.lesson.part2VisualGuide.title}>
                <strong>{COPY.lesson.part2VisualGuide.title}</strong>
                <ul>
                  {COPY.lesson.part2VisualGuide.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <pre className={styles.miniFlow}>{COPY.lesson.part2VisualGuide.flowAscii}</pre>
              </aside>
            </>
          )}

          {enhanced ? (
            <>
              {(!useLessonParts || partNum === 1) && (
                <>
                  <div className={styles.heroCard}>
                    <h4>{lesson.heroIntro.title}</h4>
                    {lesson.warmOpening?.reassurance && (
                      <p className={styles.reassurance}>{lesson.warmOpening.reassurance}</p>
                    )}
                    <p>
                      <strong>{COPY.lesson.analogyLabel}</strong> {lesson.heroIntro.analogy}
                    </p>
                    <p>{lesson.heroIntro.whyPython}</p>
                  </div>
                  <LessonPageGuide />
                  {lesson.compactConcepts?.length > 0 && (
                    <div className={styles.warmPath}>
                      <h4>{COPY.lesson.warmPathTitle}</h4>
                      <p className={styles.warmPathSub}>{COPY.lesson.warmPathSub}</p>
                      {lesson.compactConcepts.map((c) => (
                        <div key={c.title} className={styles.warmConcept}>
                          <h5>{c.title}</h5>
                          <p>{c.sentence}</p>
                          <pre className={styles.codeBlock}>{c.code}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {sectionsForPart.map((section, idx) => (
                <EnhancedSection key={section.id} section={section} index={firstSectionIndexInLesson + idx} />
              ))}
              {(!useLessonParts || partNum === B1_LESSON_PART_COUNT) && (
                <>
                  {lesson.warmClosing && (
                    <div className={styles.warmClosing}>
                      <h4>{lesson.warmClosing.headline}</h4>
                      {lesson.warmClosing.lines?.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                      {lesson.warmClosing.ctaNote && (
                        <p className={styles.ctaNote}>{lesson.warmClosing.ctaNote}</p>
                      )}
                    </div>
                  )}
                  <div className={styles.section}>
                    <h4>{COPY.lesson.quickRefTitle}</h4>
                    <ul className={styles.inlineList}>
                      {lesson.quickReference.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className={styles.section}>
                <h4>Introduction to Programming</h4>
                <p>{lesson.intro}</p>
              </div>
              {lesson.sections?.map((section, idx) => (
                <div key={section.id || section.title} className={styles.section} id={section.id}>
                  <h4>
                    {idx + 1}. {section.title}
                  </h4>
                  <p>{section.body}</p>
                  {section.examples?.length > 0 && (
                    <pre className={styles.codeBlock}>{section.examples.join("\n")}</pre>
                  )}
                  {section.namingRules && (
                    <div className={styles.twoCol}>
                      <div>
                        <strong>Valid names</strong>
                        <ul className={styles.inlineList}>
                          {section.namingRules.valid.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Invalid names</strong>
                        <ul className={styles.inlineList}>
                          {section.namingRules.invalid.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {section.operators?.length > 0 && (
                    <div className={styles.operatorTable}>
                      <div className={styles.operatorHead}>
                        <span>Operator</span>
                        <span>Meaning</span>
                        <span>Example</span>
                      </div>
                      {section.operators.map(([op, meaning, example]) => (
                        <div key={op} className={styles.operatorRow}>
                          <span>{op}</span>
                          <span>{meaning}</span>
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.parenthesesExamples?.length > 0 && (
                    <ul className={styles.inlineList}>
                      {section.parenthesesExamples.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div className={styles.section}>
                <h4>Common mistakes (wrong vs correct)</h4>
                {lesson.commonMistakes?.map((m) => (
                  <div key={m.title} className={styles.mistake}>
                    <strong>{m.title}</strong>
                    <pre className={styles.codeBlock}>Wrong: {m.wrong}</pre>
                    <pre className={styles.codeBlock}>Correct: {m.correct}</pre>
                  </div>
                ))}
              </div>
              <div className={styles.section}>
                <h4>Putting it all together</h4>
                <pre className={styles.codeBlock}>{lesson.fullExample}</pre>
                <p>
                  <strong>Try to Predict:</strong> {lesson.predict}
                </p>
              </div>
              <div className={styles.section}>
                <h4>{COPY.lesson.quickRefTitle}</h4>
                <ul className={styles.inlineList}>
                  {lesson.quickReference.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          <div className={styles.nav} style={{ marginTop: 24 }}>
            <Link className="btn btn-ghost" to="/foundation">
              {COPY.lesson.backToTrack}
            </Link>
            <div className={styles.lessonNavRight}>
              {useLessonParts && partNum > 1 && (
                <Link className="btn btn-ghost" to={`/foundation/${unitId}/lesson/${partNum - 1}`}>
                  {COPY.lesson.backToPart(partNum - 1)}
                </Link>
              )}
              {useLessonParts && partNum < B1_LESSON_PART_COUNT && (
                <Link className="btn btn-primary" to={`/foundation/${unitId}/lesson/${partNum + 1}`}>
                  {COPY.lesson.continueToPart(partNum + 1)}
                </Link>
              )}
              {useLessonParts && partNum === B1_LESSON_PART_COUNT && (
                <Link className="btn btn-primary" to={`/foundation/${unitId}/practice/1`}>
                  {COPY.lesson.startPractice}
                </Link>
              )}
              {!useLessonParts && (
                <Link
                  className="btn btn-primary"
                  to={`/foundation/${unitId}/practice/1`}
                  onClick={() => markLessonRead(unitId)}
                >
                  {COPY.lesson.startPractice}
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
