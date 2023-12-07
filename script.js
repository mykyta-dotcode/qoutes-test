jQuery(document).ready(function( $ ){
    console.log('getting quotes new...');
	
	var quotesDiv = $('#quotes');
	quotesDiv.append('<div class="loader-container"><div class="loader"></div></div>'); 
	
	var queryParams = getParamsFromUrl();
	console.log('query params: ', queryParams);
  
	var body = {
		"fullName": queryParams.fullName,
		"p1_dob": queryParams.p1_dob,
		//"p1_gender": queryParams.p1_gender,
		"p1_smokingStatus": queryParams.p1_smokingStatus,
		"p2_name": queryParams.p2_name,
		"p2_dob": queryParams.p2_dob,
		//"p2_gender": queryParams.p2_gender,
		"p2_smokingStatus": queryParams.p2_smokingStatus,
		"coverAmount": queryParams.coverAmount,
		"policyTerm": queryParams.policyTerm,
		"noPeople": queryParams.noPeople,
		"email": queryParams.email,
		"phone": queryParams.phone
	};
	
	//document.getElementById('p1Name').value = queryParams.fullName;
	document.getElementById('p1Dob').value = queryParams.p1_dob;
	//document.getElementById('p1Gender').value = queryParams.p1_gender;
	document.getElementById('p1SmokingStatus').value = queryParams.p1_smokingStatus;
	document.getElementById('p2Dob').value = queryParams.p2_dob;
	//document.getElementById('p2Gender').value = queryParams.p2_gender;
	document.getElementById('p2SmokingStatus').value = queryParams.p2_smokingStatus;
	document.getElementById('coverAmount').value = queryParams.coverAmount;
	document.getElementById('policyTerm').value = queryParams.policyTerm;
	document.getElementById('noPeople').value = queryParams.noPeople;
	
	let noPeople = document.getElementById('noPeople').value;
	
	if (noPeople !== "Two") {
		document.getElementById("p2").style.visibility = "hidden";
	}
	else {
		document.getElementById("p2").style.visibility = "visible";
	}
  	
  	$.ajax({
    	type: "POST",
    	url: "https://wizdwkx5z8.execute-api.eu-west-1.amazonaws.com/dev/quotes",
    	contentType: "application/json",
    	dataType: "json",
    	data: JSON.stringify(body),
    	success: function(result){
			console.log(typeof result);
      		console.log(result);
			console.log('quotes: ', result);
			quotesDiv.html(result);
    	}
  	})
	
	$(document).on('click','.more-info',function(){
		$(this).closest('.quote').find('.more-info-container').toggleClass('hidden');
	});
	
	$(document).on('click','.expand-text',function(){
		$(this).closest('.details-container').find('.details-lower').toggleClass('hidden');
	});
});

function checkNoPeople(value) {
	console.log("value: ", value);
	if (value !== "Two") {
		document.getElementById("p2").style.visibility = "hidden";
	}
	else {
		document.getElementById("p2").style.visibility = "visible";
	}
}

function checkFields() {
	let coverAmount = document.getElementById('coverAmount').value;
	let	policyTerm = document.getElementById('policyTerm').value;
	let noPeople = document.getElementById('noPeople').value;
	
	let p1dob = document.getElementById('p1Dob').value;
	let p1smokingStatus = document.getElementById('p1SmokingStatus').value;
	
	let p2dob = document.getElementById('p2Dob').value;
	let p2smokingStatus = document.getElementById('p2SmokingStatus').value;
	
	if (coverAmount.length > 0 && policyTerm.length > 0 && noPeople.length > 0) {
		if (p1dob.length > 0 && p1smokingStatus.length > 0) {
			if (noPeople === "One") {
				return true;
			}
			else {
				if (p2dob.length > 0 && p2smokingStatus.length > 0) {
					return true;
				}
				else {
					return false;
				}
			}
		}
		else {
			return false;
		}
	}
	else {
		return false
	}
}

async function getQuotes() {
	let validFields = checkFields();
	if (!validFields) {
		alert('Please complete all required fields to get quotes');
	}
	else {
		document.getElementById('quotes').innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

		var queryParams = getParamsFromUrl();
		console.log('query params: ', queryParams);

		var body = {
			//"fullName": document.getElementById('p1Name').value,
			"p1_dob": document.getElementById('p1Dob').value,
			//"p1_gender": document.getElementById('p1Gender').value,
			"p1_smokingStatus": document.getElementById('p1SmokingStatus').value,
			"p2_dob": document.getElementById('p2Dob').value,
			//"p2_gender": document.getElementById('p2Gender').value,
			"p2_smokingStatus": document.getElementById('p2SmokingStatus').value,
			"coverAmount": document.getElementById('coverAmount').value,
			"policyTerm": document.getElementById('policyTerm').value,
			"noPeople": document.getElementById('noPeople').value,
			"phone": queryParams.phone // same for email if we want the quotes emailed on regeneration
		};
		console.log(body);

		try {
			const response = await fetch('https://wizdwkx5z8.execute-api.eu-west-1.amazonaws.com/dev/quotes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			const data = await response.json();
			console.log(data);
			// replace quotes html with new quotes html
			document.getElementById('quotes').innerHTML = data;
		} catch(error) {
			// alert user with an error - use details if possible
			console.log(error);
		}
	}
}

function getParamsFromUrl() {
    url = decodeURI(window.location.href);
    if (typeof url === 'string') {
        let params = url.split('?');
        let eachParamsArr = params[1].split('&');
        let obj = {};
        if (eachParamsArr && eachParamsArr.length) {
            eachParamsArr.map(param => {
                let keyValuePair = param.split('=')
                let key = keyValuePair[0];
                let value = keyValuePair[1];
                obj[key] = value;
            })
        }
        return obj;
    }
}

function insertSlash(val, id) {
	let updated = val.replace(/^(\d{2})(\d{2})/, '$1/$2/');
	document.getElementById(id).value = updated;
}
