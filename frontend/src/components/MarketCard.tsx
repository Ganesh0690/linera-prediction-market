import { Market, Position } from '../utils/types'

interface MarketCardProps {
  market: Market
  position?: Position
  onTrade: () => void
}

export function MarketCard({ market, position, onTrade }: MarketCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const totalVolume = market.totalYesShares + market.totalNoShares

  return (
    <div className="market-card">
      <div className="market-header">
        <span className="market-category">{market.category}</span>
        <span className={`market-status ${market.status.toLowerCase()}`}>
          {market.status}
        </span>
      </div>

      <h3 className="market-question">{market.question}</h3>
      <p className="market-description">{market.description}</p>

      <div className="market-prices">
        <div className="price-box yes">
          <div className="price-label">Yes</div>
          <div className="price-value">${market.yesPrice.toFixed(2)}</div>
          <div className="price-percent">{(market.yesPrice * 100).toFixed(0)}% chance</div>
        </div>
        <div className="price-box no">
          <div className="price-label">No</div>
          <div className="price-value">${market.noPrice.toFixed(2)}</div>
          <div className="price-percent">{(market.noPrice * 100).toFixed(0)}% chance</div>
        </div>
      </div>

      {position && (position.yesShares > 0 || position.noShares > 0) && (
        <div className="position-card">
          <div className="position-title">Your Position</div>
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

      <div className="market-footer">
        <div className="market-meta">
          <span>📊 {totalVolume.toLocaleString()} volume</span>
          <span>⏰ {market.status === 'Active' ? `Ends ${formatDate(market.endTime)}` : `Ended ${formatDate(market.endTime)}`}</span>
          <span>🕐 Created {formatTimeAgo(market.createdAt)}</span>
        </div>
        <div className="market-actions">
          {market.status === 'Active' ? (
            <button className="btn btn-primary btn-sm" onClick={onTrade}>
              Trade
            </button>
          ) : market.outcome ? (
            <span className={`market-status ${market.outcome.toLowerCase()}`}>
              Resolved: {market.outcome}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
