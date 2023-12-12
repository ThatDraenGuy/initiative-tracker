use crate::{
    domain::{Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::{handler::FindSkillRequest, Skill};

pub async fn find(conn: &DbPool, _condition: &FindSkillRequest) -> AppResult<PageResponse<Skill>> {
    Ok(PageResponse::new(
        sqlx::query_as(
            r#"
            SELECT *
            FROM skill s
            JOIN ability a ON s.ability_id = a.ability_id
            "#,
        )
        .fetch_all(conn)
        .await?,
        sqlx::query_as!(
            Count,
            r#"
            SELECT COUNT(*) as "count!"
            FROM skill s
            "#
        )
        .fetch_one(conn)
        .await?,
    ))
}
