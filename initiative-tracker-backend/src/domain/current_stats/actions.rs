use crate::{
    errors::{AppError, AppResult},
    DbPool,
};

use super::{
    handler::{DamageRequest, HealRequest, UpdateCurrentStatsRequest},
    CurrentStats,
};

async fn find_by_id(conn: &DbPool, id: &i64) -> AppResult<CurrentStats> {
    sqlx::query_as!(
        CurrentStats,
        r#"
        SELECT *
        FROM current_stats
        WHERE current_stats_id = $1
        "#,
        id
    )
    .fetch_optional(conn)
    .await?
    .ok_or(AppError::NotFound)
}

pub async fn damage(conn: &DbPool, id: &i64, request: &DamageRequest) -> AppResult<CurrentStats> {
    match &request.damage_type_id {
        Some(damage_type_id) => {
            sqlx::query!(
                r#"
                SELECT damage_with_type($1, $2, $3);
                "#,
                request.amount,
                damage_type_id,
                id
            )
            .execute(conn)
            .await?
        }
        None => {
            sqlx::query!(
                r#"
                SELECT damage($1, $2);
                "#,
                request.amount,
                id
            )
            .execute(conn)
            .await?
        }
    };

    find_by_id(conn, id).await
}

pub async fn heal(conn: &DbPool, id: &i64, request: &HealRequest) -> AppResult<CurrentStats> {
    sqlx::query!(
        r#"
        SELECT heal($1, $2);
        "#,
        request.amount,
        id
    )
    .execute(conn)
    .await?;

    find_by_id(conn, id).await
}

pub async fn update(
    conn: &DbPool,
    id: &i64,
    request: &UpdateCurrentStatsRequest,
) -> AppResult<CurrentStats> {
    Ok(sqlx::query_as!(
        CurrentStats,
        r#"
        UPDATE current_stats SET 
        current_hit_points = $1,
        temporary_hit_points = $2,
        current_hit_dice_count = $3,
        current_armor_class = $4,
        current_speed = $5
        WHERE current_stats_id = $6
        RETURNING *;
        "#,
        request.hit_points,
        request.temp_hit_points,
        request.hit_dice_count,
        request.armor_class,
        request.speed,
        id
    )
    .fetch_one(conn)
    .await?)
}
