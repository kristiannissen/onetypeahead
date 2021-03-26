/**
 * @file: typeahead.js
 */
var TypeAhead = (function () {
    // The state contains the query entered by the user
    // and the array of products
    var state = {
        query: "",
        products: []
    };
    var domElm = null;
    // Set state
    setState = function(k, v) {
        if (state.hasOwnProperty(k) && state[k] !== v) {
            state[k] = v;
            // Dispatch Event
            domElm.dispatchEvent(new CustomEvent('stateChanged', {
                detail: {
                    'key': k,
                    'value': v
                }
            }));
            console.log('dispatched event %s', k);
        }
    };
    (function() {
        // Fetch products
        fetch('/products.json')
            .then(function(resp) {
                return resp.json();
            })
            .then(function(data) {
                setState('products', data.products)
            })
    })();
    // Render suggestions
    renderSuggestions = function(products) {
        var options = products.map(function(p) {
            return '<div>'+ p.name +'</div>';
        }); 
        domElm.querySelector('#options').innerHTML = options.join('');
    };
    // Public methods
    return {
        // TypeAhead.init(documentElement)
        init: function(elm) {
            domElm = elm;
            // Append child container
            var listElm = document.createElement('div');
            listElm.setAttribute('id', 'options');
            domElm.appendChild(listElm);

            domElm.addEventListener('stateChanged', function(evnt) {
                if (evnt.detail.key == 'query') {
                    if (evnt.detail.value.length > 3) {
                        var products = state.products.filter(function(p) {
                            return p.name.toLowerCase().includes(evnt.detail.value)
                        });
                        listElm.innerHtml = '';
                        renderSuggestions(products);
                    } else {
                        listElm.innerHTML = '';
                    }
                }
            });
            // Event triggers
            domElm.querySelector('#query')
                .addEventListener('keyup', function(evnt) {
                    evnt.preventDefault();
                    // Change state
                    setState('query', evnt.target.value.trim());
                })
        },
    };
})();
