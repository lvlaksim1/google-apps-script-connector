function doGet(e) {
  var probe = e && e.parameter && e.parameter.probe
    ? String(e.parameter.probe)
    : 'none';

  return ContentService
    .createTextOutput([
      'CHAT_GAS_RELAY_OK',
      'probe=' + probe,
      'time=' + new Date().toISOString()
    ].join('\n'))
    .setMimeType(ContentService.MimeType.TEXT);
}
