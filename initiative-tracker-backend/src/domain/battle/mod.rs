use initiative_tracker_backend::derive_entity;

use super::{battle_brief::BattleBrief, character::Character, current_stats::CurrentStats};
pub mod actions;
pub mod handler;

#[derive_entity]
pub struct Battle {
    pub battle_id: i64,
    pub round_number: i32,
    pub current_character_index: i32,
    pub character_amount: i64,
    pub entries: Vec<InitiativeEntry>,
}
impl Battle {
    pub fn new(brief: BattleBrief, entries: Vec<InitiativeEntry>) -> Self {
        Self {
            battle_id: brief.battle_id,
            round_number: brief.round_number,
            current_character_index: brief.current_character_index,
            character_amount: brief.character_amount,
            entries,
        }
    }
}

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

pub struct StartedBattle {
    pub battle_id: i64,
}
