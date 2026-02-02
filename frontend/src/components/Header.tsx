interface HeaderProps {
  balance: number
  walletAddress: string | null
  onCreateMarket: () => void
  onConnectWallet?: () => void
  connecting?: boolean
}

export function Header({ balance, walletAddress, onCreateMarket, onConnectWallet, connecting }: HeaderProps) {
  return (
    <header className="nav-header">
      <a href="/" className="logo">
        <span className="logo-icon">🔮</span>
        Linera Predict
      </a>
      <nav className="nav-actions">
        {walletAddress ? (
          <>
            <span className="wallet-badge">
              {walletAddress} • {balance.toLocaleString()} tokens
            </span>
            <button className="btn btn-primary" onClick={onCreateMarket}>
              + Create Market
            </button>
          </>
        ) : (
          <button 
            className="btn btn-connect" 
            onClick={onConnectWallet}
            disabled={connecting}
          >
            {connecting ? '🔄 Connecting...' : '🔗 Connect Wallet'}
          </button>
        )}
      </nav>
    </header>
  )
}
