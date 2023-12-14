use itertools::Itertools;

use crate::{
    domain::{
        battle::{InitiativeEntry, InitiativeEntryBrief},
        battle_brief::BattleBrief,
        character,
    },
    errors::{AppError, AppResult},
    DbPool,
};

use super::{handler::StartBattleRequest, Battle, StartedBattle};

pub async fn find_by_id(conn: &DbPool, id: &i64) -> AppResult<Battle> {
    let battle_brief = sqlx::query_as!(
        BattleBrief,
        r#"
        SELECT b.*, COUNT(ie.*) as "character_amount!"
        FROM battle b
        LEFT JOIN initiative_entry ie ON b.battle_id = ie.battle_id
        WHERE b.battle_id = $1
        GROUP BY b.battle_id;
        "#,
        id
    )
    .fetch_optional(conn)
    .await?
    .ok_or(AppError::NotFound)?;

    let entries_brief: Vec<InitiativeEntryBrief> = sqlx::query_as(
        r#"
        SELECT * 
        FROM initiative_entry ie
        INNER JOIN current_stats cs ON cs.current_stats_id = ie.current_stats_id
        WHERE ie.battle_id = $1
        ORDER BY ie.initiative_roll DESC
        "#,
    )
    .bind(battle_brief.battle_id)
    .fetch_all(conn)
    .await?;

    let characters = character::actions::find_by_ids(
        conn,
        &entries_brief
            .iter()
            .map(|entry| entry.character_id)
            .collect_vec(),
    )
    .await?;

    let entries = entries_brief
        .into_iter()
        .zip(characters.into_iter())
        .map(|(entry, character)| InitiativeEntry::new(entry, character))
        .collect_vec();

    Ok(Battle::new(battle_brief, entries))
}

pub async fn start(conn: &DbPool, request: &StartBattleRequest) -> AppResult<BattleBrief> {
    let new_battle = sqlx::query_as!(
        StartedBattle,
        r#"
        SELECT start_battle as "battle_id!" FROM start_battle($1)
        "#,
        &request.character_ids
    )
    .fetch_one(conn)
    .await?;

    Ok(sqlx::query_as!(
        BattleBrief,
        r#"
        SELECT b.*, COUNT(ie.*) as "character_amount!"
        FROM battle b
        LEFT JOIN initiative_entry ie ON b.battle_id = ie.battle_id
        WHERE b.battle_id = $1
        GROUP BY b.battle_id;
        "#,
        &new_battle.battle_id
    )
    .fetch_one(conn)
    .await?)
}

pub async fn end(conn: &DbPool, id: &i64) -> AppResult<()> {
    sqlx::query!(
        r#"
        DELETE FROM battle
        WHERE battle_id = $1
        "#,
        id
    )
    .execute(conn)
    .await?;
    Ok(())
}
