use initiative_tracker_backend::derive_entity;

pub mod handler;

#[derive_entity]
pub struct DamageType {
    pub damage_type_id: i64,
    pub damage_type_name: String,
}
