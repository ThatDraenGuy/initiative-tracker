use initiative_tracker_backend::derive_entity;

use super::ability::Ability;

pub mod actions;
pub mod handler;

#[derive_entity]
pub struct Skill {
    pub skill_id: i64,
    pub skill_name: String,
    #[sqlx(flatten)]
    pub ability: Ability,
}
