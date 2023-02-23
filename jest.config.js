module.exports = {
    roots: ['tests'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapper: {
        '@libs/api-gateway': '<rootDir>/src/libs/api-gateway',
        '@libs/lambda': '<rootDir>/src/libs/lambda',
        '@libs/mocks/products': '<rootDir>/src/libs/mocks/products',
    },
};