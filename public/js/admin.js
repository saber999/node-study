// 处理删除电影数据的逻辑
$(function () {
    $('.del').click(function (e) {
        var target = $(e.target);//有多个用e.target，就一个直接$(this)
        var id = target.data('id');
        var tr = $('.item-id-' + id);

        $.ajax({
            type: 'DELETE', // 异步请求类型：删除
            url: '/admin/list?id=' + id,
        })
        .done(function (results) {
            if (results.success === 1) {
                if (tr.length > 0) {
                    tr.remove();
                }
            }
        });
    });
    $('#douban').blur(function(){//blur是失去焦点，onblur才是获得焦点
        var douban = $(this)
        var id = douban.val()
        if(id){
            $.ajax({
                url:'https://api.douban.com/v2/movie/subject/'+id,
                cache:true,
                type:'get',
                dataType:'jsonp',
                crossDomain:true,
                jsonp:'callback',//指定回调函数的参数名称
                success:function(data){
                  $('#inputTitle').val(data.title)
                  $('#inputDoctor').val(data.directors[0].name)
                  $('#inputCountry').val(data.countries[0])
                  $('#inputPoster').val(data.images.large)
                  $('#inputYear').val(data.year)
                  $('#inputSummary').val(data.summary)
                }
            })
        }
    })
});  