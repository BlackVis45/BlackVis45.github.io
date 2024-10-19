const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', function (e) {
    e.preventDefault(); 

    const query = document.getElementById('query').value.trim();

    if (!query) {
        alert('Please enter a search query');
        return;
    }

    fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
    })
    .then(response => response.json())
    .then(data => {
        //Odstranění starých výsledků
        const existingResultsContainer = document.querySelector('.results-container');
        if (existingResultsContainer) {
            existingResultsContainer.remove();
        }

        //Přidání divu pro výpis výsledků
        const resultsContainer = document.createElement('div');
        resultsContainer.classList.add('results-container');

        //Řešení umístění divu s výsledky
        const container = document.querySelector('.container');
        container.insertAdjacentElement('beforeend', resultsContainer);

        data.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.href = result.link;
            resultItem.target = '_blank';
            resultItem.textContent = result.title;
            resultItem.classList.add('result-item');
            resultsContainer.appendChild(resultItem);
        });

        //Download button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download JSON';
        downloadButton.classList.add('download-button');
        downloadButton.addEventListener('click', () => {
            downloadResults(data, query);
        });
        resultsContainer.appendChild(downloadButton);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Asynchronní funkce řešící stahování JSON souboru - vyskakovací okno s vyhledávaným textem jakožto jménem souboru
async function downloadResults(results, query) {
    try {
        //File System Access API k uložení souboru na libovolné místo
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: `${query}.json`,
            types: [
                {
                    description: 'JSON file',
                    accept: { 'application/json': ['.json'] },
                },
            ],
        });

        const writableStream = await fileHandle.createWritable();
        await writableStream.write(new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' }));
        await writableStream.close();
    } catch (error) {
        console.error('Error saving file:', error);
    }
}

//CSS styl nových bloků
const style = document.createElement('style');
style.innerHTML = `
    .results-container {
        margin-top: 20px;
        text-align: block;
        padding-top: 20px;
    }
    .result-item {
        display: block;
        color: white;
        font-size: 18px;
        text-decoration: none;
        margin-bottom: 10px;
    }
    .result-item:hover {
        text-decoration: underline;
    }
    .download-button {
        margin-top: 20px;
        background-color: black;
        color: white;
        border: 2px solid white;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        vertical-align: middle;
    }
    .download-button:hover {
        background-color: white;
        color: black;
        transition: 0.3s;
    }
`;
document.head.appendChild(style);
