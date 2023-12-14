use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{domain::PageResponse, errors::AppResult, DbPool, ValidJson, ValidQuery};

use super::{actions, CreatureType};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/creatureType")
            .service(find)
            .service(create)
            .service(delete),
    );
}

#[derive_request]
pub struct FindCreatureTypeRequest {}

#[derive_request]
pub struct CreateCreatureTypeRequest {
    pub name: String,
}

#[derive_response]
pub struct CreatureTypeResponse {
    pub id: i64,
    pub name: String,
}
impl From<CreatureType> for CreatureTypeResponse {
    fn from(value: CreatureType) -> Self {
        Self {
            id: value.creature_type_id,
            name: value.creature_type_name,
        }
    }
}

#[get("")]
async fn find(
    condition: ValidQuery<FindCreatureTypeRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<PageResponse<CreatureTypeResponse>> {
    Ok(actions::find(&db_pool, &condition).await?.map_into())
}

#[post("")]
async fn create(
    request: ValidJson<CreateCreatureTypeRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<CreatureTypeResponse>> {
    Ok(Json(actions::create(&db_pool, &request).await?.into()))
}

#[delete("/{id}")]
async fn delete(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<()>> {
    Ok(Json(actions::delete(&db_pool, &id).await?))
}
