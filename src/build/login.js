window.Login = function() {
    var
        self = this,
        config = this.config = {
            loginType: 'async',
            loginApi: $.trim($('#login-host').val()) + 'session',
            //hasLoginApi: $.trim($('#login-host').val()) + 'has-login',
            //accountCheckApi: $.trim($('#login-host').val()) + "account/check",
            $loginForm: $('#login-form'),
            $loginUsernameInput: $("input[name='username']"),
            $loginPasswordInput: $("input[name='password']"),
            $userTypeInput: $("input[name='userType']"),
            $loginRememberMeInput: $("input[name='rememberMe']"),
            $loginSubmitBtn:  $("#login-submit"),

            /**
             * 国际化语言
             */
            i18n: {
                'error-login-username-empty': '请输入账户名',
                'error-login-password-empty': '请输入登录密码',
                //'error-login-checkcode-empty': '请输入验证码',
            }
        },
        bind = function(event, func) {
            $(_self).bind(event, func);
        },

        showError = function(msg) {
            config.$loginForm.addClass('has-error');
            $('.login-error .notice-descript').html(msg);
            //.trigger
        },
        hideError = function() {
            config.$loginForm.removeClass('has-error');
            $('.login-error .notice-descript').html('');
            //.trigger
        },
        validateForm = function() {
            var result = false, i18n = config.i18n;
            if ($.trim(config.$loginUsernameInput.val()) == '') {
                showError(i18n['error-login-username-empty']);
                config.$loginUsernameInput.focus();
            } else if ($.trim(config.$loginPasswordInput.val()) == '') {
                showError(i18n['error-login-password-empty']);
                config.$loginPasswordInput.focus();
            } else {
                return true;
            }
        },
        getLoginData = function() {
            var password = $.trim(config.$loginPasswordInput.val());
            //if (window.RSAKey && password !== '') {
            //    var pubKey = $('#fm-modulus').val(),
            //        exponent = $('#fm-exponent').val();
            //
            //    var rsa = new RSAKey();
            //
            //    rsa.setPublic(pubKey, exponent);
            //    var password2 = rsa.encrypt(password);
            //}

            return {
                username: $.trim(config.$loginUsernameInput.val()),
                sign: password,
                type: $.trim(config.$userTypeInput.val()),
                rememberMe: $.trim(config.$loginRememberMeInput.val())
            }
        },
        focusInputAndSelect = function (input, start, end) {

            if (input.offsetHeight == 0)return;

            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(start, end);
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        },
        loginLoadingLock = function() {
            config.$loginForm.addClass('state-loading');
            config.$loginSubmitBtn.attr('disabled', 'disabled');
        },
        loginLoadingUnlock = function() {
            config.$loginForm.removeClass('state-loading');
            config.$loginSubmitBtn.removeAttr('disabled');
        },
        focusUsernameAndCleanOther = function () {
            config.$loginPasswordInput.val('');
            //config.$loginCheckcodeInput.val('');
            var usernameInput = config.$loginUsernameInput.get(0),
                textLength = usernameInput.value.length;
            focusInputAndSelect(usernameInput, textLength, textLength);
        },
        asyncSubmitForm = function() {
            loginLoadingLock();
            hideError();
            $.ajax({
                type: 'POST',
                url: config.loginApi + '?fromSite=',
                data: JSON.stringify(getLoginData()),
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                //timeout: 15000,
                success: function (data) {
                    // if (data.code == 0) {
                    if (data.redirect) {
                        window.location.href = data.redirectUrl;
                        return;
                    }
                    window.location.href = '/';
                    // } else {
                    //     showError(data.msg);
                    //     loginLoadingUnlock();
                    // }
                },
                error: function (e) {
                    loginLoadingUnlock();
                    if (e.responseJSON) {
                        showError(e.responseJSON.msg);
                        return;
                    }
                    //连接超时
                    showError("连接失败!");
                    //处理错误;
                }
            })
        },
        bindEvents = function() {
            var isSafe = $(".login-pwd-icon").attr('type') == 'password';
            $(".login-pwd-icon").on("click", function (event) {
                isSafe = !isSafe;
                config.$loginPasswordInput.attr('type', !isSafe ? 'password' : "text");
                $(".login-pwd-icon").toggleClass('login-display', isSafe)
            });

            config.$loginForm.on('submit', function(evnt) {
                if (!validateForm()) {
                    return false;
                }

                if (config.loginType == 'async') {
                    evnt.preventDefault();
                    asyncSubmitForm();
                    return false;
                } else {
                    //表单提交
                    return true;
                }
            })
        },
        init = function(options) {

            self.config = $.extend({}, self.config, options || {});
            var usernameInput = config.$loginUsernameInput.get(0),
                usernameTextLength = usernameInput.value.length;


            if (usernameTextLength > 0) {
                focusInputAndSelect(usernameInput, usernameTextLength, usernameTextLength);
            }
            bindEvents();
        };

    this.init = init;
    this.bind = bind;
    this.showError=  showError;
    this.asyncSubmitForm = asyncSubmitForm;
    return this;
}