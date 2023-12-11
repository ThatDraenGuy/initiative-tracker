use initiative_tracker_backend::derive_entity;

use super::ability::Ability;

pub mod handler;

#[derive_entity]
pub struct AbilityScore {
    pub stat_block_id: i64,
    pub score: i32,
    #[sqlx(flatten)]
    pub ability: Ability,
}
