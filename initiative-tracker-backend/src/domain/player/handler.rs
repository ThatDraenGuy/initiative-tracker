use actix_web::{
    delete, get, post,
    web::{self, Data, Json, Path},
};
use initiative_tracker_backend::{derive_request, derive_response};

use crate::{domain::PageResponse, errors::AppResult, DbPool, ValidJson, ValidQuery};

use super::{actions, Player};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/player")
            .service(find)
            .service(create)
            .service(delete),
    );
}

#[derive_request]
pub struct FindPlayerRequest {}

#[derive_request]
pub struct CreatePlayerRequest {
    pub name: String,
}

#[derive_response]
pub struct PlayerResponse {
    pub id: i64,
    pub name: String,
}
impl From<Player> for PlayerResponse {
    fn from(value: Player) -> Self {
        Self {
            id: value.player_id,
            name: value.player_name,
        }
    }
}

#[get("")]
async fn find(
    condition: ValidQuery<FindPlayerRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<PageResponse<PlayerResponse>> {
    Ok(actions::find(&db_pool, &condition).await?.map_into())
}

#[post("")]
async fn create(
    request: ValidJson<CreatePlayerRequest>,
    db_pool: Data<DbPool>,
) -> AppResult<Json<PlayerResponse>> {
    Ok(Json(actions::create(&db_pool, &request).await?.into()))
}

#[delete("/{id}")]
async fn delete(id: Path<i64>, db_pool: Data<DbPool>) -> AppResult<Json<()>> {
    Ok(Json(actions::delete(&db_pool, &id).await?))
}
