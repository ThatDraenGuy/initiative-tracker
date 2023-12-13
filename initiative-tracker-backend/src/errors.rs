use actix_web::ResponseError;
use thiserror::Error;

pub type AppResult<T> = Result<T, AppError>;

#[derive(Debug, Error)]
pub enum AppError {
    #[error(transparent)]
    SqlError(#[from] sqlx::Error),
    #[error("NOT FOUND")]
    NotFound,
}

impl ResponseError for AppError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        match *self {
            AppError::SqlError(_) => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
            AppError::NotFound => actix_web::http::StatusCode::NOT_FOUND,
        }
    }
}
