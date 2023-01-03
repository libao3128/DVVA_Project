function make_left_page(){
    let myDiv = document.getElementsByClassName('left-page')[0]
    console.log(myDiv)
    let buttonDiv = document.createElement('div')
    buttonDiv.name = 'button-panel'
    buttonDiv.style.height = '7%'
    myDiv.appendChild(buttonDiv)

    var button = document.createElement("BUTTON");
    button.innerHTML = 'Rain';
    button.className = 'DisplayButton leftButton'
    buttonDiv.appendChild(button)

    var button = document.createElement("BUTTON");
    button.innerHTML = 'Temperature';
    button.className = 'DisplayButton rightButton'
    buttonDiv.appendChild(button)
    
}

make_left_page()