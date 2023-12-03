use diesel::{PgConnection, QueryDsl, RunQueryDsl, SelectableHelper, TextExpressionMethods};

use crate::{
    domain::{
        conditions::{MatchMode, StringMatchCapable},
        pagination::{PageRequest, Paginate},
    },
    errors::AppError,
};

use super::{handler::FindAbilityRequest, Ability, NewAbilty};

pub fn create(conn: &mut PgConnection, entity: NewAbilty) -> Result<Ability, AppError> {
    use crate::schema::ability::dsl::*;

    Ok(diesel::insert_into(ability)
        .values(&entity)
        .returning(Ability::as_returning())
        .get_result(conn)?)
}

pub fn find(
    conn: &mut PgConnection,
    condition: FindAbilityRequest,
    page_request: PageRequest,
) -> Result<(Vec<Ability>, i64), AppError> {
    use crate::schema::ability::dsl::*;

    let mut query = ability.into_boxed();

    if let Some(condition_name) = condition.name {
        query = query.filter(ability_name.like(condition_name.into_match(MatchMode::Inner)));
    }

    Ok(query.paginate(page_request).load_and_count(conn)?)
}
