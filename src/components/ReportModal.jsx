import React, { useState } from 'react';
import { TriangleAlert, Send, CheckCircle2 } from 'lucide-react';
import Modal from './Modal.jsx';
import { api } from '../lib.js';

export default function ReportModal({ onClose }) {
  const [form, setForm] = useState({ subject: '', message: '', contact: '' });
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.message.trim()) return;
    setState('sending');
    setError('');
    try {
      await api.submit('reports', form);
      setState('done');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  };

  return (
    <Modal title="Hata Bildir" subtitle="Sitede karşılaştığın sorunu ilet." icon={TriangleAlert} onClose={onClose}>
      {state === 'done' ? (
        <div className="form-success">
          <CheckCircle2 size={38} />
          <h3>Teşekkürler!</h3>
          <p>Bildirimin ekibe iletildi.</p>
          <button className="btn btn-primary" onClick={onClose}>
            Kapat
          </button>
        </div>
      ) : (
        <form className="form" onSubmit={submit}>
          <label className="field">
            <span>Konu</span>
            <input value={form.subject} onChange={set('subject')} placeholder="Örn: Sıralama güncellenmiyor" />
          </label>
          <label className="field">
            <span>Açıklama *</span>
            <textarea
              value={form.message}
              onChange={set('message')}
              rows={4}
              required
              placeholder="Sorunu detaylı anlat..."
            />
          </label>
          <label className="field">
            <span>İletişim (opsiyonel)</span>
            <input value={form.contact} onChange={set('contact')} placeholder="Discord kullanıcı adın" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" disabled={state === 'sending'}>
            <Send size={16} /> {state === 'sending' ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      )}
    </Modal>
  );
}
