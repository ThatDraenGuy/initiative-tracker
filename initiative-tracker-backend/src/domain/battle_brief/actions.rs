use crate::{
    domain::{Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::{handler::FindBattleRequest, BattleBrief};

pub async fn find(
    conn: &DbPool,
    _condition: &FindBattleRequest,
) -> AppResult<PageResponse<BattleBrief>> {
    Ok(PageResponse::new(
        sqlx::query_as!(
            BattleBrief,
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
