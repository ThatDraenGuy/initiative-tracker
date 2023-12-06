mod domain;
mod errors;
mod sql;

use ::config::Config;
use actix_web::{web, App, HttpServer};
use config::AppConfig;
use domain::configure_domain;
use dotenvy::dotenv;
use tokio_postgres::NoTls;

mod config {
    use serde::Deserialize;

    #[derive(Debug, Default, Deserialize)]
    pub struct AppConfig {
        pub port: Option<u16>,
        pub pg: deadpool_postgres::Config,
    }
}

type DbPool = deadpool_postgres::Pool;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let config = Config::builder()
        .add_source(::config::Environment::default().separator("."))
        .build()
        .unwrap();

    let config: AppConfig = config.try_deserialize().unwrap();

    let pool = config.pg.create_pool(None, NoTls).unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(web::scope("/api").configure(configure_domain))
    })
    .bind(("127.0.0.1", config.port.unwrap_or(8080)))?
    .run()
    .await
}
