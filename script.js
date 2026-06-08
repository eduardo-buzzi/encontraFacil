document.addEventListener("DOMContentLoaded", () => {
    // 1. Primeiro ajusta o tema e o atributo do ícone correto
    initTheme();
    
    // 2. Depois renderiza os ícones do Lucide
    lucide.createIcons();

    initDatabase();
    populateLocations();

    if (document.getElementById("results-container")) {
        renderIndexItems();
    }

    if (
        typeof $ !== "undefined" &&
        document.getElementById("tabelaItens")
    ) {
        renderAdminTable();
    }
});

/* ==========================================
   BANCO FALSO (LOCAL STORAGE)
========================================== */

function initDatabase() {

    if (!localStorage.getItem("encontrafacil_locations")) {

        const defaultLocations = [
            {
                id: "senai",
                name: "SENAI - Faculdade"
            },
            {
                id: "giassi",
                name: "Giassi - Supermercado"
            },
            {
                id: "terminal",
                name: "Terminal - Terminal Urbano"
            }
        ];

        localStorage.setItem(
            "encontrafacil_locations",
            JSON.stringify(defaultLocations)
        );
    }

    if (!localStorage.getItem("encontrafacil_items")) {

        const defaultItems = [
            {
                id: "001",
                title: "Mochila Nike Preta",
                location: "senai",
                locationName: "SENAI - Faculdade",
                desc: "Encontrada no corredor principal.",
                date: "28/05/2026",
                status: "Disponível",
                img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
            },

            {
                id: "002",
                title: "Carteira Marrom",
                location: "giassi",
                locationName: "Giassi - Supermercado",
                desc: "Carteira encontrada no estacionamento.",
                date: "27/05/2026",
                status: "Disponível",
                img: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
            }
        ];

        localStorage.setItem(
            "encontrafacil_items",
            JSON.stringify(defaultItems)
        );
    }
}

/* ==========================================
   POPULAR SELECTS
========================================== */

function populateLocations() {

    const locations = JSON.parse(
        localStorage.getItem("encontrafacil_locations")
    );

    const selects = document.querySelectorAll(
        ".dynamic-location-select"
    );

    selects.forEach(select => {

        const firstOption = select.options[0];

        select.innerHTML = "";
        select.appendChild(firstOption);

        locations.forEach(location => {

            const option = document.createElement("option");

            option.value = location.id;
            option.textContent = location.name;

            select.appendChild(option);
        });
    });
}

/* ==========================================
   CADASTRAR SEDE
========================================== */

function cadastrarSede(event) {

    event.preventDefault();

    const nomeInput =
        document.getElementById("nova-sede-nome");

    const nome = nomeInput.value.trim();

    const id = nome
        .toLowerCase()
        .replace(/\s+/g, "-");

    const locations = JSON.parse(
        localStorage.getItem("encontrafacil_locations")
    );

    locations.push({
        id,
        name: nome
    });

    localStorage.setItem(
        "encontrafacil_locations",
        JSON.stringify(locations)
    );

    alert("✅ Nova sede cadastrada!");

    nomeInput.value = "";

    populateLocations();
}

/* ==========================================
   CADASTRAR ITEM
========================================== */

function cadastrarItem(event) {

    event.preventDefault();

    const titulo =
        document.getElementById(
            "novo-item-titulo"
        ).value;

    const desc =
        document.getElementById(
            "novo-item-desc"
        ).value;

    const localSelect =
        document.getElementById(
            "novo-item-local"
        );

    const location =
        localSelect.value;

    const locationName =
        localSelect.options[
            localSelect.selectedIndex
        ].text;

    const imageInput =
        document.getElementById(
            "novo-item-img"
        );

    const file =
        imageInput.files[0];

    if (!file) {
        alert("Selecione uma imagem.");
        return;
    }

    const reader =
        new FileReader();

    reader.onload = function (e) {

        const items = JSON.parse(
            localStorage.getItem(
                "encontrafacil_items"
            )
        );

        const newItem = {

            id:
                String(items.length + 1)
                    .padStart(3, "0"),

            title: titulo,

            location,

            locationName,

            desc,

            date:
                new Date()
                    .toLocaleDateString(
                        "pt-BR"
                    ),

            status:
                "Disponível",

            img:
                e.target.result
        };

        items.push(newItem);

        localStorage.setItem(
            "encontrafacil_items",
            JSON.stringify(items)
        );

        alert(
            "✅ Item publicado com sucesso!"
        );

        location.reload();
    };

    reader.readAsDataURL(file);
}

/* ==========================================
   DATATABLE
========================================== */

