use actix_web::{get, post, web, HttpResponse};
use actix_web_validator::{Json, Query};
use deadpool_postgres::Client;
use serde::{Deserialize, Serialize};
use validator::Validate;

use super::{actions, Ability, NewAbilty};
use crate::{
    domain::{conditions::Condition, pagination::PageRequest},
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
impl Condition for FindAbilityRequest {
    fn apply(&self, stmt: &str) -> String {
        if let Some(name) = &self.name {
            stmt.replace(
                "$condition",
                &format!("ability_name LIKE '{}' AND $condition", name),
            )
        } else {
            stmt.to_owned()
        }
    }
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
    let client: Client = db_pool.get().await?;
    let new_ability = actions::create(&client, dto.into_inner().into()).await?;

    Ok(HttpResponse::Ok().json(AbililtyResponse::from(new_ability)))
}

#[get("")]
async fn find(
    condition: Query<FindAbilityRequest>,
    page_request: Query<PageRequest>,
    db_pool: web::Data<DbPool>,
) -> Result<HttpResponse, AppError> {
    let client: Client = db_pool.get().await?;
    let result = actions::find(&client, condition.into_inner(), page_request.into_inner()).await?;

    Ok(result.map::<AbililtyResponse>().into())
}
