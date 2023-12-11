use initiative_tracker_backend::derive_entity;

use super::HasId;

pub mod actions;
pub mod handler;

#[derive_entity]
pub struct Player {
    player_id: i64,
    player_name: String,
}
impl HasId for Player {
    fn id_col() -> &'static str {
        "player_id"
    }
}
