use crate::{
    domain::{
        damage_type_modifier::DamageTypeModifier,
        skill::Skill,
        stat_block_brief::{handler::FindStatBlockBriefRequest, StatBlockBrief},
        Count, PageResponse,
    },
    errors::AppResult,
    DbPool,
};

use super::{
    handler::{CreateStatBlockRequest, FindStatBlockRequest},
    AbilityScore, StatBlock,
};

pub async fn create(conn: &DbPool, request: &CreateStatBlockRequest) -> AppResult<StatBlock> {
    let mut transaction = conn.begin().await?;

    let stat_block_brief: StatBlockBrief = sqlx::query_as(
        r#"
        WITH inserted AS (
            INSERT INTO stat_block
            (entity_name, hit_points, hit_dice_type, hit_dice_count, armor_class, speed, level, creature_type_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        ) SELECT * FROM inserted i
        INNER JOIN creature_type ct ON ct.creature_type_id = i.creature_type_id;
        "#
    )
    .bind(&request.entity_name)
    .bind(request.hit_points)
    .bind(request.hit_dice_type)
    .bind(request.hit_dice_count)
    .bind(request.armor_class)
    .bind(request.speed)
    .bind(request.level)
    .bind(request.creature_type_id)
    .fetch_one(&mut *transaction).await?;

    let mut ability_ids: Vec<i64> = Vec::with_capacity(request.ability_scores.len());
    let mut ability_scores: Vec<i32> = Vec::with_capacity(request.ability_scores.len());
    request.ability_scores.iter().for_each(|score| {
        ability_ids.push(score.ability_id);
        ability_scores.push(score.score);
    });

    let ability_scores: Vec<AbilityScore> = sqlx::query_as(
        r#"
        WITH inserted AS (
            INSERT INTO ability_scores
            (stat_block_id, ability_id, score)
            SELECT $1, u.* FROM UNNEST($2, $3) u
            RETURNING *
        ) SELECT * FROM inserted i
        INNER JOIN ability a ON a.ability_id = i.ability_id;
        "#,
    )
    .bind(stat_block_brief.stat_block_id)
    .bind(&ability_ids)
    .bind(&ability_scores)
    .fetch_all(&mut *transaction)
    .await?;

    let mut skill_ids: Vec<i64> = Vec::with_capacity(request.proficient_skills.len());
    request
        .proficient_skills
        .iter()
        .for_each(|skill| skill_ids.push(skill.skill_id));
    let proficient_skills: Vec<Skill> = sqlx::query_as(
        r#"
        WITH inserted AS (
            INSERT INTO proficient_skills 
            (stat_block_id, skill_id)
            SELECT $1, * FROM UNNEST($2)
            RETURNING *
        ) SELECT s.*, a.* FROM inserted i
        INNER JOIN skill s ON s.skill_id = i.skill_id
        INNER JOIN ability a ON a.ability_id = s.ability_id;
        "#,
    )
    .bind(stat_block_brief.stat_block_id)
    .bind(skill_ids)
    .fetch_all(&mut *transaction)
    .await?;

    let mut damage_type_ids: Vec<i64> = Vec::with_capacity(request.damage_type_modifiers.len());
    let mut damage_type_modifiers: Vec<f32> =
        Vec::with_capacity(request.damage_type_modifiers.len());
    request
        .damage_type_modifiers
        .iter()
        .for_each(|damage_type| {
            damage_type_ids.push(damage_type.damage_type_id);
            damage_type_modifiers.push(damage_type.modifier);
        });

    let damage_type_modifiers: Vec<DamageTypeModifier> = sqlx::query_as(
        r#"
        WITH inserted AS (
            INSERT INTO damage_type_modifiers
            (stat_block_id, damage_type_id, modifier)
            SELECT $1, u.* FROM UNNEST($2, $3) u
            RETURNING *
        ) SELECT * FROM inserted i
        INNER JOIN damage_type dt ON dt.damage_type_id = i.damage_type_id;
        "#,
    )
    .bind(stat_block_brief.stat_block_id)
    .bind(&damage_type_ids)
    .bind(&damage_type_modifiers)
    .fetch_all(&mut *transaction)
    .await?;

    transaction.commit().await?;

    Ok(StatBlock::new(
        stat_block_brief,
        ability_scores,
        proficient_skills,
        damage_type_modifiers,
    ))
}

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
