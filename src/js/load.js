var host = "https://99-17-183-177.github.io/articles-outrun/"


export async function remoteLoad (file) {
    try {
        const response = await fetch(host + file + ".txt");
        if (response.ok) {
            const text = await response.text();
            return text;
        }
    } catch (e) {
        console.log(e)
    }
    return ["File not found."]
 }