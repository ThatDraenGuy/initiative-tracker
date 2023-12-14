use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
};
use initiative_tracker_backend::{derive_request, derive_response};
use itertools::Itertools;

use super::{actions, Battle, InitiativeEntry};
use crate::{
    domain::{
        battle_brief::handler::BattleBriefResponse, character::handler::CharacterResponse,
        current_stats::handler::CurrentStatsResponse,
    },
    errors::AppResult,
    DbPool, ValidJson,
};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/battle")
            .service(start)
            .service(find_by_id)
            .service(end)
            .service(next_initiative),
    );
}

#[derive_request]
pub struct StartBattleRequest {
    pub character_ids: Vec<i64>,
}

#[derive_response]
pub struct BattleResponse {
    pub id: i64,
    pub round_number: i32,
    pub character_amount: i64,
    pub current_character_index: i32,
    pub entries: Vec<InitiativeEntryResponse>,
}
impl From<Battle> for BattleResponse {
    fn from(value: Battle) -> Self {
        Self {
            id: value.battle_id,
            round_number: value.round_number,
            character_amount: value.character_amount,
            current_character_index: value.current_character_index,
            entries: value.entries.into_iter().map_into().collect_vec(),
        }
    }
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

#[get("/{id}")]
async fn find_by_id(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<BattleResponse>> {
    Ok(Json(actions::find_by_id(&db_pool, &id).await?.into()))
}

#[post("/start")]
async fn start(
    dto: ValidJson<StartBattleRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<BattleBriefResponse>> {
    Ok(Json(actions::start(&db_pool, &dto).await?.into()))
}

#[delete("/{id}/end")]
async fn end(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<()>> {
    Ok(Json(actions::end(&db_pool, &id).await?))
}

#[post("/{id}/nextInitiative")]
async fn next_initiative(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<()>> {
    Ok(Json(actions::next_initiative(&db_pool, &id).await?))
}
