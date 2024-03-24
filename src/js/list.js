
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

export class Command {
    command
    description

    constructor(command, description) {
        this.command = command
        this.description = description
    }

    print() {
        return this.command + " : " + this.description 
    }
}

export const articles = {
    journey_5: new Article("8 - journey_5", "Journey 5", []),
    apocalypse_1: new Article("7 - apocalypse_1.txt", "Apocalypse 1", []),
    journey_4: new Article("6 - journey_4.txt", "Journey 4", []),
    le_mani_rosse_1: new Article("5 - le_mani_rosse_1.txt", "Le Mani Rosse 1", []),
    ppd_11: new Article("4 - ppd_11.txt", "PPD 11", []),
    vacuità_realtà_7: new Article("3 - vacuità_realtà_7.txt", "Vacuità Realtà", []),
    ombra_dade: new Article("2 - ombra_dade.txt", "Ombra su Dade City", [
        new Picture("dade_fig_1.txt", "fig_1"), 
        new Picture("dade_fig_2.txt", "fig_2")
    ]),
    terremoto_dimenticato: new Article("1 - terremoto_dimenticato.txt", "Il Terremoto Dimenticato", []),
}

export function listArticles() {
    let list = [];
    let keys = Object.keys(articles);
    console.log("keys", keys)
    for (var k in keys) {
        let key = keys[k]
        console.log(key, articles[key])
        if (!articles[key]?.isHidden())
            list.push(articles[key].print(key));
    }
    return list;
}

export function getArticle(key) {
    return articles[removeBrackets(key)]
}

export function getPicture(pictures, key) {
    let k = removeBrackets(key)
    for (let p in pictures) {
        if (pictures[p].name == k)
            return pictures[p]
    }
}

function removeBrackets(string) {
    if (!string || string.length == 0) return string;
    if (string[0] == '[' && string[string.length-1] == ']')
        return string.substring(1, string.length-1)
    return string;
}


export const commands = {
    list: new Command("list", "Show the list of available articles."),
    article: new Command("article [article name]", "Show the content of the article named [article name]."),
    picture: new Command("picture [picture name]", "Display the picture named [picture name]."),
    help: new Command("help", "Show these info."),
    archive: new Command("archive", "Show archive."),
}