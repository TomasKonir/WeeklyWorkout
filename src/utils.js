const fallbackHref = 'http://localhost:3001/'

var loading = 0

export function callApi(cmd, params, callback, errCallback) {
//    console.info(window.location)
    let link = ''
    if (window.location.host === 'localhost:3000') {
        link = fallbackHref
    } else {
        link = window.location.href
    }

    link = link.replace('index.html','')
    link += "api.php?cmd=" + cmd
    loading++

    fetch(
        link,
        {
            method: 'POST',
            body: JSON.stringify(params)
        }
    ).then(
        response => {
            loading--
            if (response.status === 200) {
                response.json().then(
                    json => {
                        callback(json)
                    }
                ).catch(
                    error => {
                        console.error('error:', error)
                        if (errCallback) {
                            errCallback(666)
                        }
                    }
                )
            } else if (errCallback) {
                errCallback(response.status)
            }
        }
    ).catch(
        error => {
            loading--
            console.error('error:', error)
            if (errCallback) {
                errCallback(666)
            }
        }
    );
}

export function isWaitingApi(){
    return(loading > 0)
}