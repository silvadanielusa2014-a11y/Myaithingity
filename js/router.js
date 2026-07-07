export async function loadPage(page){


    const app =
    document.getElementById(
        "app"
    );


    const response =
    await fetch(
        `views/${page}.html`
    );


    if(!response.ok){

        app.innerHTML =
        "Page not found";

        return;

    }


    app.innerHTML =
    await response.text();


}
