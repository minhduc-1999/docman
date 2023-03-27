#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use core::panic;
use std::{
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH}
};

use serde::{Deserialize, Serialize};
use sqlite::{self, Connection, State, Value };
use std::fmt;
#[derive(Deserialize, Serialize, Debug)]
struct Information {
    id: i64,
    acceptance_no: String,
    accepted_at: i64,
    plaintiff: String,
    defendant: String,
    description: Option<String>,
    law: Option<String>,
    //Investigation
    inv_investigator: Option<String>,
    inv_designation_no: Option<String>,
    inv_designated_at: Option<i64>,
    inv_status: Option<i64>,
    inv_handling_no: Option<String>,
    inv_handled_at: Option<i64>,
    inv_transferred_at: Option<i64>,
    inv_extended_at: Option<i64>,
    inv_recovered_at: Option<i64>,
    inv_canceled_at: Option<i64>,
    //Prosecution
    pro_procurator: Option<String>,
    pro_designation_no: Option<String>,
    pro_designated_at: Option<i64>,
    pro_additional_evidence_requirement: Option<String>,
    pro_non_prosecution_decision: Option<String>,
    pro_cessation_decision: Option<String>,
    created_at: Option<i64>,
    deleted_at: Option<i64>,
    updated_at: Option<i64>,
}

#[derive(Deserialize, Debug)]
enum Order {
    ASC,
    DESC,
}

impl fmt::Display for Order {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Order::ASC => write!(f, "ASC"),
            Order::DESC => write!(f, "DESC"),
        }
    }
}

#[derive(Deserialize, Debug)]
struct InformationPageQueryOption {
    offset: i64,
    limit: i64,
    order: Order,
    search: Option<String>,
}

impl Default for InformationPageQueryOption {
    fn default() -> Self {
        InformationPageQueryOption {
            offset: 0,
            limit: 10,
            order: Order::DESC,
            search: None,
        }
    }
}

