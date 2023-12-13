use actix_web::{
    get,
    web::{self, Data},
};
use initiative_tracker_backend::derive_response;

use crate::{
    domain::{
        player::handler::PlayerResponse, stat_block_brief::handler::StatBlockBriefResponse,
        PageResponse,
    },
    errors::AppResult,
    DbPool,
};

use super::{actions, CharacterBrief};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/characterBrief").service(find));
}

#[derive_response]
pub struct CharacterBriefResponse {
    pub id: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub player: Option<PlayerResponse>,
    pub stat_block: StatBlockBriefResponse,
}
impl From<CharacterBrief> for CharacterBriefResponse {
    fn from(value: CharacterBrief) -> Self {
        Self {
            id: value.character_id,
            player: value.player.convert(),
            stat_block: value.stat_block.into(),
        }
    }
}

#[get("")]
async fn find(db_pool: Data<DbPool>) -> AppResult<PageResponse<CharacterBriefResponse>> {
    Ok(actions::find(&db_pool).await?.map_into())
}
