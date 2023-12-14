use crate::{
    domain::{Count, PageResponse},
    errors::{AppError, AppResult},
    DbPool,
};

use super::{
    handler::{CreateDamageTypeRequest, FindDamageTypeRequest},
    DamageType,
};

pub async fn create(conn: &DbPool, request: &CreateDamageTypeRequest) -> AppResult<DamageType> {
    Ok(sqlx::query_as!(
        DamageType,
        r#"
        INSERT INTO damage_type
        (damage_type_name)
        VALUES ($1)
        RETURNING *;
        "#,
        &request.name
    )
    .fetch_one(conn)
    .await?)
}

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

pub async fn delete(conn: &DbPool, id: &i64) -> AppResult<()> {
    let count = sqlx::query!(
        r#"
        DELETE FROM damage_type WHERE damage_type_id = $1;
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
