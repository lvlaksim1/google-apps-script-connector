function doGet(e) {
  var p = e && e.parameter ? e.parameter : {};

  if (p.mode === 'read' && p.nonce) {
    var key = 'relay_' + String(p.nonce);
    var value = PropertiesService.getScriptProperties().getProperty(key);

    return ContentService
      .createTextOutput(value === null ? 'NOT_FOUND' : value)
      .setMimeType(ContentService.MimeType.TEXT);
  }

  var probe = p.probe ? String(p.probe) : 'none';

  return ContentService
    .createTextOutput([
      'CHAT_GAS_RELAY_OK',
      'probe=' + probe,
      'time=' + new Date().toISOString()
    ].join('\n'))
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var body = e && e.postData && typeof e.postData.contents === 'string'
    ? e.postData.contents
    : '';

  var nonce = '';
  try {
    var parsed = JSON.parse(body);
    nonce = parsed && parsed.nonce ? String(parsed.nonce) : '';
  } catch (err) {
    nonce = '';
  }

  if (!/^[A-Za-z0-9._-]{1,120}$/.test(nonce)) {
    return ContentService
      .createTextOutput('INVALID_NONCE')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  PropertiesService
    .getScriptProperties()
    .setProperty('relay_' + nonce, body);

  return ContentService
    .createTextOutput('STORED\nnonce=' + nonce)
    .setMimeType(ContentService.MimeType.TEXT);
}
