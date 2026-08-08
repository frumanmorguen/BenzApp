// dades.js
// BenzApp V2


const CLAU_VEHICLES =
"benzapp_vehicles";

const CLAU_REPOSTATGES =
"benzapp_repostatges";

const CLAU_VEHICLE_ACTIU =
"benzapp_vehicle_actiu";


// ==================================================
// VEHICLES
// ==================================================

function obtenirVehicles(){

    try{

        return JSON.parse(
            localStorage.getItem(
                CLAU_VEHICLES
            )
        ) || [];

    }
    catch(e){

        console.error(
            "Error llegint vehicles:",
            e
        );

        return [];

    }

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

    dades.id =
    Date.now();

    vehicles.push(dades);

    guardarVehicles(
        vehicles
    );

    return dades.id;

}


function obtenirVehicle(id){

    return obterVehiclesIntern()
    .find(
        v => v.id == id
    );

}


function obterVehiclesIntern(){

    return obtenirVehicles();

}


function editarVehicle(
    id,
    dades
){

    let vehicles =
    obtenirVehicles();


    let i =
    vehicles.findIndex(
        v => v.id == id
    );


    if(i < 0)
        return false;


    vehicles[i] = {

        ...vehicles[i],

        ...dades

    };


    guardarVehicles(
        vehicles
    );


    return true;

}


function eliminarVehicle(id){

    guardarVehicles(

        obtenirVehicles()
        .filter(
            v => v.id != id
        )

    );


    guardarRepostatges(

        obtenirRepostatges()
        .filter(
            r => r.vehicleId != id
        )

    );


    if(
        obtenirVehicleActiu() == id
    ){

        localStorage.removeItem(
            CLAU_VEHICLE_ACTIU
        );

    }

}


// ==================================================
// VEHICLE ACTIU
// ==================================================

function guardarVehicleActiu(id){

    localStorage.setItem(
        CLAU_VEHICLE_ACTIU,
        String(id)
    );

}


function obtenirVehicleActiu(){

    const valor =
    localStorage.getItem(
        CLAU_VEHICLE_ACTIU
    );


    if(
        valor === null ||
        valor === ""
    ){

        return null;

    }


    return Number(valor);

}


// ==================================================
// REPOSTATGES
// ==================================================

function obtenirRepostatges(){

    try{

        return JSON.parse(

            localStorage.getItem(
                CLAU_REPOSTATGES
            )

        ) || [];

    }
    catch(e){

        console.error(
            "Error llegint repostatges:",
            e
        );

        return [];

    }

}


function guardarRepostatges(
    llista
){

    localStorage.setItem(

        CLAU_REPOSTATGES,

        JSON.stringify(
            llista
        )

    );

}


function obtenirRepostatgesVehicle(
    vehicleId
){

    return obterRepostatgesIntern()

    .filter(
        r =>
        r.vehicleId == vehicleId
    )

    .sort(
        (a,b)=>
        Number(a.data) -
        Number(b.data)
    );

}


function obterRepostatgesIntern(){

    return obtenirRepostatges();

}


function afegirRepostatge(
    dades
){

    let repostatges =
    obtenirRepostatges();


    dades.id =
    Date.now();


    repostatges.push(
        dades
    );


    guardarRepostatges(
        repostatges
    );


    return dades.id;

}


function editarRepostatge(
    id,
    dades
){

    let repostatges =
    obtenirRepostatges();


    let i =
    repostatges.findIndex(
        r => r.id == id
    );


    if(i < 0)
        return false;


    repostatges[i] = {

        ...repostatges[i],

        ...dades

    };


    guardarRepostatges(
        repostatges
    );


    return true;

}


function eliminarRepostatge(
    id
){

    guardarRepostatges(

        obtenirRepostatges()
        .filter(
            r => r.id != id
        )

    );

}