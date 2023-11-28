const { Simulador } = require("../.dist/index");
const Pessoas = require("../.dist/entidades/Pessoas");
const Sala = require("../.dist/entidades/Sala");

const sala = new Sala("Sala1", 2);
const pessoas = new Pessoas("Pessoas");
const simulador = new Simulador([sala, pessoas], 0, 100);
(async () => {
    if (await simulador.iniciar()) {
        for await (let momento of simulador.simular()) {
            console.log(momento);
        }
    }
    else {
        console.error("Falha ao iniciar a simulação.");
    }
})();