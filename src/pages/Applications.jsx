import React, { useState } from 'react';
import { ClipboardList, Send, CheckCircle2, Info } from 'lucide-react';
import { modes } from '../data.js';

export function Applications({ user }) {
  const [ign, setIgn] = useState('');
  const [region, setRegion] = useState('EU');
  const [mode, setMode] = useState(modes[0].label);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (!ign.trim()) return;
    setSent(true);
  };

  return (
    <section className="page">
      <div className="page-head">
        <span className="page-icon">
          <ClipboardList size={20} />
        </span>
        <div>
          <p className="section-kicker">Katıl</p>
          <h2>Başvurular</h2>
        </div>
      </div>
      <p className="page-lead">
        Tier testine girmek veya tester ekibine katılmak için başvurunu oluştur.
        Başvurular Discord üzerinden değerlendirilir.
      </p>

      {!user && (
        <div className="notice">
          <Info size={16} /> Başvurunun sana bağlanabilmesi için Discord ile giriş
          yapman önerilir.
        </div>
      )}

      {sent ? (
        <div className="form-success">
          <CheckCircle2 size={20} />
          Başvurun alındı! Discord üzerinden seninle iletişime geçeceğiz.
          <button className="btn btn-ghost sm" onClick={() => setSent(false)}>
            Yeni başvuru
          </button>
        </div>
      ) : (
        <form className="panel-form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="app-ign">Minecraft kullanıcı adın</label>
            <input
              id="app-ign"
              value={ign}
              onChange={(event) => setIgn(event.target.value)}
              placeholder="Örn. Marlowww"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="app-region">Bölge</label>
              <select
                id="app-region"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
              >
                <option value="NA">NA — North America</option>
                <option value="EU">EU — Europe</option>
                <option value="AS">AS — Asia</option>
                <option value="OCE">OCE — Oceania</option>
                <option value="SA">SA — South America</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="app-mode">Test modu</label>
              <select
                id="app-mode"
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                {modes.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="app-note">Ek not (opsiyonel)</label>
            <textarea
              id="app-note"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Deneyimin, önceki sıralamaların vb..."
            />
          </div>

          <button className="btn btn-primary" type="submit">
            <Send size={16} /> Başvuruyu gönder
          </button>
        </form>
      )}
    </section>
  );
}
