import { useState } from 'react'

interface CreateMarketModalProps {
  onClose: () => void
  onCreate: (data: {
    question: string
    description: string
    category: string
    endTime: number
    initialLiquidity: number
  }) => void
  userBalance: number
}

export function CreateMarketModal({ onClose, onCreate, userBalance }: CreateMarketModalProps) {
  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Crypto')
  const [endDate, setEndDate] = useState('')
  const [initialLiquidity, setInitialLiquidity] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question || !description || !endDate || !initialLiquidity) return

    const liquidity = parseFloat(initialLiquidity)
    if (liquidity > userBalance) {
      alert('Insufficient balance')
      return
    }

    setLoading(true)
    try {
      await onCreate({
        question,
        description,
        category,
        endTime: new Date(endDate).getTime(),
        initialLiquidity: liquidity
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create Market</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Question</label>
            <input
              type="text"
              className="form-input"
              placeholder="Will X happen by Y date?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Explain the resolution criteria..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="Crypto">Crypto</option>
              <option value="Tech">Tech</option>
              <option value="Politics">Politics</option>
              <option value="Sports">Sports</option>
              <option value="AI">AI</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="datetime-local"
              className="form-input"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Liquidity</label>
            <div className="amount-input-wrapper">
              <input
                type="number"
                className="form-input"
                placeholder="1000"
                value={initialLiquidity}
                onChange={e => setInitialLiquidity(e.target.value)}
                min="100"
                required
              />
              <span className="amount-suffix">tokens</span>
            </div>
            <small style={{ color: 'var(--gray-500)', marginTop: '0.5rem', display: 'block' }}>
              Available: {userBalance.toLocaleString()} tokens
            </small>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? <span className="loading-spinner" /> : 'Create Market'}
          </button>
        </form>
      </div>
    </div>
  )
}
