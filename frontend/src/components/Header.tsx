interface HeaderProps {
  balance: number
  walletAddress: string | null
  onCreateMarket: () => void
}

export function Header({ balance, walletAddress, onCreateMarket }: HeaderProps) {
  return (
    <header className="nav-header">
      <a href="/" className="logo">
        <span className="logo-icon">P</span>
        Predict
      </a>

      <nav className="nav-actions">
        {walletAddress && (
          <span className="wallet-badge">
            {walletAddress} • {balance.toLocaleString()} tokens
          </span>
        )}
        <button className="btn btn-primary" onClick={onCreateMarket}>
          + Create Market
        </button>
      </nav>
    </header>
  )
}
