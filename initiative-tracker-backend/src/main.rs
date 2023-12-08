mod domain;
mod errors;

use ::config::Config;
use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use config::AppConfig;
use domain::configure_domain;
use dotenvy::dotenv;
use sqlx::{pool::PoolOptions, Pool, Postgres};

mod config {
    use serde::Deserialize;

    #[derive(Debug, Default, Deserialize)]
    pub struct AppConfig {
        pub port: Option<u16>,
        pub database_url: String,
    }
}

type DbPool = Pool<Postgres>;

type ValidJson<T> = actix_web_validator::Json<T>;
type ValidQuery<T> = actix_web_validator::Query<T>;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let config = Config::builder()
        .add_source(::config::Environment::default().separator("."))
        .build()
        .unwrap();

    let config: AppConfig = config.try_deserialize().unwrap();

    let pool = PoolOptions::<Postgres>::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
        .unwrap();

    // sqlx::migrate!().run(&pool).await.unwrap();

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(pool.clone()))
            .service(web::scope("/api").configure(configure_domain))
    })
    .bind(("127.0.0.1", config.port.unwrap_or(8080)))?
    .run()
    .await
}
