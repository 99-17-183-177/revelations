
import {listArticles, getArticle, getPicture, commands} from "./list.js";
import { remoteLoad, loadLocal } from "./load.js";
var currentPictures = []
var maxLineSize = 100;

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
            let a = key ? getArticle(key.toLowerCase()) : undefined;
            if (!a) {
                innerType(this, "Article not found.")
                return;
            }
            await listPictures(this, a, false, true)
            loadArticle(this, a)
            
        },
        picture: async function(key) {
            let p = key ? getPicture(currentPictures, key.toLowerCase()) : undefined;
            if (!p) {
                innerType(this, "Picture not found.")
                return;
            }
            loadPicture(this, p)
        },
        help: async function() {
            await printHelp(this)
        },
        archive: async function() {
            innerType(this, "Corrupted file - unable to load [ERR 1028]")
        },  
    },
    {
        greetings: " ",
        onInit: async function() {
            let text = await loadLocal("./src/static/revelations.txt")
            await this.echo(text, { typing: true, delay: 2, wrap: false})
            await printHelp(this)
        },
        wrap: true
    });
 });

 async function loadArticle(terminal, a) {
    const response = await remoteLoad(a.getFilePath());
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
    const response = await remoteLoad(p.getFilePath());
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
            let line = split[i].trim()
            /*console.log("max", maxLineSize, terminal.cols())
            let max = maxLineSize > terminal.cols() ? 100000 : maxLineSize;
            if (line.length > max) {

                let chunks = line.match(new RegExp('.{1,' + max + '}', 'g'));
                console.log("chunks", chunks)
                for (let c in chunks) {
                    await innerType(terminal, chunks[c].trim())
                }
            }
            else {*/
                await innerType(terminal, line)
            //}
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
        terminal.resize(maxLineSize);
        lastWasEmpty = isEmpty;
    }
    if (split && split.length > 0) terminal.echo(" ")
 }

 function innerType (terminal, text) {
    return terminal.echo(text, { typing: true, delay: 10 })
 }

 async function printHelp(terminal) {
    await innerType(terminal, "Available commands")
    for (var cmd in commands) {
        await innerType(terminal, "- " + commands[cmd].print())
    }
 }
