#[derive(Debug, Clone)]
pub enum SortDirection {
    Asc,
    Desc,
}
impl SortDirection {
    pub fn get(&self) -> &'static str {
        match self {
            SortDirection::Asc => "asc",
            SortDirection::Desc => "desc",
        }
    }
}

#[derive(Debug, Clone)]
pub struct Sort {
    pub property: String,
    pub direction: SortDirection,
}
impl ToString for Sort {
    fn to_string(&self) -> String {
        self.property.clone() + " " + self.direction.get()
    }
}
