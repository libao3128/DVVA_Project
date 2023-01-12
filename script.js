
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
    make_map(mapDiv)
    //make_animation_map()
    


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
    month_bar.min = 1
    month_bar.max = 12
    month_bar.step = 1
    month_bar.value = String(month)
    month_bar.style.width = '75%'
    month_bar.style.marginRight = '20px'
    month_bar.oninput = input_onchange
    month_bar.onchange = update_map
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
    year_bar.min = 1960
    year_bar.max = 2020
    year_bar.step = 1
    year_bar.value = String(year)
    year_bar.style.width = '75%'
    year_bar.style.marginRight = '20px'
    year_bar.oninput = input_onchange
    year_bar.onchange = update_map
    year_barDiv.appendChild(year_bar)

    var year_labelDiv = document.createElement('div')
    year_labelDiv.style.width = '5%'
    year_labelDiv.id = 'year_bar_label'
    var year_label = document.createTextNode(year)
    
    year_labelDiv.appendChild(year_label)

    year_barDiv.appendChild(year_labelDiv)
    
}
async function make_map(){
    let mapDiv = document.getElementById('mapDiv')


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
        },
        colorbar: true,
        title:display_type+' scatter'
    };
    cur_mapdata = await this.getMapData(year, month, display_type)

    Plotly.newPlot("mapDiv", cur_mapdata, layout);
    // new add
    mapDiv.on('plotly_click', function(data){
        // console.log(data)
        // console.log('hehe', data.points[0]['marker.color'])
        selected_location = [data.points[0].lon, data.points[0].lat]
        var data = [
            {
                type: 'scattermapbox',
                lon: [selected_location[0]], lat: [selected_location[1]],
                marker: {color: ['#0A0A0A'], size: 24
                },
                name:'selected location'
            },
            {
                type: 'scattermapbox',
                lon: [selected_location[0]], lat: [selected_location[1]],
                marker: {color: [data.points[0]['marker.color']], colorscale: scl[display_type], size: 20, 
                    cmin:cmin[display_type], cmax:cmax[display_type]
                },
                name:'selected location'
            }
        ]
        Plotly.animate('mapDiv', {
            data: data,
            traces: [1, 2],
            layout: {}
        }, {
            transition: {
              duration: 500,
              easing: 'cubic-in-out'
            },
            frame: {
              duration: 500
            }
        })
       
        //make_map()
        update_line_chart()
        update_bar_chart()
        update_heat_map()
        
    });
    //console.log('data',data)
   
  
    /*
    var data = [
        {
            type: "scattermapbox",
            fill: "toself",
            lon: [121, 121, 120, 120],
            lat: [23, 22.5, 23, 22.5],
            marker: { size: 10, color: "orange" }
        }
    ];*/
    
    
    
    
}

function make_right_page1(){
    let rightDiv = document.getElementsByClassName('right-page1')[0]
    
    var heatmapDiv = document.createElement('div')
    heatmapDiv.className = 'sub-sub-page'
    heatmapDiv.id = 'heatDiv'
    heatmapDiv.style.height = '50%'
    heatmapDiv.style.width = '100%'
    rightDiv.appendChild(heatmapDiv)
    make_heat_map()
}

function make_right_page2(){
    let rightDiv = document.getElementsByClassName('right-page2')[0]

    var barchartDiv = document.createElement('div')
    barchartDiv.className = 'sub-sub-page'
    barchartDiv.id = 'barchartDiv'
    barchartDiv.style.height = '25%'
    rightDiv.appendChild(barchartDiv)
    make_bar_chart()
}

function make_right_page3(){
    let rightDiv = document.getElementsByClassName('right-page3')[0]

    var linechartDiv = document.createElement('div')
    linechartDiv.className = 'sub-sub-page'
    linechartDiv.id = 'linechartDiv'
    linechartDiv.style.height = '25%'
    rightDiv.appendChild(linechartDiv)
    make_line_chart()
}

var prev_heatdata, cur_heatdata;
async function make_heat_map(){
    cur_heatdata = JSON.parse(JSON.stringify( await this.getHeatData()));
    var layout = {
        autosize:true,
        margin: {
            //l: 50,
            //r: 50,
            b: 50,
            t: 50,
            pad: 4
          },
        title:'Selected Location '+display_type+' Heat Map'
    };

    Plotly.newPlot('heatDiv', cur_heatdata, layout);
}
async function update_heat_map() {
    prev_heatdata = JSON.parse(JSON.stringify(cur_heatdata));
    cur_heatdata = JSON.parse(JSON.stringify(await this.getHeatData()));
    
    // console.log(prev_heatdata);
    // console.log(cur_heatdata);
    var layout = {
        autosize:true,
        margin: {
            //l: 50,
            //r: 50,
            b: 50,
            t: 50,
            pad: 4
          },
        title:'Selected Location '+display_type+' Heat Map'
    };
    let pnum = 15;
    for (var i = 0; i <= pnum; i++) {
        var cal = prev_heatdata[0].z.map((a, idx) => a.map((b,idx2) =>  b*(pnum-i)/pnum + cur_heatdata[0].z[idx][idx2]*i/pnum));
        // console.log(cal);
        var new_heatdata = JSON.parse(JSON.stringify(cur_heatdata));
        new_heatdata[0].z = cal;
        Plotly.animate('heatDiv', {
            data: new_heatdata,
            traces: [0],
            layout: layout
          }, {
            transition: {
              duration: 30,
              easing: 'cubic-in-out'
            },
            frame: {
              duration: 30
            }
          })
    }
}

