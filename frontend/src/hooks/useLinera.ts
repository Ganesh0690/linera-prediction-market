import { useState, useEffect } from 'react'

const CHAIN_ID = 'e74ef72d6db958fb1e4ab9513a84ee5d06f51f331a2b90e9c215181b369d989d'
const APP_ID = 'c4d1219ff690252052161801496c810f29552b4d5250dbe662224b281e0657d6'
const API_URL = `http://localhost:8080/chains/${CHAIN_ID}/applications/${APP_ID}`

interface LineraClient {
  query: (query: string) => Promise<any>
  mutate: (operation: any) => Promise<any>
}

export function useLinera() {
  const [client, setClient] = useState<LineraClient | null>(null)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)

  useEffect(() => {
    const initLinera = async () => {
      try {
        const lineraClient: LineraClient = {
          query: async (query: string) => {
            const response = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query })
            })
            return response.json()
          },
          mutate: async (operation: any) => {
            console.log('Mutation:', operation)
            return {}
          }
        }

        // Test connection
        const result = await lineraClient.query('{ marketCount }')
        console.log('Connected to Linera:', result)

        setClient(lineraClient)
        setConnected(true)
        setWalletAddress('0xc38bc5c3...757ff87')
        setChainId(CHAIN_ID)
      } catch (error) {
        console.error('Failed to initialize Linera client:', error)
        setConnected(false)
      }
    }

    initLinera()
  }, [])

  const connect = async () => {
    setConnected(true)
    setWalletAddress('0xc38bc5c3...757ff87')
  }

  const disconnect = () => {
    setConnected(false)
    setWalletAddress(null)
  }

  return {
    client,
    connected,
    walletAddress,
    chainId,
    connect,
    disconnect
  }
}
