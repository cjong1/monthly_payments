$("#results").hide();

$("form").on("submit", function(event){
	// Prevent the action from refreshing the page
	event.preventDefault();

	var price = $("#price").val();
	var paymentPercentage = $("#payment").val();
	var zip = $("#zip").val();
	var loan = $("#loan").val();
	var interest = $("#interest").val();

	console.log(loan);

	$.ajax({
		url: "http://www.zillow.com/webservice/GetMonthlyPayments.htm?zws-id=X1-ZWz1evb5lcuubv_39zrb&price="+price+"&down="+paymentPercentage+"&zip="+zip+"&output=json",
		contentType: "application/json",
		dataType: "jsonp",
		type: "GET",
		success: function(data) {
			// Remove content in the #results div every time new user input is submitted
			$("#results").empty();
			var total = 0;

			var result = data["response"];

			var principleAndInt;
			var rate;

			var hazardIns = parseInt(result["monthlyHazardInsurance"]);
			var propTax = parseInt(result["monthlyPropertyTaxes"]);
			var downPayment = result["downPayment"];

			if (loan === "30 year fixed") {
				var thirtyYear = result["thirtyYearFixed"];
				principleAndInt = parseInt(thirtyYear["monthlyPrincipalAndInterest"]);
				rate = thirtyYear["rate"];
			}

			if (loan === "15 year fixed") {
				var fifteenYear = result["fifteenYearFixed"];
				principleAndInt = parseInt(fifteenYear["monthlyPrincipalAndInterest"]);
				rate = fifteenYear["rate"];
			}

			if (loan === "5/1 adjustable") {
				var fiveOneAdj = result["fifteenYearFixed"];
				principleAndInt = parseInt(fiveOneAdj["monthlyPrincipalAndInterest"]);
				rate = fiveOneAdj["rate"];
			}

			total = principleAndInt+hazardIns+propTax;

			$("#results").show();

			$("#results").append("<h4>Monthly Payment</h4>\
				<table class='table'>\
					<tr>\
						<td>Down Payment:</td>\
						<td>$"+downPayment+"</td>\
					</tr>\
					<tr>\
						<td>Principle and Interest:</td>\
						<td>$"+principleAndInt+"</td>\
					</tr>\
					<tr>\
						<td>Property Tax:</td>\
						<td>$"+propTax+"</td>\
					</tr>\
					<tr>\
						<td>Hazard Insurance:</td>\
						<td>$"+hazardIns+"</td>\
					</tr>\
					<tr>\
						<td>Loan Rate:</td>\
						<td>"+rate+"%</td>\
					</tr>\
					<tr>\
						<td>Total:</td>\
						<td>$"+total+"</td>\
					</tr>\
				</table>");

		},
		error: function(data) {
			console.log(data);
		}
	});
});