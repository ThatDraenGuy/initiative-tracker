use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{
    domain::{ability::handler::AbililtyResponse, PageResponse},
    errors::AppResult,
    DbPool, ValidJson, ValidQuery,
};

use super::{actions, Skill};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/skill")
            .service(find)
            .service(create)
            .service(delete),
    );
}

#[derive_request]
pub struct FindSkillRequest {}

#[derive_request]
pub struct CreateSkillRequest {
    pub name: String,
    pub ability_id: i64,
}

#[derive_response]
pub struct SkillResponse {
    pub id: i64,
    pub name: String,
    pub ability: AbililtyResponse,
}
impl From<Skill> for SkillResponse {
    fn from(value: Skill) -> Self {
        Self {
            id: value.skill_id,
            name: value.skill_name,
            ability: value.ability.into(),
        }
    }
}

#[get("")]
async fn find(
    condition: ValidQuery<FindSkillRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<PageResponse<SkillResponse>> {
    Ok(actions::find(&db_pool, &condition).await?.map_into())
}

#[post("")]
async fn create(
    request: ValidJson<CreateSkillRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<SkillResponse>> {
    Ok(Json(actions::create(&db_pool, &request).await?.into()))
}

#[delete("/{id}")]
async fn delete(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<()>> {
    Ok(Json(actions::delete(&db_pool, &id).await?))
}
