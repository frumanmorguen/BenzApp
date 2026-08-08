// editar.js
// BenzApp V2 - AMB VALIDACIÓ DE KM

const params =
    new URLSearchParams(location.search);

const id =
    Number(params.get("id"));

const r =
    obtenirRepostatges()
    .find(x => x.id === id);

if (!r) {
    location.href = "historial.html";
}

const vehicle =
    obtenirVehicle(r.vehicleId);

document.getElementById("dadesVehicle").innerHTML = `

<h2>

${vehicle.marca}
${vehicle.model}

</h2>

<p>

${vehicle.matricula}

</p>

`;

const data =
    document.getElementById("data");

const hora =
    document.getElementById("hora");

const km =
    document.getElementById("km");

const litres =
    document.getElementById("litres");

const preu =
    document.getElementById("preu");

const cost =
    document.getElementById("cost");

const combustible =
    document.getElementById("combustible");

const ple =
    document.getElementById("ple");

const guardar =
    document.getElementById("guardar");


function dataInput(ms) {

    let d = new Date(ms);

    return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");

}


function horaInput(ms) {

    let d = new Date(ms);

    return String(d.getHours()).padStart(2, "0") +
        ":" +
        String(d.getMinutes()).padStart(2, "0");

}


data.value =
    dataInput(r.data);

hora.value =
    horaInput(r.data);

km.value =
    r.km;

litres.value =
    r.litres;

preu.value =
    r.preu;

cost.value =
    r.cost;

combustible.value =
    r.combustible;

ple.checked =
    r.ple;


function recalcularCost() {

    let l =
        Number(litres.value);

    let p =
        Number(preu.value);

    if (l > 0 && p > 0) {

        cost.value =
            (l * p).toFixed(2);

    }

}


function recalcularPreu() {

    let l =
        Number(litres.value);

    let c =
        Number(cost.value);

    if (l > 0 && c > 0) {

        preu.value =
            (c / l).toFixed(3);

    }

}


litres.oninput =
    recalcularCost;

preu.oninput =
    recalcularCost;

cost.oninput =
    recalcularPreu;


guardar.onclick = function () {

    // ==========================
    // VALIDACIÓ: KM NO BAIXIN
    // (excloent el mateix repostatge)
    // ==========================

    const kmNum = Number(km.value);
    const repostatgesExistents = obtenirRepostatgesVehicle(r.vehicleId)
        .filter(x => x.id !== id)
        .sort((a, b) => a.data - b.data);

    if (repostatgesExistents.length > 0) {
        const ultim = repostatgesExistents[repostatgesExistents.length - 1];
        if (kmNum < Number(ultim.km)) {
            alert(`Els quilòmetres no poden ser inferiors a l'últim registre (${ultim.km} km).`);
            return;
        }
        if (kmNum === Number(ultim.km)) {
            if (!confirm("Els quilòmetres són iguals a l'últim registre. Continuar?")) {
                return;
            }
        }
    }

    // Camps imprescindibles
    if (
        data.value === "" ||
        hora.value === "" ||
        km.value === "" ||
        litres.value === ""
    ) {
        alert("Completa tots els camps obligatoris.");
        return;
    }

    editarRepostatge(

        id,

        {

            data: new Date(

                data.value +
                "T" +
                hora.value

            ).getTime(),

            km: Number(km.value),

            litres: Number(litres.value),

            preu: Number(preu.value),

            cost: Number(cost.value),

            combustible:
                combustible.value,

            ple:
                ple.checked

        }

    );

    location.href =
        "historial.html";

};