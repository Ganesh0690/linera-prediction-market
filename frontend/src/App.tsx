import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { StatsBar } from './components/StatsBar'
import { MarketCard } from './components/MarketCard'
import { CreateMarketModal } from './components/CreateMarketModal'
import { TradeModal } from './components/TradeModal'
import { Toast, ToastContainer } from './components/Toast'
import { useLinera } from './hooks/useLinera'
import { Market, Position } from './utils/types'

export default function App() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [positions, setPositions] = useState<Record<number, Position>>({})
  const [balance, setBalance] = useState(0)
  const [totalLiquidity, setTotalLiquidity] = useState(0)
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([])
  const [loading, setLoading] = useState(true)

  const { client, connected, walletAddress } = useLinera()

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const mockMarkets: Market[] = [
        {
          id: 1,
          question: "Will Bitcoin reach $100,000 by end of 2026?",
          description: "This market resolves YES if BTC/USD reaches or exceeds $100,000 on any major exchange before January 1, 2027.",
          creator: "0x1234...5678",
          endTime: Date.now() + 86400000 * 30,
          status: 'Active',
          yesPrice: 0.65,
          noPrice: 0.35,
          totalYesShares: 15000,
          totalNoShares: 8000,
          yesPool: 10000,
          noPool: 10000,
          outcome: null,
          createdAt: Date.now() - 86400000 * 5,
          category: 'Crypto'
        },
        {
          id: 2,
          question: "Will Linera launch mainnet in Q1 2026?",
          description: "Resolves YES if Linera Protocol announces mainnet launch between January 1 and March 31, 2026.",
          creator: "0xabcd...efgh",
          endTime: Date.now() + 86400000 * 60,
          status: 'Active',
          yesPrice: 0.72,
          noPrice: 0.28,
          totalYesShares: 25000,
          totalNoShares: 10000,
          yesPool: 12000,
          noPool: 12000,
          outcome: null,
          createdAt: Date.now() - 86400000 * 2,
          category: 'Tech'
        },
        {
          id: 3,
          question: "Will AI models pass the Turing test by 2027?",
          description: "Resolves YES if a major AI lab announces an AI system that consistently passes the Turing test in controlled conditions.",
          creator: "0x9876...4321",
          endTime: Date.now() + 86400000 * 365,
          status: 'Active',
          yesPrice: 0.45,
          noPrice: 0.55,
          totalYesShares: 8000,
          totalNoShares: 10000,
          yesPool: 8000,
          noPool: 8000,
          outcome: null,
          createdAt: Date.now() - 86400000 * 10,
          category: 'AI'
        },
        {
          id: 4,
          question: "Did ETH 2.0 successfully merge?",
          description: "This market tracked whether Ethereum's proof-of-stake merge would complete successfully.",
          creator: "0x5555...6666",
          endTime: Date.now() - 86400000 * 100,
          status: 'Resolved',
          yesPrice: 1.0,
          noPrice: 0.0,
          totalYesShares: 50000,
          totalNoShares: 5000,
          yesPool: 0,
          noPool: 0,
          outcome: 'Yes',
          createdAt: Date.now() - 86400000 * 200,
          category: 'Crypto'
        }
      ]

      const mockPositions: Record<number, Position> = {
        1: { yesShares: 100, noShares: 50 },
        2: { yesShares: 200, noShares: 0 }
      }

      setMarkets(mockMarkets)
      setPositions(mockPositions)
      setBalance(10000)
      setTotalLiquidity(52000)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreateMarket = async (data: {
    question: string
    description: string
    category: string
    endTime: number
    initialLiquidity: number
  }) => {
    try {
      const newMarket: Market = {
        id: markets.length + 1,
        question: data.question,
        description: data.description,
        creator: walletAddress || '0x1234...5678',
        endTime: data.endTime,
        status: 'Active',
        yesPrice: 0.5,
        noPrice: 0.5,
        totalYesShares: 0,
        totalNoShares: 0,
        yesPool: data.initialLiquidity / 2,
        noPool: data.initialLiquidity / 2,
        outcome: null,
        createdAt: Date.now(),
        category: data.category
      }

      setMarkets(prev => [newMarket, ...prev])
      setBalance(prev => prev - data.initialLiquidity)
      setTotalLiquidity(prev => prev + data.initialLiquidity)
      setShowCreateModal(false)
      showToast('Market created successfully!')
    } catch (error) {
      showToast('Failed to create market', 'error')
    }
  }

  const handleTrade = async (
    marketId: number,
    side: 'yes' | 'no',
    amount: number
  ) => {
    try {
      const market = markets.find(m => m.id === marketId)
      if (!market) return

      const shares = amount * 0.95
      
      setMarkets(prev => prev.map(m => {
        if (m.id !== marketId) return m
        const newYesPool = side === 'yes' ? m.yesPool + amount : m.yesPool - shares * 0.5
        const newNoPool = side === 'no' ? m.noPool + amount : m.noPool - shares * 0.5
        const total = newYesPool + newNoPool
        return {
          ...m,
          yesPool: newYesPool,
          noPool: newNoPool,
          yesPrice: newNoPool / total,
          noPrice: newYesPool / total,
          totalYesShares: side === 'yes' ? m.totalYesShares + shares : m.totalYesShares,
          totalNoShares: side === 'no' ? m.totalNoShares + shares : m.totalNoShares
        }
      }))

      setPositions(prev => ({
        ...prev,
        [marketId]: {
          yesShares: (prev[marketId]?.yesShares || 0) + (side === 'yes' ? shares : 0),
          noShares: (prev[marketId]?.noShares || 0) + (side === 'no' ? shares : 0)
        }
      }))

      setBalance(prev => prev - amount)
      setSelectedMarket(null)
      showToast(`Bought ${shares.toFixed(2)} ${side.toUpperCase()} shares!`)
    } catch (error) {
      showToast('Trade failed', 'error')
    }
  }

  const filteredMarkets = markets.filter(m => 
    activeTab === 'active' ? m.status === 'Active' : m.status === 'Resolved'
  )

  return (
    <div className="app-container">
      <Header 
        balance={balance} 
        walletAddress={walletAddress}
        onCreateMarket={() => setShowCreateModal(true)}
      />
      
      <Hero />
      
      <main className="main-content">
        <StatsBar 
          totalMarkets={markets.length}
          activeMarkets={markets.filter(m => m.status === 'Active').length}
          totalLiquidity={totalLiquidity}
          userBalance={balance}
        />

        <div className="section-header">
          <h2 className="section-title">Markets</h2>
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button 
              className={`tab ${activeTab === 'resolved' ? 'active' : ''}`}
              onClick={() => setActiveTab('resolved')}
            >
              Resolved
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" />
          </div>
        ) : filteredMarkets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-title">No {activeTab} markets</div>
            <p>Be the first to create a prediction market!</p>
          </div>
        ) : (
          <div className="markets-grid">
            {filteredMarkets.map(market => (
              <MarketCard
                key={market.id}
                market={market}
                position={positions[market.id]}
                onTrade={() => setSelectedMarket(market)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        Built on <a href="https://linera.io" target="_blank" rel="noopener">Linera</a> — 
        The next-generation infrastructure for real-time on-chain applications.
      </footer>

      {showCreateModal && (
        <CreateMarketModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateMarket}
          userBalance={balance}
        />
      )}

      {selectedMarket && (
        <TradeModal
          market={selectedMarket}
          position={positions[selectedMarket.id]}
          userBalance={balance}
          onClose={() => setSelectedMarket(null)}
          onTrade={handleTrade}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