async function make_bar_chart(){
    var data = await this.getYearData('Rain');
    
    var layout = {
        yaxis: {
            range: [0, Math.max(...data[0].y)+100],
            title: {
                text: 'mm'
            }
        },
        barmode: 'group',
        margin: {
            //l: 50,
            //r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
        title:'Selected Location Cummulative Rain Drop'
    
    };
    
    Plotly.newPlot('barchartDiv', data, layout);
}

async function update_bar_chart() {
    var data = await this.getYearData('Rain');
    await Plotly.animate('barchartDiv', {
        data: data,
        traces: [0],
        layout: {}
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        }
    })
    await Plotly.animate('barchartDiv', {
        data: [],
        traces: [],
        layout: {
            yaxis: {range: [0, Math.max(...data[0].y)*1.1]}
        }
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        }
    })
}

async function make_line_chart(){
    var data = await this.getYearData('Temperature');

    var layout = {
        yaxis: {
            range: [Math.min(...data[2].y)-2, Math.max(...data[1].y)+2],
            title: {
                text: '\xB0C'
            }
        },
        barmode: 'group',
        margin: {
            //l: 50,
            //r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
        title:'Selected Location Average Temperature'
    };
      
    Plotly.newPlot('linechartDiv', data, layout);
}

async function update_line_chart() {
    var data = await this.getYearData('Temperature');
    await Plotly.animate('linechartDiv', {
        data: data,
        traces: [0, 1, 2],
        layout: {}
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        }
    });
    await Plotly.animate('linechartDiv', {
        data: [],
        traces: [],
        layout: {
            yaxis: {range: [Math.min(...data[2].y)-2, Math.max(...data[1].y)+2]}
        }
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        }
    });
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
var prev_mapdata, cur_mapdata;
async function update_map(){
    // console.log('123')
    /*
    var data = await getMapData(year, month, display_type)
    Plotly.animate('mapDiv', {
        data: data,
        traces: [0],
        layout: {}
      }, {
        transition: {
          duration: 500,
          easing: 'cubic-in-out'
        },
        frame: {
          duration: 500
        }
      })
*/

      prev_mapdata = JSON.parse(JSON.stringify(cur_mapdata));
      cur_mapdata = JSON.parse(JSON.stringify(await getMapData(year, month, display_type)));
      
      //console.log(prev_mapdata[0].marker.color);
      // console.log(cur_heatdata);
      let pnum = 5;
      for (var i = 0; i <= pnum; i++) {
          var cal = prev_mapdata[0].marker.color.map((b,idx2) =>  b*(pnum-i)/pnum + cur_mapdata[0].marker.color[idx2]*i/pnum);
          //console.log(cal);
          var new_mapdata = JSON.parse(JSON.stringify(cur_mapdata));
          new_mapdata[0].marker.color = cal;
          //console.log([new_mapdata[0], cur_mapdata[1]])
          Plotly.animate('mapDiv', {
              data: [new_mapdata[0], cur_mapdata[1]],
              traces: [0],
              layout: {}
            }, {
              transition: {
                duration: 120,
                easing: 'cubic-in-out'
              },
              frame: {
                duration: 120
              }
            })
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

    update_map()

    update_heat_map()


}
function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', { month: 'short' });
}


