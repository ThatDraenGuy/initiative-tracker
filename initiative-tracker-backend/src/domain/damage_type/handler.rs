use initiative_tracker_backend::derive_response;

use super::DamageType;

#[derive_response]
pub struct DamageTypeResponse {
    pub id: i64,
    pub name: String,
}
impl From<DamageType> for DamageTypeResponse {
    fn from(value: DamageType) -> Self {
        Self {
            id: value.damage_type_id,
            name: value.damage_type_name,
        }
    }
}
