use actix_web::{get, post, web, HttpResponse};
use actix_web_validator::{Json, Query};
use serde::{Deserialize, Serialize};
use validator::Validate;

use super::{actions, Ability, NewAbilty};
use crate::{
    domain::pagination::{PageRequest, PageResponse},
    errors::AppError,
    DbPool,
};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/ability").service(create).service(find));
}

#[derive(Deserialize, Validate)]
struct CreateAbiltyRequest {
    #[validate(length(min = 1))]
    pub name: String,
}
impl From<CreateAbiltyRequest> for NewAbilty {
    fn from(value: CreateAbiltyRequest) -> Self {
        Self {
            ability_name: value.name,
        }
    }
}

#[derive(Deserialize, Validate)]
pub struct FindAbilityRequest {
    #[validate(length(min = 1))]
    pub name: Option<String>,
}

#[derive(Serialize)]
struct AbililtyResponse {
    pub id: i64,
    pub name: String,
}
impl From<Ability> for AbililtyResponse {
    fn from(value: Ability) -> Self {
        Self {
            id: value.ability_id,
            name: value.ability_name,
        }
    }
}

#[post("")]
async fn create(
    dto: Json<CreateAbiltyRequest>,
    db_pool: web::Data<DbPool>,
) -> Result<HttpResponse, AppError> {
    let mut conn = db_pool.get()?;
    let new_ability = actions::create(&mut conn, dto.into_inner().into())?;

    Ok(HttpResponse::Ok().json(AbililtyResponse::from(new_ability)))
}

#[get("")]
async fn find(
    condition: Query<FindAbilityRequest>,
    page_request: Query<PageRequest>,
    db_pool: web::Data<DbPool>,
) -> Result<HttpResponse, AppError> {
    let mut conn = db_pool.get()?;
    let result = actions::find(&mut conn, condition.into_inner(), page_request.into_inner())?;

    Ok(PageResponse::<AbililtyResponse>::from(result).into())
}
