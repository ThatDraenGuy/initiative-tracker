use deadpool_postgres::Client;
use itertools::Itertools;
use once_cell::sync::Lazy;
use tokio_pg_mapper::FromTokioPostgresRow;

use crate::{
    domain::{
        conditions::add_condition,
        pagination::{Count, PageRequest, PageResponse},
    },
    errors::AppError,
    sql::{prepare_count, prepare_insert, prepare_select},
};

use super::{handler::FindAbilityRequest, Ability, NewAbilty};

static SELECT: Lazy<String> = Lazy::new(prepare_select::<Ability>);
static COUNT: Lazy<String> = Lazy::new(prepare_count::<Ability>);
static INSERT: Lazy<String> = Lazy::new(prepare_insert::<Ability, NewAbilty>);

pub async fn create(client: &Client, entity: NewAbilty) -> Result<Ability, AppError> {
    let stmt = client.prepare_cached(INSERT.as_str()).await?;

    Ok(client
        .query(&stmt, &entity.as_sql_values())
        .await?
        .into_iter()
        .map(Ability::from_row)
        .exactly_one()
        .or(Err(AppError::InvalidReturnCount))??)
}

pub async fn find(
    client: &Client,
    condition: FindAbilityRequest,
    page_request: PageRequest,
) -> Result<PageResponse<Ability>, AppError> {
    let stmt = add_condition(SELECT.as_str(), &condition);
    let stmt = page_request.apply(&stmt);

    let stmt = client.prepare_cached(&stmt).await?;

    let result = client
        .query(&stmt, &[])
        .await?
        .into_iter()
        .map(Ability::from_row)
        .collect::<Result<Vec<Ability>, tokio_pg_mapper::Error>>()?;

    let count_stmt = add_condition(COUNT.as_str(), &condition);
    let count_stmt = client.prepare_cached(&count_stmt).await?;

    Ok(PageResponse::new(
        result,
        client
            .query(&count_stmt, &[])
            .await?
            .into_iter()
            .map(Count::try_from)
            .exactly_one()
            .or(Err(AppError::InvalidReturnCount))??,
    ))
}
