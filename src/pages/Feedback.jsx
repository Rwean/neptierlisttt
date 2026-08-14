import React, { useState } from 'react';
import { Bug, Send, CheckCircle2 } from 'lucide-react';

export function Feedback() {
  const [type, setType] = useState('bug');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    // Cloudflare Pages Functions üzerinden bir endpoint'e bağlanabilir.
    setSent(true);
    setMessage('');
    setContact('');
  };

  return (
    <section className="page">
      <div className="page-head">
        <span className="page-icon">
          <Bug size={20} />
        </span>
        <div>
          <p className="section-kicker">Geri bildirim</p>
          <h2>Hata / Öneri</h2>
        </div>
      </div>
      <p className="page-lead">
        Bir hata mı buldun ya da bir fikrin mi var? Bize buradan ulaştır,
        ekibimiz Discord üzerinden değerlendirir.
      </p>

      {sent ? (
        <div className="form-success">
          <CheckCircle2 size={20} />
          Teşekkürler! Geri bildirimin alındı.
          <button className="btn btn-ghost sm" onClick={() => setSent(false)}>
            Yeni gönder
          </button>
        </div>
      ) : (
        <form className="panel-form" onSubmit={submit}>
          <div className="field">
            <label>Tür</label>
            <div className="segmented">
              <button
                type="button"
                className={type === 'bug' ? 'active' : ''}
                onClick={() => setType('bug')}
              >
                Hata
              </button>
              <button
                type="button"
                className={type === 'suggestion' ? 'active' : ''}
                onClick={() => setType('suggestion')}
              >
                Öneri
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="fb-message">Mesajın</label>
            <textarea
              id="fb-message"
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={
                type === 'bug'
                  ? 'Karşılaştığın hatayı adım adım anlat...'
                  : 'Önerini detaylı şekilde yaz...'
              }
            />
          </div>

          <div className="field">
            <label htmlFor="fb-contact">Discord kullanıcı adın (opsiyonel)</label>
            <input
              id="fb-contact"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="kullanici#0000"
            />
          </div>

          <button className="btn btn-primary" type="submit">
            <Send size={16} /> Gönder
          </button>
        </form>
      )}
    </section>
  );
}