#[tauri::command]
fn get_new_information_list<'r>(
    conn_mut: tauri::State<'r, Mutex<Connection>>,
    query_opt: InformationPageQueryOption,
) -> Result<(Vec<Information>, Option<i64>), String> {
    let conn = conn_mut.lock().expect("Fail to get connection");
    let mut bindValues = vec![
        (":offset", query_opt.offset.into()),
        (":limit", query_opt.limit.into()),
    ];
    let mut query = String::from("
        SELECT *, count(*) OVER() as total
        FROM information
        WHERE
            inv_investigator IS NULL AND
            inv_designation_no IS NULL AND
            pro_procurator IS NULL AND
            pro_designation_no IS NULL
        ORDER BY
            created_at ASC
        LIMIT :limit
        OFFSET :offset
    ");

    if let Some(term) = query_opt.search {
        query = format!("{}{}{}{}{}{}{}", "
        SELECT *, count(*) over() as total
        FROM information
        WHERE 
            inv_investigator IS NULL AND
            inv_designation_no IS NULL AND
            pro_procurator IS NULL AND
            pro_designation_no IS NULL AND 
            (acceptance_no like '%", &term[..], "%' OR
        	plaintiff like '%" , &term[..] ,"%' OR
        	defendant like '%" , &term[..] ,"%')
        ORDER BY
            created_at ASC
        LIMIT :limit
        OFFSET :offset
    ");
    }

    let mut statement = conn.prepare::<&str>(&query[..]).unwrap();
    let bind_result = statement
        .bind::<&[(_, Value)]>(
            &bindValues[..],
        );
    
    if let Err(err) = bind_result {
        println!("Fail to bind statement: {:?}", err);
        return Err("Fail to get list information".into())
    }

    

    let mut informations: Vec<Information> = Vec::new();
    let mut total_item: Option<i64> = None;
    while let Ok(State::Row) = statement.next() {
        let infor = Information {
            id: statement.read::<i64, _>("id").unwrap(),
            acceptance_no: statement.read::<String, _>("acceptance_no").unwrap(),
            accepted_at: statement.read::<i64, _>("accepted_at").unwrap(),
            plaintiff: statement.read::<String, _>("plaintiff").unwrap(),
            defendant: statement.read::<String, _>("defendant").unwrap(),
            description: statement.read::<String, _>("description").ok(),
            law: statement.read::<String, _>("law").ok(),
            inv_investigator: statement.read::<String, _>("inv_investigator").ok(),
            inv_designated_at: statement.read::<i64, _>("inv_designated_at").ok(),
            inv_designation_no: statement.read::<String, _>("inv_designation_no").ok(),
            inv_status: statement.read::<i64, _>("inv_status").ok(),
            inv_handled_at: statement.read::<i64, _>("inv_handled_at").ok(),
            inv_handling_no: statement.read::<String, _>("inv_handling_no").ok(),
            inv_transferred_at: statement.read::<i64, _>("inv_transferred_at").ok(),
            inv_canceled_at: statement.read::<i64, _>("inv_canceled_at").ok(),
            inv_recovered_at: statement.read::<i64, _>("inv_recovered_at").ok(),
            inv_extended_at: statement.read::<i64, _>("inv_extended_at").ok(),
            pro_procurator: statement.read::<String, _>("pro_procurator").ok(),
            pro_designated_at: statement.read::<i64, _>("pro_designated_at").ok(),
            pro_designation_no: statement.read::<String, _>("pro_designation_no").ok(),
            pro_additional_evidence_requirement: statement
                .read::<String, _>("pro_additional_evidence_requirement")
                .ok(),
            pro_cessation_decision: statement.read::<String, _>("pro_cessation_decision").ok(),
            pro_non_prosecution_decision: statement
                .read::<String, _>("pro_non_prosecution_decision")
                .ok(),
            created_at: statement.read::<i64, _>("created_at").ok(),
            updated_at: statement.read::<i64, _>("updated_at").ok(),
            deleted_at: statement.read::<i64, _>("deleted_at").ok(),
        };
        informations.push(infor);
        if total_item.is_none() {
            total_item = statement.read::<i64, _>("total").ok();
        }
    }
    Ok((informations, total_item))
}



#[tauri::command]
fn get_information_list<'r>(
    conn_mut: tauri::State<'r, Mutex<Connection>>,
    query_opt: InformationPageQueryOption,
) -> Result<(Vec<Information>, Option<i64>), String> {
    let conn = conn_mut.lock().expect("Fail to get connection");
    let mut bindValues = vec![
        (":offset", query_opt.offset.into()),
        (":limit", query_opt.limit.into()),
    ];
    let mut query = String::from("
        SELECT *, count(*) OVER() as total
        FROM information
        ORDER BY
            created_at ASC
        LIMIT :limit
        OFFSET :offset
    ");

    if let Some(term) = query_opt.search {
        query = format!("{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}", "
        SELECT *, count(*) over() as total
        FROM information
        WHERE 
        	acceptance_no like '%", &term[..], "%' OR
        	plaintiff like '%" , &term[..] ,"%' OR
        	defendant like '%" , &term[..] ,"%' OR
        	inv_investigator like '%" , &term[..] ,"%' OR
        	pro_procurator like '%" , &term[..] ,"%' OR
        	inv_designation_no like '%" , &term[..] ,"%' OR
        	pro_designation_no like '%" , &term[..] ,"%'
        ORDER BY
            created_at ASC
        LIMIT :limit
        OFFSET :offset
    ");
    }

    let mut statement = conn.prepare::<&str>(&query[..]).unwrap();
    let bind_result = statement
        .bind::<&[(_, Value)]>(
            &bindValues[..],
        );
    
    if let Err(err) = bind_result {
        println!("Fail to bind statement: {:?}", err);
        return Err("Fail to get list information".into())
    }

    

    let mut informations: Vec<Information> = Vec::new();
    let mut total_item: Option<i64> = None;
    while let Ok(State::Row) = statement.next() {
        let infor = Information {
            id: statement.read::<i64, _>("id").unwrap(),
            acceptance_no: statement.read::<String, _>("acceptance_no").unwrap(),
            accepted_at: statement.read::<i64, _>("accepted_at").unwrap(),
            plaintiff: statement.read::<String, _>("plaintiff").unwrap(),
            defendant: statement.read::<String, _>("defendant").unwrap(),
            description: statement.read::<String, _>("description").ok(),
            law: statement.read::<String, _>("law").ok(),
            inv_investigator: statement.read::<String, _>("inv_investigator").ok(),
            inv_designated_at: statement.read::<i64, _>("inv_designated_at").ok(),
            inv_designation_no: statement.read::<String, _>("inv_designation_no").ok(),
            inv_status: statement.read::<i64, _>("inv_status").ok(),
            inv_handled_at: statement.read::<i64, _>("inv_handled_at").ok(),
            inv_handling_no: statement.read::<String, _>("inv_handling_no").ok(),
            inv_transferred_at: statement.read::<i64, _>("inv_transferred_at").ok(),
            inv_canceled_at: statement.read::<i64, _>("inv_canceled_at").ok(),
            inv_recovered_at: statement.read::<i64, _>("inv_recovered_at").ok(),
            inv_extended_at: statement.read::<i64, _>("inv_extended_at").ok(),
            pro_procurator: statement.read::<String, _>("pro_procurator").ok(),
            pro_designated_at: statement.read::<i64, _>("pro_designated_at").ok(),
            pro_designation_no: statement.read::<String, _>("pro_designation_no").ok(),
            pro_additional_evidence_requirement: statement
                .read::<String, _>("pro_additional_evidence_requirement")
                .ok(),
            pro_cessation_decision: statement.read::<String, _>("pro_cessation_decision").ok(),
            pro_non_prosecution_decision: statement
                .read::<String, _>("pro_non_prosecution_decision")
                .ok(),
            created_at: statement.read::<i64, _>("created_at").ok(),
            updated_at: statement.read::<i64, _>("updated_at").ok(),
            deleted_at: statement.read::<i64, _>("deleted_at").ok(),
        };
        informations.push(infor);
        if total_item.is_none() {
            total_item = statement.read::<i64, _>("total").ok();
        }
    }
    Ok((informations, total_item))
}

#[tauri::command]
fn create_information(
    conn_mut: tauri::State<Mutex<Connection>>,
    information: Information,
) -> Result<(), String> {
    let conn = conn_mut.lock().unwrap();
    print!("{:?}", information);
    let query = "
        INSERT INTO information (
            acceptance_no,
            accepted_at,
            plaintiff,
            defendant,
            description,
            law,
            inv_investigator,
            inv_designation_no,
            inv_designated_at,
            inv_status,
            inv_handling_no,
            inv_handled_at,
            inv_transferred_at,
            inv_extended_at,
            inv_recovered_at,
            inv_canceled_at,
            pro_procurator,
            pro_designation_no,
            pro_designated_at,
            pro_additional_evidence_requirement,
            pro_non_prosecution_decision,
            pro_cessation_decision,
            created_at
        ) 
        values (
            :acceptance_no,
            :accepted_at,
            :plaintiff,
            :defendant,
            :description,
            :law,
            :inv_investigator,
            :inv_designation_no,
            :inv_designated_at,
            :inv_status,
            :inv_handling_no,
            :inv_handled_at,
            :inv_transferred_at,
            :inv_extended_at,
            :inv_recovered_at,
            :inv_canceled_at,
            :pro_procurator,
            :pro_designation_no,
            :pro_designated_at,
            :pro_additional_evidence_requirement,
            :pro_non_prosecution_decision,
            :pro_cessation_decision,
            :created_at
        )
        ";

    let mut statement = conn.prepare(query).unwrap();
    statement
        .bind::<&[(_, Value)]>(
            &[
                (":acceptance_no", information.acceptance_no.into()),
                (":accepted_at", information.accepted_at.to_string().into()),
                (":plaintiff", information.plaintiff.into()),
                (":defendant", information.defendant.into()),
                (
                    ":description",
                    information
                        .description
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":law",
                    information
                        .law
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_investigator",
                    information
                        .inv_investigator
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_designation_no",
                    information
                        .inv_designation_no
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_designated_at",
                    information
                        .inv_designated_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_status",
                    information
                        .inv_status
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_handling_no",
                    information
                        .inv_handling_no
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_handled_at",
                    information
                        .inv_handled_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_transferred_at",
                    information
                        .inv_transferred_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_extended_at",
                    information
                        .inv_extended_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_recovered_at",
                    information
                        .inv_recovered_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_canceled_at",
                    information
                        .inv_canceled_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_procurator",
                    information
                        .pro_procurator
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_designation_no",
                    information
                        .pro_designation_no
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_designated_at",
                    information
                        .pro_designated_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_additional_evidence_requirement",
                    information
                        .pro_additional_evidence_requirement
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_non_prosecution_decision",
                    information
                        .pro_non_prosecution_decision
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_cessation_decision",
                    information
                        .pro_cessation_decision
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":created_at",
                    (SystemTime::now()
                        .duration_since(UNIX_EPOCH)
                        .unwrap()
                        .as_millis() as i64)
                        .into(),
                ),
            ][..],
        )
        .unwrap();

    match statement.next() {
        Ok(_) => return Ok(()),
        Err(err) => {
            println!("{}", err);
            return Err("Fail to save information".into());
        }
    }
}

#[tauri::command]
fn update_information(
    conn_mut: tauri::State<Mutex<Connection>>,
    information: Information,
) -> Result<(), String> {
    let conn = conn_mut.lock().unwrap();
    print!("update {:?}", information);
    let query = "
        UPDATE information
        SET
            acceptance_no = :acceptance_no,
            accepted_at = :accepted_at,
            plaintiff = :plaintiff,
            defendant = :defendant,
            description = :description,
            law = :law,
            inv_investigator = :inv_investigator,
            inv_designation_no = :inv_designation_no,
            inv_designated_at = :inv_designated_at,
            inv_status=  :inv_status,
            inv_handling_no = :inv_handling_no,
            inv_handled_at = :inv_handled_at,
            inv_transferred_at = :inv_transferred_at,
            inv_extended_at = :inv_extended_at,
            inv_recovered_at = :inv_recovered_at,
            inv_canceled_at = :inv_canceled_at,
            pro_procurator = :pro_procurator,
            pro_designation_no = :pro_designation_no,
            pro_designated_at = :pro_designated_at,
            pro_additional_evidence_requirement = :pro_additional_evidence_requirement,
            pro_non_prosecution_decision = :pro_non_prosecution_decision,
            pro_cessation_decision = :pro_cessation_decision,
            updated_at = :updated_at
        WHERE
            id = :id
        ";

    let mut statement = conn.prepare(query).unwrap();
    statement
        .bind::<&[(_, Value)]>(
            &[
                (":id", information.id.into()),
                (":acceptance_no", information.acceptance_no.into()),
                (":accepted_at", information.accepted_at.to_string().into()),
                (":plaintiff", information.plaintiff.into()),
                (":defendant", information.defendant.into()),
                (
                    ":description",
                    information
                        .description
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":law",
                    information
                        .law
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_investigator",
                    information
                        .inv_investigator
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_designation_no",
                    information
                        .inv_designation_no
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_designated_at",
                    information
                        .inv_designated_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_status",
                    information
                        .inv_status
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_handling_no",
                    information
                        .inv_handling_no
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_handled_at",
                    information
                        .inv_handled_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_transferred_at",
                    information
                        .inv_transferred_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_extended_at",
                    information
                        .inv_extended_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_recovered_at",
                    information
                        .inv_recovered_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":inv_canceled_at",
                    information
                        .inv_canceled_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_procurator",
                    information
                        .pro_procurator
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_designation_no",
                    information
                        .pro_designation_no
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_designated_at",
                    information
                        .pro_designated_at
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_additional_evidence_requirement",
                    information
                        .pro_additional_evidence_requirement
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_non_prosecution_decision",
                    information
                        .pro_non_prosecution_decision
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":pro_cessation_decision",
                    information
                        .pro_cessation_decision
                        .map_or(Value::from(()), |value| value.into()),
                ),
                (
                    ":updated_at",
                    (SystemTime::now()
                        .duration_since(UNIX_EPOCH)
                        .unwrap()
                        .as_millis() as i64)
                        .into(),
                ),
            ][..],
        )
        .unwrap();

    match statement.next() {
        Ok(_) => return Ok(()),
        Err(err) => {
            println!("{}", err);
            return Err("Fail to save information".into());
        }
    }
}

fn main() {
    let base_path = match home::home_dir() {
        Some(path) => path.display().to_string(),
        None => panic!("Impossible to get your home dir!"),
    };
    let conn_mut = Mutex::new(sqlite::open(base_path + "/db/docman.db".into()).unwrap_or_else(|err| {
        println!("Error: {}", err);
        panic!("Cannot initialize database connection")
    }));
    let query = "
        CREATE TABLE IF NOT EXISTS information (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            acceptance_no VARCHAR(50) NOT NULL UNIQUE, 
            accepted_at INTEGER NOT NULL,
            plaintiff NVARCHAR(100) NOT NULL,
            defendant NVARCHAR(100) NOT NULL,
            description TEXT,
            law NVARCHAR(200),
            inv_investigator NVARCHAR(100),
            inv_designation_no VARCHAR(50),
            inv_designated_at INTEGER,
            inv_status TINYINT,
            inv_handling_no VARCHAR(50),
            inv_handled_at INTEGER,
            inv_transferred_at INTEGER,
            inv_extended_at INTEGER,
            inv_recovered_at INTEGER,
            inv_canceled_at INTEGER,
            pro_procurator NVARCHAR(100),
            pro_designation_no VARCHAR(50),
            pro_designated_at INTEGER,
            pro_additional_evidence_requirement TEXT,
            pro_non_prosecution_decision TEXT,
            pro_cessation_decision TEXT,
            created_at INTEGER NOT NULL,
            deleted_at INTEGER,
            updated_at INTEGER
        );
    ";
    conn_mut.lock().unwrap().execute(query).unwrap();
    tauri::Builder::default()
        .manage(conn_mut)
        .invoke_handler(tauri::generate_handler![
            create_information,
            get_information_list,
            get_new_information_list,
            update_information
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
