angular.module('eat-this-one').factory('localisationManager', ['eatConfig', 'statics', function(eatConfig, statics) {

    return {

        setCountry : function() {

            // We set the default one so we will always have a country value.
            if (localStorage.getItem('country') === null) {
                localStorage.setItem('country', statics.defaultCountry);
            }

            // All cordova calls should be inside a deviceready listener.
            document.addEventListener('deviceready', function() {

                navigator.globalization.getLocaleName(
                    function(locale) {
                        // Always overwrite.
                        var country = locale.value.substring(3, 5);
                        if (statics.countries.hasOwnProperty(country)) {
                            localStorage.setItem('country', country);
                        }
                    }.bind(this),
                    function() {
                        // TODO newLogRequest would be a circular reference.
                        console.log('Error getting user country');
                    }
                );
            }.bind(this));

        },

        setLanguage : function() {

            $.eatLang.lang = $.eatLang[eatConfig.defaultLang];

            // All cordova calls should be inside a deviceready listener.
            document.addEventListener('deviceready', function() {

                navigator.globalization.getPreferredLanguage(
                    function(language) {
                        var shortLang = language.value.substring(0, 2);
                        if (typeof $.eatLang[shortLang] !== 'undefined') {
                            $.eatLang.lang = $.eatLang[shortLang];
                        } else {
                            // We default to 'en' if any problem.
                            $.eatLang.lang = $.eatLang[eatConfig.defaultLang];
                        }
                    },
                    function() {
                        // We default to 'en' if any problem.
                        $.eatLang.lang = $.eatLang[eatConfig.defaultLang];

                        // TODO Here we can not add a newLogRequest circular reference.
                        console.log('Error getting preferred language');
                    }
                );
            }.bind(this));
        }

    };
}]);