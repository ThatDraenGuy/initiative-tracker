use crate::{
    domain::{Count, PageResponse},
    errors::{AppError, AppResult},
    DbPool,
};

use super::{
    handler::{CreateCreatureTypeRequest, FindCreatureTypeRequest},
    CreatureType,
};

pub async fn create(conn: &DbPool, request: &CreateCreatureTypeRequest) -> AppResult<CreatureType> {
    Ok(sqlx::query_as!(
        CreatureType,
        r#"
        INSERT INTO creature_type
        (creature_type_name)
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

pub async fn delete(conn: &DbPool, id: &i64) -> AppResult<()> {
    let count = sqlx::query!(
        r#"
        DELETE FROM creature_type WHERE creature_type_id = $1
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
