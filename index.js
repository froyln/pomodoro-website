const body = document.getElementById("body");
const timer_screen = document.getElementById("contador");
const audio = new Audio('sources/button_sound.wav');
const modo = document.getElementById("modo");
const icono = document.getElementById("imagen_barra_de_paginas");
const notificacion_boton = document.getElementById("");
const button_siguiente = document.getElementById("button_siguiente"); 

audio.volume = 0.2;

var operacion = "pomodoro";
var pausa_button;
var estado;

let start_button = document.getElementById("start_button");

start_button.addEventListener('click', toggle);

function toggle() {
    audio.play();
    start_button.classList.toggle('break');
    if(start_button.classList.contains('break')){
        start_button.innerText = "BORRAR";
        estado = "INICIAR";
        pomodoro();
    }
    else{
        audio.play();
        start_button.innerText = "INICIAR";
        estado = "BORRAR";
        pomodoro_colors_change_black()
        modo.innerText = "Pomodoro";
        operacion = "pomodoro";
        timer_screen.innerText = segundosAMinutos(1500);
    }
}

function pomodoro() {
    if (operacion == "pomodoro"){
        modo.innerText = "Pomodoro";
        pomodoro_timer(1500);
        pomodoro_colors_change_red();
    }
    
    if (operacion == "break"){
        modo.innerText = "Descanso";
        timer_screen.innerText = segundosAMinutos(300);
        pomodoro_timer(300);
        pomodoro_colors_change_green();
    }
}

function pomodoro_timer(segundos) {
    var segundos_temp = segundos;

    const timer = setInterval(() => {
        if (estado == "BORRAR"){
            clearInterval(timer);   
            if (operacion == "pomodoro"){
                timer_screen.innerText = segundosAMinutos(1500);
            }
            else if (operacion == "break"){
                timer_screen.innerText = segundosAMinutos(300);
            }
            return;
        }   

        segundos_temp = segundos_temp - 1;
        timer_screen.innerText = segundosAMinutos(segundos_temp);
        if (segundos_temp == 0){
            clearInterval(timer);

            if (operacion == "pomodoro"){
                operacion = "break";
                pomodoro();
            }
            else if (operacion == "break"){
                operacion = "pomodoro";
                start_button.innerText = "Reiniciar";
                start_button.classList.toggle('break');
            }
        }  
    }, 1000);
};

function pomodoro_colors_change_black() {
    body.classList = 'body_pomodoro';
    icono.href = 'sources/totoro_icon.ico';
}

function pomodoro_colors_change_red() {
    body.classList = 'body_pomodoro_red';
    icono.href = 'sources/totoro_icon_rojo.ico';
}

function pomodoro_colors_change_green() {
    body.classList = 'body_pomodoro_verde';
    icono.href = 'sources/totoro_icon_verde.ico';
}

function segundosAMinutos(segundos) {
    const minutos = Math.floor(segundos / 60);
    var segundosRestantes = segundos % 60;
    if (segundosRestantes < 10){
        segundosRestantes = "0" + segundosRestantes;
    }
    var minutosYsegundos = minutos + ":" + segundosRestantes;
    return minutosYsegundos;
}

button_siguiente.addEventListener('click', function toggleSiguiente(){
    if (operacion == "pomodoro"){
        operacion = "break";
        estado = "BORRAR";
        timer_screen.innerText = segundosAMinutos(300);
    }
    else if (operacion == "break"){
        operacion = "pomodoro"
        estado = "BORRAR";
        timer_screen.innerText = segundosAMinutos(1500);
    }
    pomodoro()
});



Notification.requestPermission().then(function(permission) {
    if (permission === 'granted') {
        // El usuario ha permitido las notificaciones
    } else {
        // El usuario ha negado o está pendiente el permiso
    }
});