async function getMapData(){
    /*
    fetch('https://exodus.tw/api/getDataByMonth.php',headers={
        'year':String(year),
        'month':String(month),
       'type':type,
        'apikey':'sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6'
    })
    */
    return await fetch(`https://exodus.tw/api/getDataByMonth.php?year=${year}&month=${month}&type=${display_type}&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6`)
    .then(function(response){return response.json()} )
    .then(function(data) {
        // console.log(data['Result'])
        //var processed_data = []
        /*
        data['Result'].forEach(element => {
            let new_data_point = {
                type: "scattermapbox",
                fill: "toself",
                lon: [element.Lon-0.25, element.Lon-0.25, element.Lon+0.25, element.Lon+0.25],
                lat: [element.Lat-0.25, element.Lat+0.25, element.Lat+0.25, element.Lat-0.25],
                marker: { size: 10, color: element.TempValue}
            }
            processed_data.push(new_data_point)
            
        })
        */
        var pinvalue = data['Result'].find(ele => ele.Lon == selected_location[0] && ele.Lat == selected_location[1]).Value;
        var processed_data = [{
                type: 'scattermapbox',
                lon: data['Result'].map(a=>a.Lon), lat: data['Result'].map(a=>a.Lat),
                marker: {
                    color: data['Result'].map(a=>a.Value),
                    size: 10,
                    colorscale: scl[display_type],
                    cmin:cmin[display_type],
                    cmax:cmax[display_type],
                    colorbar: {
                        title: display_type
                    },
                    opacity:0.8
                },
                text:  data['Result'].map(a=>a.Value),
                name:display_type,
                
            },
            {
                type: 'scattermapbox',
                lon: [selected_location[0]], lat: [selected_location[1]],
                marker: {
                    color: ['#0A0A0A'],
                    size: 24, 
                },
            },
            {
                type: 'scattermapbox',
                lon: [selected_location[0]], lat: [selected_location[1]],
                marker: {
                    color: [pinvalue],
                    colorscale: scl[display_type],
                    size: 20, 
                    cmin:cmin[display_type],
                    cmax:cmax[display_type]
                },
            }

    
        ];
        
        // console.log(pinvalue);

        // console.log(processed_data)
        return processed_data
    })
    .catch((error)=>{
        console.log('fetch error', error)
        // alert('fetch error')
        return []

    })
    
    //http://exodus.tw/api/getDataByMonth.php?year=2015&month=3&type=Temperature&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6
    // year: int, month: int
    // type= 'Rain' or 'Temperature'
    // retrun the data of ['type' value] and its ['WGS84_Lon'] and ['WGS84_Lat']
}
async function getHeatData(){
    // lon: WGS84_Lon, lat: WGS84_Lat
    // type= 'Rain' or 'Temperature'
    // return [Year, Month, value]
    return await fetch('https://exodus.tw/api/getDataByLoc.php?lon='+String(selected_location[0])+'&lat='+String(selected_location[1])+'&type='+display_type+'&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6')
    .then(function(response){return response.json()} )
    .then(function(data) {
        var cmin = {
            'Rain':0,
            'Temperature':0
        }
        var cmax = {
            'Rain':30,
            'Temperature':30
        }
        let heat_unit = "";
        if (display_type == "Rain") {
            heat_unit = "(unit:mm)";
        } else {
            heat_unit = "(unit:\xB0C)";
        }
        var processed_data = {
            z: [],
            x: [],
            y: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            colorscale: scl[display_type],
            colorbar: {title: heat_unit},
            type: 'heatmap',
            hoverongaps: false
        };
        let cnt = 0, first = 1;
        data['Result'].forEach(element => {
            
            if (!processed_data.x.includes(element.Year)) {
                processed_data.x.push(element.Year);
            }
            cnt += 1;
            if (cnt > 12) {
                cnt = 1;
                first = 0;
                processed_data.z[cnt-1].push(parseInt(element.Value, 10));
            } else if (first == 1) {
                processed_data.z.push([parseInt(element.Value, 10)]);
            } else {
                processed_data.z[cnt-1].push(parseInt(element.Value, 10));
            }
        })
        return [processed_data]
    })
    .catch((error)=>{
        console.log(error)
        alert('fetch error')
        return []
    })
}
async function getYearData(type){
    // lon: WGS84_Lon, lat: WGS84_Lat
    // year: if year is -1, return the average of all history data
    // type= 'Rain' or 'Temperature'
    // return [Month, value]
    return await fetch('https://exodus.tw/api/getYearDataByLoc.php?lon='+selected_location[0]+'&lat='+selected_location[1]+'&type='+type+'&apikey=sucaYRergn4frDMCcFpjPPkEf6EXcNpMT7dcWbp6')
    .then(function(response){return response.json()} )
    .then(function(data) {
        // console.log(data['Result'])
        
        if(type == 'Rain'){
            var bar1 = {
                x: data['Result'].map(x => x.Year),
                y: data['Result'].map(x => x.Value),
                name: 'Rain',
                type: 'bar'
            };
            var processed_data = [bar1];
        }else if(type == 'Temperature'){
            var line1 = {
                x: data['Result'].map(x => x.Year),
                y: data['Result'].map(x => x.Value),
                type: 'scatter',
                name: 'average'
            };
            
            var line2 = {
                x: data['Result'].map(x => x.Year),
                y: data['Result'].map(x => x.MaxValue),
                type: 'scatter',
                name:'max'
            };
            
            var line3 = {
                x: data['Result'].map(x => x.Year),
                y: data['Result'].map(x => x.MinValue),
                type: 'scatter',
                name: 'min'
            };
            var processed_data = [line1, line2, line3];
        }
        
        // console.log(processed_data)
        return processed_data
    })
    .catch((error)=>{
        console.log(error)
        return []
    })
}

  
var display_type = 'Rain'
var month = 6
var year = 2020
var selected_location = [120.4, 23.5]
var scl = {
    'Rain':[ [0,'rgb(255, 255, 255)'], [1/3,'rgb(0,100,156)'], [1,'rgb(0,0,0)']],
    'Temperature':[[0,'rgb(119, 207, 252)'], [2/3, 'rgb(255,243,103)'], [1,'rgb(253,33,2)'],]
}
var cmin = {
    'Rain':0,
    'Temperature':0
}
var cmax = {
    'Rain':30,
    'Temperature':30
}

make_left_page()
make_right_page1()
make_right_page2()
make_right_page3()