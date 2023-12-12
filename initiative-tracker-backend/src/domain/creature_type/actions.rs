use crate::{
    domain::{Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::{handler::FindCreatureTypeRequest, CreatureType};

pub async fn find(
    conn: &DbPool,
    _condition: &FindCreatureTypeRequest,
) -> AppResult<PageResponse<CreatureType>> {
    Ok(PageResponse::new(
        sqlx::query_as!(
            CreatureType,
            r#"
            SELECT * FROM creature_type;
            "#
        )
        .fetch_all(conn)
        .await?,
        sqlx::query_as!(
            Count,
            r#"
            SELECT COUNT(*) as "count!"
            FROM creature_type;
            "#
        )
        .fetch_one(conn)
        .await?,
    ))
}
