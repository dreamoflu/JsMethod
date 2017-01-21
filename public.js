require("js/jquery_md5.js")
require("js/json2.js");
var Server_Ip = "http://101.200.234.55:8080/medapp";
//var Server_Ip="http://www.medicalcircle.cn/med";
//获取url中参数值
var getUrlParam = function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    /**
        随机生成6-12位数字
    **/
function RndNum() {
    var rnd = "";
    var num = Math.floor(Math.random() * 6 + 6)
    for (var i = 0; i < num; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}
/**
 * 公共的调用接口ajax方法
 * @param {Object} param
 * @param {Object} api_url
 */
var myAjax = function myAjax(param, api_url) {
    var obj_return;
    var token = getUrlParam("token");
    var randNum = RndNum(); //随机生成6-12位数字
    var ts = Date.parse(new Date());
    if (token == null || token == "") {
        token = localStorage.getItem("token");
    }
    var salt = localStorage.getItem("salt"); //用于接口校验
    var sign = $.md5(token + randNum + ts + salt);
    console.log("sign====" + sign);
    console.log(Server_Ip + api_url);
    $.ajax({
        url: Server_Ip + api_url,
        type: "POST",
        async: false,
        dataType: "json",
        contentType: "application/json",
        data: param,
        headers: {
            "token": token,
            "rand": randNum,
            "ts": ts,
            "sign": sign,
            "salt": salt
        },
        timeout: 10000, //超时时间设置为10秒；
        success: function(data) {
            obj_return = data;
        },
        error: function(xhr, type, errorThrown) {
            alert(errorThrown);
        }
    });

    return obj_return;
}

/**
 * 根据服务端返回时间和当前时间计算时间差
 * @param {Object} in_date
 */
var comparTime = function comparTime(in_date) {
        var timestamp = Date.parse(new Date());
        var d_value = Math.ceil((timestamp - in_date) / 1000);
        var d_html = "";
        console.log(2419200);
        if (d_value < 60) {
            d_html = "1分钟内";
        } else if (d_value > 60 && d_value < 3600) {
            d_html = parseInt(d_value / 60) + "分钟前";
        } else if (d_value > 3600 && d_value < 86400) {
            d_html = parseInt(d_value / 3600) + "小时前";
        } else if (d_value > 86400 && d_value < 604800) {
            d_html = parseInt(d_value / 86400) + "天前";
        } else if (d_value > 604800 && d_value < 2419200) {
            d_html = parseInt(d_value / 604800) + "周前";
        } else if (d_value > 2419200 && d_value < 31536000) {
            d_html = parseInt(d_value / 2419200) + "月前";
        } else if (d_value > 31536000) {
            d_html = parseInt(d_value / 31536000) + "年前";
        }
        return d_html;
    }
    /**
        计算时间间隔天数
    **/
function GetDateDiff(startDate, endDate) {
    var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    if (isNaN(dates)) {
        dates = "0";
    }
    return dates;
}
/**
     根据毫秒计算时间间隔天数
   **/
function GetDateDiffMil(startMil, endMil) {
    var timeMil = endMil - startMil;
    return parseInt(timeMil / 86400 / 1000);
}

//校验手机号
var validateMobile = function validateMobile(phone) {
        var myreg = /^1[34578]\d{9}$/;
        if (!myreg.test(phone)) {
            //alert('手机号码格式不正确！');
            return false;
        }
        return true;
    }
    //校验邮箱格式
var validateEmail = function validateEmail(email) {
        var myreg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!myreg.test(email)) {
            //alert('手机号码格式不正确！');
            return false;
        }
        return true;
    }
    //格式化日期
Date.prototype.Format = function(fmt) { //   
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var px2rem = function px2rem() {
        document.addEventListener('DOMContentLoaded', function() {
            var html = document.documentElement;
            var windowWidth = html.clientWidth;
            html.style.fontSize = windowWidth / 7.5 + 'px';
            console.log(windowWidth)
        }, false);
    }
    /*公共弹框提示*/
    //这是一个jQ插件 需要引用jquery.toast.css,jquery-toast-plugin
var eAlert = function eAlert(msg) {
    $.toast({
            text: msg,
            showHideTransition: 'slide',
            textColor: 'red',
            allowToastClose: false,
            hideAfter: 2000,
            // stack: 5,
            textAlign: 'center',
            position: 'top-center'
    })
        // var msgHtml = '<span style="color:red;font-weight:bold">' + msg + '</span>'
        // swal({
        //     showConfirmButton: false,
        //     type: "warning",
        //     html: msgHtml,
        //     timer: 1500
        // }).catch(swal.noop);
    return false;
}
var validateUserInfo = function validateUserInfo(phone, name, org, sector, post, verifyCode, email) {
    
    if (name == "" || phone == "" || org == "" || post == "" || sector == "" || email == "" || name == null || phone == null || org == null || post == null || sector == null || email == null) {
        eAlert("请完善个人信息,不能为空");
        return false;
    };
    if (!validateMobile(phone)) {
        eAlert("手机号码格式不正确");
        return false;
    }
    if (verifyCode == "" || verifyCode == null) {
        eAlert("验证码不能为空");
        return false;
    }
    if (!name.match("^[\u4e00-\u9fa5a-zA-Z0-9_ ]{1,30}$")) {
        eAlert("姓名只能包括中英文、数字和下划线");
        return false;
    }
    if (!validateEmail(email)) {
        eAlert("邮箱格式不正确");
        return false;
    }
    return true;

}



//判断访问终端
var browser = {
    versions: function() {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq", //是否QQ
            ios9: app.indexOf('OS 9_') > -1, //是否是IOS9
            ios10: app.indexOf('OS 10_') > -1 //是否是IOS10
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
exports.getUrlParam = getUrlParam;
exports.myAjax = myAjax;
exports.comparTime = comparTime;
exports.validateMobile = validateMobile;
exports.px2rem = px2rem;
exports.eAlert = eAlert;
exports.GetDateDiff = GetDateDiff;
exports.GetDateDiffMil = GetDateDiffMil;
exports.validateUserInfo = validateUserInfo;
exports.browser = browser;
