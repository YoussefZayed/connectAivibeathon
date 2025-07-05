module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        '@contract': '../Backend/src/contracts',
                    },
                    extensions: [
                        '.js',
                        '.jsx',
                        '.ts',
                        '.tsx',
                        '.json'
                    ],
                },
            ],
            ['module:react-native-dotenv', {
                "moduleName": "@env",
                "path": ".env",
                "allowUndefined": true
            }]
        ],
    };
};