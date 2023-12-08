use crate::{
    domain::{Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::{
    handler::{FindBattleRequest, StartBattleRequest},
    Battle, StartedBattle,
};

pub async fn find(
    conn: &DbPool,
    _condition: &FindBattleRequest,
) -> AppResult<PageResponse<Battle>> {
    Ok(PageResponse::new(
        sqlx::query_as!(
            Battle,
            r#"
        SELECT b.*, COUNT(ie.*) as "character_amount!"
        FROM battle b
        LEFT JOIN initiative_entry ie ON b.battle_id = ie.battle_id
        GROUP BY b.battle_id;
        "#
        )
        .fetch_all(conn)
        .await?,
        sqlx::query_as!(
            Count,
            r#"
            SELECT COUNT(*) as "count!" FROM battle;
            "#
        )
        .fetch_one(conn)
        .await?,
    ))
}

pub async fn start(conn: &DbPool, request: &StartBattleRequest) -> AppResult<Battle> {
    let new_battle = sqlx::query_as!(
        StartedBattle,
        r#"
        SELECT start_battle as "battle_id!" FROM start_battle($1)
        "#,
        &request.character_ids
    )
    .fetch_one(conn)
    .await?;

    Ok(sqlx::query_as!(
        Battle,
        r#"
        SELECT b.*, COUNT(ie.*) as "character_amount!"
        FROM battle b
        LEFT JOIN initiative_entry ie ON b.battle_id = ie.battle_id
        WHERE b.battle_id = $1
        GROUP BY b.battle_id;
        "#,
        &new_battle.battle_id
    )
    .fetch_one(conn)
    .await?)
}

pub async fn end(conn: &DbPool, id: &i64) -> AppResult<()> {
    sqlx::query!(
        r#"
        DELETE FROM battle
        WHERE battle_id = $1
        "#,
        id
    )
    .execute(conn)
    .await?;
    Ok(())
}
