use actix_web::{
    put,
    web::{self, Data, Json, Path},
};
use initiative_tracker_backend::{derive_request, derive_response};

use super::{actions, CurrentStats};
use crate::{errors::AppResult, DbPool, ValidJson};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/currentStats")
            .service(damage)
            .service(heal)
            .service(update),
    );
}

#[derive_request]
pub struct DamageRequest {
    #[validate(range(min = 1))]
    pub amount: i32,
    pub damage_type_id: Option<i64>,
}

#[derive_request]
pub struct HealRequest {
    #[validate(range(min = 1))]
    pub amount: i32,
}

#[derive_request]
pub struct UpdateCurrentStatsRequest {
    pub hit_points: Option<i32>,
    pub temp_hit_points: i32,
    pub hit_dice_count: Option<i32>,
    pub armor_class: Option<i32>,
    pub speed: Option<i32>,
}

#[derive_response]
pub struct CurrentStatsResponse {
    pub id: i64,
    pub hit_points: Option<i32>,
    pub temp_hit_points: i32,
    pub hit_dice_count: Option<i32>,
    pub armor_class: Option<i32>,
    pub speed: Option<i32>,
}
impl From<CurrentStats> for CurrentStatsResponse {
    fn from(value: CurrentStats) -> Self {
        Self {
            id: value.current_stats_id,
            hit_points: value.current_hit_points,
            temp_hit_points: value.temporary_hit_points,
            hit_dice_count: value.current_hit_dice_count,
            armor_class: value.current_armor_class,
            speed: value.current_speed,
        }
    }
}

#[put("/{id}/damage")]
async fn damage(
    id: Path<i64>,
    request: ValidJson<DamageRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<CurrentStatsResponse>> {
    Ok(Json(actions::damage(&db_pool, &id, &request).await?.into()))
}

#[put("/{id}/heal")]
async fn heal(
    id: Path<i64>,
    request: ValidJson<HealRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<CurrentStatsResponse>> {
    Ok(Json(actions::heal(&db_pool, &id, &request).await?.into()))
}

#[put("/{id}")]
async fn update(
    id: Path<i64>,
    request: ValidJson<UpdateCurrentStatsRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<CurrentStatsResponse>> {
    Ok(Json(actions::update(&db_pool, &id, &request).await?.into()))
}
