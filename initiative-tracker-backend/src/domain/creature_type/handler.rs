use actix_web::{
    get,
    web::{self, Data},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{domain::PageResponse, errors::AppResult, DbPool, ValidQuery};

use super::{actions, CreatureType};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/creatureType").service(find));
}

#[derive_request]
pub struct FindCreatureTypeRequest {}

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
