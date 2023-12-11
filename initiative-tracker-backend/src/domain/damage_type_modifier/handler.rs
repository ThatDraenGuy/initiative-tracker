use initiative_tracker_backend::derive_response;

use crate::domain::damage_type::handler::DamageTypeResponse;

use super::DamageTypeModifier;

#[derive_response]
pub struct DamageTypeModifierResponse {
    pub stat_block_id: i64,
    pub damage_type: DamageTypeResponse,
    pub modifier: f32,
}
impl From<DamageTypeModifier> for DamageTypeModifierResponse {
    fn from(value: DamageTypeModifier) -> Self {
        Self {
            stat_block_id: value.stat_block_id,
            damage_type: value.damage_type.into(),
            modifier: value.modifier,
        }
    }
}
