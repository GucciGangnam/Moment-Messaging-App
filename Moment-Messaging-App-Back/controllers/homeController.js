// IMPORTS //

// CONTROLLERS //
exports.home = (req, res, next) => {
    res.render('index', { title: 'Moment' });
    return;
}