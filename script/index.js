const busquedaIngrediente = document.querySelector("#buscarIngrediente")
const submitBuscarIngrediente = document.querySelector("#submitBuscarIngrediente")
const resultados = document.querySelector("#resultados")
const detalles = document.querySelector("#detalles")
const divBusqueda = document.querySelector("#divBusqueda")
const divRandom = document.querySelector("#divRandom")
const divContenidoRandom = document.querySelector("#divContenidoRandom")
const botonVolver = document.querySelector("#botonVolver")
const botonVolver2 = document.querySelector("#botonVolver2")
const botonRandom = document.querySelector("#botonRandom")

// Seleccionar modo: Búsqueda / Random

divBusqueda.onclick = () => {
    divRandom.style.display = "none"
    divBusqueda.style.width = "100%"
    botonVolver.style.display = "flex"
}

divRandom.onclick = () => {
    divBusqueda.style.display = "none"
    divRandom.style.width = "100%"
    botonVolver2.style.display = "flex"
}

// Habilitar búsqueda

submitBuscarIngrediente.disabled = true

busquedaIngrediente.oninput = () => {
    busquedaIngrediente.value === "" ? submitBuscarIngrediente.disabled = true : submitBuscarIngrediente.disabled = false
}

// Buscar cóctel

submitBuscarIngrediente.onclick = () => {

    let fetchIngrediente = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${busquedaIngrediente.value}`

    fetch(fetchIngrediente)
        .then(respuesta => respuesta.json())
        .then(data => {

            const busquedaAHtml = (array) => {
                const datosBusqueda = array.reduce((acc, curr) => {
                    return acc + `
                        <div class="tarjetasResultados" id=>
                            <h2 class="tituloBusqueda">${curr.strDrink}</h2>
                            <img class="imgBusqueda" src=${curr.strDrinkThumb} alt=${curr.strDrink}>
                            <button class="botonesBusqueda" type="button" id="${curr.idDrink}">Detalles</button>
                        </div>         
                    `
                }, "")

                return datosBusqueda
            }

            resultados.innerHTML = busquedaAHtml(data.drinks)

            // Mostrar detalles (obtener id)

            let tarjetasResultados = document.getElementsByClassName("tarjetasResultados")

            for (botonDetalles of tarjetasResultados) {
                botonDetalles.onclick = (e) => {
                    const botonElegido = e.target;
                    const idBoton = botonElegido.getAttribute("id");
                    console.log(idBoton)

                    // Mostrar detalles (peticion con id)

                    let fetchPorID = (`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idBoton}`)

                    fetch(fetchPorID)
                        .then(respuesta => respuesta.json())
                        .then(data => {
                            console.log(data)

                            resultados.innerHTML = ""

                            // Mostrar instrucciones en español, sino en inglés

                            const instruccionesRandom = () => {
                                if (data.drinks[0].strInstructionsES !== null) {
                                    return data.drinks[0].strInstructionsES
                                } else if (data.drinks[0].strInstructionsES === null) {
                                    return data.drinks[0].strInstructions
                                }
                            }

                            // Filtrado de ingredientes y medidas

                            const arrayCocktel = Object.entries(data.drinks[0])

                            const ingredientes = arrayCocktel.slice(17, 32)
                            console.log(ingredientes)

                            const medidas = arrayCocktel.slice(32, 47)
                            console.log(medidas[0])

                            const ingredientesTrue = ingredientes.filter((curr) => {
                                return curr[1] !== null
                            })

                            const medidasTrue = medidas.filter((curr) => {
                                return curr[1] !== null
                            })

                            // Detalles al HTML

                            detalles.innerHTML = `
                            <h2 class="nombreCocktel">${data.drinks[0].strDrink}</h2>
                            <img class="imgRandom" src=${data.drinks[0].strDrinkThumb} alt=${data.drinks[0].strDrink}>
                            <h4>Ingredientes</h4>
                            <div class="cajaIngredientes">
                                <div class="divIngredientes">
                                    <section id="sectionIngredientes">
                                    </section>
                                </div>
                                <div class="divMedidas">
                                    <section id="sectionMedidas">
                                    </section>
                                </div>
                            </div>                
                            <h4 class="tituloInstrucciones">Instrucciones</h4>
                            <p class="instrucciones">${instruccionesRandom()}
                            </p>`

                            // Ingredientes y medidas al HTML

                            const sectionIngredientes = document.querySelector("#sectionIngredientes")
                            const ingredientesHTML = () => {
                                ingredientesTrue.forEach(curr => sectionIngredientes.innerHTML += `<p class="ingredientes">${curr[1]}</p>`)
                            }
                            ingredientesHTML()

                            const sectionMedidas = document.querySelector("#sectionMedidas")
                            const medidasHTML = () => {
                                medidasTrue.forEach(curr => sectionMedidas.innerHTML += `<p class="ingredientes">${curr[1]}</p>`)
                            }
                            medidasHTML()
                        })

                        .catch(() => {
                            swal("Cóctel no encontrado", "", "error");
                        })
                }
            }
        })
        .catch(() => {
            swal("Cóctel no encontrado", "", "error");
        })
}

// Buscar con tecla ENTER

busquedaIngrediente.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
        submitBuscarIngrediente.click();
    }
});

// Botón volver

botonVolver.onclick = () => {
    resultados.innerHTML = ""
    busquedaIngrediente.value = ""
    window.location.reload()
}

botonVolver2.onclick = () => {
    resultados.innerHTML = ""
    busquedaIngrediente.value = ""
    window.location.reload()
}

// Cóctel al azar

let coctelAlAzar = () => {

    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        .then(respuesta => respuesta.json())
        .then(data => {

            // Mostrar instrucciones en español, sino en inglés

            const instruccionesRandom = () => {
                if (data.drinks[0].strInstructionsES !== null) {
                    return data.drinks[0].strInstructionsES
                } else if (data.drinks[0].strInstructionsES === null) {
                    return data.drinks[0].strInstructions
                }
            }

            // Filtrado de ingredientes y medidas

            const arrayCocktel = Object.entries(data.drinks[0])

            const ingredientes = arrayCocktel.slice(17, 32)
            console.log(ingredientes)

            const medidas = arrayCocktel.slice(32, 47)
            console.log(medidas[0])

            const ingredientesTrue = ingredientes.filter((curr) => {
                return curr[1] !== null
            })

            const medidasTrue = medidas.filter((curr) => {
                return curr[1] !== null
            })

            // Datos al HTML

            divContenidoRandom.innerHTML = `
            <h2 class="nombreCocktel">${data.drinks[0].strDrink}</h2>
            <img class="imgRandom" src=${data.drinks[0].strDrinkThumb} alt=${data.drinks[0].strDrink}>
            <h4>Ingredientes</h4>
            <div class="cajaIngredientes">
                <div class="divIngredientes">
                    <section id="sectionIngredientes">
                    </section>
                </div>
                <div class="divMedidas">
                    <section id="sectionMedidas">
                    </section>
                </div>
            </div>
            <h4 class="tituloInstrucciones">Instrucciones</h4>
            <p class="instrucciones">${instruccionesRandom()}
            </p>`

            // Ingredientes y medidas al HTML

            const sectionIngredientes = document.querySelector("#sectionIngredientes")
            const ingredientesHTML = () => {
                ingredientesTrue.forEach(curr => sectionIngredientes.innerHTML += `<p class="ingredientes">${curr[1]}</p>`)
            }
            ingredientesHTML()

            const sectionMedidas = document.querySelector("#sectionMedidas")
            const medidasHTML = () => {
                medidasTrue.forEach(curr => sectionMedidas.innerHTML += `<p class="ingredientes">${curr[1]}</p>`)
            }
            medidasHTML()
        })
        .catch(() => {
            console.log("malio sal")
        })
}

botonRandom.onclick = () => {
    coctelAlAzar()
}