use initiative_tracker_backend::derive_entity;

use super::{battle_brief::BattleBrief, character::Character};
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

#[derive_entity]
pub struct CurrentStats {
    pub current_stats_id: i64,
    pub character_id: i64,
    pub current_hit_points: Option<i32>,
    pub temporary_hit_points: Option<i32>,
    pub current_hit_dice_count: Option<i32>,
    pub current_armor_class: Option<i32>,
    pub current_speed: Option<i32>,
}

pub struct StartedBattle {
    pub battle_id: i64,
}
