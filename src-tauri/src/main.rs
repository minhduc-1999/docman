#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use core::panic;
use std::{
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};

use chrono::{NaiveDateTime};
use serde::{Deserialize, Serialize};
use sqlite::{self, Connection, State, Statement, Value};
use std::fmt;
use tauri::api::path;
use xlsxwriter::{prelude::FormatAlignment, Format, Workbook};
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
    let bind_values = vec![
        (":offset", query_opt.offset.into()),
        (":limit", query_opt.limit.into()),
    ];
    let mut query = String::from(
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

    if let Some(term) = query_opt.search {
        query = format!(
            "{}{}{}{}{}{}{}",
            "
        SELECT *, count(*) over() as total
        FROM information
        WHERE 
            inv_investigator IS NULL AND
            inv_designation_no IS NULL AND
            pro_procurator IS NULL AND
            pro_designation_no IS NULL AND 
            (acceptance_no like '%",
            &term[..],
            "%' OR
        	plaintiff like '%",
            &term[..],
            "%' OR
        	defendant like '%",
            &term[..],
            "%')
        ORDER BY
            created_at ASC
        LIMIT :limit
        OFFSET :offset
    "
        );
    }

    let mut statement = conn.prepare::<&str>(&query[..]).unwrap();
    let bind_result = statement.bind::<&[(_, Value)]>(&bind_values[..]);

    if let Err(err) = bind_result {
        println!("Fail to bind statement: {:?}", err);
        return Err("Fail to get list information".into());
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
    let mut bind_values = vec![
        (":offset", query_opt.offset.into()),
        (":limit", query_opt.limit.into()),
    ];
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

    if let Some(term) = query_opt.search {
        query = format!(
            "{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}",
            "
        SELECT *, count(*) over() as total
        FROM information
        WHERE 
        	acceptance_no like '%",
            &term[..],
            "%' OR
        	plaintiff like '%",
            &term[..],
            "%' OR
        	defendant like '%",
            &term[..],
            "%' OR
        	inv_investigator like '%",
            &term[..],
            "%' OR
        	pro_procurator like '%",
            &term[..],
            "%' OR
        	inv_designation_no like '%",
            &term[..],
            "%' OR
        	pro_designation_no like '%",
            &term[..],
            "%'
        ORDER BY
            created_at ASC
        LIMIT :limit
        OFFSET :offset
    "
        );
    }

    let mut statement = conn.prepare::<&str>(&query[..]).unwrap();
    let bind_result = statement.bind::<&[(_, Value)]>(&bind_values[..]);

    if let Err(err) = bind_result {
        println!("Fail to bind statement: {:?}", err);
        return Err("Fail to get list information".into());
    }

    let mut informations: Vec<Information> = Vec::new();
    let mut total_item: Option<i64> = None;
    while let Ok(State::Row) = statement.next() {
        let infor = read_from_statement(&statement);
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

#[tauri::command]
fn delete_information(
    conn_mut: tauri::State<Mutex<Connection>>,
    ids: Vec<String>,
) -> Result<(), String> {
    let conn = conn_mut.lock().unwrap();
    let query = format!("DELETE FROM information WHERE id IN ({})", ids.join(","));
    let mut statement = conn.prepare(query).unwrap();
    match statement.next() {
        Ok(_) => return Ok(()),
        Err(err) => {
            println!("{}", err);
            return Err("Fail to delete information".into());
        }
    }
}

#[tauri::command]
async fn export_excel(conn_mut: tauri::State<'_, Mutex<Connection>>) -> Result<(), String> {
    let conn = conn_mut.lock().unwrap();
    let query = format!("SELECT * FROM information");
    let mut statement = conn.prepare(query).unwrap();
    let mut informations: Vec<Information> = Vec::new();
    while let Ok(State::Row) = statement.next() {
        let infor = read_from_statement(&statement);
        informations.push(infor);
    }
    let path = format!("./db/test.xlsx");
    let workbook = Workbook::new(&path).expect("Cannot create workbook");
    let mut sheet1 = workbook
        .add_worksheet(None)
        .expect("Cannot create worksheet");

    let title_format = Format::new()
        .set_align(FormatAlignment::CenterAcross)
        .set_align(FormatAlignment::Center)
        .set_bold()
        .to_owned();
    sheet1.merge_range(0, 0, 0, 22, "Số liệu tin báo", Some(&title_format));
    sheet1.merge_range(1, 1, 1, 6, "Nội dung tin báo", Some(&title_format));
    sheet1.merge_range(1, 7, 1, 15, "Cơ quan điếu tra", Some(&title_format));
    sheet1.merge_range(1, 16, 1, 22, "Viện kiểm sát", Some(&title_format));

    sheet1.write_string(2, 0, &format!("STT"), Some(&title_format));
    sheet1.write_string(2, 1, &format!("Số TL"), Some(&title_format));
    sheet1.write_string(2, 2, &format!("Ngày TL"), Some(&title_format));
    sheet1.write_string(2, 3, &format!("Nguyên đơn"), Some(&title_format));
    sheet1.write_string(2, 4, &format!("Bị đơn"), Some(&title_format));
    sheet1.write_string(2, 5, &format!("Nội dung"), Some(&title_format));
    sheet1.write_string(2, 6, &format!("Điều luật"), Some(&title_format));
    sheet1.write_string(2, 7, &format!("Điều tra viên"), Some(&title_format));
    sheet1.write_string(2, 8, &format!("Số PC"), Some(&title_format));
    sheet1.write_string(2, 9, &format!("Ngày PC"), Some(&title_format));
    sheet1.write_string(2, 10, &format!("Trạng thái"), Some(&title_format));
    sheet1.write_string(2, 11, &format!("Số"), Some(&title_format));
    sheet1.write_string(2, 12, &format!("Ngày"), Some(&title_format));
    sheet1.write_string(2, 13, &format!("Chuyển"), Some(&title_format));
    sheet1.write_string(2, 14, &format!("Gia hạn"), Some(&title_format));
    sheet1.write_string(2, 15, &format!("Phục hồi"), Some(&title_format));
    sheet1.write_string(2, 16, &format!("Hủy"), Some(&title_format));
    sheet1.write_string(2, 17, &format!("KSV thụ lý"), Some(&title_format));
    sheet1.write_string(2, 18, &format!("Số QĐPC"), Some(&title_format));
    sheet1.write_string(2, 19, &format!("Ngày"), Some(&title_format));
    sheet1.write_string(
        2,
        20,
        &format!("Trao đổi/Yêu cầu BSCC"),
        Some(&title_format),
    );
    sheet1.write_string(2, 21, &format!("Kết luận QĐKKT"), Some(&title_format));
    sheet1.write_string(2, 22, &format!("Kết luận TĐC"), Some(&title_format));

    for (index, information) in informations.iter().enumerate() {
        let row: u32 = (2 + index + 1).try_into().unwrap();
        sheet1.write_string(row, 0, &format!("{}", index + 1), None);
        sheet1.write_string(row, 1, &information.acceptance_no, None);

        sheet1.write_string(
            row,
            3,
            &NaiveDateTime::from_timestamp_millis(information.accepted_at)
                .expect("Cannot convert accepted_at to Datetime")
                .format("%d-%m-%Y")
                .to_string(),
            None,
        );
        sheet1.write_string(row, 4, &information.plaintiff, None);
        sheet1.write_string(row, 5, &information.defendant, None);
        sheet1.write_string(
            row,
            6,
            &information
                .description
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        );
        sheet1.write_string(
            row,
            7,
            &information.law.as_ref().unwrap_or(&String::from("")),
            None,
        );

        sheet1.write_string(
            row,
            8,
            &information
                .inv_investigator
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        );
        sheet1.write_string(
            row,
            10,
            &information
                .inv_designation_no
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        );
        if let Some(inv_designated_at) = information.inv_designated_at {
            sheet1.write_string(
                row,
                9,
                &NaiveDateTime::from_timestamp_millis(inv_designated_at)
                    .expect("Cannot convert inv_designated_at to Datetime")
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            );
        } else {
            sheet1.write_string(row, 9, "", None);
        }

        sheet1.write_string(
            row,
            11,
            &information
                .inv_handling_no
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        );

        if let Some(inv_handled_at) = information.inv_handled_at {
            sheet1.write_string(
                row,
                12,
                &NaiveDateTime::from_timestamp_millis(inv_handled_at)
                    .expect("Cannot convert inv_handled_at to Datetime")
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            );
        } else {
            sheet1.write_string(row, 12, "", None);
        }

        if let Some(inv_transferred_at) = information.inv_transferred_at {
            sheet1.write_string(
                row,
                13,
                &NaiveDateTime::from_timestamp_millis(inv_transferred_at)
                    .expect("Cannot convert inv_transferred_at to Datetime")
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            );
        } else {
            sheet1.write_string(row, 13, "", None);
        }

        if let Some(inv_extended_at) = information.inv_extended_at {
            sheet1.write_string(
                row,
                14,
                &NaiveDateTime::from_timestamp_millis(inv_extended_at)
                    .expect("Cannot convert inv_extended_at to Datetime")
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            );
        } else {
            sheet1.write_string(row, 14, "", None);
        }

        if let Some(inv_recovered_at) = information.inv_recovered_at {
            sheet1.write_string(
                row,
                15,
                &NaiveDateTime::from_timestamp_millis(inv_recovered_at)
                    .expect("Cannot convert inv_recovered_at to Datetime")
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            );
        } else {
            sheet1.write_string(row, 15, "", None);
        }

        if let Some(inv_canceled_at) = information.inv_canceled_at {
            sheet1.write_string(
                row,
                16,
                &NaiveDateTime::from_timestamp_millis(inv_canceled_at)
                    .expect("Cannot convert inv_canceled_at to Datetime")
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            );
        } else {
            sheet1.write_string(row, 16, "", None);
        }

        sheet1.write_string(
            row,
            17,
            &information
                .pro_procurator
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        );
        sheet1.write_string(
            row,
            18,
            &information
                .pro_designation_no
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        );
        if let Some(pro_designated_at) = information.pro_designated_at {
            sheet1.write_string(
                row,
                19,
                &NaiveDateTime::from_timestamp_millis(pro_designated_at)
                    .expect("Cannot convert pro_designated_at to Datetime")
                    .format("%d-%m-%Y")
                    .to_string(),
                None,
            );
        } else {
            sheet1.write_string(row, 19, "", None);
        }

        sheet1.write_string(
            row,
            20,
            &information
                .pro_additional_evidence_requirement
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        );
        sheet1.write_string(
            row,
            22,
            &information
                .pro_non_prosecution_decision
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        );
        sheet1.write_string(
            row,
            21,
            &information
                .pro_cessation_decision
                .as_ref()
                .unwrap_or(&String::from("")),
            None,
        );
    }

    workbook.close();

    Ok(())
}

fn read_from_statement(statement: &Statement) -> Information {
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
    infor
}

fn main() {
    // let db_path = path::data_dir()
    //     .expect("Cannot get data dir")
    //     .join("docman.db").display().to_string();

    let db_path = String::from("./db/docman.db");

    let conn_mut = Mutex::new(sqlite::open(db_path).unwrap_or_else(|err| {
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
    conn_mut.lock().unwrap().execute(query).unwrap();
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
