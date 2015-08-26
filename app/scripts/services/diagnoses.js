'use strict';

app.factory('Diagnoses', function() {
	var kcs = /(keratoconjunctivitis sicca) |kcs/i;
	var cornealulcer = /(ulcerative\s+keratitis)|(indolent\s+ulcer)/i;
	var glaucoma = /glaucoma/i;
	var cataracts = /cataract/i;
	var uveitis = /uveitis/i;
	var retinaldisease = /pra|sards|retinal/i;

	var Diagnoses = {
		category: function(diagnosis) {
			var category = '';
			switch(true) {
			case kcs.test(diagnosis):
				category = 'KCS';
				break;
			case cornealulcer.test(diagnosis):
				category = 'CornealUlcers';
				break;
			case glaucoma.test(diagnosis):
				category = 'Glaucoma';
				break;
			case cataracts.test(diagnosis):
				category = 'Cataracts';
				break;
			case uveitis.test(diagnosis):
				category = 'AnteriorUveitis';
				break;
			case retinaldisease.test(diagnosis):
				category = 'RetinalDisease';
				break;
			} // end switch statement
			console.log('Diagnosis is: ' + diagnosis + ' - Category is: ' + category);

			return category;

		} // end category function

	};

	return Diagnoses;
});