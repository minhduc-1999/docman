#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use core::panic;
use std::{
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};

use chrono::{FixedOffset, NaiveDateTime, TimeZone};
use rusqlite::{named_params, Connection, Result, Row};
use serde::{Deserialize, Serialize};
use std::fmt;
use tauri::api::path;
use xlsxwriter::{prelude::FormatAlignment, Format, Workbook, Worksheet, XlsxError};

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
    let mut query: String = String::from(
        "
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
    ",
    );

    if query_opt.search.is_some() {
        query = String::from(
            "
            SELECT *, count(*) over() as total
                FROM information
            WHERE 
                inv_investigator IS NULL AND
                inv_designation_no IS NULL AND
                pro_procurator IS NULL AND
                pro_designation_no IS NULL AND 
                (
                    acceptance_no like :term OR
        	        plaintiff like :term OR
        	        defendant like :term OR
        	        inv_investigator like :term OR
        	        pro_procurator like :term OR
        	        inv_designation_no like :term OR
        	        pro_designation_no like :term
                )
            ORDER BY created_at ASC
            LIMIT :limit
            OFFSET :offset
        ",
        );
    }

    let mut stmt = conn.prepare(&query).unwrap();

    let mut rows = if let Some(term) = query_opt.search {
        stmt.query(named_params! {
            ":term": format!("%{}%", term),
            ":limit": query_opt.limit,
            ":offset": query_opt.offset
        })
        .unwrap()
    } else {
        stmt.query(named_params! {
            ":limit": query_opt.limit,
            ":offset": query_opt.offset
        })
        .unwrap()
    };

    let mut informations: Vec<Information> = Vec::new();
    let mut total_item: Option<i64> = None;

    while let Ok(Some(row)) = rows.next() {
        let infor = read_from_row(row);
        informations.push(infor);
        if total_item.is_none() {
            total_item = row.get_unwrap("total");
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
    let mut query = String::from(
        "
        SELECT *, count(*) OVER() as total
        FROM information
        ORDER BY
            created_at ASC
        LIMIT :limit
        OFFSET :offset
    ",
    );

    if query_opt.search.is_some() {
        query = String::from(
            "
            SELECT *, count(*) over() as total
            FROM information
            WHERE 
        	    acceptance_no like :term OR
        	    plaintiff like :term OR
        	    defendant like :term OR
        	    inv_investigator like :term OR
        	    pro_procurator like :term OR
        	    inv_designation_no like :term OR
        	    pro_designation_no like :term
            ORDER BY
                created_at ASC
            LIMIT :limit
            OFFSET :offset
        ",
        );
    }

    let mut stmt = conn.prepare(&query).unwrap();
    let mut rows = if let Some(term) = query_opt.search {
        stmt.query(named_params! {
            ":term": format!("%{}%", term),
            ":limit": query_opt.limit,
            ":offset": query_opt.offset
        })
        .unwrap()
    } else {
        stmt.query(named_params! {
            ":limit": query_opt.limit,
            ":offset": query_opt.offset
        })
        .unwrap()
    };

    let mut information_list: Vec<Information> = Vec::new();
    let mut total_item: Option<i64> = None;

    while let Ok(Some(row)) = rows.next() {
        let infor_item = read_from_row(row);
        information_list.push(infor_item);
        if total_item.is_none() {
            total_item = row.get_unwrap("total");
        }
    }

    Ok((information_list, total_item))
}

#[tauri::command]
fn create_information(
    conn_mut: tauri::State<Mutex<Connection>>,
    information: Information,
) -> Result<(), String> {
    let conn: std::sync::MutexGuard<Connection> = conn_mut.lock().unwrap();
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

    let mut stmt = conn.prepare(query).unwrap();
    let save_result = stmt.execute(named_params! {
        ":acceptance_no": information.acceptance_no,
        ":accepted_at": information.accepted_at,
        ":plaintiff": information.plaintiff,
        ":defendant": information.defendant,
        ":description": information.description,
        ":law": information.law,
        ":inv_investigator": information.inv_investigator,
        ":inv_designation_no": information.inv_designation_no,
        ":inv_designated_at": information.inv_designated_at,
        ":inv_status": information.inv_status,
        ":inv_handling_no": information.inv_handling_no,
        ":inv_handled_at": information.inv_handled_at,
        ":inv_transferred_at": information.inv_transferred_at,
        ":inv_extended_at": information.inv_extended_at,
        ":inv_recovered_at": information.inv_recovered_at,
        ":inv_canceled_at": information.inv_canceled_at,
        ":pro_procurator": information.pro_procurator,
        ":pro_designation_no": information.pro_designation_no,
        ":pro_designated_at": information.pro_designated_at,
        ":pro_additional_evidence_requirement":information.pro_additional_evidence_requirement,
        ":pro_non_prosecution_decision":information.pro_non_prosecution_decision,
        ":pro_cessation_decision":information.pro_cessation_decision,
        ":created_at": (SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as i64)
    });

    if let Err(_) = save_result {
        return Err("Fail to save new information".into());
    }

    Ok(())
}

#[tauri::command]
fn update_information(
    conn_mut: tauri::State<Mutex<Connection>>,
    information: Information,
) -> Result<(), String> {
    let conn = conn_mut.lock().unwrap();
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

    let mut stmt = conn.prepare(query).unwrap();
    let result = stmt.execute(named_params! {
        ":id": information.id,
        ":acceptance_no": information.acceptance_no,
        ":accepted_at": information.accepted_at,
        ":plaintiff": information.plaintiff,
        ":defendant": information.defendant,
        ":description": information.description,
        ":law": information.law,
        ":inv_investigator": information.inv_investigator,
        ":inv_designation_no": information.inv_designation_no,
        ":inv_designated_at": information.inv_designated_at,
        ":inv_status": information.inv_status,
        ":inv_handling_no": information.inv_handling_no,
        ":inv_handled_at": information.inv_handled_at,
        ":inv_transferred_at": information.inv_transferred_at,
        ":inv_extended_at": information.inv_extended_at,
        ":inv_recovered_at": information.inv_recovered_at,
        ":inv_canceled_at": information.inv_canceled_at,
        ":pro_procurator": information.pro_procurator,
        ":pro_designation_no": information.pro_designation_no,
        ":pro_designated_at": information.pro_designated_at,
        ":pro_additional_evidence_requirement":information.pro_additional_evidence_requirement,
        ":pro_non_prosecution_decision":information.pro_non_prosecution_decision,
        ":pro_cessation_decision":information.pro_cessation_decision,
        ":updated_at": (SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as i64)
    });

    if let Err(e) = result {
        return Err("Fail to update information".into());
    }

    Ok(())
}

#[tauri::command]
fn delete_information(
    conn_mut: tauri::State<Mutex<Connection>>,
    ids: Vec<String>,
) -> Result<(), String> {
    let conn = conn_mut.lock().unwrap();
    let query = format!("DELETE FROM information WHERE id IN ({})", ids.join(","));
    let result = conn.prepare(&query).unwrap().execute(());
    if let Err(_) = result {
        return Err("Fail to delete information".into());
    }
    Ok(())
}

fn init_template(sheet: &mut Worksheet) -> Result<(), XlsxError> {
    let title_format = Format::new()
        .set_align(FormatAlignment::CenterAcross)
        .set_align(FormatAlignment::Center)
        .set_bold()
        .to_owned();
    sheet.merge_range(0, 0, 0, 21, "Số liệu tin báo", Some(&title_format))?;
    sheet.merge_range(1, 0, 1, 6, "Nội dung tin báo", Some(&title_format))?;
    sheet.merge_range(1, 7, 1, 15, "Cơ quan điếu tra", Some(&title_format))?;
    sheet.merge_range(1, 16, 1, 21, "Viện kiểm sát", Some(&title_format))?;

    sheet.write_string(2, 0, &format!("STT"), Some(&title_format))?;
    sheet.write_string(2, 1, &format!("Số TL"), Some(&title_format))?;
    sheet.write_string(2, 2, &format!("Ngày TL"), Some(&title_format))?;
    sheet.write_string(2, 3, &format!("Nguyên đơn"), Some(&title_format))?;
    sheet.write_string(2, 4, &format!("Bị đơn"), Some(&title_format))?;
    sheet.write_string(2, 5, &format!("Nội dung"), Some(&title_format))?;
    sheet.write_string(2, 6, &format!("Điều luật"), Some(&title_format))?;
    sheet.write_string(2, 7, &format!("Điều tra viên"), Some(&title_format))?;
    sheet.write_string(2, 8, &format!("Số PC"), Some(&title_format))?;
    sheet.write_string(2, 9, &format!("Ngày PC"), Some(&title_format))?;
    sheet.write_string(2, 10, &format!("Số"), Some(&title_format))?;
    sheet.write_string(2, 11, &format!("Ngày"), Some(&title_format))?;
    sheet.write_string(2, 12, &format!("Chuyển"), Some(&title_format))?;
    sheet.write_string(2, 13, &format!("Gia hạn"), Some(&title_format))?;
    sheet.write_string(2, 14, &format!("Phục hồi"), Some(&title_format))?;
    sheet.write_string(2, 15, &format!("Hủy"), Some(&title_format))?;
    sheet.write_string(2, 16, &format!("KSV thụ lý"), Some(&title_format))?;
    sheet.write_string(2, 17, &format!("Số QĐPC"), Some(&title_format))?;
    sheet.write_string(2, 18, &format!("Ngày"), Some(&title_format))?;
    sheet.write_string(
        2,
        19,
        &format!("Trao đổi/Yêu cầu BSCC"),
        Some(&title_format),
    )?;
    sheet.write_string(2, 20, &format!("Kết luận QĐKKT"), Some(&title_format))?;
    sheet.write_string(2, 21, &format!("Kết luận TĐC"), Some(&title_format))?;
    Ok(())
}

fn fill_data(sheet: &mut Worksheet, data: &Vec<Information>) -> Result<(), XlsxError> {
    let tz_offset = FixedOffset::east_opt(7 * 3600).unwrap();
    for (index, information) in data.iter().enumerate() {
        let row: u32 = (2 + index + 1).try_into().unwrap();
        sheet.write_string(row, 0, &format!("{}", index + 1), None)?;
        sheet.write_string(row, 1, &information.acceptance_no, None)?;

        sheet.write_string(
            row,
            2,
            &tz_offset
                .from_utc_datetime(
                    &NaiveDateTime::from_timestamp_millis(information.accepted_at)
                        .expect("Cannot convert accepted_at to Datetime"),
                )
                .format("%d-%m-%Y")
                .to_string(),
            None,
        )?;
        sheet.write_string(row, 3, &information.plaintiff, None)?;
        sheet.write_string(row, 4, &information.defendant, None)?;
        sheet.write_string(
            row,
            5,
            &information
                .description
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        )?;
        sheet.write_string(
            row,
            6,
            &information.law.as_ref().unwrap_or(&String::from("")),
            None,
        )?;

        sheet.write_string(
            row,
            7,
            &information
                .inv_investigator
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        )?;
        sheet.write_string(
            row,
            8,
            &information
                .inv_designation_no
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        )?;
        if let Some(inv_designated_at) = information.inv_designated_at {
            sheet.write_string(
                row,
                9,
                &tz_offset
                    .from_utc_datetime(
                        &NaiveDateTime::from_timestamp_millis(inv_designated_at)
                            .expect("Cannot convert inv_designated_at to Datetime"),
                    )
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            )?;
        } else {
            sheet.write_blank(row, 9, None)?;
        }

        sheet.write_string(
            row,
            10,
            &information
                .inv_handling_no
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        )?;

        if let Some(inv_handled_at) = information.inv_handled_at {
            sheet.write_string(
                row,
                11,
                &tz_offset
                    .from_utc_datetime(
                        &NaiveDateTime::from_timestamp_millis(inv_handled_at)
                            .expect("Cannot convert inv_handled_at to Datetime"),
                    )
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            )?;
        } else {
            sheet.write_blank(row, 11, None)?;
        }

        if let Some(inv_transferred_at) = information.inv_transferred_at {
            sheet.write_string(
                row,
                12,
                &tz_offset
                    .from_utc_datetime(
                        &NaiveDateTime::from_timestamp_millis(inv_transferred_at)
                            .expect("Cannot convert inv_transferred_at to Datetime"),
                    )
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            )?;
        } else {
            sheet.write_blank(row, 12, None)?;
        }

        if let Some(inv_extended_at) = information.inv_extended_at {
            sheet.write_string(
                row,
                13,
                &tz_offset
                    .from_utc_datetime(
                        &NaiveDateTime::from_timestamp_millis(inv_extended_at)
                            .expect("Cannot convert inv_extended_at to Datetime"),
                    )
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            )?;
        } else {
            sheet.write_blank(row, 13, None)?;
        }

        if let Some(inv_recovered_at) = information.inv_recovered_at {
            sheet.write_string(
                row,
                14,
                &tz_offset
                    .from_utc_datetime(
                        &NaiveDateTime::from_timestamp_millis(inv_recovered_at)
                            .expect("Cannot convert inv_recovered_at to Datetime"),
                    )
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            )?;
        } else {
            sheet.write_blank(row, 14, None)?;
        }

        if let Some(inv_canceled_at) = information.inv_canceled_at {
            sheet.write_string(
                row,
                15,
                &tz_offset
                    .from_utc_datetime(
                        &NaiveDateTime::from_timestamp_millis(inv_canceled_at)
                            .expect("Cannot convert inv_canceled_at to Datetime"),
                    )
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            )?;
        } else {
            sheet.write_blank(row, 15, None)?;
        }

        sheet.write_string(
            row,
            16,
            &information
                .pro_procurator
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        )?;
        sheet.write_string(
            row,
            17,
            &information
                .pro_designation_no
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        )?;
        if let Some(pro_designated_at) = information.pro_designated_at {
            sheet.write_string(
                row,
                18,
                &tz_offset
                    .from_utc_datetime(
                        &NaiveDateTime::from_timestamp_millis(pro_designated_at)
                            .expect("Cannot convert pro_designated_at to Datetime"),
                    )
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            )?;
        } else {
            sheet.write_blank(row, 18, None)?;
        }

        sheet.write_string(
            row,
            19,
            &information
                .pro_additional_evidence_requirement
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        )?;
        sheet.write_string(
            row,
            20,
            &information
                .pro_non_prosecution_decision
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        )?;
        sheet.write_string(
            row,
            21,
            &information
                .pro_cessation_decision
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        )?;
    }
    Ok(())
}

#[derive(Deserialize, Debug)]
struct ExportSetting {
    from: i64,
    to: i64,
    path: String,
}

#[tauri::command]
fn export_excel(
    conn_mut: tauri::State<Mutex<Connection>>,
    setting: ExportSetting,
) -> Result<String, String> {
    let conn = conn_mut.lock().unwrap();
    let query = "SELECT * FROM information WHERE accepted_at BETWEEN :from AND :to";
    let mut stmt = conn.prepare(&query).unwrap();
    let mut informations: Vec<Information> = Vec::new();
    let mut rows = stmt
        .query(&[(":from", &setting.from), (":to", &setting.to)])
        .unwrap();
    while let Ok(Some(row)) = rows.next() {
        let item = read_from_row(&row);
        informations.push(item);
    }
    let workbook = Workbook::new(&setting.path).expect("Cannot create workbook");
    let mut sheet = workbook
        .add_worksheet(None)
        .expect("Cannot create worksheet");

    if let Err(_) = init_template(&mut sheet) {
        return Err("Fail to initialize template".into());
    }

    if let Err(_) = fill_data(&mut sheet, &informations) {
        return Err("Fail to fill data into file".into());
    }

    workbook.close().expect("Fail to close workbook");

    Ok(setting.path.clone())
}

fn read_from_row(row: &Row) -> Information {
    Information {
        id: row.get_unwrap("id"),
        acceptance_no: row.get_unwrap("acceptance_no"),
        accepted_at: row.get_unwrap("accepted_at"),
        plaintiff: row.get_unwrap("plaintiff"),
        defendant: row.get_unwrap("defendant"),
        description: row.get_unwrap::<&str, Option<String>>("description"),
        law: row.get_unwrap::<&str, Option<String>>("law"),
        inv_investigator: row.get_unwrap::<&str, Option<String>>("inv_investigator"),
        inv_designated_at: row.get_unwrap::<&str, Option<i64>>("inv_designated_at"),
        inv_designation_no: row.get_unwrap::<&str, Option<String>>("inv_designation_no"),
        inv_status: row.get_unwrap::<&str, Option<i64>>("inv_status"),
        inv_handled_at: row.get_unwrap::<&str, Option<i64>>("inv_handled_at"),
        inv_handling_no: row.get_unwrap::<&str, Option<String>>("inv_handling_no"),
        inv_transferred_at: row.get_unwrap::<&str, Option<i64>>("inv_transferred_at"),
        inv_canceled_at: row.get_unwrap::<&str, Option<i64>>("inv_canceled_at"),
        inv_recovered_at: row.get_unwrap::<&str, Option<i64>>("inv_recovered_at"),
        inv_extended_at: row.get_unwrap::<&str, Option<i64>>("inv_extended_at"),
        pro_procurator: row.get_unwrap::<&str, Option<String>>("pro_procurator"),
        pro_designated_at: row.get_unwrap::<&str, Option<i64>>("pro_designated_at"),
        pro_designation_no: row.get_unwrap::<&str, Option<String>>("pro_designation_no"),
        pro_additional_evidence_requirement: row
            .get_unwrap::<&str, Option<String>>("pro_additional_evidence_requirement"),
        pro_cessation_decision: row.get_unwrap::<&str, Option<String>>("pro_cessation_decision"),
        pro_non_prosecution_decision: row
            .get_unwrap::<&str, Option<String>>("pro_non_prosecution_decision"),
        created_at: row.get_unwrap::<&str, Option<i64>>("created_at"),
        updated_at: row.get_unwrap::<&str, Option<i64>>("updated_at"),
        deleted_at: row.get_unwrap::<&str, Option<i64>>("deleted_at"),
    }
}

fn main() {
    let db_path = path::data_dir()
        .expect("Cannot get data dir")
        .join("docman.db")
        .display()
        .to_string();

    // let db_path = String::from("./db/docman.db");

    let conn_mut = Mutex::new(Connection::open(db_path).unwrap_or_else(|err| {
        println!("Error: {}", err);
        panic!("Cannot initialize database connection")
    }));
    let query: &str = "
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
    conn_mut
        .lock()
        .unwrap()
        .execute(query, ())
        .expect("Failed to initialize db");
    tauri::Builder::default()
        .manage(conn_mut)
        .invoke_handler(tauri::generate_handler![
            create_information,
            get_information_list,
            get_new_information_list,
            update_information,
            delete_information,
            export_excel
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
