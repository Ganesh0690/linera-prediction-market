#![cfg_attr(target_arch = "wasm32", no_main)]

use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{linera_base_types::WithServiceAbi, Service, ServiceRuntime};

linera_sdk::service!(PredictionMarketService);

pub struct PredictionMarketService {
    market_count: u64,
}

impl WithServiceAbi for PredictionMarketService {
    type Abi = prediction_market::PredictionMarketAbi;
}

impl Service for PredictionMarketService {
    type Parameters = ();

    async fn new(_runtime: ServiceRuntime<Self>) -> Self {
        PredictionMarketService { market_count: 0 }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            QueryRoot { market_count: self.market_count },
            MutationRoot,
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

struct QueryRoot {
    market_count: u64,
}

#[Object]
impl QueryRoot {
    async fn market_count(&self) -> u64 {
        self.market_count
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn placeholder(&self) -> bool {
        true
    }
}
