use actix_web::ResponseError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error(transparent)]
    PoolError(#[from] deadpool_postgres::PoolError),
    #[error(transparent)]
    PostgresError(#[from] tokio_postgres::Error),
    #[error(transparent)]
    PgMapError(#[from] tokio_pg_mapper::Error),
    #[error("invalid return count")] //TODO
    InvalidReturnCount,
}

impl ResponseError for AppError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        match *self {
            AppError::PoolError(_)
            | AppError::PostgresError(_)
            | AppError::PgMapError(_)
            | AppError::InvalidReturnCount => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}
