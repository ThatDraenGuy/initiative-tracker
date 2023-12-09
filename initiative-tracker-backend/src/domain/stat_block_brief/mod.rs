use serde::{Deserialize, Serialize};
use sqlx::FromRow;

use super::creature_type::CreatureType;

pub mod actions;
pub mod handler;

#[derive(Serialize, Deserialize, FromRow)]
pub struct StatBlockBrief {
    pub stat_block_id: i64,
    pub entity_name: String,
    pub hit_points: i32,
    pub hit_dice_type: Option<i32>,
    pub hit_dice_count: Option<i32>,
    pub armor_class: i32,
    pub speed: i32,
    pub level: Option<i32>,
    #[sqlx(flatten)]
    pub creature_type: CreatureType,
}
