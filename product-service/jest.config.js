module.exports = {
    roots: ['tests'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapper: {
        '@libs/api-gateway': '<rootDir>/product-service/src/libs/api-gateway',
        '@libs/lambda': '<rootDir>/product-service/src/libs/lambda',
        '@libs/mocks/products': '<rootDir>/product-service/src/libs/mocks/products',
    },
};