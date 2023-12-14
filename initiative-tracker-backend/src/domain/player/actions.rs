use crate::{
    domain::{Count, PageResponse},
    errors::{AppError, AppResult},
    DbPool,
};

use super::{
    handler::{CreatePlayerRequest, FindPlayerRequest},
    Player,
};

pub async fn find(
    conn: &DbPool,
    _condition: &FindPlayerRequest,
) -> AppResult<PageResponse<Player>> {
    Ok(PageResponse::new(
        sqlx::query_as!(
            Player,
            r#"
            SELECT * FROM player;
            "#
        )
        .fetch_all(conn)
        .await?,
        sqlx::query_as!(
            Count,
            r#"
            SELECT COUNT(*) as "count!" FROM player;
            "#
        )
        .fetch_one(conn)
        .await?,
    ))
}

pub async fn create(conn: &DbPool, request: &CreatePlayerRequest) -> AppResult<Player> {
    Ok(sqlx::query_as!(
        Player,
        r#"
        INSERT INTO player (player_name) 
        VALUES ($1)
        RETURNING player_id, player_name;
        "#,
        &request.name
    )
    .fetch_one(conn)
    .await?)
}

pub async fn delete(conn: &DbPool, id: &i64) -> AppResult<()> {
    let count = sqlx::query!(
        r#"
        DELETE FROM player
        WHERE player_id = $1
        "#,
        id
    )
    .execute(conn)
    .await?;

    if count.rows_affected() == 0 {
        Err(AppError::NotFound)
    } else {
        Ok(())
    }
}
