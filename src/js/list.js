import { articles } from "./load.js";

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