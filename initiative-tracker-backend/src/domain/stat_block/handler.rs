use actix_web::{
    get, post,
    web::{self, Data, Json},
};
use initiative_tracker_backend::{derive_request, derive_response};
use itertools::Itertools;
use validator::Validate;

use crate::{
    domain::{
        ability_score::handler::AbilityScoreResponse, creature_type::handler::CreatureTypeResponse,
        damage_type_modifier::handler::DamageTypeModifierResponse, skill::handler::SkillResponse,
        PageResponse,
    },
    errors::AppResult,
    DbPool, ValidJson, ValidQuery,
};

use super::{actions, StatBlock};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/statBlock").service(find).service(create));
}

#[derive_request]
pub struct FindStatBlockRequest {}

#[derive_request]
pub struct CreateStatBlockRequest {
    pub entity_name: String,
    pub hit_points: i32,
    pub hit_dice_type: Option<i32>,
    pub hit_dice_count: Option<i32>,
    pub armor_class: i32,
    pub speed: i32,
    pub level: i32,
    pub creature_type_id: i64,
    #[validate]
    pub ability_scores: Vec<CreateAbilityScoreRequest>,
    #[validate]
    pub proficient_skills: Vec<CreateProficientSkillRequest>,
    #[validate]
    pub damage_type_modifiers: Vec<CreateDamageTypeModifierRequest>,
}

#[derive_request]
pub struct CreateAbilityScoreRequest {
    pub ability_id: i64,
    pub score: i32,
}

#[derive_request]
pub struct CreateProficientSkillRequest {
    pub skill_id: i64,
}

#[derive_request]
pub struct CreateDamageTypeModifierRequest {
    pub damage_type_id: i64,
    pub modifier: f32,
}

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

#[post("")]
async fn create(
    request: ValidJson<CreateStatBlockRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<StatBlockResponse>> {
    Ok(Json(actions::create(&db_pool, &request).await?.into()))
}
