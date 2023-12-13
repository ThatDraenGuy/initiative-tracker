use initiative_tracker_backend::derive_entity;

use super::{player::Player, stat_block_brief::StatBlockBrief, Nullable};

pub mod actions;
pub mod handler;

#[derive_entity]
pub struct CharacterBrief {
    pub character_id: i64,
    #[sqlx(flatten)]
    pub player: Nullable<Player>,
    #[sqlx(flatten)]
    pub stat_block: StatBlockBrief,
}
