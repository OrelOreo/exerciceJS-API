import { ajoutListenerAvis, ajoutListenerEnvoyerAvis, afficherAvis } from "./avis.js";
// Récupération des pièces eventuellement stockée dans le localStorage
let pieces = window.localStorage.getItem('pieces')

if(pieces === null) {
    // Récupération des pièces dans le fichier JSON
    const reponse = await fetch(`http://localhost:8081/pieces`);
    pieces = await reponse.json()
    // Transformation des pièces en JSON
    const valeurPieces = JSON.stringify(pieces)
    // Stockage des informations dans le localStorage
    window.localStorage.setItem('pieces', valeurPieces)
}else {
    pieces = JSON.parse(pieces)
}


ajoutListenerEnvoyerAvis()

function genererPieces(pieces){
// Rattachement des éléments

for (let i = 0; i < pieces.length; i++) {
    const article = pieces[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector('.fiches')
    // Création d'une balise dédiée à une pièce automobile
    const pieceElement = document.createElement('article')
    // On crée l'éléement img
    const imageElement = document.createElement('img')
    // On crée le nom
    const nomElement = document.createElement('h2')
    nomElement.innerText = article.nom
    // On crée le prix
    const prixElement = document.createElement('p')
    prixElement.innerText = `Prix: ${article.prix} $ (${article.prix < 35 ? "$" : "$$$"})`
    // On crée la catégorie
    const categorieElement = document.createElement('p')
    categorieElement.innerText = article.categorie ?? "(aucune catégorie)"
    // On crée la description
    const description = document.createElement('p')
    description.innerText = article.description ?? "Pas de description pour le moment"
    // On crée un paragraphe disant si c'est en stock ou non
    const stock = document.createElement('p')
    stock.innerText = article.disponnible ? "En stock" : "Rupture de stock"

    const avisBouton = document.createElement("button");
    avisBouton.dataset.id = article.id;
    avisBouton.textContent = "Afficher les avis";

    // On accède à l'indice i de la liste pieces pour configurer la source de l'image
    imageElement.src = pieces[i].image

    sectionFiches.appendChild(pieceElement)
    pieceElement.appendChild(imageElement)
    pieceElement.appendChild(nomElement)
    pieceElement.appendChild(prixElement)
    pieceElement.appendChild(categorieElement)
    pieceElement.appendChild(description)
    pieceElement.appendChild(stock)
    pieceElement.appendChild(avisBouton)
    }
    ajoutListenerAvis()
}
genererPieces(pieces)

for(let i = 0; i < pieces.length; i++){
    const id = pieces[i].id
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`)
    const avis = JSON.parse(avisJSON)

    if(avis !== null) {
        const pieceElement = document.querySelector(`article[data-id="${id}"]`)
        afficherAvis(pieceElement, avis)
    }
}
// Gestion des boutons

const boutonTrier = document.querySelector('.btn-trier')
boutonTrier.addEventListener('click', function() {
    const piecesOrdonnees = Array.from(pieces)
    piecesOrdonnees.sort(function (a,b) {
        return a.prix - b.prix
    })
})

const boutonFiltrer = document.querySelector('.btn-filtrer')
boutonFiltrer.addEventListener('click', function() {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35
    })
})

const boutonFiltrerDescription = document.querySelector('.btn-filter-description')
boutonFiltrerDescription.addEventListener('click', function() {
    const piecesDescription = pieces.filter(function (piece) {
        return piece.description
    })
})

const boutonTrierDecroissant = document.querySelector('.btn-trier-decroissant')
boutonTrierDecroissant.addEventListener('click', function() {
    const piecesDecroissants = Array.from(pieces)
    piecesDecroissants.sort(function (a,b) {
        return a.prix + b.prix
    })
})

// Retourne la valeur de la propriété nom, de l'objet piece
const noms = pieces.map(piece => piece.nom)
// A chaque tour de boucle on diminue de 1 la valeur de i
for(let i = pieces.length -1; i >= 0; i--){
    if(pieces[i].prix > 35){
        noms.splice(i,1)
    }
}

// Création de la liste
const abordablesElements = document.createElement('ul')
// Ajout de chaque nom à la liste
for(let i = 0; i < noms.length; i++){
    const nomElement = document.createElement('li')
    nomElement.innerText = noms[i]
    abordablesElements.appendChild(nomElement)
}

// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.abordables')
    .appendChild(abordablesElements)

const nomsDisponnibles = pieces.map(piece => piece.nom)
const prixDisponnibles = pieces.map(piece => piece.prix)

for(let i = pieces.length -1; i >= 0; i--){
    if(pieces[i].disponnible === false){
        nomsDisponnibles.splice(i,1)
        prixDisponnibles.splice(i,1)
    }
}

const disponniblesElements = document.createElement('ul')

for(let i = 0; i < nomsDisponnibles.length; i++){
    const nomElement = document.createElement('li')
    nomElement.innerText = `${nomsDisponnibles[i]} - ${prixDisponnibles[i]} $`
    disponniblesElements.appendChild(nomElement)
}


document.querySelector('.disponnibles')
    .appendChild(disponniblesElements)

// Quand on manipule l'input pour filtrer le prix, retourne les produits filtrer et regénère le bloc "fiches"
const inputPrixMax = document.querySelector('#prix-max')
inputPrixMax.addEventListener('input', function() {
    const piecesFiltrees = pieces.filter(function(piece) {
        return piece.prix <= inputPrixMax.value
    })
    document.querySelector('.fiches').innerHTML = ""
    genererPieces(piecesFiltrees)
})

// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector('.btn-maj')
boutonMettreAJour.addEventListener('click', function() {
    window.localStorage.removeItem('pieces')
})