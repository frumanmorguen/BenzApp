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

function crearConfiguracio(){

    if(document.getElementById("botoConfiguracio"))
        return;

    const capcalera =
    document.querySelector(".app");

    if(!capcalera)
        return;

    const boto =
    document.createElement("button");

    boto.id =
    "botoConfiguracio";

    boto.className =
    "botoConfiguracio";

    boto.innerHTML =
    "⚙️";

    boto.title =
    "Configuració";

    boto.onclick =
    obrirConfiguracio;

    capcalera.insertBefore(
        boto,
        llistaVehicles
    );

}


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
// MATRÍCULA
// ==================================================

function mostrarMatricula(valor){

    const text =
    String(valor || "")
    .trim()
    .toUpperCase();

    return `

        <span class="matriculaReal">

            <span class="matriculaCAT">

                <span class="estrelles">
                    ★★★★★★★★★★★★
                </span>

                <span>
                    CAT
                </span>

            </span>

            <span class="matriculaLletres">
                ${text}
            </span>

        </span>

    `;

}


// ==================================================
// CARREGAR VEHICLES
// ==================================================

function carregarVehicles(){

    llistaVehicles.innerHTML="";

    let vehicles =
    obtenirVehicles();

    if(vehicles.length===0){

        llistaVehicles.innerHTML=`

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
    .sort((a,b)=>
        String(a.matricula)
        .localeCompare(
            String(b.matricula),
            "ca"
        )
    )
    .forEach(v=>{

        let ultim="-";

        let r =
        obtenirRepostatgesVehicle(v.id);

        if(r.length){

            const ultimRepostatge =
            r[r.length-1];

            ultim =
            Number(
                ultimRepostatge.km
            ).toLocaleString(
                "ca-ES"
            ) + " km";

        }


        let html=`

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
                    title="Editar">

                    ✏️

                </button>


                <button
                    class="petitEliminar"
                    onclick="eliminarVehicleUI(${v.id})"
                    title="Eliminar">

                    🗑️

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
// EXPORTACIÓ CSV
// ==================================================

function escaparCSV(valor){

    return '"' +
        String(
            valor ?? ""
        )
        .replace(
            /"/g,
            '""'
        ) +
        '"';

}


function calcularConsumExportacio(
    index,
    llista
){

    const actual =
    llista[index];

    if(
        !actual ||
        !actual.ple
    ){

        return "";

    }


    let anteriorPle = -1;


    for(
        let i=index-1;
        i>=0;
        i--
    ){

        if(
            llista[i].ple
        ){

            anteriorPle=i;

            break;

        }

    }


    if(
        anteriorPle === -1
    ){

        return "";

    }


    const km =
    Number(actual.km) -
    Number(
        llista[anteriorPle].km
    );


    if(km <= 0)
        return "";


    let litres=0;


    for(
        let i=anteriorPle+1;
        i<=index;
        i++
    ){

        litres +=
        Number(
            llista[i].litres
        ) || 0;

    }


    if(litres <= 0)
        return "";


    return (
        litres /
        km *
        100
    ).toFixed(2);

}


function exportarDades(){

    const vehicles =
    obtenirVehicles();

    const repostatges =
    obtenirRepostatges();


    if(
        !vehicles.length ||
        !repostatges.length
    ){

        alert(
            "No hi ha dades per exportar."
        );

        return;

    }


    let files=[];


    files.push([

        "Vehicle",
        "Matrícula",
        "Data",
        "Hora",
        "Km",
        "Litres",
        "Preu/L",
        "Cost",
        "Combustible",
        "Dipòsit",
        "Consum L/100 km"

    ]
    .map(escaparCSV)
    .join(";"));


    vehicles.forEach(vehicle=>{

        const llista =
        repostatges
        .filter(
            r =>
            r.vehicleId == vehicle.id
        )
        .slice()
        .sort(
            (a,b)=>
            Number(a.data) -
            Number(b.data)
        );


        llista.forEach(
            (r,index)=>{

                const d =
                new Date(
                    Number(r.data)
                );


                const data =
                d.toLocaleDateString(
                    "ca-ES"
                );


                const hora =
                d.toLocaleTimeString(
                    "ca-ES",
                    {
                        hour:"2-digit",
                        minute:"2-digit"
                    }
                );


                files.push([

                    vehicle.marca +
                    " " +
                    vehicle.model,

                    vehicle.matricula,

                    data,

                    hora,

                    Number(r.km),

                    Number(r.litres)
                    .toFixed(2),

                    Number(r.preu)
                    .toFixed(3),

                    Number(r.cost)
                    .toFixed(2),

                    r.combustible,

                    r.ple
                    ? "PLE"
                    : "PARCIAL",

                    calcularConsumExportacio(
                        index,
                        llista
                    )

                ]
                .map(escaparCSV)
                .join(";"));

            }
        );

    });


    const csv =
    "\ufeff" +
    files.join("\r\n");


    const blob =
    new Blob(
        [csv],
        {
            type:
            "text/csv;charset=utf-8;"
        }
    );


    const url =
    URL.createObjectURL(blob);


    const a =
    document.createElement("a");


    const avui =
    new Date()
    .toISOString()
    .substring(0,10);


    a.href=url;

    a.download =
    "BenzApp_" +
    avui +
    ".csv";


    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

}


// ==================================================
// BOTÓ EXPORTAR
// ==================================================

function crearBotoExportar(){

    if(
        document.getElementById(
            "botoExportar"
        )
    )
        return;


    const boto =
    document.createElement("button");

    boto.id =
    "botoExportar";

    boto.className =
    "botoExportar";

    boto.innerHTML =
    "📥 Exportar dades";

    boto.onclick =
    exportarDades;


    const nouVehicle =
    document.getElementById(
        "botoNouVehicle"
    );


    if(
        nouVehicle &&
        nouVehicle.parentNode
    ){

        nouVehicle.parentNode
        .insertBefore(
            boto,
            nouVehicle.nextSibling
        );

    }

}


// ==================================================
// INICI
// ==================================================

window.onload=function(){

    carregarTema();

    crearConfiguracio();

    carregarVehicles();

    crearBotoExportar();

};