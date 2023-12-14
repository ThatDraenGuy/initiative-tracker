use initiative_tracker_backend::derive_entity;

pub mod actions;
pub mod handler;

#[derive_entity]
pub struct CurrentStats {
    pub current_stats_id: i64,
    pub character_id: i64,
    pub current_hit_points: Option<i32>,
    pub temporary_hit_points: i32,
    pub current_hit_dice_count: Option<i32>,
    pub current_armor_class: Option<i32>,
    pub current_speed: Option<i32>,
}
