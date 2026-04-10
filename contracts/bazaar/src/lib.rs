#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Service {
    pub id: u32,
    pub provider: Address,
    pub category: Symbol,
    pub name: Symbol,
    pub price: u128,
    pub service_type: u32, // 0: x402, 1: MPP
    pub endpoint: String,
    pub reputation: u32,
    pub total_calls: u32,
    pub successful_calls: u32,
}

#[contract]
pub struct BazaarContract;

#[contractimpl]
impl BazaarContract {
    pub fn list_service(
        env: Env,
        provider: Address,
        category: Symbol,
        name: Symbol,
        price: u128,
        service_type: u32,
        endpoint: String,
    ) -> u32 {
        provider.require_auth();

        let mut services: Vec<Service> = env.storage().instance().get(&symbol_short!("SVC")).unwrap_or(Vec::new(&env));
        let id = services.len();

        let new_service = Service {
            id,
            provider,
            category,
            name,
            price,
            service_type,
            endpoint,
            reputation: 100, // Start with neutral reputation
            total_calls: 0,
            successful_calls: 0,
        };

        services.push_back(new_service);
        env.storage().instance().set(&symbol_short!("SVC"), &services);

        id
    }

    pub fn get_services_by_category(env: Env, category: Symbol) -> Vec<Service> {
        let services: Vec<Service> = env.storage().instance().get(&symbol_short!("SVC")).unwrap_or(Vec::new(&env));
        let mut result = Vec::new(&env);

        for service in services.iter() {
            if service.category == category {
                result.push_back(service);
            }
        }

        result
    }

    pub fn update_reputation(env: Env, id: u32, success: bool) {
        // In a real system, we'd limit who can call this (e.g., a "Trust Agent" or the system itself)
        let mut services: Vec<Service> = env.storage().instance().get(&symbol_short!("SVC")).unwrap_or(Vec::new(&env));
        
        if let Some(mut service) = services.get(id) {
            service.total_calls += 1;
            if success {
                service.successful_calls += 1;
            }
            
            // Calculate reputation (simple success rate %)
            service.reputation = (service.successful_calls * 100) / service.total_calls;
            
            services.set(id, service);
            env.storage().instance().set(&symbol_short!("SVC"), &services);
        }
    }

    pub fn get_service(env: Env, id: u32) -> Option<Service> {
        let services: Vec<Service> = env.storage().instance().get(&symbol_short!("SVC")).unwrap_or(Vec::new(&env));
        services.get(id)
    }
}

mod test;
