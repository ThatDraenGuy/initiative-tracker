use sqlx::Postgres;

use crate::{
    domain::{Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::Character;

pub async fn find(conn: &DbPool) -> AppResult<PageResponse<Character>> {
    Ok(PageResponse::new(
        sqlx::query_as::<Postgres, Character>(
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
