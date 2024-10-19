from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__) #Start serveru
CORS(app, resources={r"/*": {"origins": "https://blackvis45-github-io.onrender.com"}})

@app.route('/search', methods=['POST']) #Čekání na /search požadavek typu POST

# Funkce bez vstupních parametrů
# returns JSON
def google_search():
    query = request.json.get("query")
    #Maskování za bežný prohlížeč
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    }
    url = f"https://www.google.com/search?q={query}"
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    results = [] 
    #For cyklus který hledá všechny odkazy a následně je přidá do listu    
    for g in soup.find_all('a', href=True):
        title_tag = g.find('h3')
        link = g['href']

        if title_tag:
            title = title_tag.get_text()
            results.append({'title': title, 'link': link})
    #Vrátí JSON formát listu odkazů
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
