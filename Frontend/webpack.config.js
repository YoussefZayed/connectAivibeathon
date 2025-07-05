const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    // Ensure the resolver is properly initialized
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Add alias for @contract
    config.resolve.alias['@contract'] = path.resolve(__dirname, '../Backend/src/contracts');

    // Add .ts extension to resolvable extensions
    config.resolve.extensions = config.resolve.extensions || ['.web.js', '.js', '.json'];
    if (!config.resolve.extensions.includes('.ts')) {
        config.resolve.extensions.push('.ts');
    }
    if (!config.resolve.extensions.includes('.tsx')) {
        config.resolve.extensions.push('.tsx');
    }

    // Find and modify the source-map-loader to exclude Backend files
    config.module.rules.forEach(rule => {
        if (rule.oneOf) {
            rule.oneOf.forEach(oneOfRule => {
                if (oneOfRule.use) {
                    const loaders = Array.isArray(oneOfRule.use) ? oneOfRule.use : [oneOfRule.use];
                    loaders.forEach(loader => {
                        if (loader.loader && loader.loader.includes('source-map-loader')) {
                            // Exclude Backend files from source-map-loader
                            oneOfRule.exclude = oneOfRule.exclude || [];
                            if (Array.isArray(oneOfRule.exclude)) {
                                oneOfRule.exclude.push(path.resolve(__dirname, '../Backend'));
                            } else {
                                oneOfRule.exclude = [oneOfRule.exclude, path.resolve(__dirname, '../Backend')];
                            }
                        }
                    });
                }
            });
        }
    });

    // Add a specific rule to handle TypeScript files from Backend
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, '../Backend/src'),
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-typescript',
                    ['@babel/preset-env', { modules: false }]
                ],
                plugins: [
                    [
                        'module-resolver',
                        {
                            alias: {
                                '@contract': '../Backend/src/contracts',
                            },
                        },
                    ],
                ],
            },
        },
    });

    return config;
}; 