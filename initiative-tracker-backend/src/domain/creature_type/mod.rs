use initiative_tracker_backend::derive_entity;

pub mod handler;

#[derive_entity]
pub struct CreatureType {
    pub creature_type_id: i64,
    pub creature_type_name: String,
}
