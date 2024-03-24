
import {listArticles, getArticle, getPicture, commands} from "./list.js";
import { remoteLoad } from "./load.js";
var currentPictures = []

$(function() {
    $('body').terminal({
        list: async function() {
            var l = listArticles()
            for (var a in l) {
                await innerType(this, "- " + l[a])
            }
            if (l.length == 0) {
                await innerType(this, "No articles available.")
            }
            else {
                await innerType(this, "Type: 'article [article name]' to print article")
            }
        },
        article: async function(key) {
            let a = getArticle(key);
            if (!a) {
                innerType(this, "Article not found.")
                return;
            }
            await listPictures(this, a, false, true)
            loadArticle(this, a)
            
        },
        picture: async function(key) {
            let p = getPicture(currentPictures, key);
            if (!p) {
                innerType(this, "Picture not found.")
                return;
            }
            loadPicture(this, p)
        },
        help: async function() {
            await printHelp(this)
        },
        test: async function(f) {
            console.log(await remoteLoad(f))
        },
    },
    {
        greetings: " ",
        onInit: async function() {
            let text = await load("./src/static/revelations.txt")
            await this.echo(text, { typing: true, delay: 2})
            await printHelp(this)
        },
        wrap: true
    });
 });

 async function loadArticle(terminal, a) {
    const response = await load(a.getFilePath());
    return type(terminal, response)
    .then(
        () => {
            return a;
        }
    )
    .catch(
        () => undefined
    )
 }

 async function loadPicture(terminal, p) {
    const response = await load(p.getFilePath());
    return type(terminal, response, false)
    .then(
        () => {
            return a;
        }
    )
    .catch(
        () => undefined
    )
 }

 async function listPictures(terminal, article, addSpacingBefore = false, addSpacingAfter = false) {
    currentPictures = []
    if (article && article.hasPictures()) {
        if (addSpacingBefore)
            await innerType(terminal, " ")

        await innerType(terminal, "Attached pictures:")
        let pics = article.getPictures();
        currentPictures = pics;
        for (let p in pics) {
            await innerType(terminal, "- " + pics[p].name)
        }
        await innerType(terminal, "Type: 'picture [picture name]' to print picture")

        if (addSpacingAfter)
            await innerType(terminal, " ")
    }
 }

 async function type(terminal, text, paginate = true) {
    let split = text.split('\n')
    let lastWasEmpty = false;
    let continuePrinted = false;
    if (split && split.length > 0) terminal.echo(" ")
    for (var i in split) {
        var isEmpty = !split[i] || split[i].trim().length == 0
        if (!isEmpty) {
            continuePrinted = false;
            await innerType(terminal, split[i].trim())
        }
        else {
            if (paginate && lastWasEmpty && !continuePrinted) {
                continuePrinted = true;
                let c = await terminal.read("Continue? (Y/n) ")
                if (c != 'Y' && c != 'y' && c != '') break;
            }
            else
                await innerType(terminal, " ")
        }
        terminal.resize();
        lastWasEmpty = isEmpty;
    }
    if (split && split.length > 0) terminal.echo(" ")
 }

 function innerType (terminal, text) {
    return terminal.echo(text, { typing: true, delay: 10 })
 }
 

 async function load (file) {
    try {
        const response = await fetch(file);
        if (response.ok) {
            const text = await response.text();
            return text;
        }
    } catch (e) {
        console.log(e)
    }
    return ["File not found."]
 }

 async function printHelp(terminal) {
    await innerType(terminal, "Available commands")
    for (var cmd in commands) {
        await innerType(terminal, "- " + commands[cmd].print())
    }
 }
