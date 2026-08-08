// resum.js
// BenzApp V2 - CORREGIT

const vehicleId = obtenirVehicleActiu();

if (!vehicleId) {
    location.href = "index.html";
}

const vehicle = obtenirVehicle(vehicleId);
const dadesVehicle = document.getElementById("dadesVehicle");
const resum = document.getElementById("resum");

// ==================================================
// CONSUM MITJÀ - CORRECTE
// ==================================================

function consumMitja(repostatges) {
    const llista = repostatges.slice().sort((a, b) => a.data - b.data);

    let litresPerConsum = 0;
    let kmPerConsum = 0;

    llista.forEach((actual, index) => {
        if (!actual.ple) return;

        let anteriorIndex = -1;
        for (let i = index - 1; i >= 0; i--) {
            if (llista[i].ple) {
                anteriorIndex = i;
                break;
            }
        }

        if (anteriorIndex === -1) return;

        const anterior = llista[anteriorIndex];
        const km = Number(actual.km) - Number(anterior.km);
        if (km <= 0) return;

        let litres = 0;
        for (let i = anteriorIndex + 1; i <= index; i++) {
            litres += Number(llista[i].litres);
        }

        litresPerConsum += litres;
        kmPerConsum += km;
    });

    if (kmPerConsum <= 0) return null;
    return litresPerConsum / kmPerConsum * 100;
}

// ==================================================
// CARREGAR
// ==================================================

window.onload = function () {
    dadesVehicle.innerHTML = `
        <h2>${vehicle.marca} ${vehicle.model}</h2>
        <p>${vehicle.matricula}</p>
    `;

    const r = obtenirRepostatgesVehicle(vehicleId);

    if (r.length === 0) {
        resum.innerHTML = "Encara no hi ha repostatges.";
        return;
    }

    let litres = 0;
    let cost = 0;
    r.forEach(x => {
        litres += x.litres;
        cost += x.cost;
    });

    // Ordenar per data per calcular km correctament
    const ordenats = r.slice().sort((a, b) => a.data - b.data);
    let km = 0;
    if (ordenats.length > 1) {
        km = ordenats[ordenats.length - 1].km - ordenats[0].km;
    }

    const consum = consumMitja(r);
    const consumText = consum !== null ? consum.toFixed(2) + " L/100" : "—";
    const preuMig = litres > 0 ? (cost / litres).toFixed(3) : "—";

    resum.innerHTML = `
        <table class="taulaResum">
            <tr><td>Quilòmetres</td><td>${km.toLocaleString("ca-ES")} km</td></tr>
            <tr><td>Repostatges</td><td>${r.length}</td></tr>
            <tr><td>Litres</td><td>${litres.toFixed(2)} L</td></tr>
            <tr><td>Cost total</td><td>${cost.toFixed(2)} €</td></tr>
            <tr><td>Preu mig/L</td><td>${preuMig} €</td></tr>
            <tr><td>Cost/km</td><td>${km > 0 ? (cost / km).toFixed(3) + " €" : "—"}</td></tr>
            <tr><td>Consum mitjà</td><td>${consumText}</td></tr>
        </table>
    `;
};