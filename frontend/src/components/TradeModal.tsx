import { useState, useMemo } from 'react'
import { Market, Position } from '../utils/types'

interface TradeModalProps {
  market: Market
  position?: Position
  userBalance: number
  onClose: () => void
  onTrade: (marketId: number, side: 'yes' | 'no', amount: number) => void
}

export function TradeModal({ market, position, userBalance, onClose, onTrade }: TradeModalProps) {
  const [side, setSide] = useState<'yes' | 'no'>('yes')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const amountNum = parseFloat(amount) || 0

  const preview = useMemo(() => {
    if (amountNum <= 0) return null

    const fee = amountNum * 0.003
    const amountAfterFee = amountNum - fee
    const price = side === 'yes' ? market.yesPrice : market.noPrice
    const shares = amountAfterFee / price * 0.95
    const avgPrice = amountNum / shares

    return {
      shares: shares.toFixed(4),
      avgPrice: avgPrice.toFixed(4),
      fee: fee.toFixed(4),
      maxPayout: shares.toFixed(4)
    }
  }, [amountNum, side, market])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (amountNum <= 0 || amountNum > userBalance) return

    setLoading(true)
    try {
      await onTrade(market.id, side, amountNum)
    } finally {
      setLoading(false)
    }
  }

  const setMaxAmount = () => {
    setAmount(userBalance.toString())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Trade</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <p style={{ marginBottom: '1.5rem', color: 'var(--gray-600)' }}>
            {market.question}
          </p>

          <div className="trade-tabs">
            <button
              type="button"
              className={`trade-tab yes ${side === 'yes' ? 'active' : ''}`}
              onClick={() => setSide('yes')}
            >
              Buy YES @ ${market.yesPrice.toFixed(2)}
            </button>
            <button
              type="button"
              className={`trade-tab no ${side === 'no' ? 'active' : ''}`}
              onClick={() => setSide('no')}
            >
              Buy NO @ ${market.noPrice.toFixed(2)}
            </button>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Amount</label>
              <button 
                type="button" 
                onClick={setMaxAmount}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--linera-red)', 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Max
              </button>
            </div>
            <div className="amount-input-wrapper">
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
              <span className="amount-suffix">tokens</span>
            </div>
            <small style={{ color: 'var(--gray-500)', marginTop: '0.5rem', display: 'block' }}>
              Balance: {userBalance.toLocaleString()} tokens
            </small>
          </div>

          {preview && (
            <div className="trade-preview">
              <div className="trade-preview-row">
                <span className="trade-preview-label">Est. Shares</span>
                <span className="trade-preview-value">{preview.shares}</span>
              </div>
              <div className="trade-preview-row">
                <span className="trade-preview-label">Avg Price</span>
                <span className="trade-preview-value">${preview.avgPrice}</span>
              </div>
              <div className="trade-preview-row">
                <span className="trade-preview-label">Fee (0.3%)</span>
                <span className="trade-preview-value">{preview.fee}</span>
              </div>
              <div className="trade-preview-row">
                <span className="trade-preview-label">Max Payout</span>
                <span className="trade-preview-value">{preview.maxPayout}</span>
              </div>
            </div>
          )}

          {position && (position.yesShares > 0 || position.noShares > 0) && (
            <div className="position-card">
              <div className="position-title">Current Position</div>
              {position.yesShares > 0 && (
                <div className="position-row">
                  <span>YES shares</span>
                  <span>{position.yesShares.toFixed(2)}</span>
                </div>
              )}
              {position.noShares > 0 && (
                <div className="position-row">
                  <span>NO shares</span>
                  <span>{position.noShares.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className={`btn ${side === 'yes' ? 'btn-success' : 'btn-primary'} btn-lg`}
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading || amountNum <= 0 || amountNum > userBalance}
          >
            {loading ? (
              <span className="loading-spinner" />
            ) : (
              `Buy ${side.toUpperCase()}`
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
