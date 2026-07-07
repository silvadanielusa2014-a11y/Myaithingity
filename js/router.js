let currentPage = null;



export async function loadPage(page) {


    const app =
    document.getElementById(
        "app"
    );


    if (!app) {

        throw new Error(
            "App container not found."
        );

    }



    try {


        const response =
        await fetch(
            `./views/${page}.html`
        );



        if (!response.ok) {

            throw new Error(
                "Page not found."
            );

        }



        app.innerHTML =
        await response.text();



        currentPage =
        page;



        runPageScript(
            page
        );



    }

    catch(error) {


        console.error(
            error
        );


        app.innerHTML = `

            <section>

                <h2>
                    Error
                </h2>


                <p>
                    Could not load page.
                </p>

            </section>

        `;

    }

}




function runPageScript(page) {


    const event =
    new CustomEvent(

        "pageLoaded",

        {

            detail: {

                page: page

            }

        }

    );


    document.dispatchEvent(
        event
    );

}




export function getCurrentPage(){

    return currentPage;

}
