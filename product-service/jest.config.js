module.exports = {
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '@libs/api-gateway': '<rootDir>/product-service/src/libs/api-gateway',
        '@libs/lambda': '<rootDir>/product-service/src/libs/lambda',
        '@libs/mocks/products': '<rootDir>/product-service/src/libs/mocks/products',
    },
};