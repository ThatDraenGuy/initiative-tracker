use initiative_tracker_backend::derive_response;
use serde::Serialize;

use super::CreatureType;

#[derive_response]
pub struct CreatureTypeResponse {
    pub id: i64,
    pub name: String,
}
impl From<CreatureType> for CreatureTypeResponse {
    fn from(value: CreatureType) -> Self {
        Self {
            id: value.creature_type_id,
            name: value.creature_type_name,
        }
    }
}
