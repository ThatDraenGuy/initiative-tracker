use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{domain::PageResponse, errors::AppResult, DbPool, ValidJson, ValidQuery};

use super::{actions, DamageType};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/damageType")
            .service(find)
            .service(create)
            .service(delete),
    );
}

#[derive_request]
pub struct FindDamageTypeRequest {}

#[derive_request]
pub struct CreateDamageTypeRequest {
    pub name: String,
}

#[derive_response]
pub struct DamageTypeResponse {
    pub id: i64,
    pub name: String,
}
impl From<DamageType> for DamageTypeResponse {
    fn from(value: DamageType) -> Self {
        Self {
            id: value.damage_type_id,
            name: value.damage_type_name,
        }
    }
}

#[get("")]
async fn find(
    condition: ValidQuery<FindDamageTypeRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<PageResponse<DamageTypeResponse>> {
    Ok(actions::find(&db_pool, &condition).await?.map_into())
}

#[post("")]
async fn create(
    request: ValidJson<CreateDamageTypeRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<DamageTypeResponse>> {
    Ok(Json(actions::create(&db_pool, &request).await?.into()))
}

#[delete("/{id}")]
async fn delete(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<()>> {
    Ok(Json(actions::delete(&db_pool, &id).await?))
}
