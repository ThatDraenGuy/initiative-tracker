use actix_web::{
    get,
    web::{self, Data},
};
use initiative_tracker_backend::derive_response;
use serde::Serialize;

use super::{actions, Character};
use crate::{
    domain::{
        player::handler::PlayerResponse, stat_block::handler::StatBlockResponse, PageResponse,
    },
    errors::AppResult,
    DbPool,
};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/character").service(find));
}

#[derive_response]
struct CharacterResponse {
    pub id: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub player: Option<PlayerResponse>,
    pub stat_block: StatBlockResponse,
}
impl From<Character> for CharacterResponse {
    fn from(value: Character) -> Self {
        Self {
            id: value.character_id,
            player: value.player.convert(),
            stat_block: value.stat_block.into(),
        }
    }
}

#[get("")]
async fn find(db_pool: Data<DbPool>) -> AppResult<PageResponse<CharacterResponse>> {
    Ok(actions::find(&db_pool).await?.map_into())
}
