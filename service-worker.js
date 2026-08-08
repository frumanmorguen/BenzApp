// service-worker.js

const CACHE = "benzapp-v4";

const FITXERS = [

    "./",

    "./index.html",
    "./vehicle.html",
    "./historial.html",
    "./editar.html",
    "./resum.html",

    "./style.css",

    "./app.js",
    "./dades.js",
    "./vehicle.js",
    "./historial.js",
    "./editar.js",
    "./resum.js",
    "./tema.js",

    "./manifest.json",

    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/icon-1024.png"

];



self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE)

        .then(cache =>

            cache.addAll(FITXERS)

        )

    );

});



self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

        .then(keys =>

            Promise.all(

                keys

                .filter(key => key !== CACHE)

                .map(key => caches.delete(key))

            )

        )

    );

});



self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response =>

            response || fetch(event.request)

        )

    );

});