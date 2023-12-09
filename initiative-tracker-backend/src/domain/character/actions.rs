use crate::{
    domain::{Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::{handler::CreateCharacterRequest, Character};

pub async fn find(conn: &DbPool) -> AppResult<PageResponse<Character>> {
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

pub async fn create(conn: &DbPool, request: &CreateCharacterRequest) -> AppResult<Character> {
    Ok(sqlx::query_as(
        r#"
        WITH inserted AS (
            INSERT INTO character (player_id, stat_block_id)
            VALUES ($1, $2)
            RETURNING *
        ) SELECT * FROM inserted i
        LEFT JOIN player p ON i.player_id = p.player_id
        INNER JOIN stat_block sb ON i.stat_block_id = sb.stat_block_id
        INNER JOIN creature_type ct ON sb.creature_type_id = ct.creature_type_id;
        "#,
    )
    .bind(request.player_id)
    .bind(request.stat_block_id)
    .fetch_one(conn)
    .await?)
}
