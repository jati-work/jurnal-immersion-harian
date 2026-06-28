import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import CaraBelajar from '../components/CaraBelajar'

const AMBANG_HARI = 14 // dianggap "lama gak disentuh" kalau udah lewat sekian hari

export default function Cover({ goTo, openPaket, jumlahPaket, jumlahKata, jumlahHariJurnal }) {
  const [reminder, setReminder] = useState(null) // {paketId, nama, hari}

  useEffect(() => {
    async function cekReminder() {
      const { data: kataData } = await supabase.from('kata').select('paket_id, last_reviewed_at')
      if (!kataData || kataData.length === 0) return
      const terakhirPerPaket = {}
      kataData.forEach(k => {
        const t = k.last_reviewed_at ? new Date(k.last_reviewed_at).getTime() : 0
        if (!terakhirPerPaket[k.paket_id] || t > terakhirPerPaket[k.paket_id]) {
          terakhirPerPaket[k.paket_id] = t
        }
      })
      let paketIdTerlama = null, waktuTerlama = Infinity
      Object.entries(terakhirPerPaket).forEach(([pid, t]) => {
        if (t < waktuTerlama) { waktuTerlama = t; paketIdTerlama = pid }
      })
      if (!paketIdTerlama) return
      const hari = Math.floor((Date.now() - waktuTerlama) / (1000 * 60 * 60 * 24))
      if (hari < AMBANG_HARI) return
      const { data: p } = await supabase.from('paket').select('nama').eq('id', paketIdTerlama).single()
      if (p) setReminder({ paketId: paketIdTerlama, nama: p.nama, hari })
    }
    cekReminder()
  }, [])

  function kunciUlang() {
    if (!confirm('Keluar dan minta kata sandi lagi waktu buka app berikutnya?')) return
    localStorage.removeItem('immersion-unlocked')
    window.location.reload()
  }

  return (
    <div className="cover">
      <button
        onClick={kunciUlang}
        title="Keluar (minta kata sandi lagi pas buka app berikutnya)"
        style={{
          position: 'fixed', top: 20, right: 20, width: 32, height: 32, borderRadius: '50%',
          border: '1.5px solid #b8d8b8', background: '#fff', cursor: 'pointer', color: '#7aaa8a',
          fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}
      >
        🔒
      </button>

      <div className="cover-inner">
        <div className="cover-head">
          <div className="cover-emoji">🌿</div>
          <div>
            <div className="cover-title">Jurnal Immersion Harian</div>
            <div className="cover-sub">kosakata dari keseharian + tracking belajar</div>
          </div>
        </div>

        {reminder && (
          <div
            onClick={() => openPaket(reminder.paketId)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12,
              background: '#fdf6e8', border: '1.5px solid #f0d9a0', marginBottom: 14, cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 20 }}>🌱</div>
            <div style={{ fontSize: 12, color: '#8a6a2a', lineHeight: 1.4 }}>
              Udah <b>{reminder.hari} hari</b> gak direview: <b>{reminder.nama}</b>.<br />
              <span style={{ fontSize: 11, color: '#a8905a' }}>Ayo buka lagi sebelum keburu lupa →</span>
            </div>
          </div>
        )}

        <div className="nav-card" onClick={() => goTo('jurnal')}>
          <div className="nav-icon">📅</div>
          <div className="nav-info">
            <div className="nav-title">Jurnal Kalender</div>
            <div className="nav-desc">
              {jumlahHariJurnal ? `${jumlahHariJurnal} hari sudah dicatat` : 'tandai tiap hari kamu belajar'}
            </div>
          </div>
        </div>

        <div className="nav-card" onClick={() => goTo('paket')}>
          <div className="nav-icon">📚</div>
          <div className="nav-info">
            <div className="nav-title">Kosakata Immersion</div>
            <div className="nav-desc">
              {jumlahPaket ? `${jumlahPaket} paket · ${jumlahKata} kata` : 'kosakata dari keseharian'}
            </div>
          </div>
        </div>

        <CaraBelajar />
      </div>
    </div>
  )
}
