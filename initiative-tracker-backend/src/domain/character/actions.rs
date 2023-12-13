use itertools::Itertools;

use crate::{
    domain::{
        character_brief::{self, CharacterBrief},
        stat_block,
    },
    errors::AppResult,
    DbPool,
};

use super::{handler::CreateCharacterRequest, Character};

pub async fn find_by_ids(conn: &DbPool, ids: &[i64]) -> AppResult<Vec<Character>> {
    let characters_brief = character_brief::actions::find_by_ids(conn, ids).await?;

    let stat_block_ids = characters_brief
        .iter()
        .map(|character| character.stat_block.stat_block_id)
        .collect_vec();

    let stat_blocks = stat_block::actions::find_by_ids(conn, &stat_block_ids).await?;

    Ok(characters_brief
        .into_iter()
        .zip(stat_blocks.into_iter())
        .map(|(brief, stat_block)| Character::new(brief, stat_block))
        .collect_vec())
}

pub async fn create(conn: &DbPool, request: &CreateCharacterRequest) -> AppResult<CharacterBrief> {
    Ok(sqlx::query_as(
        r#"
        WITH inserted AS (
            INSERT INTO character (player_id, stat_block_id)
            VALUES ($1, $2)
            RETURNING *
        ) SELECT * FROM inserted i
        LEFT JOIN player p ON i.player_id = p.player_id
        INNER JOIN stat_block sb ON i.stat_block_id = sb.stat_block_id
        INNER JOIN creature_type ct ON sb.creature_type_id = ct.creature_type_id;
        "#,
    )
    .bind(request.player_id)
    .bind(request.stat_block_id)
    .fetch_one(conn)
    .await?)
}

pub async fn delete(conn: &DbPool, id: &i64) -> AppResult<()> {
    sqlx::query!(
        r#"
        DELETE FROM character
        WHERE character_id = $1
        "#,
        id
    )
    .execute(conn)
    .await?;
    Ok(())
}
