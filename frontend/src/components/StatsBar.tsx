interface StatsBarProps {
  totalMarkets: number
  activeMarkets: number
  totalLiquidity: number
  userBalance: number
}

export function StatsBar({ totalMarkets, activeMarkets, totalLiquidity, userBalance }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-label">Total Markets</div>
        <div className="stat-value">{totalMarkets}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Active Markets</div>
        <div className="stat-value accent">{activeMarkets}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Liquidity</div>
        <div className="stat-value">{totalLiquidity.toLocaleString()}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Your Balance</div>
        <div className="stat-value">{userBalance.toLocaleString()}</div>
      </div>
    </div>
  )
}
