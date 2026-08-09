// app.js
// BenzApp V2

const llistaVehicles =
document.getElementById("llistaVehicles");

const modalVehicle =
document.getElementById("modalVehicle");

const titolModal =
document.getElementById("titolModal");

const botoNouVehicle =
document.getElementById("botoNouVehicle");

const guardarVehicle =
document.getElementById("guardarVehicle");

const cancelarVehicle =
document.getElementById("cancelarVehicle");

const matricula =
document.getElementById("matricula");

const marca =
document.getElementById("marca");

const model =
document.getElementById("model");

const diposit =
document.getElementById("diposit");

const combustible =
document.getElementById("combustible");

let editant = null;


// ==================================================
// TEMA
// ==================================================

const CLAU_TEMA = "benzapp_tema";

function aplicarTema(tema){

    document.documentElement.setAttribute(
        "data-theme",
        tema
    );

    localStorage.setItem(
        CLAU_TEMA,
        tema
    );

}


function carregarTema(){

    const tema =
    localStorage.getItem(CLAU_TEMA)
    || "auto";

    aplicarTema(tema);

}


// ==================================================
// CONFIGURACIÓ
// ==================================================

function obrirConfiguracio(){

    let modal =
    document.getElementById(
        "modalConfiguracio"
    );

    if(!modal){

        modal =
        document.createElement("div");

        modal.id =
        "modalConfiguracio";

        modal.className =
        "modal";

        modal.innerHTML = `

            <div class="finestra">

                <h2>Configuració</h2>

                <label>
                    Aspecte
                </label>

                <select id="selectorTema">

                    <option value="auto">
                        📱 Automàtic
                    </option>

                    <option value="light">
                        ☀️ Clar
                    </option>

                    <option value="dark">
                        🌙 Fosc
                    </option>

                </select>

                <button
                    id="tancarConfiguracio"
                    class="primari botoAmplada">

                    Tancar

                </button>

            </div>
        `;

        document.body.appendChild(modal);

        document
        .getElementById(
            "selectorTema"
        )
        .addEventListener(
            "change",
            function(){

                aplicarTema(
                    this.value
                );

            }
        );

        document
        .getElementById(
            "tancarConfiguracio"
        )
        .onclick =
        function(){

            modal.classList.add(
                "ocult"
            );

        };

    }

    const selector =
    document.getElementById(
        "selectorTema"
    );

    selector.value =
    localStorage.getItem(
        CLAU_TEMA
    ) || "auto";

    modal.classList.remove(
        "ocult"
    );

}


// ==================================================
// MATRÍCULA EUROPEA - AMB SVG
// ==================================================

function generarEstrellesCercle() {
    let estrelles = '';
    const cx = 12, cy = 12, radi = 8.5;
    
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = cx + radi * Math.cos(angle);
        const y = cy + radi * Math.sin(angle);
        
        const estrella = `
            <polygon 
                points="${x},${y-2.5} ${x+0.8},${y-0.8} ${x+2.5},${y-0.8} ${x+1.2},${y+0.3} ${x+1.6},${y+2} ${x},${y+1} ${x-1.6},${y+2} ${x-1.2},${y+0.3} ${x-2.5},${y-0.8} ${x-0.8},${y-0.8}"
                fill="#ffd700"
            />
        `;
        estrelles += estrella;
    }
    return estrelles;
}

