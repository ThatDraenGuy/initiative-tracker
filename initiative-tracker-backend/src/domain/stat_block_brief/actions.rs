use crate::{
    domain::{Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::{handler::FindStatBlockBriefRequest, StatBlockBrief};

pub async fn find(
    conn: &DbPool,
    _condition: &FindStatBlockBriefRequest,
) -> AppResult<PageResponse<StatBlockBrief>> {
    Ok(PageResponse::new(
        sqlx::query_as(
            r#"
            SELECT * FROM stat_block sb
            INNER JOIN creature_type ct ON sb.creature_type_id = ct.creature_type_id;
            "#,
        )
        .fetch_all(conn)
        .await?,
        sqlx::query_as!(
            Count,
            r#"
            SELECT COUNT(*) as "count!" FROM stat_block;
            "#
        )
        .fetch_one(conn)
        .await?,
    ))
}

pub async fn find_by_ids(conn: &DbPool, ids: &[i64]) -> AppResult<Vec<StatBlockBrief>> {
    Ok(sqlx::query_as(
        r#"
        SELECT * FROM stat_block sb
        INNER JOIN creature_type ct ON sb.creature_type_id = ct.creature_type_id
        WHERE sb.stat_block_id = ANY($1);
        "#,
    )
    .bind(ids)
    .fetch_all(conn)
    .await?)
}
