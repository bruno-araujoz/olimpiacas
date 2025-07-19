const data = [
        {
            title: "Olimpiada de Matemática Brasileira (OBM)",
            descripition:
                "A prestigious mathematics competition in Brazil that challenges students with complex problems.",
            value: "matematica",
            data: "2024-05-15",
        },

        {
            title: "Olimpiada Brasileira de Biologia (OBB)",
            descripition:
                "Uma competição de biologia que estimula o interesse dos estudantes pela ciência.",
            value: "biologia",
            data: "2024-05-15",
        },

        

];

const cardContainer = document.querySelector(".card-container");
const searchInput = document.querySelector("#searchInput");

const displayData = data => {
    cardContainer.innerHTML = ""; // Clear previous content
    data.forEach(e => {
        cardContainer.innerHTML += `
        <div class="card ${e.value}">
            <h3>${e.title}</h3>
            <p>${e.descripition}</p>
            <div class="detail-popup-button">
                <button id="popup-button">Detalhes</button>
            </div>
        </div>
        `
    });
}

searchInput.addEventListener("input", (e) => {
    const search = data.filter( i => i.title.toLowerCase().includes(e.target.value.toLowerCase()));
    displayData(search);
});

window.addEventListener("load", displayData.bind(null, data));

document.getElementById('filter').addEventListener('change', function () {
  const selectedCategory = this.value;
  const items = document.querySelectorAll('.card');

  items.forEach(item => {
    if (selectedCategory === 'all' || item.classList.contains(selectedCategory)) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
});

querySelectorAll('.detail-popup-button').addEventListener('click', function () {
        document.querySelector('body').innerHTML += `
        <div class="detail-popup">
        <div class="content">
            <button class="popup-close-btn">&times;</button>
            <h1>Detalhes da Olimpíada</h1>
            <p>Informações detalhadas sobre a olimpíada selecionada.</p>
        </div>
    </div>
    `;
    });