function mostrarMatricula(valor) {
    const text = String(valor || "").trim().toUpperCase();
    const net = text.replace(/[^A-Z0-9]/g, '');

    const estrellesSVG = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:22px;height:22px;display:block;">
            ${generarEstrellesCercle()}
        </svg>
    `;

    return `
        <span class="matriculaReal">
            <span class="matriculaEU">
                ${estrellesSVG}
                <span class="pais">CAT</span>
            </span>
            <span class="matriculaLletres">${net}</span>
        </span>
    `;
}


// ==================================================
// EXPORTAR VEHICLE ACTIU A CSV - AMB CONFIRMACIÓ
// ==================================================

function exportarVehicleActual(id) {
    // Confirmar abans de descarregar
    if (!confirm("Vols exportar les dades d'aquest vehicle a CSV?")) {
        return;
    }

    // Si ens passen un id, el fem servir. Sino, agafem l'actiu.
    const vehicleId = id || obtenirVehicleActiu();
    
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


// ==================================================
// CARREGAR VEHICLES
// ==================================================

function carregarVehicles() {

    llistaVehicles.innerHTML = "";

    let vehicles =
        obtenirVehicles();

    if (vehicles.length === 0) {

        llistaVehicles.innerHTML = `

            <div class="targeta">

                Encara no hi ha vehicles.

                <br><br>

                Prem
                <strong>
                    ➕ Nou vehicle
                </strong>

            </div>

        `;

        return;

    }


    vehicles
        .slice()
        .sort((a, b) =>
            String(a.matricula)
            .localeCompare(
                String(b.matricula),
                "ca"
            )
        )
        .forEach(v => {

            let ultim = "-";

            let r =
                obtenirRepostatgesVehicle(v.id);

            if (r.length) {

                const ultimRepostatge =
                    r[r.length - 1];

                ultim =
                    Number(
                        ultimRepostatge.km
                    ).toLocaleString(
                        "ca-ES"
                    ) + " km";

            }


            let html = `

        <div class="targetaVehicle">

            <div class="infoVehicle">

                <div class="nomVehicle">

                    ${v.marca}
                    ${v.model}

                </div>

                <div class="matricula">

                    ${mostrarMatricula(
                        v.matricula
                    )}

                </div>

                <div class="ultimKm">

                    Últim km: ${ultim}

                </div>

            </div>


            <div class="accionsVehicle">

                <button
                    class="botoRepostar"
                    onclick="obrirVehicle(${v.id})"
                    title="Repostar">

                    ⛽

                </button>


                <button
                    class="petitEditar"
                    onclick="editarVehicleUI(${v.id})"
                    title="Editar vehicle">

                    ✏️

                </button>


                <button
                    class="petitEliminar"
                    onclick="eliminarVehicleUI(${v.id})"
                    title="Eliminar vehicle">

                    🗑️

                </button>

                <!-- BOTÓ EXPORTAR CSV - AMB TOOLTIP -->
                <button
                    class="petitExportar"
                    onclick="exportarVehicleActual(${v.id})"
                    title="Exportar dades d'aquest vehicle a CSV">

                    ⬇️

                </button>

            </div>

        </div>

        `;

            llistaVehicles.innerHTML +=
            html;

        });

}


// ==================================================
// OBRIR VEHICLE
// ==================================================

function obrirVehicle(id){

    guardarVehicleActiu(id);

    location.href =
    "vehicle.html";

}


// ==================================================
// NOU VEHICLE
// ==================================================

botoNouVehicle.onclick=function(){

    editant=null;

    titolModal.textContent =
    "Nou vehicle";

    matricula.value="";
    marca.value="";
    model.value="";
    diposit.value="";
    combustible.value="95";

    modalVehicle.classList.remove(
        "ocult"
    );

};


// ==================================================
// EDITAR VEHICLE
// ==================================================

function editarVehicleUI(id){

    editant=id;

    let v =
    obtenirVehicle(id);

    if(!v)
        return;

    titolModal.textContent =
    "Editar vehicle";

    matricula.value =
    v.matricula || "";

    marca.value =
    v.marca || "";

    model.value =
    v.model || "";

    diposit.value =
    v.diposit || "";

    combustible.value =
    v.combustible || "95";

    modalVehicle.classList.remove(
        "ocult"
    );

}


// ==================================================
// GUARDAR VEHICLE
// ==================================================

guardarVehicle.onclick=function(){

    if(

        matricula.value.trim()==="" ||

        marca.value.trim()==="" ||

        model.value.trim()==="" ||

        diposit.value===""

    ){

        alert(
            "Completa totes les dades."
        );

        return;

    }


    if(
        Number(diposit.value) <= 0
    ){

        alert(
            "La capacitat del dipòsit ha de ser superior a 0."
        );

        return;

    }


    let dades={

        matricula:
        matricula.value
        .trim()
        .toUpperCase(),

        marca:
        marca.value
        .trim(),

        model:
        model.value
        .trim(),

        diposit:
        Number(
            diposit.value
        ),

        combustible:
        combustible.value

    };


    if(editant===null){

        afegirVehicle(dades);

    }
    else{

        editarVehicle(
            editant,
            dades
        );

    }


    modalVehicle.classList.add(
        "ocult"
    );

    carregarVehicles();

};


// ==================================================
// ELIMINAR
// ==================================================

function eliminarVehicleUI(id){

    let v =
    obtenirVehicle(id);

    if(!v)
        return;


    if(confirm(

        "Eliminar el vehicle\n\n" +

        v.marca +
        " " +
        v.model +

        "\n(" +
        v.matricula +
        ") ?\n\n" +

        "També s'eliminaran els seus repostatges."

    )){

        eliminarVehicle(id);

        carregarVehicles();

    }

}


// ==================================================
// CANCEL·LAR
// ==================================================

cancelarVehicle.onclick=function(){

    modalVehicle.classList.add(
        "ocult"
    );

};


// ==================================================
// COPIAR SEGURETAT (BACKUP) - AMB CONFIRMACIÓ
// ==================================================

function ferBackup() {
    // Confirmar abans de descarregar
    if (!confirm("Vols fer una còpia de seguretat de totes les dades?")) {
        return;
    }

    const vehicles = localStorage.getItem('benzapp_vehicles');
    const repostatges = localStorage.getItem('benzapp_repostatges');
    const actiu = localStorage.getItem('benzapp_vehicle_actiu');
    
    if (!vehicles && !repostatges) {
        alert("No hi ha dades per guardar.");
        return;
    }
    
    const backup = {
        vehicles: vehicles ? JSON.parse(vehicles) : [],
        repostatges: repostatges ? JSON.parse(repostatges) : [],
        vehicle_actiu: actiu || null,
        data: new Date().toISOString(),
        versio: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BenzApp_backup_${new Date().toISOString().substring(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}


// ==================================================
// INICI
// ==================================================

window.onload = function() {

    carregarTema();

    // Configuració
    const botoConfig = document.getElementById('botoConfiguracio');
    if (botoConfig) {
        botoConfig.onclick = obrirConfiguracio;
    }

    carregarVehicles();

    // Backup
    const botoBackup = document.getElementById('botoBackup');
    if (botoBackup) {
        botoBackup.onclick = ferBackup;
    }

};