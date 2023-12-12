use actix_web::{
    get,
    web::{self, Data},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{domain::PageResponse, errors::AppResult, DbPool, ValidQuery};

use super::{actions, DamageType};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/damageType").service(find));
}

#[derive_request]
pub struct FindDamageTypeRequest {}

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
