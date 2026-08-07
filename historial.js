// historial.js

const vehicleId = obtenirVehicleActiu();

if (!vehicleId) {
    location.href = "index.html";
}

const vehicle = obtenirVehicle(vehicleId);

const capcalera = document.getElementById("capcaleraVehicle");
const cos = document.getElementById("cosHistorial");
const totals = document.getElementById("totals");

const modal = document.getElementById("modalDetall");
const detall = document.getElementById("detallRepostatge");

const botoEditar = document.getElementById("editar");
const botoEliminar = document.getElementById("eliminar");
const botoTancar = document.getElementById("tancar");

let idActual = null;


// ==========================
// FORMAT
// ==========================

function data(ms) {
    return new Date(ms).toLocaleDateString("ca-ES");
}

function hora(ms) {
    return new Date(ms).toLocaleTimeString(
        "ca-ES",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================
// CALCULAR CONSUM
// ==========================
//
// Exemple:
//
// 01/07  PLE      40 L
// 10/07  PARCIAL  15 L
// 18/07  PARCIAL  10 L
// 25/07  PLE      35 L
//
// Litres consumits = 15 + 10 + 35 = 60 L
//
// Km recorreguts = Km final - Km inicial
//
// Consum = litres / km * 100
//

function calcularConsum(index, llista) {

    const actual = llista[index];

    // Només podem tancar un càlcul
    // quan aquest repostatge és PLE.
    if (!actual.ple) {
        return null;
    }

    let indexPleAnterior = -1;

    for (let i = index - 1; i >= 0; i--) {

        if (llista[i].ple) {

            indexPleAnterior = i;
            break;

        }
    }

    // No hi ha un ple anterior.
    if (indexPleAnterior === -1) {
        return null;
    }

    const anterior =
        llista[indexPleAnterior];

    const kmRecorreguts =
        Number(actual.km) -
        Number(anterior.km);

    if (kmRecorreguts <= 0) {
        return null;
    }

    // SUMEM TOTS els litres entre
    // els dos dipòsits plens.
    let litresConsumits = 0;

    for (
        let i = indexPleAnterior + 1;
        i <= index;
        i++
    ) {

        litresConsumits +=
            Number(llista[i].litres);

    }

    if (litresConsumits <= 0) {
        return null;
    }

    return (
        litresConsumits /
        kmRecorreguts *
        100
    );

}


// ==========================
// CARREGAR
// ==========================

function carregar() {

    capcalera.innerHTML = `
        <h2>
            ${vehicle.marca} ${vehicle.model}
        </h2>

        <p>
            ${vehicle.matricula}
        </p>
    `;

    cos.innerHTML = "";

    const repostatges =
        obtenirRepostatgesVehicle(vehicleId);

    if (repostatges.length === 0) {

        cos.innerHTML = `
            <tr>
                <td colspan="6">
                    Encara no hi ha repostatges.
                </td>
            </tr>
        `;

        totals.innerHTML = "";

        return;
    }

    // Ordenació cronològica
    const llista =
        repostatges
        .slice()
        .sort((a, b) => a.data - b.data);


    let litresTotals = 0;
    let costTotal = 0;

    llista.forEach(r => {

        litresTotals += Number(r.litres);
        costTotal += Number(r.cost);

    });


    // Mostrem del més recent al més antic
    for (
        let index = llista.length - 1;
        index >= 0;
        index--
    ) {

        const r = llista[index];

        const consum =
            calcularConsum(index, llista);

        let consumText = "—";

        if (consum !== null) {
            consumText =
                consum.toFixed(2);
        }


        const fila =
            document.createElement("tr");

        fila.innerHTML = `

            <td>
                <strong>${data(r.data)}</strong>
                <small>${hora(r.data)}</small>
            </td>

            <td>
                ${Number(r.km).toLocaleString("ca-ES")}
            </td>

            <td>
                ${Number(r.litres).toFixed(1)}
            </td>

            <td>
                ${Number(r.cost).toFixed(2)}
            </td>

            <td>
                ${consumText}
            </td>

            <td>
                ${
                    r.ple
                    ? '<span class="dipositPle">🟢 PLE</span>'
                    : '<span class="dipositParcial">⚪</span>'
                }
            </td>

        `;

        fila.onclick = function () {
            mostrarDetall(r.id);
        };

        cos.appendChild(fila);
    }


    // ==========================
    // RESUM
    // ==========================

    let kmRecorreguts = 0;

    if (llista.length > 1) {

        kmRecorreguts =
            Number(llista[llista.length - 1].km) -
            Number(llista[0].km);

    }


    // Consum mitjà només dels trams
    // que realment es poden calcular.

    let litresPerConsum = 0;
    let kmPerConsum = 0;

    llista.forEach((actual, index) => {

        if (!actual.ple) {
            return;
        }

        let anteriorIndex = -1;

        for (let i = index - 1; i >= 0; i--) {

            if (llista[i].ple) {

                anteriorIndex = i;
                break;

            }
        }

        if (anteriorIndex === -1) {
            return;
        }

        const anterior =
            llista[anteriorIndex];

        const km =
            Number(actual.km) -
            Number(anterior.km);

        if (km <= 0) {
            return;
        }

        let litres = 0;

        for (
            let i = anteriorIndex + 1;
            i <= index;
            i++
        ) {

            litres +=
                Number(llista[i].litres);

        }

        litresPerConsum += litres;
        kmPerConsum += km;

    });


    let consumMitja = null;

    if (kmPerConsum > 0) {

        consumMitja =
            litresPerConsum /
            kmPerConsum *
            100;

    }


    totals.innerHTML = `

        <div class="resumHistorial">

            <div>
                <span>Repostatges</span>
                <strong>${llista.length}</strong>
            </div>

            <div>
                <span>Km recorreguts</span>
                <strong>
                    ${kmRecorreguts.toLocaleString("ca-ES")}
                </strong>
            </div>

            <div>
                <span>Litres</span>
                <strong>
                    ${litresTotals.toFixed(2)} L
                </strong>
            </div>

            <div>
                <span>Cost total</span>
                <strong>
                    ${costTotal.toFixed(2)} €
                </strong>
            </div>

            <div>
                <span>Consum mitjà</span>
                <strong>
                    ${
                        consumMitja !== null
                        ? consumMitja.toFixed(2) + " L/100"
                        : "—"
                    }
                </strong>
            </div>

        </div>
    `;
}


// ==========================
// DETALL
// ==========================

function mostrarDetall(id) {

    idActual = id;

    const r =
        obtenirRepostatges()
        .find(x => x.id === id);

    if (!r) {
        return;
    }

    detall.innerHTML = `

        <div class="detallData">

            <strong>
                ${data(r.data)}
            </strong>

            <span>
                ${hora(r.data)}
            </span>

        </div>

        <div class="detallFila">
            <span>Quilometratge</span>
            <strong>
                ${Number(r.km).toLocaleString("ca-ES")} km
            </strong>
        </div>

        <div class="detallFila">
            <span>Litres</span>
            <strong>
                ${Number(r.litres).toFixed(2)} L
            </strong>
        </div>

        <div class="detallFila">
            <span>Preu/litre</span>
            <strong>
                ${Number(r.preu).toFixed(3)} €
            </strong>
        </div>

        <div class="detallFila">
            <span>Cost</span>
            <strong>
                ${Number(r.cost).toFixed(2)} €
            </strong>
        </div>

        <div class="detallFila">
            <span>Combustible</span>
            <strong>
                ${r.combustible}
            </strong>
        </div>

        <div class="detallPle">

            ${
                r.ple
                ? "🟢 DIPÒSIT PLE"
                : "⚪ REPOSTATGE PARCIAL"
            }

        </div>
    `;

    modal.classList.remove("ocult");
}


// ==========================
// EDITAR
// ==========================

botoEditar.onclick = function () {

    if (!idActual) {
        return;
    }

    location.href =
        "editar.html?id=" +
        idActual;
};


// ==========================
// ELIMINAR
// ==========================

botoEliminar.onclick = function () {

    if (!idActual) {
        return;
    }

    if (
        confirm(
            "Eliminar aquest repostatge?"
        )
    ) {

        eliminarRepostatge(idActual);

        modal.classList.add("ocult");

        idActual = null;

        carregar();
    }
};


// ==========================
// TANCAR
// ==========================

botoTancar.onclick = function () {

    modal.classList.add("ocult");

    idActual = null;
};


// ==========================
// INICI
// ==========================

window.onload = carregar;