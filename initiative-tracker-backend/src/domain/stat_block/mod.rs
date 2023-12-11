use initiative_tracker_backend::derive_entity;

use super::{
    ability_score::AbilityScore, creature_type::CreatureType,
    damage_type_modifier::DamageTypeModifier, skill::Skill, stat_block_brief::StatBlockBrief,
};

pub mod actions;
pub mod handler;

#[derive_entity]
pub struct StatBlock {
    pub stat_block_id: i64,
    pub entity_name: String,
    pub hit_points: i32,
    pub hit_dice_type: Option<i32>,
    pub hit_dice_count: Option<i32>,
    pub armor_class: i32,
    pub speed: i32,
    pub level: Option<i32>,
    pub creature_type: CreatureType,
    pub ability_scores: Vec<AbilityScore>,
    pub proficient_skills: Vec<Skill>,
    pub damage_type_modifiers: Vec<DamageTypeModifier>,
}
impl StatBlock {
    pub fn new(
        brief: StatBlockBrief,
        ability_scores: Vec<AbilityScore>,
        proficient_skills: Vec<Skill>,
        damage_type_modifiers: Vec<DamageTypeModifier>,
    ) -> Self {
        Self {
            stat_block_id: brief.stat_block_id,
            entity_name: brief.entity_name,
            hit_points: brief.hit_points,
            hit_dice_type: brief.hit_dice_type,
            hit_dice_count: brief.hit_dice_count,
            armor_class: brief.armor_class,
            speed: brief.speed,
            level: brief.level,
            creature_type: brief.creature_type,
            ability_scores,
            proficient_skills,
            damage_type_modifiers,
        }
    }
}
