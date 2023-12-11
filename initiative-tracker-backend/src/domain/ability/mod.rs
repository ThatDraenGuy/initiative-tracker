use initiative_tracker_backend::derive_entity;
pub mod actions;
pub mod handler;

#[derive_entity]
pub struct Ability {
    pub ability_id: i64,
    pub ability_name: String,
}
