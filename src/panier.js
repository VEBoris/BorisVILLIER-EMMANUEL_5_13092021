let panier = document.querySelector(".panier-card__recap");
let copyOfLS = JSON.parse(localStorage.getItem("products"));

main();

function main() {
  displayPanier();
  countTotalInPanier();
  toEmptyPanier();
  checkFormAndPostRequest();
}

function displayPanier() {
  let test = document.querySelector(".width-to-empty-panier");
  let panierCard = document.querySelector(".panier-card");
  let emptyPanier = document.querySelector(".if-empty-panier");

  // Si le tableau copié du localStorage contient au moins un objet, on affiche le panier et on supprime le message d'erreur.
  if (localStorage.getItem("products")) {
    panierCard.style.display = "flex";
    panierCard.style.flexDirection = "column";
    panierCard.style.justifyContent = "space-around";
    emptyPanier.style.display = "none";
  }

  // Pour chaque objet dans le tableau copié du localStorage, on crée les divs de l'affichage du panier et on les remplit avec les données du tableau.
  for (let produit in copyOfLS) {
    let productRow = document.createElement("div");
    panier.insertBefore(productRow, test);
    productRow.classList.add("panier-card__recap__row", "product-row");

    let productName = document.createElement("div");
    productRow.appendChild(productName);
    productName.classList.add("panier-card__recap__title");
    productName.innerHTML = copyOfLS[produit].name;

    let productQuantity = document.createElement("div");
    productRow.appendChild(productQuantity);
    productQuantity.classList.add("panier-card__recap__title", "title-quantity");
    productQuantity.innerHTML = copyOfLS[produit].quantity;

    let productPrice = document.createElement("div");
    productRow.appendChild(productPrice);
    productPrice.classList.add(
      "panier-card__recap__title",
      "data-price",
      "price"
    );

    // Affichage du prix avec le formatage €
    productPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(copyOfLS[produit].price * copyOfLS[produit].quantity);
  }
}

function countTotalInPanier() {
  let arrayOfPrice = [];
  let totalPrice = document.querySelector(".total");

  // On push chaque prix du DOM dans un tableau
  let productPriceAccordingToQuantity = document.querySelectorAll(".price");
  for (let price in productPriceAccordingToQuantity) {
    arrayOfPrice.push(productPriceAccordingToQuantity[price].innerHTML);
  }

  // On enlève les undefined du tableau
  arrayOfPrice = arrayOfPrice.filter((el) => {
    return el != undefined;
  });

  // Transformer en nombre chaque valeur du tableau
  arrayOfPrice = arrayOfPrice.map((x) => parseFloat(x));

  // Additionner les valeurs du tableau pour avoir le prix total
  const reducer = (acc, currentVal) => acc + currentVal;
  arrayOfPrice = arrayOfPrice.reduce(reducer);

  // Affichage du prix avec formatage €
  totalPrice.innerText = `Total : ${(arrayOfPrice = new Intl.NumberFormat(
    "fr-FR",
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(arrayOfPrice))}`;
}

function toEmptyPanier() {

  // Lorsque qu'on clique sur le bouton, le panier se vide ainsi que le localStorage
  const buttonToEmptyPanier = document.querySelector(".to-empty-panier");
  buttonToEmptyPanier.addEventListener("click", () => {
    localStorage.clear();
  });
}

function checkFormAndPostRequest() {

  // On récupère les inputs depuis le DOM.
  const submit = document.querySelector("#submit");
  const inputName = document.querySelector("#name");
  const inputLastName = document.querySelector("#lastname");
  const inputPostal = document.querySelector("#postal");
  const inputCity = document.querySelector("#city");
  const inputAdress = document.querySelector("#adress");
  const inputMail = document.querySelector("#mail");
  const inputPhone = document.querySelector("#phone");
  const erreur = document.querySelector(".erreur");

  // Lors d'un clic, si l'un des champs n'est pas rempli, on affiche une erreur, on empêche l'envoi du formulaire. On vérifie aussi que le numéro est un nombre, sinon même chose.
  submit.addEventListener("click", (e) => {
    if (
      !inputName.value ||
      !inputLastName.value ||
      !inputPostal.value ||
      !inputCity.value ||
      !inputAdress.value ||
      !inputMail.value ||
      !inputPhone.value
    ) {
      erreur.innerHTML = "Vous devez renseigner tous les champs !";
      erreur.style.visibility = "visible";
      erreur.style.color = "red";
      erreur.style.whiteSpace = "normal";
      e.preventDefault();
    } else if (isNaN(inputPhone.value)) {
      e.preventDefault();
      erreur.innerText = "Votre numéro de téléphone n'est pas valide";
    } else {

      // Si le formulaire est valide, le tableau productsBought contiendra un tableau d'objet qui sont les produits acheté, et order contiendra ce tableau ainsi que l'objet qui contient les infos de l'acheteur
      let productsBought = [];
      productsBought.push(copyOfLS);

      const info = {
        contact: {
          firstName: inputName.value,
          lastName: inputLastName.value,
          city: inputCity.value,
          address: inputAdress.value,
          email: inputMail.value,
        },
        teddy_bears: productsBought,
      };

      // -------  Envoi de la requête POST au back-end --------
      // Création de l'entête de la requête
      const options = {
        method: "POST",
        body: JSON.stringify(info),
        headers: { "Content-Type": "application/json" },
      };

      // Préparation du prix formaté pour l'afficher sur la prochaine page
      let priceConfirmation = document.querySelector(".total").innerText;
      priceConfirmation = priceConfirmation.split(" :");

      // Envoie de la requête avec l'en-tête. On changera de page avec un localStorage qui ne contiendra plus que l'order id et le prix.
      fetch("http://localhost:3000/api/teddies/order", options)
      .then((response) => {
        const dataResponse = response.json();
          localStorage.clear();
          console.log(data)
          localStorage.setItem("orderId", data.orderId);
          localStorage.setItem("total", priceConfirmation[1]);

          //  On peut commenter cette ligne pour vérifier le statut 201 de la requête fetch. Le fait de préciser la destination du lien ici et non dans la balise <a> du HTML permet d'avoir le temps de placer les éléments comme l'orderId dans le localStorage avant le changement de page.
          document.location.href = "confirmation.html";
        })
        .catch((err) => {
          alert("Il y a eu une erreur : " + err);
        });
    }
  });
}