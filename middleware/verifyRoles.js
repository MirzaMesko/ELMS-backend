const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // problem with verifiyng roles when creating new user witohout admin role !!!
        if (!req.body?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.body.roles.map(role => rolesArray.includes(role)).find(value => value === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;