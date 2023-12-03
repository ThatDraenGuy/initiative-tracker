use actix_web::HttpResponse;
use diesel::pg::Pg;
use diesel::prelude::*;
use diesel::query_builder::*;
use diesel::query_dsl::methods::LoadQuery;
use diesel::sql_types::BigInt;
use itertools::Itertools;
use serde::Deserialize;
use serde::Serialize;
use validator::Validate;
use validator::ValidationError;

use super::sort::*;

#[derive(Deserialize, Validate)]
pub struct PageRequest {
    offset: Option<i64>,
    limit: Option<i64>,
    #[validate(custom = "validate_sort")]
    sort: Option<String>,
}

fn validate_sort(sort: &str) -> Result<(), ValidationError> {
    if let Some((_, dir)) = sort.split(',').collect_tuple() {
        if dir == "asc" || dir == "desc" {
            return Ok(());
        }
    }

    Err(ValidationError::new("Invalid sort argument"))
}

impl From<PageRequest> for Option<Sort> {
    fn from(value: PageRequest) -> Self {
        value.sort.map(|sort| {
            let split = sort.split(',').collect_vec();
            Sort {
                property: split[0].to_owned(),
                direction: if split[1] == "asc" {
                    SortDirection::Asc
                } else {
                    SortDirection::Desc
                },
            }
        })
    }
}

#[derive(Serialize)]
pub struct PageResponse<T: Serialize> {
    total: i64,
    items: Vec<T>,
}
impl<T: Serialize, F: Into<T>> From<(Vec<F>, i64)> for PageResponse<T> {
    fn from(value: (Vec<F>, i64)) -> Self {
        Self {
            total: value.1,
            items: value.0.into_iter().map(F::into).collect_vec(),
        }
    }
}
impl<T: Serialize> From<PageResponse<T>> for HttpResponse {
    fn from(value: PageResponse<T>) -> Self {
        HttpResponse::Ok().json(value)
    }
}

pub trait Paginate: Sized {
    fn paginate(self, page_request: PageRequest) -> Paginated<Self>;
}

impl<T> Paginate for T {
    fn paginate(self, page_request: PageRequest) -> Paginated<Self> {
        Paginated {
            query: self,
            offset: page_request.offset.unwrap_or(0),
            limit: page_request.limit,
            sort: page_request.into(),
        }
    }
}

#[derive(Debug, Clone, QueryId)]
pub struct Paginated<T> {
    query: T,
    offset: i64,
    limit: Option<i64>,
    sort: Option<Sort>,
}

impl<T> Paginated<T> {
    pub fn load_and_count<'a, U>(self, conn: &mut PgConnection) -> QueryResult<(Vec<U>, i64)>
    where
        Self: LoadQuery<'a, PgConnection, (U, i64)>,
    {
        let results = self.load::<(U, i64)>(conn)?;
        let total = results.get(0).map(|x| x.1).unwrap_or(0);
        let records = results.into_iter().map(|x| x.0).collect();
        Ok((records, total))
    }
}

impl<T: Query> Query for Paginated<T> {
    type SqlType = (T::SqlType, BigInt);
}

impl<T> RunQueryDsl<PgConnection> for Paginated<T> {}

impl<T> QueryFragment<Pg> for Paginated<T>
where
    T: QueryFragment<Pg>,
{
    fn walk_ast<'b>(&'b self, mut out: AstPass<'_, 'b, Pg>) -> QueryResult<()> {
        out.push_sql("SELECT *, COUNT(*) OVER () FROM (");
        self.query.walk_ast(out.reborrow())?;
        out.push_sql(") t");
        if let Some(sort) = &self.sort {
            out.push_sql(" ORDER BY ");
            out.push_sql(sort.to_string().as_str())
        }
        if let Some(limit) = &self.limit {
            out.push_sql(" LIMIT ");
            out.push_bind_param::<BigInt, _>(limit)?;
        }
        out.push_sql(" OFFSET ");
        out.push_bind_param::<BigInt, _>(&self.offset)?;
        Ok(())
    }
}
