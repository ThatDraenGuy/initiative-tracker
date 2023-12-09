use actix_web::{
    get,
    web::{self, Data},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{
    domain::{creature_type::handler::CreatureTypeResponse, PageResponse},
    errors::AppResult,
    DbPool, ValidQuery,
};

use super::{actions, StatBlockBrief};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/statBlockBrief").service(find));
}

#[derive_request]
pub struct FindStatBlockBriefRequest {}

#[derive_response]
pub struct StatBlockBriefResponse {
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
impl From<StatBlockBrief> for StatBlockBriefResponse {
    fn from(value: StatBlockBrief) -> Self {
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

#[get("")]
async fn find(
    condition: ValidQuery<FindStatBlockBriefRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<PageResponse<StatBlockBriefResponse>> {
    Ok(actions::find(&db_pool, &condition).await?.map_into())
}
