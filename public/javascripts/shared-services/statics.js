angular.module('eat-this-one').factory('statics', ['$filter', function($filter) {

    return {

        countries : {
            AR : {
                name : 'Argentina',
                currency : '$',
                defaultLanguage : 'es',
                donationOptions : [
                    { text: 10, value: '10'},
                    { text: 20, value: '20'},
                    { text: 30, value: '30'}
                ]
            },
            AU : {
                name : 'Australia',
                currency : '$',
                defaultLanguage : 'en',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            CA : {
                name: 'Canada',
                currency : '$',
                defaultLanguage : 'en',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            CL : {
                name: 'Chile',
                currency : '$',
                defaultLanguage : 'es',
                donationOptions : [
                    { text: 1000, value: '1000'},
                    { text: 2000, value: '2000'},
                    { text: 3000, value: '3000'}
                ]
            },
            CO : {
                name: 'Colombia',
                currency : '$',
                defaultLanguage : 'es',
                donationOptions : [
                    { text: 3000, value: '3000'},
                    { text: 5000, value: '5000'},
                    { text: 10000, value: '10000'}
                ]
            },
            CU : {
                name: 'Cuba',
                currency : '$',
                defaultLanguage : 'es',
                donationOptions : [
                    { text: 50, value: '50'},
                    { text: 100, value: '100'},
                    { text: 150, value: '150'}
                ]
            },
            ES : {
                name: 'España',
                currency : '&#8364;',
                defaultLanguage : 'es',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            GB : {
                name: 'United Kingdom',
                currency : '&#8356;',
                defaultLanguage : 'en',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            IE : {
                name: 'Ireland',
                currency : '&#8364;',
                defaultLanguage : 'en',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            MX : {
                name: 'México',
                currency : '$',
                defaultLanguage : 'es',
                donationOptions : [
                    { text: 10, value: '10'},
                    { text: 30, value: '30'},
                    { text: 50, value: '50'}
                ]
            },
            PE : {
                name: 'Perú',
                currency : 'S/.',
                defaultLanguage : 'es',
                donationOptions : [
                    { text: 3, value: '3'},
                    { text: 5, value: '5'},
                    { text: 10, value: '10'}
                ]
            },
            US : {
                name: 'United States',
                currency : '$',
                defaultLanguage : 'en',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            VE : {
                name: 'Venezuela',
                currency : 'Bs.F.',
                defaultLanguage : 'es',
                donationOptions : [
                    { text: 3, value: '3'},
                    { text: 5, value: '5'},
                    { text: 10, value: '10'}
                ]
            }
        },

        defaultCountry : 'AU',

        displayCurrency : function(value) {
            var loc = JSON.parse(localStorage.getItem('loc'));
            return $filter('currency')(value, this.countries[loc.country].currency, 0);
        },

        getDonationOptions : function() {
            var loc = JSON.parse(localStorage.getItem('loc'));
            if (loc === null) {
                return [];
            }

            var options = this.countries[loc.country].donationOptions;
            for (var i in options) {
                options[i].text = $filter('currency')(options[i].text, this.countries[loc.country].currency, 0);
            }
            return options;
        },

        getCountriesOptions : function() {
            var options = [];
            for (var code in this.countries) {
                if (this.countries.hasOwnProperty(code)) {
                    options.push({
                        value: code,
                        text: this.countries[code].name
                    });
                }
            }
            return options;
        },

        getLocationLanguage : function() {
            var country = JSON.parse(localStorage.getItem('loc')).country;
            return this.countries[country].defaultLanguage;
        }

    };
}]);
