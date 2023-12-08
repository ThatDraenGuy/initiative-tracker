use serde::{Deserialize, Serialize};
use sqlx::FromRow;

pub mod handler;

#[derive(Serialize, Deserialize, FromRow)]
pub struct CreatureType {
    pub creature_type_id: i64,
    pub creature_type_name: String,
}
