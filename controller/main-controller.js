exports.mainPage = (req, res, next) => {
    res.render('main-page', {
        pageTitle: 'Sudoku'
    });
};