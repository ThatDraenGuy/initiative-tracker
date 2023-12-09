use initiative_tracker_backend::derive_response;
use serde::Serialize;

use crate::domain::creature_type::handler::CreatureTypeResponse;

use super::StatBlock;

#[derive_response]
pub struct StatBlockResponse {
    pub id: i64,
    pub entity_name: String,
    pub hit_points: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hit_dice_type: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hit_dice_count: Option<i32>,
    pub armor_class: i32,
    pub speed: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub level: Option<i32>,
    pub creature_type: CreatureTypeResponse,
}
impl From<StatBlock> for StatBlockResponse {
    fn from(value: StatBlock) -> Self {
        Self {
            id: value.stat_block_id,
            entity_name: value.entity_name,
            hit_points: value.hit_points,
            hit_dice_type: value.hit_dice_type,
            hit_dice_count: value.hit_dice_count,
            armor_class: value.armor_class,
            speed: value.speed,
            level: value.level,
            creature_type: value.creature_type.into(),
        }
    }
}
