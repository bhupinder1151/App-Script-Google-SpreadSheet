function doPost(e) {

  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    
    let data = JSON.parse(e.postData.contents)

    const doc = SpreadsheetApp.openById(data.spreadsheetId)
    const sheet = doc.getSheetByName(data.sheetName)    

    const nextRow = sheet.getLastRow() + 1

    const newRow = data.formData;

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': newRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}
