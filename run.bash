#!/usr/bin/env bash
set -eu

eval "$(linera net helper)"
linera_spawn linera net up --with-faucet

export LINERA_FAUCET_URL=http://localhost:8080
linera wallet init --faucet="$LINERA_FAUCET_URL"
linera wallet request-chain --faucet="$LINERA_FAUCET_URL"

# Build the prediction market
echo "Building Prediction Market..."
cargo build --release --target wasm32-unknown-unknown

# Deploy the application
echo "Deploying Prediction Market..."
APP_ID=$(linera publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_contract.wasm \
  target/wasm32-unknown-unknown/release/prediction_market_service.wasm)

echo "Application deployed with ID: $APP_ID"

# Start the node service
echo "Starting Linera service..."
linera service --port 8081 &

# Wait for service to start
sleep 5

# Get chain ID
CHAIN_ID=$(linera wallet show | grep -oP '[a-f0-9]{64}' | head -1)

echo ""
echo "============================================"
echo "🔮 Prediction Market Deployed!"
echo "============================================"
echo "Chain ID: $CHAIN_ID"
echo "App ID: $APP_ID"
echo "GraphQL: http://localhost:8081/chains/$CHAIN_ID/applications/$APP_ID"
echo "============================================"

# Start frontend
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
