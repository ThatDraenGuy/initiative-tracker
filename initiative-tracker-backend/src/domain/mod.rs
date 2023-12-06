pub mod ability;
pub mod conditions;
pub mod pagination;
pub mod sort;

use actix_web::web;

pub fn configure_domain(cfg: &mut web::ServiceConfig) {
    ability::handler::configure(cfg);
}
