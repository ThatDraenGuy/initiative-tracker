use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
};
use initiative_tracker_backend::{derive_request, derive_response};

use super::{actions, Character};
use crate::{
    domain::{
        player::handler::PlayerResponse, stat_block_brief::handler::StatBlockBriefResponse,
        PageResponse,
    },
    errors::AppResult,
    DbPool, ValidJson,
};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/character")
            .service(find)
            .service(create)
            .service(delete),
    );
}

#[derive_request]
pub struct CreateCharacterRequest {
    pub player_id: Option<i64>,
    pub stat_block_id: i64,
}

#[derive_response]
struct CharacterResponse {
    pub id: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub player: Option<PlayerResponse>,
    pub stat_block: StatBlockBriefResponse,
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

#[post("")]
async fn create(
    request: ValidJson<CreateCharacterRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<CharacterResponse>> {
    Ok(Json(actions::create(&db_pool, &request).await?.into()))
}

#[delete("/{id}")]
async fn delete(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<()>> {
    Ok(Json(actions::delete(&db_pool, &id).await?))
}
