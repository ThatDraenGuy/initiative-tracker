use initiative_tracker_backend::derive_response;

use crate::domain::ability::handler::AbililtyResponse;

use super::Skill;

#[derive_response]
pub struct SkillResponse {
    pub id: i64,
    pub name: String,
    pub ability: AbililtyResponse,
}
impl From<Skill> for SkillResponse {
    fn from(value: Skill) -> Self {
        Self {
            id: value.skill_id,
            name: value.skill_name,
            ability: value.ability.into(),
        }
    }
}
