const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.headers.roles.split(',');
        if (!req.headers?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = userRoles.map(role => rolesArray.includes(role)).find(value => value === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;