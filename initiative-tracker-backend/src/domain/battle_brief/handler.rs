use actix_web::{
    get,
    web::{self, Data},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{domain::PageResponse, errors::AppResult, DbPool, ValidQuery};

use super::{actions, BattleBrief};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/battleBrief").service(find));
}

#[derive_request]
pub struct FindBattleRequest {}

#[derive_response]
pub struct BattleBriefResponse {
    id: i64,
    round_number: i32,
    character_amount: i64,
    current_character_index: i32,
}
impl From<BattleBrief> for BattleBriefResponse {
    fn from(value: BattleBrief) -> Self {
        Self {
            id: value.battle_id,
            round_number: value.round_number,
            character_amount: value.character_amount,
            current_character_index: value.current_character_index,
        }
    }
}

#[get("")]
async fn find(
    condition: ValidQuery<FindBattleRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<PageResponse<BattleBriefResponse>> {
    Ok(actions::find(&db_pool, &condition).await?.map_into())
}
