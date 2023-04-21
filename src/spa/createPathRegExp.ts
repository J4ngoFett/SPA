export function createPathRegExp(pathTemplate: string): RegExp {
    return new RegExp('/' + pathTemplate.replace(/:([A-z\d_-]+)/g, (_, paramName) => {
        return `(?<${paramName}>[^?/]+)`;
    }) + '$');
};

