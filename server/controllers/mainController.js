exports.homepage = async (req, res) => {
    const locals = {
        title: "Notes App",
        description: "Free NodeJs Notes App"
    };
    res.render('index', locals);
};

exports.about = async (req, res) => {
    const locals = {
        title: "About - Notes App",
        description: "Free NodeJs Notes App"
    };
    res.render('about', {
        locals,
        layout: '../views/layouts/front-page'
    });
};
