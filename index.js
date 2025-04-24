const body = document.getElementById("body");
const timer_screen = document.getElementById("contador");
const audio = new Audio('sources/button_sound.wav');
const modo = document.getElementById("modo");
const icono = document.getElementById("imagen_barra_de_paginas");
const notificacion_boton = document.getElementById("boton-de-notificaciones");
const button_siguiente = document.getElementById("button_siguiente"); 

audio.volume = 0.2;

var operacion = "pomodoro";
var segundos_pausa = 0;
var estado;
var boton_presionado_no_spam = false;

let start_button = document.getElementById("start_button");

start_button.addEventListener('click', toggle);

function toggle() {
    if (boton_presionado_no_spam == true){
        return;
    }
    boton_presionado_no_spam = true;
    setTimeout(function() {
        boton_presionado_no_spam = false;
    }, 1000);
    audio.play();
    start_button.classList.toggle('break');
    if(start_button.classList.contains('break')){
        start_button.innerText = "PAUSAR";
        estado = "INICIAR";
        pomodoro();
    }
    else{
        audio.play();
        start_button.innerText = "INICIAR";
        estado = "PAUSA";
        setTimeout(function(){
            if (segundos_pausa != 0){
                timer_screen.innerText = segundosAMinutos(segundos_pausa);
            }
        }, 1000);
    }
}

function pomodoro() {
    if (segundos_pausa != 0){
        pomodoro_timer(segundos_pausa);
        segundos_pausa = 0;
    }
    else if (operacion == "pomodoro"){
        modo.innerText = "Pomodoro";
        pomodoro_timer(1500);
        pomodoro_colors_change_red();
    }
    else if (operacion == "break"){
        modo.innerText = "Descanso";
        timer_screen.innerText = segundosAMinutos(300);
        pomodoro_timer(300);
        pomodoro_colors_change_green();
    }
}

function pomodoro_timer(segundos) {
    var segundos_temp = segundos;

    const timer = setInterval(() => {
        if (estado == "PAUSA"){
            clearInterval(timer);   
            segundos_pausa = segundos_temp;
            return;
        }   

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
                new_notificacion_send("Tu Descanso ha comenzado.", "Tu tiempo de trabajo termino, ha iniciado tu periodo de descanso, Felicidades!!. 😁😁😁");
                pomodoro();
            }
            else if (operacion == "break"){
                operacion = "pomodoro";
                new_notificacion_send("Tu Descanso ha terminado.", "Tu tiempo de descanso termino, es hora de iniciar a trabajar. 🤓🤠😡");
                pomodoro();
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
        if (estado == "INICIAR"){
            toggle();
        }
        operacion = "break";
        estado = "BORRAR";
        modo.innerText = "Descanso";
        timer_screen.innerText = segundosAMinutos(300);
        pomodoro_colors_change_green();
        audio.play();
    }
    else if (operacion == "break"){
        if (estado == "INICIAR"){
            toggle();
        }
        operacion = "pomodoro"
        estado = "BORRAR";
        modo.innerText = "Pomodoro";
        timer_screen.innerText = segundosAMinutos(1500);
        pomodoro_colors_change_red();
        audio.play();
    }
    pomodoro()
});

notificacion_boton.addEventListener('click', () => {
  if (Notification.permission === 'granted') {
    return;
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permiso) => {
      if (permiso === 'granted') {
      }
    });
  }
});

function new_notificacion_send(titulo, mensaje){
    if (Notification.permission === 'granted') {
        var notification = new Notification(titulo, {
            body: mensaje,
            icon: 'sources/totoro_icon.ico' 
        });
    
        notification.onclick = function() {
            console.log('El usuario hizo clic en la notificación.');
        };
    
        notification.onclose = function() {
            console.log('La notificación se ha cerrado.');
        };
    }
}



