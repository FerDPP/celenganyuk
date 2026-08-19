import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from './supabase'
import './App.css'

// ==================== CONSTANTS ====================
const DEFAULT_USERS = [
  { id: 'ferdy', name: 'Ferdy', emoji: '👨‍💻' },
  { id: 'shelline', name: 'Shelline', emoji: '👩‍🎨' },
  { id: 'mamah', name: 'Mamah', emoji: '👩‍🍳' },
]

const PRODUCTS = [
  { id: 'uang', name: 'Uang', emoji: '💵', unit: 'Rp', prefix: 'Rp' },
  { id: 'emas', name: 'Emas', emoji: '🥇', unit: 'gram', prefix: '' },
  { id: 'perhiasan', name: 'Perhiasan', emoji: '💎', unit: 'item', prefix: '' },
  { id: 'lainnya', name: 'Lainnya', emoji: '📦', unit: '', prefix: '' },
]

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000]

const STORAGE_KEY = 'celenganyuk_transactions'

const TAGLINES = [
  'Yuk nabung bareng-bareng, dikit-dikit lama-lama jadi bukit! 🏔️',
  'Sedikit demi sedikit, masa depan cerah menanti! ☀️',
  'Hari ini nabung, besok tersenyum lebar! 😊',
  'Uang kecil hari ini, kebahagiaan besar di esok hari! 🌈',
  'Konsisten itu kunci! Terus nabung ya! 🔑',
  'Tabunganmu hari ini adalah kebebasanmu di masa depan! 🦋',
  'Satu langkah kecil untuk tabungan, satu lompatan besar untuk impian! 🚀',
  'Jangan tunda nabung, mulai dari sekarang! 💪',
  'Rajin menabung, hidup tenang tanpa bingung! 🧘',
  'Kumpulkan receh-recehnya, nanti jadi berlimpah! 💰',
  'Masa depan dibentuk dari kebiasaan hari ini! 🌟',
  'Nabung itu bukan soal besar kecil, tapi soal konsisten! ✨',
  'Setiap rupiah yang ditabung adalah investasi untuk kebahagiaan! 🎯',
  'Semangat menabung! Impianmu semakin dekat! 🎈',
]

const FLOATING_ITEMS = [
  { emoji: '💰', size: '1.8rem' },
  { emoji: '🪙', size: '1.4rem' },
  { emoji: '✨', size: '1.2rem' },
  { emoji: '🌟', size: '1.5rem' },
  { emoji: '🍀', size: '1.3rem' },
  { emoji: '🦋', size: '1.6rem' },
  { emoji: '🌸', size: '1.4rem' },
  { emoji: '💎', size: '1.3rem' },
  { emoji: '🐈', size: '1.5rem' },
  { emoji: '🎈', size: '1.4rem' },
  { emoji: '☁️', size: '1.6rem' },
  { emoji: '🌿', size: '1.2rem' },
]

// ==================== HELPERS ====================
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function formatRupiah(num) {
  if (num === 0) return 'Rp 0'
  return 'Rp ' + Math.abs(num).toLocaleString('id-ID')
}

function formatAmount(num, product) {
  if (product === 'uang') return formatRupiah(num)
  if (product === 'emas') return `${num.toLocaleString('id-ID')} gram`
  if (product === 'perhiasan') return `${num.toLocaleString('id-ID')} item`
  return num.toLocaleString('id-ID')
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHrs = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHrs < 24) return `${diffHrs} jam lalu`
  if (diffDays < 7) return `${diffDays} hari lalu`
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function getEmojiForUser(name) {
  const found = DEFAULT_USERS.find(u => u.name.toLowerCase() === name.toLowerCase())
  if (found) return found.emoji
  const emojis = ['🧑', '👤', '🙋', '🧑‍💼', '👨‍🎤', '👩‍💻', '🦸', '🧑‍🚀']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return emojis[Math.abs(hash) % emojis.length]
}

function getProductInfo(productId) {
  return PRODUCTS.find(p => p.id === productId) || PRODUCTS[0]
}

