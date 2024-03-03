// @ts-nocheck
function doGet(e) {
    let res = {}
    const sheetId = ""
    try {
      const sheet = SpreadsheetApp.openById(sheetId);
      res["config"] = getConfigTable('Р. Конфиг', sheet)
      const [offline, offlinePersons] = getScoringTable('Р. из Оффлайн', sheet)
      res["offline"] = offline
      const [online, onlinePersons] = getScoringTable('Р. из Онлайн', sheet)
      res["online"] = online
      res["medalsMeta"] = getSimpleKeyTable('Р. Медальки' ,sheet)
      res["persons"] = offlinePersons.concat(onlinePersons)
      console.log("persons", res["persons"].length, JSON.stringify(res["persons"]))
    } catch (error) {
      Logger.log(error)
      res = {"responce": error.toString(), "sheetId": sheetId} 
    }
    return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON)
  }
  
  
  function getSimpleKeyTable(tableName, sheet) {
    const rows = sheet.getSheetByName(tableName).getDataRange().getValues();
    const headers = rows[0].slice(1)
    const items = {}
    rows.slice(1).forEach((row) => {
      let item = {};
      let key = row[0]
      row.slice(1).forEach((cell, index) => {
        if (cell && String(cell).trim() !== "") {
          item[headers[index]] = cell
        }
      })
      // console.log({item})
      if (Object.keys(item).length) {items[key]=item}
    })
    console.log(tableName, JSON.stringify(items))
    return items
  }
  
  function getConfigTable(tableName, sheet) {
    let result = {}
    const rows = sheet.getSheetByName(tableName).getDataRange().getValues();
    const headers = rows[0]
  
    rows.slice(1).forEach((row) => {
      row.forEach((cell, index) => {
        const key = headers[index]
        let value
        if (String(cell).trim() !== "") {
          if (!Object.keys(result).includes(key)) {
            value = cell
          } else {
              const old = Array.isArray(result[key]) ? result[key] : [result[key]] 
              value = old.concat(cell)
              
          }
          result[key] = value
        }
      })
    })
    console.log(tableName, JSON.stringify(result))
    return result
  }
  
  function getSimpleTable(tableName, sheet) {
    const rows = sheet.getSheetByName(tableName).getDataRange().getValues();
    const headers = rows[0]
    const items = [] 
    rows.slice(1).forEach((row) => {
      let item = {};
      row.forEach((cell, index) => {
        if (String(cell).trim() !== "") {
          item[headers[index]] = cell
        }
      })
      if (Object.keys(item).length) {items.push(item)}
    })
    console.log(tableName, JSON.stringify(items))
    return items
  }
  
  
  const START_ROW = 10 - 1
  function getScoringTable(tableName, sheet) {
    const rows = sheet.getSheetByName(tableName).getDataRange().getValues();
    
    let table_result = {}
    table_result["enable"] = rows[0][1]
  
    const headers = rows[2].slice(1)
    const excluded_meta_rows = ["column_letter", "column_title"]
    let meta = {}
    rows.slice(3, START_ROW-1).forEach((row) => {
      const row_key = row[0]
      row.slice(1).forEach((cell, index) => {
        const header_key = headers[index]
        if (!excluded_meta_rows.includes(row_key) && String(cell).trim() !== "") {
          if (!(header_key in meta)) {
            meta[header_key] = {}
          }
          meta[header_key][row_key] = cell
        }
      })
    })
    
    table_result["meta"] = meta
    console.log({meta})
  
    const items = []
    rows.slice(START_ROW).forEach((row) => {
      let item = {};
      row.slice(1).forEach((cell, index) => {
        if (String(cell).trim() !== "") {
          item[headers[index]] = cell
        }
      })
      if (Object.keys(item).length) {items.push(item)}
    })
    
    console.log(tableName, items.length)
    console.log(tableName, JSON.stringify(table_result))
    return [table_result, items]
  }
  
  const temp = () => {
    console.log(0 == false)
  }