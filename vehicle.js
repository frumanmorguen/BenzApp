// vehicle.js
// BenzApp V2 - AMB VALIDACIÓ DE KM I EXPORTACIÓ

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

    const kmNum = Number(km.value);
    const litresNum = Number(litres.value);
    const preuNum = Number(preu.value);
    const costNum = Number(cost.value);

    // ==========================
    // VALIDACIÓ: KM NO BAIXIN
    // ==========================

    const repostatgesExistents = obtenirRepostatgesVehicle(vehicleId);
    if (repostatgesExistents.length > 0) {
        const ultim = repostatgesExistents[repostatgesExistents.length - 1];
        if (kmNum < Number(ultim.km)) {
            alert(`Els quilòmetres no poden ser inferiors a l'últim registre (${ultim.km} km).`);
            return;
        }
        // Opcional: avisar si els km són iguals
        if (kmNum === Number(ultim.km)) {
            if (!confirm("Els quilòmetres són iguals a l'últim registre. Continuar?")) {
                return;
            }
        }
    }

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

        km: kmNum,

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
// EXPORTAR VEHICLE ACTIU A CSV
// ==========================

function exportarVehicleActual() {
    const vehicleId = obtenirVehicleActiu();
    
    if (!vehicleId) {
        alert("No hi ha vehicle seleccionat.");
        return;
    }

    const vehicle = obtenirVehicle(vehicleId);
    
    if (!vehicle) {
        alert("Vehicle no trobat.");
        return;
    }

    const repostatges = obtenirRepostatgesVehicle(vehicleId);

    if (!repostatges.length) {
        alert("Aquest vehicle no té repostatges per exportar.");
        return;
    }

    // Funció per escapar CSV
    function escaparCSV(valor) {
        return '"' + String(valor ?? "").replace(/"/g, '""') + '"';
    }

    // Funció per calcular consum
    function calcularConsum(index, llista) {
        const actual = llista[index];
        if (!actual || !actual.ple) return "";

        let anteriorPle = -1;
        for (let i = index - 1; i >= 0; i--) {
            if (llista[i].ple) {
                anteriorPle = i;
                break;
            }
        }
        if (anteriorPle === -1) return "";

        const km = Number(actual.km) - Number(llista[anteriorPle].km);
        if (km <= 0) return "";

        let litres = 0;
        for (let i = anteriorPle + 1; i <= index; i++) {
            litres += Number(llista[i].litres) || 0;
        }
        if (litres <= 0) return "";

        return (litres / km * 100).toFixed(2);
    }

    let files = [];

    // Capçalera
    files.push([
        "Vehicle", "Matrícula", "Data", "Hora", "Km",
        "Litres", "Preu/L", "Cost", "Combustible", "Dipòsit", "Consum L/100 km"
    ].map(escaparCSV).join(";"));

    const llista = repostatges.slice().sort((a, b) => Number(a.data) - Number(b.data));

    llista.forEach((r, index) => {
        const d = new Date(Number(r.data));
        const data = d.toLocaleDateString("ca-ES");
        const hora = d.toLocaleTimeString("ca-ES", {
            hour: "2-digit",
            minute: "2-digit"
        });

        files.push([
            vehicle.marca + " " + vehicle.model,
            vehicle.matricula,
            data,
            hora,
            Number(r.km),
            Number(r.litres).toFixed(2),
            Number(r.preu).toFixed(3),
            Number(r.cost).toFixed(2),
            r.combustible,
            r.ple ? "PLE" : "PARCIAL",
            calcularConsum(index, llista)
        ].map(escaparCSV).join(";"));
    });

    const csv = "\ufeff" + files.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const avui = new Date().toISOString().substring(0, 10);

    a.href = url;
    a.download = `BenzApp_${vehicle.matricula}_${avui}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}


// ==========================
// INICI
// ==========================

window.onload = carregar;