import React from 'react';
import { Newspaper } from 'lucide-react';
import { newsItems } from '../data.js';

export function News() {
  return (
    <section className="page">
      <div className="page-head">
        <span className="page-icon">
          <Newspaper size={20} />
        </span>
        <div>
          <p className="section-kicker">Duyurular</p>
          <h2>Haberler</h2>
        </div>
      </div>
      <p className="page-lead">
        Sezon güncellemeleri, yeni modlar ve topluluk etkinlikleriyle ilgili en
        güncel duyurular.
      </p>

      <div className="news-grid">
        {newsItems.map((item) => (
          <article className="news-card" key={item.id}>
            <div className="news-meta">
              <span className="news-tag">{item.tag}</span>
              <time>{item.date}</time>
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
