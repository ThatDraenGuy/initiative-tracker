use actix_web::{
    get,
    web::{self, Data},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{
    domain::{
        character::handler::CharacterResponse, current_stats::handler::CurrentStatsResponse,
        PageResponse,
    },
    errors::AppResult,
    DbPool, ValidQuery,
};

use super::{actions, InitiativeEntry};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/initiativeEntry").service(find));
}

#[derive_request]
pub struct FindInitiativeEntryRequest {
    pub battle_id: i64,
}

#[derive_response]
pub struct InitiativeEntryResponse {
    pub character: CharacterResponse,
    pub current_stats: CurrentStatsResponse,
    pub roll: i32,
}
impl From<InitiativeEntry> for InitiativeEntryResponse {
    fn from(value: InitiativeEntry) -> Self {
        Self {
            character: value.character.into(),
            current_stats: value.current_stats.into(),
            roll: value.initiative_roll,
        }
    }
}

#[get("")]
async fn find(
    request: ValidQuery<FindInitiativeEntryRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<PageResponse<InitiativeEntryResponse>> {
    Ok(actions::find(&db_pool, &request).await?.map_into())
}
