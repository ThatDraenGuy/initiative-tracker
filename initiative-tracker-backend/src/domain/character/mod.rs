use serde::{Deserialize, Serialize};
use sqlx::FromRow;

use super::{player::Player, stat_block::StatBlock, Nullable};

pub mod actions;
pub mod handler;

#[derive(Serialize, Deserialize, FromRow)]
pub struct Character {
    pub character_id: i64,
    #[sqlx(flatten)]
    pub player: Nullable<Player>,
    #[sqlx(flatten)]
    pub stat_block: StatBlock,
}
