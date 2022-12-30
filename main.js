// API ENDPOINT : `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`

const form = document.querySelector("form");
const input = document.querySelector("input");
const errorMsg = document.querySelector(".error-msg");
const loader = document.querySelector(".loader")
const resultsDisplay = document.querySelector(".results-display")

form.addEventListener("submit", handleSubmit);

function handleSubmit(e){
    e.preventDefault()

    if(input.value === "") /*=chaine de caractere vide*/{
        errorMsg.textContent = "Oups, 0 résultat ! Vous n'avez pas remplit l'input de recherche...";
        return;
    }else {
        errorMsg.textContent = "";
        loader.style.display = "flex";
        resultsDisplay.textContent ="";
        wikiApiCall(input.value);
    }
}

async function wikiApiCall(searchInput){ /*async sert à attendre que les resultat soit trouvé avat d'afficher quelque chose*/

    try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`)

    const data = await response.json()
    console.log(data);

    createCards(data.query.search);

    if(!response.ok){
        throw new Error (`${response.status}`)
    }
    }
    catch(error) {
        errorMsg.textContent = `${error}`;
        loader.style.display="none";
    }
}



function createCards(data){
    if(!data.length){
        errorMsg.textContent = "Oups, aucun résultat !";
        loader.style.display = "none";
        return; 
    }
    data.forEach(el => {

        const url = `https://en.wikipedia.org/?curid=${el.pageid}`;
        const card = document.createElement("div");
        card.className = "result-item";
        card.innerHTML = `
         <h3 class="result-tilte"> 
                <a href=${url} target="_blank">${el.title}</a>
         </h3>

         <a href=${url} class="result-link" target="_blank">${url}</a>
         <span class="result-snippet">${el.snippet}</span>
         <br>
    `;
    resultsDisplay.appendChild(card); /*ca permet d'ajouter un enfant à results-display*/
    });

    loader.style.display = "none";
}