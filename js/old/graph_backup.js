
google.load("visualization", "1", {packages:["timeline"]});

var xhr = new XMLHttpRequest();
var db;
xhr.open('GET', '../toilet.sqlite', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
        var Uints = new Uint8Array(this.response);
        db = new SQL.Database(Uints);
}

xhr.send();

function getDataWithID(id){
  var data = createDataTable(id);
  if (data.getNumberOfRows()>0){
    drawChart(data,id);
  } else {
    console.error("No Data collected yet");
  }
}

function getAmount(id){
  var data = createDataTable(id);
  var amount = data.getNumberOfRows();
  drawAmountData(amount,id);
}

function createDataTable(id){

  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'Toilet' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });

  var startDate = '';
  var stmt = db.prepare("SELECT timestamp, state FROM toilet_data WHERE id = "+id+" AND timestamp < date('now', '+1 day') ORDER BY timestamp");

  while(stmt.step()) {

      var row = stmt.getAsObject();

      if(row.state == 1){
        startDate = dateFromUTC(row.timestamp,'-');
        // console.log("on");
      }
      else{
        endDate = dateFromUTC(row.timestamp,'-');
        // console.log(endDate);
        if(startDate != ''){
          // console.log("start date empty")
          dataTable.addRows([[ ''+id,  new Date(startDate),  new Date(endDate) ]]);
          startDate = '';
        }
      }
  }
  return dataTable;
}

function drawChart(dataTable,id) {
  var element = document.getElementById('toilet'+id);
  var chart = new google.visualization.Timeline(element);

  var options = {
    colors: ['#00A9D4', '#5fbadd', '#f0f1f1'],
    timeline: { showRowLabels: false,
                rowLabelStyle: {fontName: 'Helvetica', fontSize: 36, color: '#000000' },
                barLabelStyle: { fontName: 'Helvetica', fontSize: 34 } }
  };

  chart.draw(dataTable, options);
}

function drawAmountData(amount,id){
  var element = document.getElementById('toilet_total'+id);
  element.innerHTML="Total:"+amount;
}

function dateFromUTC( dateAsString, ymdDelimiter ) {
  var pattern = new RegExp( "(\\d{4})" + ymdDelimiter + "(\\d{2})" + ymdDelimiter + "(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})" );
  var parts = dateAsString.match( pattern );
  return new Date( Date.UTC(
    parseInt( parts[1] )
  , parseInt( parts[2], 10 ) - 1
  , parseInt( parts[3], 10 )
  , parseInt( parts[4], 10 )
  , parseInt( parts[5], 10 )
  , parseInt( parts[6], 10 )
  , 0
  ));
}
