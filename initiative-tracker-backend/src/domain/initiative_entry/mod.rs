use initiative_tracker_backend::derive_entity;

use super::{character::Character, current_stats::CurrentStats};

pub mod actions;
pub mod handler;

#[derive_entity]
pub struct InitiativeEntryBrief {
    pub character_id: i64,
    #[sqlx(flatten)]
    pub current_stats: CurrentStats,
    pub initiative_roll: i32,
}

#[derive_entity]
pub struct InitiativeEntry {
    pub character: Character,
    pub current_stats: CurrentStats,
    pub initiative_roll: i32,
}
impl InitiativeEntry {
    pub fn new(brief: InitiativeEntryBrief, character: Character) -> Self {
        Self {
            character,
            current_stats: brief.current_stats,
            initiative_roll: brief.initiative_roll,
        }
    }
}
