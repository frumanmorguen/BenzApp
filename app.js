// app.js

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



// ==========================
// CARREGAR
// ==========================

function carregarVehicles(){

    llistaVehicles.innerHTML="";

    let vehicles=obtenirVehicles();

    if(vehicles.length===0){

        llistaVehicles.innerHTML=`

        <div class="targeta">

        Encara no hi ha vehicles.

        <br><br>

        Prem <strong>➕ Nou vehicle</strong>

        </div>

        `;

        return;

    }

    vehicles
    .sort((a,b)=>
        a.matricula.localeCompare(b.matricula)
    )
    .forEach(v=>{

        let ultim="-";

        let r=
        obtenirRepostatgesVehicle(v.id);

        if(r.length){

            ultim=
            r[r.length-1].km.toLocaleString("ca-ES")
            +" km";

        }

        let html=`

        <div class="targetaVehicle">

            <div class="infoVehicle">

                <div class="nomVehicle">

                    ${v.marca}
                    ${v.model}

                </div>

                <div class="matricula">

                    ${v.matricula}

                </div>

                <div class="ultimKm">

                    Últim km: ${ultim}

                </div>

            </div>

            <div class="accionsVehicle">

                <button
                class="primari"
                onclick="obrirVehicle(${v.id})">

                ▶

                </button>

                <button
                class="petitEditar"
                onclick="editarVehicleUI(${v.id})">

                ✏️

                </button>

                <button
                class="petitEliminar"
                onclick="eliminarVehicleUI(${v.id})">

                🗑️

                </button>

            </div>

        </div>

        `;

        llistaVehicles.innerHTML+=html;

    });

}



// ==========================
// OBRIR VEHICLE
// ==========================

function obrirVehicle(id){

    guardarVehicleActiu(id);

    location.href="vehicle.html";

}



// ==========================
// NOU
// ==========================

botoNouVehicle.onclick=function(){

    editant=null;

    titolModal.textContent=
    "Nou vehicle";

    matricula.value="";
    marca.value="";
    model.value="";
    diposit.value="";
    combustible.value="95";

    modalVehicle.classList.remove("ocult");

};



// ==========================
// EDITAR
// ==========================

function editarVehicleUI(id){

    editant=id;

    let v=
    obtenirVehicle(id);

    titolModal.textContent=
    "Editar vehicle";

    matricula.value=v.matricula;
    marca.value=v.marca;
    model.value=v.model;
    diposit.value=v.diposit;
    combustible.value=v.combustible;

    modalVehicle.classList.remove("ocult");

}



// ==========================
// GUARDAR
// ==========================

guardarVehicle.onclick=function(){

    if(

        matricula.value.trim()==="" ||

        marca.value.trim()==="" ||

        model.value.trim()==="" ||

        diposit.value===""

    ){

        alert("Completa totes les dades.");

        return;

    }

    let dades={

        matricula:
        matricula.value.trim().toUpperCase(),

        marca:
        marca.value.trim(),

        model:
        model.value.trim(),

        diposit:
        Number(diposit.value),

        combustible:
        combustible.value

    };

    if(editant===null){

        afegirVehicle(dades);

    }
    else{

        editarVehicle(editant,dades);

    }

    modalVehicle.classList.add("ocult");

    carregarVehicles();

};



// ==========================
// ELIMINAR
// ==========================

function eliminarVehicleUI(id){

    let v=
    obtenirVehicle(id);

    if(confirm(

        "Eliminar el vehicle\n\n"+

        v.marca+" "+v.model+

        "\n("+v.matricula+") ?"

    )){

        eliminarVehicle(id);

        carregarVehicles();

    }

}



// ==========================
// CANCEL·LAR
// ==========================

cancelarVehicle.onclick=function(){

    modalVehicle.classList.add("ocult");

};



// ==========================

window.onload=
carregarVehicles;