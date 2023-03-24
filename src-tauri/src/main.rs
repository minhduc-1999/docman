#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use core::panic;
use std::{
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};

use serde::Deserialize;
use sqlite::{self, Connection, State, Value};


#[derive(Deserialize)]
struct Information {
    acceptance_no: String,
    accepted_at: i64,
    plaintiff: String,
    defendant: String,
    description: Option<String>,
    law: Option<String>,
    //Investigation
    inv_investigator: Option<String>,
    inv_designation_no:  Option<String>,
    inv_designated_at: Option<i64>,
    inv_status: Option<i64>,
    inv_handling_no:  Option<String>,
    inv_handled_at: Option<i64>,
    inv_transferred_at: Option<i64>,
    inv_extended_at: Option<i64>,
    inv_recovered_at: Option<i64>,
    inv_canceled_at: Option<i64>,
    //Prosecution
    pro_procurator:  Option<String>,
    pro_designation_no:  Option<String>,
    pro_designated_at: Option<i64>,
    pro_additional_evidence_requirement:  Option<String>,
    pro_non_prosecution_decision:  Option<String>,
    pro_cessation_decision:  Option<String>,
    created_at: Option<i64>,
    deleted_at: Option<i64>,
    updated_at: Option<i64>
}

enum Order {
    ASC,
    DESC,
}

struct InformationPageQueryOption {
    page: u32,
    size: u32,
    order: Order,
}

impl Default for InformationPageQueryOption {
    fn default() -> Self {
        InformationPageQueryOption {
            page: 0,
            size: 10,
            order: Order::DESC,
        }
    }
}


#[tauri::command]
fn create_information(conn_mut: tauri::State<Mutex<Connection>>, information: Information) -> Result<(), String> {
    let conn = conn_mut.lock().unwrap();
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
                (":description", information.description.map_or(Value::from(()), |value|  value.into())),
                (":law", information.law.map_or(Value::from(()), |value|  value.into())),
                (":inv_investigator", information.inv_investigator.map_or(Value::from(()), |value|  value.into())),
                (":inv_designation_no", information.inv_designation_no.map_or(Value::from(()), |value|  value.into())),
                (":inv_designated_at", information.inv_designated_at.map_or(Value::from(()), |value|  value.into())),
                (":inv_status", information.inv_status.map_or(Value::from(()), |value|  value.into())),
                (":inv_handling_no", information.inv_handling_no.map_or(Value::from(()), |value|  value.into())),
                (":inv_handled_at", information.inv_handled_at.map_or(Value::from(()), |value|  value.into())),
                (":inv_transferred_at", information.inv_transferred_at.map_or(Value::from(()), |value|  value.into())),
                (":inv_extended_at", information.inv_extended_at.map_or(Value::from(()), |value|  value.into())),
                (":inv_recovered_at", information.inv_recovered_at.map_or(Value::from(()), |value|  value.into())),
                (":inv_canceled_at", information.inv_canceled_at.map_or(Value::from(()), |value|  value.into())),
                (":pro_procurator", information.pro_procurator.map_or(Value::from(()), |value|  value.into())),
                (":pro_designation_no", information.pro_designation_no.map_or(Value::from(()), |value|  value.into())),
                (":pro_designated_at", information.pro_designated_at.map_or(Value::from(()), |value|  value.into())),
                (":pro_additional_evidence_requirement", information.pro_additional_evidence_requirement.map_or(Value::from(()), |value|  value.into())),
                (":pro_non_prosecution_decision", information.pro_non_prosecution_decision.map_or(Value::from(()), |value|  value.into())),
                (":pro_cessation_decision", information.pro_cessation_decision.map_or(Value::from(()), |value|  value.into())),
                (
                    ":created_at",
                    (SystemTime::now()
                        .duration_since(UNIX_EPOCH)
                        .unwrap()
                        .as_secs() as i64)
                        .into(),
                ),
            ][..],
        )
        .unwrap();

    match statement.next() {
        Ok(_) => return Ok(()),
        Err(err) => {
            println!("{}", err);
            return Err("Fail to save information".into())
        }
        
    }
}

fn main() {
    let connectionMutex = Mutex::new(sqlite::open("./db/docman.db").unwrap_or_else(|err| {
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
    connectionMutex.lock().unwrap().execute(query).unwrap();
    tauri::Builder::default()
        .manage(connectionMutex)
        .invoke_handler(tauri::generate_handler![create_information])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
