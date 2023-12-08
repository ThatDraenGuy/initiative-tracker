use crate::{
    domain::{Count, PageResponse},
    errors::AppError,
    DbPool,
};

use super::{
    handler::{CreateAbiltyRequest, FindAbilityRequest},
    Ability,
};

pub async fn create(conn: &DbPool, request: &CreateAbiltyRequest) -> Result<Ability, AppError> {
    Ok(sqlx::query_as!(
        Ability,
        r#"
        INSERT INTO ability (ability_name) 
        VALUES ($1) 
        RETURNING ability_id, ability_name;
        "#,
        &request.name
    )
    .fetch_one(conn)
    .await?)
}

pub async fn find(
    conn: &DbPool,
    condition: &FindAbilityRequest,
) -> Result<PageResponse<Ability>, AppError> {
    let name_cond = condition
        .name
        .as_ref()
        .map(|name| "%".to_owned() + &name + "%")
        .unwrap_or("%".to_owned());

    Ok(PageResponse::new(
        sqlx::query_as!(
            Ability,
            r#"
            SELECT * FROM ability 
            WHERE ability_name LIKE $1;
            "#,
            &name_cond
        )
        .fetch_all(conn)
        .await?,
        sqlx::query_as!(
            Count,
            r#"
            SELECT COUNT(*) as "count!" FROM ability
            WHERE ability_name LIKE $1;
            "#,
            &name_cond
        )
        .fetch_one(conn)
        .await?,
    ))
}
