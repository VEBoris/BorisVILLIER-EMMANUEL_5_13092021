main();

function main() {
  getBears();
}

// Récupérer les articles depuis l'API
function getBears() {
  fetch("http://localhost:3000/api/teddies")
    .then(function (res) {
      return res.json();
    })
    .catch((error) => {
      const productsContainer = document.querySelector(".products-container");
      productsContainer.innerHTML =
        "Une erreur s'est produite. Avez vous bien lancé le serveur local (Port 3000) ?";
      productsContainer.style.textAlign = "center";
      productsContainer.style.padding = "30vh 0";
    })

    // Distribuer chaque produit dans le DOM
    .then(function (resultatAPI) {
      const teddyBears = resultatAPI;
      console.log(teddyBears);
      for (const article in teddyBears) {
        const productCard = document.createElement("article");
        document.querySelector(".teddy_bears").appendChild(productCard);
        productCard.classList.add("product");

        const productLink = document.createElement("a");
        productCard.appendChild(productLink);
        productLink.href = `product.html?id=${resultatAPI[article]._id}`;
        productLink.classList.add("bears_link");

        const productImgDiv = document.createElement("div");
        productLink.appendChild(productImgDiv);
        productImgDiv.classList.add("product__img");

        const productImg = document.createElement("img");
        productImgDiv.appendChild(productImg);
        productImg.src = resultatAPI[article].imageUrl;

        const productInfosDiv = document.createElement("div");
        productLink.appendChild(productInfosDiv);
        productInfosDiv.classList.add("product__infos");

        const productInfoTitle = document.createElement("div");
        productInfosDiv.appendChild(productInfoTitle);
        productInfoTitle.classList.add("product__infos__title");
        productInfoTitle.innerHTML = resultatAPI[article].name;

        const productInfoPrice = document.createElement("div");
        productInfosDiv.appendChild(productInfoPrice);
        productInfoPrice.classList.add("product__infos__price");

        // Formatage du prix pour l'afficher en euros
        resultatAPI[article].price = resultatAPI[article].price / 100;
        productInfoPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(resultatAPI[article].price);
      }
    });
}