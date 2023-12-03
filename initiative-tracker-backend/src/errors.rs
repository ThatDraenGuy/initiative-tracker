use actix_web::ResponseError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error(transparent)]
    PoolError(#[from] r2d2::Error),
    #[error(transparent)]
    DbError(#[from] diesel::result::Error),
}

impl ResponseError for AppError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        match *self {
            AppError::PoolError(_) | AppError::DbError(_) => {
                actix_web::http::StatusCode::INTERNAL_SERVER_ERROR
            }
        }
    }
}
