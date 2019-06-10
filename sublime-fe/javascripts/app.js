function jsonFormat(data) {
    let jsonVal = " {";
    let i = 0;
    for (let key in data) {
        jsonVal += "<div class=\"padding-15\">\"" + key + "\": \"" + data[key] + "\"";
        if (i < Object.keys(data).length - 1) {
            jsonVal += "\,";
        }
        jsonVal += "</div>";
        i++;
    }

    jsonVal += " }";

    return jsonVal;
}

$(document).ready(function () {
    $("#btnSubmit").click(function () {
        const API_ENDPOIT = "https://test.epiapi.com";
        let firstName = $("#firstNameTxt").val();
        let lastName = $("#lastNameTxt").val();
        let language = $("#languageDdl").val();
        let accountType = $("#accountTypeDdl").val();
        let country = $("#countryDdl").val();
        let email = $("#emailTxt").val();
        let phone = $("#phoneTxt").val();
        let password = $("#passwordTxt").val();

        if (email && password) {
            $.post(API_ENDPOIT + "/v2/accounts", {
                firstName: firstName,
                lastName: lastName,
                language: language,
                accountType: accountType,
                country: country,
                email: email,
                phone: phone,
                password: password

            }).done(function (data, status) {
                if (status === "success") {
                    $.post(API_ENDPOIT + "/v2/apiKeys?sessionId=" + data.sessionId, {})
                        .done(function (data) {
                            $("#result").html(jsonFormat(data));
                        });
                } else {
                    $("#result").html(data.message);
                }
            }).fail(function (xhr, status, error) {
                alert(status.toUpperCase());
            });
        }
    });
});