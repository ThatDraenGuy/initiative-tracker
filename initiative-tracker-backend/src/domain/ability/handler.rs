use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
};
use initiative_tracker_backend::{derive_request, derive_response};

use super::{actions, Ability};
use crate::{domain::PageResponse, errors::AppResult, DbPool, ValidJson, ValidQuery};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/ability")
            .service(create)
            .service(find)
            .service(delete),
    );
}

#[derive_request]
pub struct CreateAbiltyRequest {
    #[validate(length(min = 1))]
    pub name: String,
}

#[derive_request]
pub struct FindAbilityRequest {
    #[validate(length(min = 1))]
    pub name: Option<String>,
}

#[derive_response]
pub struct AbililtyResponse {
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
    dto: ValidJson<CreateAbiltyRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<AbililtyResponse>> {
    Ok(Json(actions::create(&db_pool, &dto).await?.into()))
}

#[get("")]
async fn find(
    condition: ValidQuery<FindAbilityRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<PageResponse<AbililtyResponse>> {
    Ok(actions::find(&db_pool, &condition)
        .await?
        .map_into::<AbililtyResponse>())
}

#[delete("/{id}")]
async fn delete(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<()>> {
    Ok(Json(actions::delete(&db_pool, &id).await?))
}
