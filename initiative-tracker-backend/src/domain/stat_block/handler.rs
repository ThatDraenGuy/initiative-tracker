use actix_web::{
    get,
    web::{self, Data},
};
use initiative_tracker_backend::{derive_request, derive_response};
use itertools::Itertools;

use crate::{
    domain::{
        ability_score::handler::AbilityScoreResponse, creature_type::handler::CreatureTypeResponse,
        damage_type_modifier::handler::DamageTypeModifierResponse, skill::handler::SkillResponse,
        PageResponse,
    },
    errors::AppResult,
    DbPool, ValidQuery,
};

use super::{actions, StatBlock};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/statBlock").service(find));
}

#[derive_request]
pub struct FindStatBlockRequest {}

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
    pub ability_scores: Vec<AbilityScoreResponse>,
    pub proficient_skills: Vec<SkillResponse>,
    pub damage_type_modifiers: Vec<DamageTypeModifierResponse>,
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
            ability_scores: value.ability_scores.into_iter().map_into().collect_vec(),
            proficient_skills: value.proficient_skills.into_iter().map_into().collect_vec(),
            damage_type_modifiers: value
                .damage_type_modifiers
                .into_iter()
                .map_into()
                .collect_vec(),
        }
    }
}

#[get("")]
async fn find(
    condition: ValidQuery<FindStatBlockRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<PageResponse<StatBlockResponse>> {
    Ok(actions::find(&db_pool, &condition).await?.map_into())
}
