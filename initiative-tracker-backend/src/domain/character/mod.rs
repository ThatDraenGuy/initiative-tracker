use initiative_tracker_backend::derive_entity;

use super::{character_brief::CharacterBrief, player::Player, stat_block::StatBlock, Nullable};

pub mod actions;
pub mod handler;

#[derive_entity]
pub struct Character {
    pub character_id: i64,
    #[sqlx(flatten)]
    pub player: Nullable<Player>,
    #[sqlx(flatten)]
    pub stat_block: StatBlock,
}
impl Character {
    pub fn new(brief: CharacterBrief, stat_block: StatBlock) -> Self {
        Self {
            character_id: brief.character_id,
            player: brief.player,
            stat_block,
        }
    }
}
