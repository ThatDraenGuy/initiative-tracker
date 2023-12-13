use crate::{
    domain::{Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::CharacterBrief;

pub async fn find_by_ids(conn: &DbPool, ids: &[i64]) -> AppResult<Vec<CharacterBrief>> {
    Ok(sqlx::query_as(
        r#"
        SELECT *
        FROM character c
        LEFT JOIN player p ON c.player_id = p.player_id
        INNER JOIN stat_block sb ON sb.stat_block_id = c.stat_block_id
        INNER JOIN creature_type ct ON sb.creature_type_id = ct.creature_type_id
        WHERE c.character_id = ANY($1);
        "#,
    )
    .bind(ids)
    .fetch_all(conn)
    .await?)
}

pub async fn find(conn: &DbPool) -> AppResult<PageResponse<CharacterBrief>> {
    Ok(PageResponse::new(
        sqlx::query_as(
            r#"
                SELECT *
                FROM character c
                LEFT JOIN player p ON c.player_id = p.player_id
                INNER JOIN stat_block sb ON sb.stat_block_id = c.stat_block_id
                INNER JOIN creature_type ct ON sb.creature_type_id = ct.creature_type_id;
                "#,
        )
        .fetch_all(conn)
        .await?,
        sqlx::query_as!(
            Count,
            r#"
            SELECT COUNT(*) as "count!" FROM character;
            "#
        )
        .fetch_one(conn)
        .await?,
    ))
}
