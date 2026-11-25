/**
 * PenDone Data — Optional App-Level Google Apps Script (Code.gs)
 * Scoped strictly to Workspace/app automations inside the user's permitted folder.
 * Global API routing & metering remain on Supabase Edge Functions (pendone-gateway).
 */

const APP_CONFIG = {
  APP_SLUG: "task-vault",
  FOLDER_ROOT: "PenDone",
  FILE_NAME: "data.json",
  UPDATABLE_INFO: ["notes", "user_status", "preferred_theme"],
  READ_ONLY_FIELDS: ["record_id", "issued_by", "verified_balance", "created_at"],
};

function getOrCreateAppFolder_() {
  const rootIter = DriveApp.getFoldersByName(APP_CONFIG.FOLDER_ROOT);
  const rootFolder = rootIter.hasNext()
    ? rootIter.next()
    : DriveApp.createFolder(APP_CONFIG.FOLDER_ROOT);

  const appIter = rootFolder.getFoldersByName(APP_CONFIG.APP_SLUG);
  return appIter.hasNext()
    ? appIter.next()
    : rootFolder.createFolder(APP_CONFIG.APP_SLUG);
}

function readUserAppRecord() {
  const folder = getOrCreateAppFolder_();
  const files = folder.getFilesByName(APP_CONFIG.FILE_NAME);
  if (!files.hasNext()) {
    const initial = {
      record_id: Utilities.getUuid(),
      issued_by: "PenDone Store",
      verified_balance: 0,
      created_at: new Date().toISOString(),
      notes: "",
      user_status: "active",
      preferred_theme: "dark",
    };
    folder.createFile(APP_CONFIG.FILE_NAME, JSON.stringify(initial, null, 2), MimeType.PLAIN_TEXT);
    return initial;
  }
  return JSON.parse(files.next().getBlob().getDataAsString());
}

function updateAllowedFields(payload) {
  const folder = getOrCreateAppFolder_();
  const files = folder.getFilesByName(APP_CONFIG.FILE_NAME);
  if (!files.hasNext()) {
    throw new Error("App storage file not initialized.");
  }

  const file = files.next();
  const current = JSON.parse(file.getBlob().getDataAsString());
  const allowed = new Set(APP_CONFIG.UPDATABLE_INFO);

  Object.keys(payload || {}).forEach(function (key) {
    if (!allowed.has(key)) {
      throw new Error("403 Forbidden: Field '" + key + "' is read-only.");
    }
    current[key] = payload[key];
  });

  file.setContent(JSON.stringify(current, null, 2));
  return current;
}
