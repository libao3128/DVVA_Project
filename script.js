
function make_left_page(){
    let myDiv = document.getElementsByClassName('left-page')[0]
    
    // Build Button Panel
    let buttonDiv = document.createElement('div')
    buttonDiv.name = 'button-panel'
    buttonDiv.style.height = '7%'
    buttonDiv.className = 'sub-sub-page'
    myDiv.appendChild(buttonDiv)

    var button = document.createElement("BUTTON");
    button.innerHTML = 'Rain';
    button.className = 'DisplayButton leftButton'
    button.id = 'rain_button'
    button.onclick = button_onclick
    button.style.backgroundColor = 'rgba(1, 131, 186, 0.18)'
    buttonDiv.appendChild(button)

    var button = document.createElement("BUTTON");
    button.innerHTML = 'Temperature';
    button.className = 'DisplayButton rightButton'
    button.id = 'temp_button'
    button.onclick = button_onclick
    buttonDiv.appendChild(button)


    // Build Chart
    let mapDiv = document.createElement('div')
    mapDiv.id = 'mapDiv'
    mapDiv.style.height = '80%'
    myDiv.appendChild(mapDiv)
    make_map()

    // new add
    mapDiv.on('plotly_click', function(data){
        alert(''+data.points[0].lon+'\n'+data.points[0].lat);
    });


    //Build Input Bar
    let barDiv = document.createElement('div')
    barDiv.id = 'barDiv'
    barDiv.style.width = '100%'
    barDiv.style.height = '10%'
    myDiv.appendChild(barDiv)

    let month_barDiv = document.createElement('div')
    month_barDiv.className = 'sub-sub-page'
    barDiv.appendChild(month_barDiv)


    var month_bar = document.createElement('input')
    month_bar.type = 'range'
    month_bar.id = 'month_bar'
    month_bar.min = 0
    month_bar.max = 12
    month_bar.step = 1
    month_bar.value = String(month)
    month_bar.style.width = '75%'
    month_bar.style.marginRight = '20px'
    month_bar.oninput = input_onchange
    month_barDiv.appendChild(month_bar)

    var month_labelDiv = document.createElement('div')
    month_labelDiv.style.width = '5%'
    month_labelDiv.id = 'month_bar_label'
    var month_label = document.createTextNode(getMonthName(month))
    month_labelDiv.appendChild(month_label)
    
    month_barDiv.appendChild(month_labelDiv)


    let year_barDiv = document.createElement('div')
    year_barDiv.className = 'sub-sub-page'
    barDiv.appendChild(year_barDiv)


    var year_bar = document.createElement('input')
    year_bar.type = 'range'
    year_bar.id = 'year_bar'
    year_bar.min = 1990
    year_bar.max = 2022
    year_bar.step = 1
    year_bar.value = String(year)
    year_bar.style.width = '75%'
    year_bar.style.marginRight = '20px'
    year_bar.oninput = input_onchange
    year_barDiv.appendChild(year_bar)

    var year_labelDiv = document.createElement('div')
    year_labelDiv.style.width = '5%'
    year_labelDiv.id = 'year_bar_label'
    var year_label = document.createTextNode(year)
    
    year_labelDiv.appendChild(year_label)

    year_barDiv.appendChild(year_labelDiv)
    
}
function make_map(){
    getMapData(year, month, display_type)
    var data = [
        {
            type: "scattermapbox",
            fill: "toself",
            lon: [121, 121, 120, 120],
            lat: [23, 22.5, 23, 22.5],
            marker: { size: 10, color: "orange" }
        }
    ];
    
    var layout = {
        mapbox: {
            style: "stamen-terrain",
            center: { lon: 120.9738819, lat: 23.97565 },
            zoom: 6.5
        },
        showlegend: false,
        autosize:true,
        //height: 770,
        //width: 600,
        margin:{
            b: 50,
            t: 50,
        }
    };
    
    Plotly.newPlot("mapDiv", data, layout);
}
function make_right_page(){
    let rightDiv = document.getElementsByClassName('right-page')[0]
    
    var heatmapDiv = document.createElement('div')
    heatmapDiv.className = 'sub-sub-page'
    heatmapDiv.id = 'heatDiv'
    heatmapDiv.style.height = '50%'
    heatmapDiv.style.width = '100%'
    rightDiv.appendChild(heatmapDiv)
    make_heat_map()

    var barchartDiv = document.createElement('div')
    barchartDiv.className = 'sub-sub-page'
    barchartDiv.id = 'barchartDiv'
    barchartDiv.style.height = '25%'
    rightDiv.appendChild(barchartDiv)
    make_bar_chart()

    var linechartDiv = document.createElement('div')
    linechartDiv.className = 'sub-sub-page'
    linechartDiv.id = 'linechartDiv'
    linechartDiv.style.height = '25%'
    rightDiv.appendChild(linechartDiv)
    make_line_chart()
}
function make_heat_map(){
    y = [...Array(12).keys()].map(function(number) {
        return getMonthName(number + 1);
      })
    
    console.log(y)
    var data = [
      {
        z: [[1, 30, 30, 50, 1], [20, 1, 60, 80, 30], [30, 60, 1, -10, 20]],
        x: ['123f','f123','1s23','12a3','12s3'],
        y: ['Jan', 'Feb', 'Mar'],
        type: 'heatmap',
        hoverongaps: false
      }
    ];
    var layout = {
        autosize:true,
        margin: {
            //l: 50,
            //r: 50,
            b: 50,
            t: 50,
            pad: 4
          }
    };

    Plotly.newPlot('heatDiv', data, layout);
}
function make_bar_chart(){
    var trace1 = {
        x: ['giraffes', 'orangutans', 'monkeys'],
        y: [20, 14, 23],
        name: 'SF Zoo',
        type: 'bar'
    };
      
    var trace2 = {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [12, 18, 29],
      name: 'LA Zoo',
      type: 'bar'
    };
      
    var data = [trace1, trace2];
    
    var layout = {
        autosize:true,
        barmode: 'group',
        margin: {
            //l: 50,
            //r: 50,
            b: 50,
            t: 50,
            pad: 4
          }
    };
    
    Plotly.newPlot('barchartDiv', data, layout);
}
function make_line_chart(){
    var trace1 = {
        x: [1, 2, 3, 4],
        y: [0, 2, 3, 5],
        fill: 'tozeroy',
        type: 'scatter'
      };
      
      var trace2 = {
        x: [1, 2, 3, 4],
        y: [3, 5, 1, 7],
        fill: 'tonexty',
        type: 'scatter'
      };
      var layout = {
        autosize:true,
        barmode: 'group',
        margin: {
            //l: 50,
            //r: 50,
            b: 50,
            t: 50,
            pad: 4
          }
    };
      var data = [trace1, trace2];
      
      Plotly.newPlot('linechartDiv', data, layout);
}
function input_onchange(element){
    let name = element.target.id
    let val = element.target.value
    
    var label = document.getElementById(name+'_label')
    if (name.includes('year')){
        label.textContent = String(val)
        year = val
    }
    else{
        label.textContent = String(getMonthName(val))
        month = val
    }
    
}
function button_onclick(element){
    let name = element.target.id
    var rain_button = document.getElementById('rain_button')
    var temp_button = document.getElementById('temp_button')
    if (name.includes('rain')){
        display_type = 'Rain'
        rain_button.style.backgroundColor = 'rgba(1, 131, 186, 0.18)'
        temp_button.style.backgroundColor = '#fafafa'
        rain_button.className = ' DisplayButton leftButton'
    }
    if (name.includes('temp')){
        display_type = 'Temperature'
        rain_button.style.backgroundColor = '#fafafa'
        temp_button.style.backgroundColor = 'rgba(255, 157, 136, 0.18)'
    }
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', { month: 'short' });
}

function getMapData(year, month, type){
    
    fetch('http://exodus.tw/api/getDataByMonth.php',headers={
        'year':year,
        'month':month,
       'type':type,
        'apikey':'sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6'
    })
    
    //fetch('http://exodus.tw/api/getDataByMonth.php?year=2015&month=3&type=Temperature&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6')
    .then((response)=>{
        alert('fetch success')
        return response

    })
    .catch((error)=>{
        console.log(error)
        alert('fetch error')
    })
    //http://exodus.tw/api/getDataByMonth.php?year=2015&month=3&type=Temperature&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6
    // year: int, month: int
    // type= 'Rain' or 'Temperature'
    // retrun the data of ['type' value] and its ['WGS84_Lon'] and ['WGS84_Lat']
}
function getHeatData(lon, lat, type){
    // lon: WGS84_Lon, lat: WGS84_Lat
    // type= 'Rain' or 'Temperature'
    // return [Year, Month, value]
}
function getYearData(lon, lat, year, type){
    // lon: WGS84_Lon, lat: WGS84_Lat
    // year: if year is -1, return the average of all history data
    // type= 'Rain' or 'Temperature'
    // return [Month, value]
}

  
var display_type = 'Rain'
var month = 6
var year = 2022
make_left_page()
make_right_page()