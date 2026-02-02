import { useState } from 'react'

const CHAIN_ID = 'e74ef72d6db958fb1e4ab9513a84ee5d06f51f331a2b90e9c215181b369d989d'
const APP_ID = 'c4d1219ff690252052161801496c810f29552b4d5250dbe662224b281e0657d6'

interface LineraClient {
  query: (query: string) => Promise<any>
  mutate: (operation: any) => Promise<any>
}

export function useLinera() {
  const [client, setClient] = useState<LineraClient | null>(null)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  const connect = async () => {
    setConnecting(true)
    
    // Simulate wallet connection with delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate a realistic looking wallet address
    const address = '0x' + CHAIN_ID.slice(0, 8) + '...' + CHAIN_ID.slice(-6)
    
    const lineraClient: LineraClient = {
      query: async (query: string) => {
        console.log('GraphQL Query:', query)
        // Return mock data for demo
        if (query.includes('marketCount')) {
          return { data: { marketCount: 2 } }
        }
        return { data: {} }
      },
      mutate: async (operation: any) => {
        console.log('Mutation:', operation)
        return { success: true }
      }
    }

    setClient(lineraClient)
    setConnected(true)
    setWalletAddress(address)
    setChainId(CHAIN_ID)
    setConnecting(false)
    
    console.log('✅ Connected to Linera Testnet Conway')
    console.log('Chain ID:', CHAIN_ID)
    console.log('App ID:', APP_ID)
  }

  const disconnect = () => {
    setConnected(false)
    setWalletAddress(null)
    setClient(null)
    setChainId(null)
  }

  return {
    client,
    connected,
    walletAddress,
    chainId,
    connect,
    disconnect,
    connecting
  }
}
