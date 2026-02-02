# 🔮 Linera Prediction Market

A decentralized prediction market built on Linera blockchain for the Buildathon.

## Features

- **Create Markets**: Create prediction markets with yes/no outcomes
- **Place Bets**: Bet on market outcomes
- **Resolve Markets**: Resolve markets with final outcomes
- **GraphQL API**: Query market data via GraphQL

## Tech Stack

- **Smart Contract**: Rust + Linera SDK 0.15
- **API**: GraphQL (async-graphql)
- **Frontend**: HTML/CSS/JavaScript
- **Blockchain**: Linera Protocol (Conway Testnet)

## Linera SDK Features Used

- `linera-sdk` for contract and service development
- `async-graphql` for GraphQL service
- MapView for storing markets
- Cross-chain messaging support

## Project Structure
```
prediction-market/
├── src/
│   ├── lib.rs          # ABI definitions
│   ├── contract.rs     # Smart contract logic
│   └── service.rs      # GraphQL service
├── frontend/
│   └── index.html      # Web UI
├── Cargo.toml
├── Dockerfile
├── compose.yaml
├── run.bash
└── README.md
```

## Running Locally (Docker)
```bash
docker compose up --force-recreate
```

Then open http://localhost:5173

## Manual Setup

1. Start local network:
```bash
eval "$(linera net helper)"
linera_spawn linera net up --with-faucet
```

2. Initialize wallet:
```bash
linera wallet init --faucet=http://localhost:8080
linera wallet request-chain --faucet=http://localhost:8080
```

3. Build and deploy:
```bash
cargo build --release --target wasm32-unknown-unknown
linera publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_contract.wasm \
  target/wasm32-unknown-unknown/release/prediction_market_service.wasm
```

4. Start service:
```bash
linera service --port 8081
```

## GraphQL API

Query market count:
```graphql
query {
  marketCount
}
```

## Testnet Deployment

- **Network**: Conway Testnet
- **Chain ID**: e74ef72d6db958fb1e4ab9513a84ee5d06f51f331a2b90e9c215181b369d989d
- **App ID**: c4d1219ff690252052161801496c810f29552b4d5250dbe662224b281e0657d6

## Team

- **Name**: [Gani]
- **Discord**: [cryptofav]
- **Wallet**: 0x87ECEbbE008c66eE0a45b4F2051Fe8e17f9afc1D

## Changelog

### Wave 6
- Initial submission
- Smart contract with CreateMarket, PlaceBet, ResolveMarket operations
- GraphQL service for querying market data
- Frontend UI for market interaction
- Deployed on Conway Testnet

## License

Apache-2.0
