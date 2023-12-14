use itertools::Itertools;

use crate::{
    domain::{character, Count, PageResponse},
    errors::AppResult,
    DbPool,
};

use super::{handler::FindInitiativeEntryRequest, InitiativeEntry, InitiativeEntryBrief};

pub async fn find(
    conn: &DbPool,
    request: &FindInitiativeEntryRequest,
) -> AppResult<PageResponse<InitiativeEntry>> {
    let entries_brief: Vec<InitiativeEntryBrief> = sqlx::query_as(
        r#"
        SELECT *
        FROM initiative_entry ie
        INNER JOIN current_stats cs ON cs.current_stats_id = ie.current_stats_id
        WHERE ie.battle_id = $1
        ORDER BY ie.initiative_roll DESC
        "#,
    )
    .bind(request.battle_id)
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

    let total = Count {
        count: entries.len() as i64,
    };
    Ok(PageResponse::new(entries, total))
}
