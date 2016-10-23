module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    globals:{
        Vue:true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        'no-console':'off',
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single",
            'avoid-escape'
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};