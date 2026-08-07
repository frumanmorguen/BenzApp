// resum.js

const vehicleId = obtenirVehicleActiu();

if (!vehicleId) {

    location.href = "index.html";

}

const vehicle =
obtenirVehicle(vehicleId);

const dadesVehicle =
document.getElementById("dadesVehicle");

const resum =
document.getElementById("resum");



function consumMitja(repostatges){

    let litres = 0;
    let km = 0;

    let ultimPle = null;

    repostatges.forEach(r=>{

        if(r.ple){

            if(ultimPle){

                km +=
                r.km-ultimPle.km;

                litres +=
                r.litres;

            }

            ultimPle = r;

        }

    });

    if(km<=0)
        return "—";

    return (
        litres/km*100
    ).toFixed(2);

}



window.onload=function(){

    dadesVehicle.innerHTML=`

    <h2>

    ${vehicle.marca}
    ${vehicle.model}

    </h2>

    <p>

    ${vehicle.matricula}

    </p>

    `;


    let r =
    obtenirRepostatgesVehicle(vehicleId);


    if(r.length===0){

        resum.innerHTML=`

        Encara no hi ha repostatges.

        `;

        return;

    }


    let litres=0;
    let cost=0;

    r.forEach(x=>{

        litres+=x.litres;
        cost+=x.cost;

    });


    let km=0;

    if(r.length>1){

        km=
        r[r.length-1].km-
        r[0].km;

    }


    resum.innerHTML=`

    <table class="taulaResum">

    <tr>

    <td>Quilòmetres</td>

    <td>

    ${km.toLocaleString("ca-ES")}

    </td>

    </tr>

    <tr>

    <td>Repostatges</td>

    <td>

    ${r.length}

    </td>

    </tr>

    <tr>

    <td>Litres</td>

    <td>

    ${litres.toFixed(2)}

    </td>

    </tr>

    <tr>

    <td>Cost total</td>

    <td>

    ${cost.toFixed(2)} €

    </td>

    </tr>

    <tr>

    <td>Preu mig/L</td>

    <td>

    ${(cost/litres).toFixed(3)} €

    </td>

    </tr>

    <tr>

    <td>Cost/km</td>

    <td>

    ${
        km>0
        ? (cost/km).toFixed(3)+" €"
        : "—"
    }

    </td>

    </tr>

    <tr>

    <td>Consum mitjà</td>

    <td>

    ${consumMitja(r)}
    L/100

    </td>

    </tr>

    </table>

    `;

};