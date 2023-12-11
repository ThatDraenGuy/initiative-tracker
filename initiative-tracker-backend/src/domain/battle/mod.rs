use initiative_tracker_backend::derive_entity;
pub mod actions;
pub mod handler;

#[derive_entity]
pub struct Battle {
    pub battle_id: i64,
    pub round_number: i32,
    pub current_character_index: i32,
    pub character_amount: i64,
}

pub struct StartedBattle {
    pub battle_id: i64,
}
