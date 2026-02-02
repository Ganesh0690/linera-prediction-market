use async_graphql::{Request, Response};
use linera_sdk::linera_base_types::{ContractAbi, ServiceAbi};
use serde::{Deserialize, Serialize};

pub struct PredictionMarketAbi;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Operation {
    CreateMarket { question: String, description: String },
    PlaceBet { market_id: u64, is_yes: bool },
    ResolveMarket { market_id: u64, outcome: bool },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Message {
    MarketCreated { market_id: u64 },
}

impl ContractAbi for PredictionMarketAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for PredictionMarketAbi {
    type Query = Request;
    type QueryResponse = Response;
}
