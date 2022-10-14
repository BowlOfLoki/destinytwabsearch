exports.handler = async function key(event, context) {
    bungie = "f964b21004ec4b688c3bfd113638b260";
    return {statusCode:200,
        body: JSON.stringify({key:bungie})};
};
