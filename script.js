
function make_left_page(){
    let myDiv = document.getElementsByClassName('left-page')[0]
    
    // Build Button Panel
    let buttonDiv = document.createElement('div')
    buttonDiv.name = 'button-panel'
    buttonDiv.style.height = '7%'
    buttonDiv.style.display = 'flex'
    buttonDiv.style.justifyContent = 'center'
    myDiv.appendChild(buttonDiv)

    var button = document.createElement("BUTTON");
    button.innerHTML = 'Rain';
    button.className = 'DisplayButton leftButton'
    buttonDiv.appendChild(button)

    var button = document.createElement("BUTTON");
    button.innerHTML = 'Temperature';
    button.className = 'DisplayButton rightButton'
    buttonDiv.appendChild(button)


    // Build Chart
    let mapDiv = document.createElement('div')
    mapDiv.id = 'mapDiv'
    myDiv.appendChild(mapDiv)
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
        height: 700,
        width: 600
    };
    
    Plotly.newPlot("mapDiv", data, layout);


    //Build Input Bar
    let barDiv = document.createElement('div')
    barDiv.id = 'barDiv'
    barDiv.width = '100%'
    barDiv.height = '20%'
    myDiv.appendChild(barDiv)

    let month_barDiv = document.createElement('div')
    month_barDiv.style.display = 'flex'
    month_barDiv.style.justifyContent = 'center'
    myDiv.appendChild(month_barDiv)


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
    year_barDiv.style.display = 'flex'
    year_barDiv.style.justifyContent = 'center'
    myDiv.appendChild(year_barDiv)


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

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', { month: 'short' });
}
  
var display_type = 'Rain'
var month = 6
var year = 2022
make_left_page()