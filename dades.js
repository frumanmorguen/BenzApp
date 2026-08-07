// dades.js

const CLAU_VEHICLES = "benzapp_vehicles";
const CLAU_REPOSTATGES = "benzapp_repostatges";
const CLAU_VEHICLE_ACTIU = "benzapp_vehicle_actiu";



// ==========================
// VEHICLES
// ==========================

function obtenirVehicles(){

    return JSON.parse(
        localStorage.getItem(CLAU_VEHICLES)
    ) || [];

}



function guardarVehicles(llista){

    localStorage.setItem(
        CLAU_VEHICLES,
        JSON.stringify(llista)
    );

}



function afegirVehicle(dades){

    let vehicles =
    obtenirVehicles();

    dades.id = Date.now();

    vehicles.push(dades);

    guardarVehicles(vehicles);

}



function obtenirVehicle(id){

    return obtenirVehicles()
    .find(v => v.id == id);

}



function editarVehicle(id,dades){

    let vehicles =
    obtenirVehicles();

    let i =
    vehicles.findIndex(v=>v.id==id);

    if(i<0)
        return false;

    vehicles[i] = {

        ...vehicles[i],

        ...dades

    };

    guardarVehicles(vehicles);

    return true;

}



function eliminarVehicle(id){

    guardarVehicles(

        obtenirVehicles()
        .filter(v=>v.id!=id)

    );

    guardarRepostatges(

        obtenirRepostatges()
        .filter(r=>r.vehicleId!=id)

    );

}



// ==========================
// VEHICLE ACTIU
// ==========================

function guardarVehicleActiu(id){

    localStorage.setItem(
        CLAU_VEHICLE_ACTIU,
        id
    );

}



function obtenirVehicleActiu(){

    return Number(

        localStorage.getItem(
            CLAU_VEHICLE_ACTIU
        )

    );

}



// ==========================
// REPOSTATGES
// ==========================

function obtenirRepostatges(){

    return JSON.parse(

        localStorage.getItem(
            CLAU_REPOSTATGES
        )

    ) || [];

}



function guardarRepostatges(llista){

    localStorage.setItem(

        CLAU_REPOSTATGES,

        JSON.stringify(llista)

    );

}



function obtenirRepostatgesVehicle(vehicleId){

    return obtenirRepostatges()

    .filter(r=>r.vehicleId==vehicleId)

    .sort((a,b)=>a.data-b.data);

}



function afegirRepostatge(dades){

    let r =
    obtenirRepostatges();

    dades.id = Date.now();

    r.push(dades);

    guardarRepostatges(r);

}



function editarRepostatge(id,dades){

    let r =
    obtenirRepostatges();

    let i =
    r.findIndex(x=>x.id==id);

    if(i<0)
        return false;

    r[i] = {

        ...r[i],

        ...dades

    };

    guardarRepostatges(r);

    return true;

}



function eliminarRepostatge(id){

    guardarRepostatges(

        obtenirRepostatges()

        .filter(r=>r.id!=id)

    );

}