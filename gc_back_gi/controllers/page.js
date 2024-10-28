exports.renderMain = (req, res, next) => {
    res.render('main', { title: '메인' });
};

exports.renderCheckEmail = (req, res) => {
    res.render('check_email', { title: '회원가입' });
}

exports.renderCheckAuthCode = (req, res) => {
    res.render('check_auth_code', { title: '회원가입' });
}

exports.renderFillUserInfo = (req, res) => {
    res.render('fill_user_info', { title: '회원가입' });
}

exports.renderLogin = (req, res) => {
    res.render('login', { title: 'login' });
}