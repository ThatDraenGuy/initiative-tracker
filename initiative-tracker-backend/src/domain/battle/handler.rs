use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{domain::PageResponse, errors::AppResult, DbPool, ValidJson, ValidQuery};

use super::{actions, Battle};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/battle")
            .service(find)
            .service(find_by_id)
            .service(start)
            .service(end)
            .service(next_initiative),
    );
}

#[derive_request]
pub struct FindBattleRequest {}

#[derive_request]
pub struct StartBattleRequest {
    pub character_ids: Vec<i64>,
}

#[derive_response]
pub struct BattleResponse {
    id: i64,
    round_number: i32,
    character_amount: i64,
    current_character_index: i32,
}
impl From<Battle> for BattleResponse {
    fn from(value: Battle) -> Self {
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
) -> AppResult<PageResponse<BattleResponse>> {
    Ok(actions::find(&db_pool, &condition).await?.map_into())
}

#[get("/{id}")]
async fn find_by_id(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<BattleResponse>> {
    Ok(Json(actions::find_by_id(&db_pool, &id).await?.into()))
}

#[post("/start")]
async fn start(
    dto: ValidJson<StartBattleRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<BattleResponse>> {
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
