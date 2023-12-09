pub mod ability;
pub mod battle;
pub mod character;
pub mod creature_type;
pub mod player;
pub mod stat_block;

use actix_web::{web, HttpResponse, Responder};
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgRow, FromRow, Row};

pub fn configure_domain(cfg: &mut web::ServiceConfig) {
    ability::handler::configure(cfg);
    battle::handler::configure(cfg);
    character::handler::configure(cfg);
    player::handler::configure(cfg);
}

#[derive(Serialize)]
pub struct PageResponse<T: Serialize> {
    total: i64,
    items: Vec<T>,
}
impl<T: Serialize> PageResponse<T> {
    pub fn new(items: Vec<T>, total: Count) -> Self {
        Self {
            total: total.count,
            items,
        }
    }
    pub fn map_into<F: From<T> + Serialize>(self) -> PageResponse<F> {
        PageResponse {
            total: self.total,
            items: self.items.into_iter().map_into().collect_vec(),
        }
    }
}
impl<T: Serialize> Responder for PageResponse<T> {
    type Body = actix_web::body::BoxBody;

    fn respond_to(self, _req: &actix_web::HttpRequest) -> HttpResponse<Self::Body> {
        HttpResponse::Ok().json(self)
    }
}
pub struct Count {
    count: i64,
}

pub trait HasId {
    fn id_col() -> &'static str;
}

#[derive(Serialize, Deserialize)]
pub struct Nullable<T: Serialize>(pub Option<T>);
impl<'r, T: HasId + FromRow<'r, PgRow> + Serialize> FromRow<'r, PgRow> for Nullable<T> {
    fn from_row(row: &'r PgRow) -> Result<Self, sqlx::Error> {
        Ok(Nullable(
            match row.try_get::<'r, Option<i64>, _>(T::id_col()) {
                Ok(field) => match field {
                    Some(_) => Some(T::from_row(row)?),
                    None => None,
                },
                Err(e) => return Err(e),
            },
        ))
    }
}
impl<T: Serialize> Nullable<T> {
    pub fn convert<F: From<T>>(self) -> Option<F> {
        self.0.map(F::from)
    }
}
