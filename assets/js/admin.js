document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');
    const serviceList = document.getElementById('serviceList');
    const priceList = document.getElementById('priceList');

    // Iegūst datus no localStorage vai izveido tukšus sarakstus
    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const prices = JSON.parse(localStorage.getItem('prices')) || [];

    // Renderē lietotājus
    function renderUsers() {
        userList.innerHTML = '';
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${new Date().toLocaleDateString()}</td>
                <td><button class="btn btn-danger" onclick="deleteUser(${index})">Dzēst</button></td>
            `;
            userList.appendChild(row);
        });
    }

    // Renderē pakalpojumus
    function renderServices() {
        serviceList.innerHTML = '';
        services.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.id}</td>
                <td>${service.serviceName}</td>
                <td>${service.description}</td>
                <td><button class="btn btn-danger" onclick="deleteService(${service.id})">Dzēst</button></td>
            `;
            serviceList.appendChild(row);
        });
    }

    // Renderē cenas
    function renderPrices() {
        priceList.innerHTML = '';
        prices.forEach(price => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${price.id}</td>
                <td>${price.service}</td>
                <td>${price.price}</td>
                <td><button class="btn btn-danger" onclick="deletePrice(${price.id})">Dzēst</button></td>
            `;
            priceList.appendChild(row);
        });
    }

    // Dzēst lietotāju
    function deleteUser(userId) {
        users.splice(userId, 1);  // Dzēš lietotāju no saraksta
        localStorage.setItem("registeredUsers", JSON.stringify(users)); // Atjaunina localStorage
        renderUsers();
    }

    // Dzēst pakalpojumu
    function deleteService(serviceId) {
        const index = services.findIndex(service => service.id === serviceId);
        if (index !== -1) {
            services.splice(index, 1);
            localStorage.setItem('services', JSON.stringify(services)); // Saglabāt izmaiņas localStorage
            renderServices();
        }
    }

    // Dzēst cenu
    function deletePrice(priceId) {
        const index = prices.findIndex(price => price.id === priceId);
        if (index !== -1) {
            prices.splice(index, 1);
            localStorage.setItem('prices', JSON.stringify(prices)); // Saglabāt izmaiņas localStorage
            renderPrices();
        }
    }

    // Pievienot lietotāju
    document.getElementById('addUserBtn').addEventListener('click', () => {
        const newUser = {
            id: users.length + 1,
            name: prompt('Ievadi lietotāja vārdu:'),
            email: prompt('Ievadi lietotāja e-pastu:'),
            registrationDate: new Date().toLocaleDateString(),
        };
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users)); // Saglabāt jaunus datus localStorage
        renderUsers();
    });

    // Pievienot pakalpojumu
    document.getElementById('addServiceBtn').addEventListener('click', () => {
        const newService = {
            id: services.length + 1,
            serviceName: prompt('Ievadi pakalpojuma nosaukumu:'),
            description: prompt('Ievadi pakalpojuma aprakstu:'),
        };
        services.push(newService);
        localStorage.setItem('services', JSON.stringify(services)); // Saglabāt jaunus datus localStorage
        renderServices();
    });
    

    // Iniciē sākotnējo datu attēlošanu
    renderUsers();
    renderServices();
    renderPrices();

    const formatLatvianDateTime = (datetime) => {
    const date = new Date(datetime);
    date.setHours(date.getHours() + 3); // Pieliekam 3 stundas
    return date.toISOString().replace("T", " ").slice(0, 19);
    };

    fetch('/api/register')
        .then(res => res.json())
        .then(data => {
            const userList = document.getElementById('userList');
            userList.innerHTML = '';
            data.forEach((a, i) => {
                const createData = (a.create_data === "1970-01-01 03:00:00" || !a.create_data) ? '' : formatLatvianDateTime(a.create_data);
                const modifiedData = (a.modified_data_password === "1970-01-01 03:00:00" || !a.modified_data_password) ? '' : formatLatvianDateTime(a.modified_data_password);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${a.name}</td>
                    <td>${a.email}</td>
                    <td>${a.phone}</td>
                    <td>${createData}</td>
                    <td>${modifiedData}</td>
                    <td><button class="btn btn-danger">Rediģēt</button></td>
                `;
                userList.appendChild(row);
            });
        });

    fetch('/api/pakalpojumi')
        .then(res => res.json())
        .then(data => {
            const serviceList = document.getElementById('serviceList');
            serviceList.innerHTML = '';
            data.forEach((service, i) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${service.pakalpojums}</td>
                    <td>${service.apraksts}</td>
                    <td><button class="btn btn-danger">Rediģēt</button></td>
                `;
                serviceList.appendChild(row);
            });
        });
       
        fetch('/api/pakalpojumu_cenas') // pielāgo URL, ja vajag
        .then(response => response.json())
        .then(data => {
            const priceList = document.getElementById('priceList');
            priceList.innerHTML = ''; // notīra iepriekšējo saturu
            
            console.log("➡️ Saņemts no servera:", data);

            data.forEach((item, index) => {
                const row = document.createElement('tr');
                const date = new Date(item.create_data); // vai item.modified_data
                const formattedDate = date.toISOString().split('T')[0];
        
            row.innerHTML = `
              <td>${index + 1}</td>
              <td>${item.service_title}</td>
              <td>${item.service_desc}</td>
              <td>${item.service_price} €</td>
              <td>${item.create_data ? new Date(item.create_data).toISOString().split('T')[0] : ''}</td>
              <td>${item.modify_data || ''}</td>
              <td><button class="edit-btn" data-id="${item.id}">Rediģēt</button></td>
            `;
    
            priceList.appendChild(row);
          });
        })
        .catch(error => {
          console.error('❌ Kļūda ielādējot pakalpojumus:', error);
        });                 
});
