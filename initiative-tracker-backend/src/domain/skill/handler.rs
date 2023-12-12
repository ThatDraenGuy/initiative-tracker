use actix_web::{
    get,
    web::{self, Data},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{
    domain::{ability::handler::AbililtyResponse, PageResponse},
    errors::AppResult,
    DbPool, ValidQuery,
};

use super::{actions, Skill};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/skill").service(find));
}

#[derive_request]
pub struct FindSkillRequest {}

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
