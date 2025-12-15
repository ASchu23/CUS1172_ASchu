var updateView = async (button) => {
    if (button.dataset.querytype == 'by_name') {
        let queryvalue = document.querySelector('#nameQuery').value;
        api = `http://localhost:3000/api/by_name/${queryvalue}`;
    } else if (button.dataset.querytype == 'by_age') {
        let queryStartAgevalue = document.querySelector('#startAgeQuery').value;
        let queryEndAgevalue = document.querySelector('#endAgeQuery').value;
        api = `http://localhost:3000/api/by_age/${queryStartAgevalue}/${queryEndAgevalue}`;
    }
    const data = await fetch(api);
    const model = await data.json();
    render_view(model);
}

var render_view = (model) => {
    var source = document.querySelector('#show_results_view').innerHTML;
    var template = Handlebars.compile(source);
    var html = template(model);

    document.querySelector('#results').innerHTML = html;
}