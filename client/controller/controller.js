var angularModule = angular.module("VoterApp", ['ngSanitize']);

angularModule.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
angularModule.directive('scrollBottom', function () {
    return {
        scope: {
            scrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('scrollBottom', function (newValue) {
var scrollHeight = $(element).prop('scrollHeight');

$(element).animate({scrollTop: scrollHeight}, 500);
            });
        }
    }
 
});

angularModule.factory("VoteService", function ($http) {
    return {
        talk: function (query) {
            return $http.post('https://robotchat.herokuapp.com/talk',{q:query});
        }
    };
});

angularModule.filter('orderObjectBy', function () {
    return function (input, attribute) {
        if (!angular.isObject(input)) return input;
        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }
        array.sort(function (a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return b - a;
        });
        return array;
    }
});


angularModule.controller("VoterController", function ($scope, $sce, VoteService) {
    $scope.message="";
    $scope.enter = function(){
        $scope.message+=$sce.trustAsHtml("<li class=\"self\"> "+
            "<div class=\"avatar\"> "+
            "<img src=\"/image/avatar.png\" /> "+
            "</div> "+
            " <div class=\"messages\"> "+
            "<p>"+ $scope.inputMessage+"</p> "+
            "<time datetime=\"2009-11-13T20:14\">"+getFormattedDate()+"</time> "+
            "</div> "+
            "</li>");

        var inputMessage = $scope.inputMessage;

        VoteService.talk(inputMessage).success(function(data){
            $scope.message+=" <li class=\"other\"> "+
           "<div class=\"avatar\"> "+
                "     <img src=\"https://www.raz-kids.com/shared/images/robot3.png\" /> "+
                "</div> "+
                " <div class=\"messages\"> "+
                "<p>"+data.response+"</p> "+
                "<time datetime=\"2009-11-13T20:14\">"+data.time+"</time> "+
                "</div> "+
                "</li>";
        });
        $scope.inputMessage = "";
    };

    function getFormattedDate() {
        var date = new Date();
        var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return str;
    }

});
