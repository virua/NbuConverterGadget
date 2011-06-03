/*
 * NBU Converter v0.1 (конвертор валют НБУ)
 * Author: Ihor Vispyanskiy
 * URL: http://vispyanskiy.name/
 * Description: Конвертор валют призначений для швидкого конвертування рiзних валют за курсом НБУ
 * Date: December 25, 2010
 */

var optStr = "";
var currencyJSON = null;
var rate1 = 0, rate2 = 0, result = 0, coef = 0;
var ratesArr = new Array();

$(document).ready(function(){	
	$.ajaxSettings.cache = false;
	$.getJSON(
		"http://lvivonline.net/exchange/currency.json",
		{ findbydate: getCurrDate() },
		function(data, status) {

			if(status=="success" && data!=null){
				currencyJSON = data;
				
				$.each(data.body, function(i,item){
					optStr += '<option value="' + item.digital_code + '">' + item.currency_name + '</option>';
				});
				
				$('#currencyListFrom').html(optStr);
				$('#currencyListTo').html(optStr);
				
				$("#currencyListTo").val('840'); // USD
				
				ratesArr = getRates(currencyJSON.body, '980', '840'); // UAH та USD
				rate1 = ratesArr[0];
				rate2 = ratesArr[1];
				
				setCurrency(rate1, rate2, 0);

			}else{
				$('#container').append('<p style="color:red;">Невдала спроба отримати дані!</p>');
			}
	});
	
	$('#calc').click(function() {
		var fromSelValue = $('#currencyListFrom').val();
		var toSelValue = $('#currencyListTo').val();
		var fromValue = parseFloat($('#currencyValueFrom').val());
		
		//if( fromValue>0 ){
			ratesArr = getRates(currencyJSON.body, fromSelValue, toSelValue);
			rate1 = ratesArr[0];
			rate2 = ratesArr[1];
			setCurrency(rate1, rate2, fromValue);
		//}

	});
	
	$('#currencyListFrom').change(function() {
		$('#calc').click();
	});
	
	$('#currencyListTo').change(function() {
		$('#calc').click();
	});

	$('#swop-img').click(function() {
		var fromSelValue = $('#currencyListFrom').val();
		var toSelValue = $('#currencyListTo').val();
		
		$('#currencyListFrom').val(toSelValue);
		$("#currencyListTo").val(fromSelValue);
		
		$('#calc').click();		
	});

});

function getRates(jsonBody, from, to){
	var r1 = 0, r2 = 0;
	$.each(jsonBody, function(i,item){
		
		if(item.digital_code == from){
			r1 = parseFloat(item.official_rate) / parseFloat(item.units_num);
		}
		
		if(item.digital_code == to){
			r2 = parseFloat(item.official_rate) / parseFloat(item.units_num);
		}
		
	});
	
	return [r1, r2];	
}

function setCurrency(rate1, rate2, fromValue){
	if(rate1>0 && rate2>0){
		coef = rate1 / rate2;
		result = fromValue * coef;
		
		if(fromValue>0){
			$('#currencyValueTo').val(result.toFixed(4));
		}else{
			$('#currencyValueFrom').val('0');
			$('#currencyValueTo').val('0.0000');
		}
		$('#coef').text(coef.toFixed(4));	
	}else{
		$('#currencyValueTo').val('0');
		$('#coef').text('0.0000');
	}
}

function getCurrDate(){
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	curr_month++;
	var curr_year = d.getFullYear();
	return curr_date + "." + curr_month + "." + curr_year;
}