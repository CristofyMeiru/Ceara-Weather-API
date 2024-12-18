var isShow = false;

//API dinamica com o wheathermap usando parametro do nome da cidade
async function getWeather(cityName) {
    await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=45811b6de16f20623df6ecf0efd9e07c&lang=pt_br&units=metric
`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Dados indisponiveis");
            }
            return res.json();
        })
        .then((data) => {
            return configureData(data);
        })
        .catch((err) => {
            return configureData(err);
        });
}
//Definir todas as cidades como botões que podem fazer a chamada da API
function setCityName() {
    var mapaCeara = document.getElementById("mapa-ceara");
    var conteudoMapa = mapaCeara.contentDocument;

    var paths = conteudoMapa.querySelectorAll("path");
    paths.forEach((path) => {
        pathEvents(path);
    });
}
//Utilizar a response para formatar o modal
function configureData(data) {
    var modalTitle = document.getElementById("modalTitle");
    var modalImage = document.getElementById("weatherIcon");
    var descWeather = document.getElementById("descWeather");
    var tempCelcius = document.getElementById("tempCelcius");
    var humidity = document.getElementById("humidity");
    var humidityIcon = document.getElementById("humidityIcon");
    var feelLike = document.getElementById("feelLike");

    //Caracteristicas iniciais dos elementos
    feelLike.innerHTML = "";
    humidityIcon.style.display = "block";
    humidity.innerHTML = "";
    descWeather.innerHTML = "";
    tempCelcius.innerHTML = "";
    modalImage.src = "";
    modalTitle.style.display = "flex";
    modalImage.style.display = "flex";
    descWeather.style.display = "flex";
    //Verificação se o parametro passado na chamada da função contem mensagem de erro
    if (data.message) {
        humidityIcon.style.display = "none";
        document.querySelector(".iconSec").style.border = "none";
        document.getElementById("locationIcon").style.display = "none";
        //A URL de baixo é de um placeholder pra caso a imagem tenha que ser vazia
        modalImage.src =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAEAAAIBRAA=";

        return (modalTitle.innerHTML = "Dados indisponiveis");
    }
    //Sem mensagem de erro == Poder seguir com a formatação
    if (!data.message) {
        let temp = String(data.main.temp);
        let feelsLike = String(data.main.feels_like);
        document.querySelector(".iconSec").style.borderRight =
            "1px solid #8f8f8f";
        modalImage.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        modalTitle.innerHTML = `Tempo em ${data.name} / CE`;
        descWeather.innerHTML = data.weather[0].description;
        tempCelcius.innerHTML = temp.slice(0, 2) + "°";
        humidityIcon.data = aboutHumidity(data.main.humidity);
        humidity.innerHTML = data.main.humidity + "%";
        feelLike.innerHTML = "S. Termíca: " + feelsLike.slice(0, 2) + "°";
    }
}

//Eventos atribuidos as cidades
function pathEvents(path) {
    var modal = document.getElementById("modal");
    var rect = path.getBoundingClientRect();
    //Apenas se clicar o modal aparece, acabei fazendo mini ataque DoS por usar o mouseover :D
    //840 requisições ao wheaterapi em 1 minuto, recebi ate email de aviso que fui bloqueado D:
    path.addEventListener("click", (e) => {
        var windowWidth = ifWidth();
        getWeather(e.target.id);
        modal.style.left = `${rect.left + rect.width + windowWidth}px`;
        modal.style.top = `${rect.top}px`;
        isShow = true;
        modal.style.display = "flex";
    });
    //Se o cursor sair de cima da cidade o modal fecha
    path.addEventListener("mouseleave", (e) => {
        isShow = false;
        modal.style.display = "none";
    });
}

function ifWidth() {
    var windowWi = window.innerWidth;
    switch (true) {
        case windowWi >= 1500 && windowWi < 1600:
            return 370;
        case windowWi >= 1400 && windowWi < 1500:
            return 320;
        case windowWi > 1300 && windowWi < 1400:
            return 270;
        case windowWi >= 1200 && windowWi < 1300:
            return 200;
        case windowWi >= 1100 && windowWi < 1200:
            return 150;
        case windowWi >= 1050 && windowWi < 1100:
            return 150;
        case windowWi >= 1000 && windowWi < 1050:
            return 100;
        case windowWi <= 1000 && windowWi >= 900:
            return 70;
        case windowWi < 900 && windowWi > 800:
            return 20;
        case windowWi <= 800 && windowWi > 600:
            return -20;
    }
}
function aboutHumidity(humidity) {
    //Verificação a intensidade da umidade e retornando o diretorio correspondente de SVG
    switch (true) {
        case humidity <= 30:
            return "./public/humidity_low.svg";
        case humidity > 30 && humidity <= 60:
            return "./public/humidity_mid.svg";
        case humidity > 60:
            return "./public/humidity_high.svg";
    }
}
//Função inicial onde o codigo inteiro começa a rodar

setTimeout(() => {
    setCityName();
}, 2000);
