use actix_web::HttpResponse;
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Deserialize, Validate)]
pub struct PageRequest {
    offset: Option<i32>,
    limit: Option<i32>,
}
impl PageRequest {
    pub fn apply(&self, stmt: &str) -> String {
        let stmt = if let Some(lim) = self.limit {
            stmt.replace("$lim", &lim.to_string())
        } else {
            stmt.replace("$lim", "ALL")
        };

        stmt.replace("$offset", &self.offset.unwrap_or(0).to_string())
    }
}

#[derive(Serialize)]
pub struct PageResponse<T: Serialize> {
    total: i64,
    items: Vec<T>,
}

impl<T: Serialize> From<PageResponse<T>> for HttpResponse {
    fn from(value: PageResponse<T>) -> Self {
        HttpResponse::Ok().json(value)
    }
}

impl<T: Serialize> PageResponse<T> {
    pub fn new(items: Vec<T>, total: Count) -> Self {
        Self {
            total: total.0,
            items,
        }
    }
    pub fn map<F: From<T> + Serialize>(self) -> PageResponse<F> {
        PageResponse {
            total: self.total,
            items: self.items.into_iter().map_into().collect_vec(),
        }
    }
}

#[derive(pg_mapper::TryFromRow)]
pub struct Count(i64);
