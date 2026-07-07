export function showStatus(text){

    const status =
    document.getElementById(
        "status"
    );


    if(status){

        status.textContent =
        text;

    }

}



export function createElement(
    tag,
    className,
    text
){

    const element =
    document.createElement(tag);


    if(className)
        element.className = className;


    if(text)
        element.textContent = text;


    return element;

}



export function clear(element){

    if(element)
        element.innerHTML = "";

}
