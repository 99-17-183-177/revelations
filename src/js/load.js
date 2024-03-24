var host = "https://99-17-183-177.github.io/articles-outrun/";
var alternativeHost = "src/static/"; 
var listFile = "index.txt"; 
export var articles = {};

function loadArticles(h = host) {
    fetch(h + listFile)
    .then(
        response => {
            console.log("response", response)
            if (!response.ok) throw response.status;
            response.text()
            .then (
                text => articles = parseArticleList(text)
            )
            
        }
    )
    .catch(
        e => {
            console.log("Unable to load from main host...", e)
            if (h == host) loadArticles(alternativeHost);
        }
    )
} 

loadArticles();

export async function remoteLoadArticle(file) {
    return remoteLoad(file, "articles/")
}

async function remoteLoad (file, type) {
    if (file != listFile) {
        try {
            const response = await fetch(host + type + file);
            if (response.ok) {
                const text = await response.text();
                return text;
            }
        } catch (e) {
            console.log(e)
        }
    }
    return ["File not found."]
 }

function parseArticleList(text) {
    console.log("parsing", text)
    let articles = {};
    if (!text || text.length <= 0) return articles;


    let split = text.split("\n");
    for (let s in split) {
        let item = (split[s] || "").trim().split(",");
        if (!item || item.length < 3) continue;

        let pictures = []
        for (let i = 3; i < item.length; i+=2) {
            if (i+1 >= item.length) break;
            if (item[i].trim().length <= 0 || item[i+1].trim().length <= 0) continue;

            pictures.push(
                new Picture(item[i].trim(), item[i+1].trim())
            );
        }

        let key = item[0].trim();
        let hidden = key[0] == '*';
        key = hidden ? key.substring(1) : key
        articles[key] = new Article(item[1].trim(), item[2].trim(), pictures, hidden);
    }

    return articles;
}


export class Picture {
    file
    name

    constructor(file, name) {
        this.file = file;
        this.name = name;
    }

    getFilePath = () => {
        return "./src/static/pictures/"+this.file
    }

    getName = () => {
        return this.name;
    }
}

export class Article {
    file 
    title
    pictures
    hidden

    constructor(file, title, pictures, hidden = false) {
        this.file = file;
        this.title = title
        this.pictures = pictures;
        this.hidden = hidden;
    }

    getFilePath = () => {
        return "./src/static/articles/"+this.file
    }

    getPictures = () => {
        if (this.pictures)
            return this.pictures;
        else
            return []
    }

    hasPictures = () => {
        return this.pictures && this.pictures.length > 0
    }

    isHidden = () => {
        return this.hidden;
    }

    print = (key) => {
        return " [" + key + "]  " + this.title
    }

}
