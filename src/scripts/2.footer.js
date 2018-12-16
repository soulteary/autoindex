var dataSets = document.getElementsByTagName('pre')[0].innerHTML.split('\n');
var directoryUp = false;
var tpl = '';

for (var i = 0, j = dataSets.length - 1; i < j; i++) {
  var line = dataSets[i];
  if (line.indexOf('../') === -1) {
    line = line.match(/^(.*)\s+(\S+\s\S+)\s+(\S+)/);
    tpl += '<tr>' +
        '<td>' + line[1] + '</td>' +
        '<td>' + '<span class="date" datetime="' + new Date(line[2]) + '">' + line[2] + '</span>' + '</td>' +
        '<td>' + line[3] + '</td>' +
        '</tr>';
  } else {
    if (location.pathname !== '/') directoryUp = true;
  }
}

if (directoryUp) tpl = '<tr><td colspan="3"><a href="..">..</a></td></tr>' + tpl;

document.getElementsByTagName('tbody')[0].innerHTML = tpl;
timeago().render(document.querySelectorAll('.date'));
