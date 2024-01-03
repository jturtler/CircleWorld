function HtmlTemplate() {};

HtmlTemplate.getTemplateFileWithJsonList = async function( filePath, jsonList, returnFunc )
{
    HtmlTemplate.loadTemplateFile( filePath, function( itemTpl ){
        var divTag = $("<div/>");

        divTag.append( jsonList.map( function( jsonData ){
            var temlp = itemTpl;
            return temlp.map( HtmlTemplate.render( jsonData ) ).join('');
        }));

        returnFunc( divTag );

    });
};

HtmlTemplate.getTemplateFileWithJsonData = async function( filePath, jsonData, returnFunc )
{
    HtmlTemplate.loadTemplateFile( filePath, function( itemTpl ){
        var divTag = $("<div/>");

        divTag.append( function(){
            return itemTpl.map( HtmlTemplate.render( jsonData ) ).join('');
        });

        returnFunc( divTag );
    });
};

HtmlTemplate.loadTemplateFile = async function( filePath, returnFunc )
{
    var templated = await (await fetch( filePath ) ).text();
    var itemTpl = templated.split(/\$\{(.+?)\}/g);

    returnFunc( itemTpl );
};

HtmlTemplate.render = function( props ) {
    return function(tok, i) {
        return( i % 2 ) ? props[tok] : tok;
    };
};