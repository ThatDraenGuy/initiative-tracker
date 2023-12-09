use serde::{Deserialize, Serialize};
use sqlx::FromRow;

use super::HasId;

pub mod actions;
pub mod handler;

#[derive(Serialize, Deserialize, FromRow)]
pub struct Player {
    player_id: i64,
    player_name: String,
}
impl HasId for Player {
    fn id_col() -> &'static str {
        "player_id"
    }
}
