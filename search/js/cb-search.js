 $(document).ready(function () {
     var time1 = 0;
     var show = false;
     var names = new Array(); //文章名字等
     var urls = new Array(); //文章地址
     $(document).keyup(function (e) {
         var time2 = new Date().getTime();
         if (e.keyCode == 17) {
             var gap = time2 - time1;
             time1 = time2;
             if (gap < 500) {
                 if (show) {
                     $(".cb-search-tool").css("display", "none");
                     show = false;
                 } else {
                     $(".cb-search-tool").css("display", "block");
                     show = true;
                     $("#cb-search-content").val("");
                     $("#cb-search-content").focus();
                 }
                 time1 = 0;
             }
         } else if (e.keyCode == 27) {
             $(".cb-search-tool").css("display", "none");
             show = false;
             time1 = 0;
         }
     });

     $("#cb-search-content").keyup(function (e) {
         var time2 = new Date().getTime();
         if (e.keyCode == 17) {
             var gap = time2 - time1;
             time1 = time2;
             if (gap < 500) {
                 if (show) {
                     $(".cb-search-tool").css("display", "none");
                     show = false;
                 } else {
                     $(".cb-search-tool").css("display", "block");
                     show = true;
                     $("#cb-search-content").val("");
                     $("#cb-search-content").focus();
                 }
                 time1 = 0;
             }
         }
     });

     $("#cb-close-btn").click(function () {
         $(".cb-search-tool").css("display", "none");
         show = false;
         time1 = 0;
     });

     $("#cb-search-btn").click(function () {
         $(".cb-search-tool").css("display", "block");
         show = true;
         $("#cb-search-content").val("");
         $("#cb-search-content").focus();
         time1 = 0;
     });

     $.getJSON("/search/cb-search.json").done(function (data) {
         if (data.code == 0) {
             for (var index in data.data) {
                 var item = data.data[index];
                 names.push(item.title);
                 urls.push(item.url);
             }

             $("#cb-search-content").typeahead({
                 source: names,

                 afterSelect: function (item) {
                     $(".cb-search-tool").css("display", "none");
                     show = false;
                     window.location.href = (urls[names.indexOf(item)]);
                     return item;
                 }
             });
         }
     });

 });
 console.log("\n \n'########::::'###::::'########:'########:\n... ##..::::'## ##:::... ##..:: ##.....::\n::: ##:::::'##:. ##::::: ##:::: ##:::::::\n::: ##::::'##:::. ##:::: ##:::: ######:::\n::: ##::::###########::::##:::: ##...::::\n::: ##::::##.......##::::##:::: ##::::::: \n::: ##::::##:::::::##::::##:::: ########: \n:::..:::::..:::::..:::::..:::::........::\n \n欢迎来到 %cTate & Snow%c 的博客，有不足的地方欢迎指正 \n \n此jekyll主题选用自liberxue，感谢提供 \n \n\n" + "%c Tate & Snow \n" + "%c", "color:orange;", "", " font: 2.6rem/1.25rem 'Fredericka the Great', cursive;color: #FFF;text-shadow: 0 1px #2b2b2b, -1px 0 #000, -1px 2px #2b2b2b, -2px 1px #000, -2px 3px #2b2b2b, -3px 2px #000, -3px 4px #2b2b2b, -4px 3px #000, -4px 5px #2b2b2b, -5px 4px #000, -5px 6px #2b2b2b, -6px 5px #000, -6px 7px #2b2b2b, -7px 6px #000, -7px 8px #2b2b2b, -8px 7px #000;", "background: url(https://i.loli.net/2018/03/13/5aa74f5b4c2c7.png) no-repeat;padding: 20px 219px;line-height: 166px");