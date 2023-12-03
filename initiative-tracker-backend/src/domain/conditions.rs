#[allow(unused)]
pub enum MatchMode {
    Start,
    End,
    Inner,
    Full,
}

pub trait StringMatchCapable {
    fn into_match(self, mode: MatchMode) -> String;
}

impl StringMatchCapable for String {
    fn into_match(self, mode: MatchMode) -> String {
        match mode {
            MatchMode::Start => "%".to_owned() + self.as_str(),
            MatchMode::End => self + "%",
            MatchMode::Inner => "%".to_owned() + self.as_str() + "%",
            MatchMode::Full => self,
        }
    }
}
