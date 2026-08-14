import React, { useEffect, useState } from 'react';
import { Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsTicker({ items }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = items.length;

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(timer);
  }, [paused, count]);

  if (!count) return null;

  const go = (dir) => setIndex((i) => (i + dir + count) % count);

  return (
    <div
      className="news-ticker"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="news-head">
        <span className="news-label">
          <Newspaper size={15} /> Haberler
        </span>
        <div className="news-nav">
          <button onClick={() => go(-1)} aria-label="Önceki haber">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => go(1)} aria-label="Sonraki haber">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="news-stage">
        {items.map((item, i) => (
          <article
            key={item.id || i}
            className={`news-slide ${i === index ? 'active' : ''}`}
            aria-hidden={i !== index}
          >
            <span className="news-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <div className="news-dots">
        {items.map((item, i) => (
          <button
            key={item.id || i}
            className={i === index ? 'active' : ''}
            onClick={() => setIndex(i)}
            aria-label={`Haber ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
