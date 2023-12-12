use crate::{
    domain::{Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::{handler::FindDamageTypeRequest, DamageType};

pub async fn find(
    conn: &DbPool,
    _condition: &FindDamageTypeRequest,
) -> AppResult<PageResponse<DamageType>> {
    Ok(PageResponse::new(
        sqlx::query_as!(
            DamageType,
            r#"
            SELECT *
            FROM damage_type;
            "#
        )
        .fetch_all(conn)
        .await?,
        sqlx::query_as!(
            Count,
            r#"
            SELECT COUNT(*) as "count!"
            FROM damage_type;
            "#
        )
        .fetch_one(conn)
        .await?,
    ))
}
