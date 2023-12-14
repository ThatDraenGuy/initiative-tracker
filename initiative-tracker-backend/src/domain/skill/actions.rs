use crate::{
    domain::{Count, PageResponse},
    errors::{AppError, AppResult},
    DbPool,
};

use super::{
    handler::{CreateSkillRequest, FindSkillRequest},
    Skill,
};

pub async fn create(conn: &DbPool, request: &CreateSkillRequest) -> AppResult<Skill> {
    Ok(sqlx::query_as(
        r#"
        WITH inserted AS (
            INSERT INTO skill (skill_name, ability_id)
            VALUES ($1, $2)
            RETURNING *
        ) SELECT * FROM inserted i
        INNER JOIN ability a ON i.ability_id = a.ability_id;
        "#,
    )
    .bind(&request.name)
    .bind(request.ability_id)
    .fetch_one(conn)
    .await?)
}

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

pub async fn delete(conn: &DbPool, id: &i64) -> AppResult<()> {
    let count = sqlx::query!(
        r#"
        DELETE FROM skill WHERE skill_id = $1
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