function renderAdminTable() {
    const tbody = document.querySelector("#tabelaItens tbody");
    const items = JSON.parse(localStorage.getItem("encontrafacil_items"));

    tbody.innerHTML = "";

    items.forEach(item => {
        // Define uma cor de botão diferente baseada no status atual do item
        let badgeClass = "bg-success text-white"; // Disponível
        if (item.status === "Em Análise") {
            badgeClass = "bg-warning text-dark";
        } else if (item.status === "Devolvido") {
            badgeClass = "bg-secondary text-white";
        }

        tbody.innerHTML += `
            <tr>
                <td>#${item.id}</td>

                <td>
                    <div class="d-flex align-items-center gap-2">
                        <img
                            src="${item.img}"
                            width="40"
                            height="40"
                            style="object-fit:cover;border-radius:6px;">

                        ${item.title}
                    </div>
                </td>

                <td>
                    ${item.locationName}
                </td>

                <td>
                    ${item.date}
                </td>

                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm ${badgeClass} dropdown-toggle fw-medium" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            ${item.status}
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="alterarStatus('${item.id}', 'Disponível')">Disponível</a></li>
                            <li><a class="dropdown-item" href="#" onclick="alterarStatus('${item.id}', 'Em Análise')">Em Análise</a></li>
                            <li><a class="dropdown-item" href="#" onclick="alterarStatus('${item.id}', 'Devolvido')">Devolvido</a></li>
                        </ul>
                    </div>
                </td>

                <td>
                    <button
                        onclick="simulateDelete()"
                        class="btn btn-danger btn-sm">

                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });

    $("#tabelaItens").DataTable({
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json"
        },
        pageLength: 5,
        lengthChange: false
    });
}

/* ==========================================
   RENDER HOME
========================================== */

function renderIndexItems() {

    const container =
        document.getElementById(
            "results-container"
        );

    const items = JSON.parse(
        localStorage.getItem(
            "encontrafacil_items"
        )
    );

    container.innerHTML = "";

    items.reverse().forEach(item => {

        container.innerHTML += `
        <div class="col-md-4 result-item"
             data-location="${item.location}"
             data-title="${item.title.toLowerCase()}">

            <div class="card h-100 shadow-sm border-0 item-card">

                <img src="${item.img}"
                    class="card-img-top"
                    style="height:220px;object-fit:cover;">

                <div class="card-body d-flex flex-column">

                    <h5 class="fw-bold">
                        ${item.title}
                    </h5>

                    <p class="small text-muted">
                        📍 ${item.locationName}
                    </p>

                    <p class="small">
                        ${item.desc}
                    </p>

                    <button
                        onclick="navigateTo('request')"
                        class="btn btn-brand mt-auto">

                        Solicitar Recuperação
                    </button>

                </div>
            </div>
        </div>
        `;
    });
}

/* ==========================================
   PESQUISA
========================================== */

function executeSearch() {

    const location =
        document.getElementById(
            "location-select"
        ).value;

    const text =
        document.getElementById(
            "main-search-input"
        )
            .value
            .toLowerCase();

    const items =
        document.querySelectorAll(
            ".result-item"
        );

    let count = 0;

    items.forEach(item => {

        const matchLocation =
            !location ||
            item.dataset.location === location;

        const matchText =
            !text ||
            item.dataset.title.includes(text);

        if (
            matchLocation &&
            matchText
        ) {

            item.style.display = "block";
            count++;

        } else {

            item.style.display = "none";
        }
    });

    navigateTo("results");
}

/* ==========================================
   TEMA
========================================== */

function initTheme() {
    const saved = localStorage.getItem("theme");
    const theme = saved || "light";
    document.documentElement.setAttribute("data-bs-theme", theme);

    const icon = document.getElementById("theme-icon");
    if (icon) {
        icon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
    }
}

function toggleDarkMode() {
    const current = document.documentElement.getAttribute("data-bs-theme");
    const next = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-bs-theme", next);
    localStorage.setItem("theme", next);

    const icon = document.getElementById("theme-icon");
    if (icon) {
        icon.outerHTML = next === "dark" 
            ? '<i id="theme-icon" data-lucide="sun"></i>' 
            : '<i id="theme-icon" data-lucide="moon"></i>';
        
        lucide.createIcons();
    }
}

/* ==========================================
   LOGIN
========================================== */

function handleLogin(event) {

    event.preventDefault();

    alert(
        "Login realizado!"
    );

    window.location.href =
        "admin.html";
}

function togglePasswordVisibility() {
    const input = document.getElementById("login-password");
    const icon = document.getElementById("password-toggle-icon");

    if (input.type === "password") {
        input.type = "text";
        
        if (icon) {
            icon.outerHTML = '<i id="password-toggle-icon" data-lucide="eye-off" style="width: 18px;"></i>';
        }
    } else {
        input.type = "password";
        
        if (icon) {
            icon.outerHTML = '<i id="password-toggle-icon" data-lucide="eye" style="width: 18px;"></i>';
        }
    }

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

/* ==========================================
   NAVEGAÇÃO
========================================== */

function navigateTo(view) {

    document
        .querySelectorAll(
            ".view-panel"
        )
        .forEach(el =>
            el.classList.remove(
                "active"
            )
        );

    document
        .getElementById(
            `view-${view}`
        )
        .classList.add(
            "active"
        );
}

/* ==========================================
   MÁSCARAS
========================================== */

function maskCPF(input) {

    let value =
        input.value
            .replace(/\D/g, "");

    value = value.replace(
        /(\d{3})(\d)/,
        "$1.$2"
    );

    value = value.replace(
        /(\d{3})(\d)/,
        "$1.$2"
    );

    value = value.replace(
        /(\d{3})(\d{1,2})$/,
        "$1-$2"
    );

    input.value = value;
}

function maskPhone(input) {

    let value =
        input.value
            .replace(/\D/g, "");

    value = value.replace(
        /^(\d{2})(\d)/g,
        "($1) $2"
    );

    value = value.replace(
        /(\d)(\d{4})$/,
        "$1-$2"
    );

    input.value = value;
}

/* ==========================================
   ALERTAS
========================================== */

function submitRequest(event) {

    event.preventDefault();

    alert(
        "✅ Solicitação enviada!"
    );

    navigateTo("home");

    event.target.reset();
}

function simulateDelete() {

    alert(
        "❌ Item não pode ser excluído."
    );
}

function simulateSave(
    event,
    message
) {

    event.preventDefault();

    alert(
        "✅ " + message
    );

    event.target.reset();
}

/* ==========================================
   ALTERAR STATUS DO ITEM
========================================== */

function alterarStatus(id, novoStatus) {
    const items = JSON.parse(localStorage.getItem("encontrafacil_items"));
    
    const item = items.find(i => i.id === id);
    
    if (item) {
        item.status = novoStatus;
        
        localStorage.setItem("encontrafacil_items", JSON.stringify(items));
        
        location.reload();
    }
}