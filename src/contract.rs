#![cfg_attr(target_arch = "wasm32", no_main)]

use linera_sdk::{
    linera_base_types::WithContractAbi,
    Contract, ContractRuntime,
};
use prediction_market::{Operation, Message, PredictionMarketAbi};

linera_sdk::contract!(PredictionMarketContract);

pub struct PredictionMarketContract {
    runtime: ContractRuntime<Self>,
}

impl WithContractAbi for PredictionMarketContract {
    type Abi = PredictionMarketAbi;
}

impl Contract for PredictionMarketContract {
    type Message = Message;
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        PredictionMarketContract { runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {}

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::CreateMarket { .. } => {}
            Operation::PlaceBet { .. } => {}
            Operation::ResolveMarket { .. } => {}
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(self) {}
}
