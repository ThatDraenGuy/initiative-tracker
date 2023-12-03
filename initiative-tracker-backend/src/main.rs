use ::config::Config;
use actix_web::{web, App, HttpServer};
use config::AppConfig;
use diesel::prelude::*;
use diesel::r2d2;
use domain::configure_domain;
use dotenvy::dotenv;

mod domain;
mod errors;
mod schema;

mod config {
    use serde::Deserialize;

    #[derive(Debug, Default, Deserialize)]
    pub struct AppConfig {
        pub port: Option<u16>,
        pub database_url: String,
    }
}

type DbPool = r2d2::Pool<r2d2::ConnectionManager<PgConnection>>;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let config: AppConfig = Config::builder()
        .add_source(::config::Environment::default().separator("."))
        .build()
        .unwrap()
        .try_deserialize()
        .unwrap();

    let pool = init_db_pool(config.database_url);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(web::scope("/api").configure(configure_domain))
    })
    .bind(("127.0.0.1", config.port.unwrap_or(8080)))?
    .run()
    .await
}

fn init_db_pool(db_url: String) -> DbPool {
    let manager = r2d2::ConnectionManager::<PgConnection>::new(db_url);
    r2d2::Pool::builder()
        .build(manager)
        .expect("database URL should be valid path to Postgres DB file")
}
