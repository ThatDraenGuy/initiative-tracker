use initiative_tracker_backend::derive_entity;

use super::damage_type::DamageType;

pub mod handler;

#[derive_entity]
pub struct DamageTypeModifier {
    pub stat_block_id: i64,
    #[sqlx(flatten)]
    pub damage_type: DamageType,
    pub modifier: f32,
}
