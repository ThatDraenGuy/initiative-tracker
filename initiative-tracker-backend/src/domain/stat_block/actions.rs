use crate::{
    domain::{
        damage_type_modifier::DamageTypeModifier, skill::Skill,
        stat_block_brief::handler::FindStatBlockBriefRequest, Count, PageResponse,
    },
    errors::AppResult,
    DbPool,
};

use super::{handler::FindStatBlockRequest, AbilityScore, StatBlock};

pub async fn find(
    conn: &DbPool,
    _condition: &FindStatBlockRequest,
) -> AppResult<PageResponse<StatBlock>> {
    let stat_blocks_brief =
        crate::domain::stat_block_brief::actions::find(conn, &FindStatBlockBriefRequest {}).await?;
    let total = stat_blocks_brief.total;

    let mut stat_blocks: Vec<StatBlock> = Vec::with_capacity(total as usize);
    for stat_block_brief in stat_blocks_brief.into_iter() {
        let scores: Vec<AbilityScore> = sqlx::query_as(
            r#"
            SELECT *
            FROM ability_scores abs
            INNER JOIN ability a ON abs.ability_id = a.ability_id
            WHERE abs.stat_block_id = $1
            "#,
        )
        .bind(stat_block_brief.stat_block_id)
        .fetch_all(conn)
        .await?;

        let skills: Vec<Skill> = sqlx::query_as(
            r#"
            SELECT s.*, a.*
            FROM proficient_skills ps
            INNER JOIN skill s ON ps.skill_id = s.skill_id
            INNER JOIN ability a ON s.ability_id = a.ability_id
            WHERE ps.stat_block_id = $1
            "#,
        )
        .bind(stat_block_brief.stat_block_id)
        .fetch_all(conn)
        .await?;

        let damage_type_mods: Vec<DamageTypeModifier> = sqlx::query_as(
            r#"
        SELECT *
        FROM damage_type_modifiers dtm
        INNER JOIN damage_type dt ON dt.damage_type_id = dtm.damage_type_id 
        WHERE dtm.stat_block_id = $1;
        "#,
        )
        .bind(stat_block_brief.stat_block_id)
        .fetch_all(conn)
        .await?;

        stat_blocks.push(StatBlock::new(
            stat_block_brief,
            scores,
            skills,
            damage_type_mods,
        ));
    }

    Ok(PageResponse::new(stat_blocks, Count { count: total }))
}
