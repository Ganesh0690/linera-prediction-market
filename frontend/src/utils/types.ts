export interface Market {
  id: number
  question: string
  description: string
  creator: string
  endTime: number
  status: 'Active' | 'Paused' | 'Resolved' | 'Cancelled'
  yesPrice: number
  noPrice: number
  totalYesShares: number
  totalNoShares: number
  yesPool: number
  noPool: number
  outcome: 'Yes' | 'No' | null
  createdAt: number
  category: string
}

export interface Position {
  yesShares: number
  noShares: number
}

export interface CreateMarketData {
  question: string
  description: string
  category: string
  endTime: number
  initialLiquidity: number
}
