// vehicle.js

const vehicleId = obtenirVehicleActiu();

if (!vehicleId) {
    location.href = "index.html";
}

const vehicle = obtenirVehicle(vehicleId);

const dadesVehicle = document.getElementById("dadesVehicle");

const data = document.getElementById("data");
const hora = document.getElementById("hora");
const km = document.getElementById("km");
const litres = document.getElementById("litres");
const preu = document.getElementById("preu");
const cost = document.getElementById("cost");
const combustible = document.getElementById("combustible");
const ple = document.getElementById("ple");
const guardar = document.getElementById("guardar");


// ==========================
// INICI
// ==========================

function carregar() {

    dadesVehicle.innerHTML = `
        <h2>
            ${vehicle.marca} ${vehicle.model}
        </h2>

        <p>
            ${vehicle.matricula}
        </p>
    `;

    const ara = new Date();

    data.value =
        ara.getFullYear() +
        "-" +
        String(ara.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(ara.getDate()).padStart(2, "0");

    hora.value =
        String(ara.getHours()).padStart(2, "0") +
        ":" +
        String(ara.getMinutes()).padStart(2, "0");

    if (vehicle.combustible) {
        combustible.value = vehicle.combustible;
    }
}


// ==========================
// CALCULS
// ==========================

// Si posem litres + preu/litre,
// calcula el cost.

function calcularCost() {

    const l = Number(litres.value);
    const p = Number(preu.value);

    if (l > 0 && p > 0) {

        cost.value =
            (l * p).toFixed(2);

    }
}


// Si posem litres + cost,
// calcula el preu/litre.

function calcularPreu() {

    const l = Number(litres.value);
    const c = Number(cost.value);

    if (l > 0 && c > 0) {

        preu.value =
            (c / l).toFixed(3);

    }
}


// Litres + preu → cost

litres.addEventListener("input", function () {

    if (preu.value !== "") {
        calcularCost();
    }

});


// Canviant preu → cost

preu.addEventListener("input", function () {

    calcularCost();

});


// Cost → preu

cost.addEventListener("input", function () {

    if (
        litres.value !== "" &&
        cost.value !== ""
    ) {

        calcularPreu();

    }

});


// ==========================
// GUARDAR
// ==========================

guardar.onclick = function () {

    // Camps imprescindibles

    if (
        data.value === "" ||
        hora.value === "" ||
        km.value === "" ||
        litres.value === ""
    ) {

        alert(
            "Completa la data, l'hora, els quilòmetres i els litres."
        );

        return;

    }


    const litresNum =
        Number(litres.value);

    const preuNum =
        Number(preu.value);

    const costNum =
        Number(cost.value);


    // Cal que tinguem prou dades
    // per calcular el cost.

    if (
        litresNum <= 0 ||
        (
            preuNum <= 0 &&
            costNum <= 0
        )
    ) {

        alert(
            "Introdueix el preu per litre o el cost total."
        );

        return;

    }


    // Si falta el cost, el calculem.

    let costFinal = costNum;

    if (costFinal <= 0) {

        costFinal =
            litresNum * preuNum;

    }


    // Si falta el preu, el calculem.

    let preuFinal = preuNum;

    if (preuFinal <= 0) {

        preuFinal =
            costFinal / litresNum;

    }


    const moment =
        new Date(
            data.value +
            "T" +
            hora.value
        ).getTime();


    afegirRepostatge({

        vehicleId: vehicleId,

        data: moment,

        km: Number(km.value),

        litres: litresNum,

        preu: preuFinal,

        cost: costFinal,

        combustible:
            combustible.value,

        ple:
            ple.checked

    });


    alert(
        "Repostatge desat."
    );


    location.href =
        "historial.html";

};


// ==========================
// INICI
// ==========================

window.onload = carregar;