// ==================== FLOATING BACKGROUND ====================
function FloatingBackground() {
  const items = useMemo(() =>
    FLOATING_ITEMS.map((item, i) => ({
      ...item,
      left: `${3 + (i * 8)}%`,
      duration: `${15 + Math.random() * 20}s`,
      delay: `${-Math.random() * 15}s`,
    })),
  [])

  return (
    <div className="floating-bg">
      {items.map((item, i) => (
        <span
          key={i}
          className="floating-bg__item"
          style={{
            left: item.left,
            fontSize: item.size,
            animationDuration: item.duration,
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </span>
      ))}
      {/* Pulsing color blobs */}
      <div
        className="floating-bg__blob"
        style={{
          width: '300px', height: '300px',
          top: '20%', right: '5%',
          background: 'rgba(200, 149, 108, 0.06)',
        }}
      />
      <div
        className="floating-bg__blob"
        style={{
          width: '250px', height: '250px',
          bottom: '15%', left: '10%',
          background: 'rgba(168, 197, 160, 0.06)',
          animationDelay: '-6s',
        }}
      />
    </div>
  )
}

// ==================== TOAST COMPONENT ====================
function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '😅' : '✨'}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}

// ==================== CONFIRM MODAL ====================
function ConfirmModal({ show, title, message, icon, onConfirm, onCancel }) {
  if (!show) return null
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__icon">{icon || '🤔'}</div>
        <div className="modal__title">{title}</div>
        <div className="modal__message">{message}</div>
        <div className="modal__actions">
          <button className="modal__btn modal__btn--cancel" onClick={onCancel}>Batal</button>
          <button className="modal__btn modal__btn--confirm" onClick={onConfirm}>Ya, Hapus</button>
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN APP ====================
function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedUser, setSelectedUser] = useState('ferdy')
  const [customUser, setCustomUser] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('uang')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [txType, setTxType] = useState('deposit')
  const [filterUser, setFilterUser] = useState('all')
  const [toasts, setToasts] = useState([])
  const [confirmModal, setConfirmModal] = useState({ show: false })

  // Fetch transactions from Supabase on mount
  const fetchTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      const mapped = (data || []).map(row => ({
        id: row.id,
        user: row.user_name,
        amount: Number(row.amount),
        product: row.product || 'uang',
        type: row.type,
        note: row.note || '',
        date: row.created_at,
      }))
      setTransactions(mapped)
    } catch (err) {
      console.error('Gagal ambil data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const showToast = useCallback((message, type = 'success') => {
    const id = generateId()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const getActiveUserName = () => {
    if (selectedUser === 'other') return customUser.trim()
    const found = DEFAULT_USERS.find(u => u.id === selectedUser)
    return found ? found.name : ''
  }

  // Computed stats (only for "uang" product since other products have different units)
  const uangTransactions = transactions.filter(t => (t.product || 'uang') === 'uang')
  const totalSaldo = uangTransactions.reduce((sum, t) => sum + (t.type === 'deposit' ? t.amount : -t.amount), 0)
  const totalDeposit = uangTransactions.reduce((sum, t) => sum + (t.type === 'deposit' ? t.amount : 0), 0)
  const totalWithdraw = uangTransactions.reduce((sum, t) => sum + (t.type === 'withdraw' ? t.amount : 0), 0)
  const totalTransactions = transactions.length

  // Per-user balances (uang only for the summary)
  const userBalances = {}
  uangTransactions.forEach(t => {
    if (!userBalances[t.user]) userBalances[t.user] = { total: 0, count: 0 }
    userBalances[t.user].total += t.type === 'deposit' ? t.amount : -t.amount
    userBalances[t.user].count += 1
  })
  // Also count non-uang transactions
  transactions.filter(t => (t.product || 'uang') !== 'uang').forEach(t => {
    if (!userBalances[t.user]) userBalances[t.user] = { total: 0, count: 0 }
    userBalances[t.user].count += 1
  })

  const filteredTransactions = filterUser === 'all'
    ? [...transactions].reverse()
    : [...transactions].filter(t => t.user === filterUser).reverse()

  const allUsers = [...new Set(transactions.map(t => t.user))]

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userName = getActiveUserName()
    if (!userName) {
      showToast('Pilih atau ketik nama dulu ya!', 'error')
      return
    }

    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) {
      showToast('Masukkan jumlah yang valid ya!', 'error')
      return
    }

    if (txType === 'withdraw' && selectedProduct === 'uang') {
      const currentBalance = (userBalances[userName]?.total || 0)
      if (numAmount > currentBalance) {
        showToast(`Saldo uang ${userName} tidak cukup! (Saldo: ${formatRupiah(currentBalance)})`, 'error')
        return
      }
    }

    const productInfo = getProductInfo(selectedProduct)

    // Insert to Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_name: userName,
        amount: numAmount,
        product: selectedProduct,
        type: txType,
        note: note.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error('Gagal simpan:', error)
      showToast('Gagal menyimpan! Coba lagi ya.', 'error')
      return
    }

    // Add to local state
    const newTx = {
      id: data.id,
      user: data.user_name,
      amount: Number(data.amount),
      product: data.product,
      type: data.type,
      note: data.note || '',
      date: data.created_at,
    }

    setTransactions(prev => [...prev, newTx])
    setAmount('')
    setNote('')

    const formattedAmt = formatAmount(numAmount, selectedProduct)
    if (txType === 'deposit') {
      showToast(`${userName} berhasil nabung ${productInfo.emoji} ${formattedAmt}!`, 'success')
    } else {
      showToast(`${userName} tarik ${productInfo.emoji} ${formattedAmt}`, 'info')
    }
  }

  const handleDelete = (tx) => {
    const productInfo = getProductInfo(tx.product || 'uang')
    setConfirmModal({
      show: true,
      title: 'Hapus Transaksi?',
      message: `Yakin mau hapus transaksi ${tx.type === 'deposit' ? 'nabung' : 'tarik'} ${productInfo.emoji} ${formatAmount(tx.amount, tx.product || 'uang')} oleh ${tx.user}?`,
      icon: '🗑️',
      onConfirm: async () => {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', tx.id)

        if (error) {
          console.error('Gagal hapus:', error)
          showToast('Gagal menghapus! Coba lagi.', 'error')
          setConfirmModal({ show: false })
          return
        }

        setTransactions(prev => prev.filter(t => t.id !== tx.id))
        setConfirmModal({ show: false })
        showToast('Transaksi berhasil dihapus', 'info')
      },
    })
  }

  const handleAmountChange = (e) => {
    if (selectedProduct === 'uang') {
      const val = e.target.value.replace(/\D/g, '')
      setAmount(val)
    } else if (selectedProduct === 'emas') {
      // Allow decimals for gold
      const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.')
      setAmount(val)
    } else {
      const val = e.target.value.replace(/\D/g, '')
      setAmount(val)
    }
  }

  const currentProduct = getProductInfo(selectedProduct)

  // Rotating tagline
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [taglineKey, setTaglineKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(prev => (prev + 1) % TAGLINES.length)
      setTaglineKey(prev => prev + 1) // force re-render for animation
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app">
      {/* Floating Background */}
      <FloatingBackground />

      <Toast toasts={toasts} />

      <ConfirmModal
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        icon={confirmModal.icon}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ show: false })}
      />

      {/* Header */}
      <header className="header">
        <div className="header__icon">🐈</div>
        <h1 className="header__title">Celengan Yuk!</h1>
        <p className="header__subtitle">
          <span className="header__tagline" key={taglineKey}>
            {TAGLINES[taglineIndex]}
          </span>
        </p>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-card__label">💰 Saldo Uang</div>
          <div className={`stat-card__value ${totalSaldo >= 0 ? 'stat-card__value--accent' : ''}`}>
            {formatRupiah(totalSaldo)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">📥 Total Nabung</div>
          <div className="stat-card__value stat-card__value--success">
            {formatRupiah(totalDeposit)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">📤 Total Tarik</div>
          <div className="stat-card__value" style={{ color: 'var(--accent-danger)' }}>
            {formatRupiah(totalWithdraw)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">📊 Transaksi</div>
          <div className="stat-card__value">{totalTransactions}x</div>
        </div>
      </div>

      {/* User Summary Cards */}
      {Object.keys(userBalances).length > 0 && (
        <div className="user-summaries">
          {Object.entries(userBalances).map(([name, data]) => (
            <div
              key={name}
              className="user-summary-card"
              onClick={() => setFilterUser(filterUser === name ? 'all' : name)}
              title={`Klik untuk filter transaksi ${name}`}
            >
              <div className="user-summary-card__header">
                <span className="user-summary-card__emoji">{getEmojiForUser(name)}</span>
                <div>
                  <div className="user-summary-card__name">{name}</div>
                  <div className="user-summary-card__count">{data.count} transaksi</div>
                </div>
              </div>
              <div className={`user-summary-card__balance ${data.total < 0 ? 'user-summary-card__balance--negative' : ''}`}>
                {formatRupiah(data.total)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Layout */}
      <div className="main-layout">
        {/* Form Card */}
        <div className="form-card">
          <div className="form-card__title">
            <span>🐈</span>
            {txType === 'deposit' ? 'Nabung Yuk!' : 'Tarik Dana'}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Type Toggle */}
            <div className="type-toggle">
              <button
                type="button"
                className={`type-toggle__btn ${txType === 'deposit' ? 'type-toggle__btn--active-deposit' : ''}`}
                onClick={() => setTxType('deposit')}
              >
                📥 Nabung
              </button>
              <button
                type="button"
                className={`type-toggle__btn ${txType === 'withdraw' ? 'type-toggle__btn--active-withdraw' : ''}`}
                onClick={() => setTxType('withdraw')}
              >
                📤 Tarik
              </button>
            </div>

            {/* User Selector */}
            <label className="section-label">Siapa yang mau {txType === 'deposit' ? 'nabung' : 'tarik'}?</label>
            <div className="user-selector">
              {DEFAULT_USERS.map(user => (
                <button
                  key={user.id}
                  type="button"
                  className={`user-chip ${selectedUser === user.id ? 'user-chip--active' : ''}`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.emoji} {user.name}
                </button>
              ))}
              <button
                type="button"
                className={`user-chip user-chip--other ${selectedUser === 'other' ? 'user-chip--active' : ''}`}
                onClick={() => setSelectedUser('other')}
              >
                ✏️ Lainnya
              </button>
            </div>

            {/* Custom User Input */}
            {selectedUser === 'other' && (
              <div className="input-group" style={{ animation: 'slideIn 0.3s ease' }}>
                <label className="input-group__label">Nama</label>
                <input
                  type="text"
                  className="input-group__field"
                  placeholder="Ketik nama..."
                  value={customUser}
                  onChange={e => setCustomUser(e.target.value)}
                  maxLength={30}
                  autoFocus
                />
              </div>
            )}

            {/* Product Selector */}
            <label className="section-label">Produk tabungan</label>
            <div className="product-selector">
              {PRODUCTS.map(product => (
                <button
                  key={product.id}
                  type="button"
                  className={`product-chip product-chip--${product.id} ${selectedProduct === product.id ? 'product-chip--active' : ''}`}
                  onClick={() => { setSelectedProduct(product.id); setAmount(''); }}
                >
                  <span className="product-chip__icon">{product.emoji}</span>
                  <span className="product-chip__label">{product.name}</span>
                </button>
              ))}
            </div>

            {/* Amount Input */}
            <div className="input-group">
              <label className="input-group__label">
                {txType === 'deposit' ? 'Mau nabung berapa?' : 'Mau tarik berapa?'}
              </label>
              {selectedProduct === 'uang' ? (
                <div className="input-group__prefix">
                  <input
                    type="text"
                    className="input-group__field input-group__field--amount"
                    placeholder="0"
                    value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
                    onChange={handleAmountChange}
                    inputMode="numeric"
                  />
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    className="input-group__field input-group__field--amount"
                    placeholder={selectedProduct === 'emas' ? '0.00' : '0'}
                    value={amount}
                    onChange={handleAmountChange}
                    inputMode={selectedProduct === 'emas' ? 'decimal' : 'numeric'}
                  />
                  {currentProduct.unit && (
                    <div className="input-group__unit">Satuan: {currentProduct.unit}</div>
                  )}
                </>
              )}
            </div>

            {/* Quick Amounts - Only for Uang */}
            {selectedProduct === 'uang' && (
              <div className="quick-amounts">
                <span className="quick-amounts__label">Pilih cepat:</span>
                {QUICK_AMOUNTS.map(qa => (
                  <button
                    key={qa}
                    type="button"
                    className="quick-amount-btn"
                    onClick={() => setAmount(String(qa))}
                  >
                    {qa >= 1000 ? `${qa / 1000}rb` : qa}
                  </button>
                ))}
              </div>
            )}

            {/* Note */}
            <div className="input-group">
              <label className="input-group__label">Catatan (opsional)</label>
              <textarea
                className="input-group__field note-field"
                placeholder={
                  selectedProduct === 'emas' ? 'Beli emas 24 karat...' :
                  selectedProduct === 'perhiasan' ? 'Cincin emas putih...' :
                  'Nabung dari sisa jajan...'
                }
                value={note}
                onChange={e => setNote(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={!amount || (selectedUser === 'other' && !customUser.trim())}
            >
              {txType === 'deposit'
                ? `${currentProduct.emoji} Tabung ${currentProduct.name} Sekarang!`
                : `📤 Tarik ${currentProduct.name} Sekarang!`
              }
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="history-section">
          <div className="history-section__header">
            <div className="history-section__title">
              <span>📋</span>
              Riwayat Transaksi
            </div>

            {allUsers.length > 0 && (
              <div className="filter-tabs">
                <button
                  className={`filter-tab ${filterUser === 'all' ? 'filter-tab--active' : ''}`}
                  onClick={() => setFilterUser('all')}
                >
                  Semua
                </button>
                {allUsers.map(u => (
                  <button
                    key={u}
                    className={`filter-tab ${filterUser === u ? 'filter-tab--active' : ''}`}
                    onClick={() => setFilterUser(u)}
                  >
                    {getEmojiForUser(u)} {u}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🐈</div>
              <div className="empty-state__text">Belum ada transaksi nih...</div>
              <div className="empty-state__subtext">Yuk mulai nabung sekarang! Semangat! 💪</div>
            </div>
          ) : (
            <div className="transaction-list">
              {filteredTransactions.map(tx => {
                const txProduct = getProductInfo(tx.product || 'uang')
                return (
                  <div key={tx.id} className="transaction-item">
                    <div className={`transaction-item__avatar transaction-item__avatar--${tx.type}`}>
                      {txProduct.emoji}
                    </div>
                    <div className="transaction-item__info">
                      <div className="transaction-item__name">
                        {getEmojiForUser(tx.user)} {tx.user}
                      </div>
                      <div className="transaction-item__meta">
                        <span className={`transaction-item__product-badge transaction-item__product-badge--${tx.product || 'uang'}`}>
                          {txProduct.emoji} {txProduct.name}
                        </span>
                        <span>{formatDateShort(tx.date)}</span>
                      </div>
                      {tx.note && (
                        <div className="transaction-item__note">"{tx.note}"</div>
                      )}
                    </div>
                    <div>
                      <div className={`transaction-item__amount transaction-item__amount--${tx.type}`}>
                        {tx.type === 'deposit' ? '+' : '-'}{formatAmount(tx.amount, tx.product || 'uang')}
                      </div>
                      <div className="transaction-item__amount-sub">
                        {formatDate(tx.date)}
                      </div>
                    </div>
                    <button
                      className="transaction-item__delete"
                      onClick={() => handleDelete(tx)}
                      title="Hapus transaksi"
                    >
                      🗑️
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
